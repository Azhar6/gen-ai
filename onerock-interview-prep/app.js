(function () {
  const USER_KEY = "interview-qa-user-v1";
  let data = null;
  let index = 0;
  let view = "library";
  let filter = "all";
  let search = "";
  let navTopic = "all";
  let topicScope = null;

  function $(id) { return document.getElementById(id); }
  function isAndroidDevice() { return /android/i.test(navigator.userAgent || ""); }
  function isStandaloneMode() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
  }

  function loadUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  function getUser() {
    const user = loadUser();
    user.notes = user.notes || {};
    user.practiced = user.practiced || {};
    return user;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paras(list) {
    return (list || []).map(function (p) {
      return "<p>" + escapeHtml(p) + "</p>";
    }).join("");
  }

  function points(list) {
    var rows = (list || []).filter(function (p) { return String(p || "").trim().length > 0; });
    if (!rows.length) return "";
    return '<ul class="answer-points">' + rows.map(function (p) {
      return "<li>" + escapeHtml(p) + "</li>";
    }).join("") + "</ul>";
  }

  function ensureSentence(text) {
    var t = String(text || "").trim();
    if (!t) return "";
    if (!/[.!?]$/.test(t)) t += ".";
    return t.replace(/\s+/g, " ");
  }

  function sentenceClause(text) {
    return normalizeAnswerLine(text).replace(/[.!?]+$/, "").trim();
  }

  function composeInterviewSentence(prefix, line) {
    var clause = sentenceClause(line);
    if (!clause) return "";
    return ensureSentence(prefix + clause);
  }

  function normalizeAnswerLine(line) {
    var t = String(line || "").trim();
    if (!t) return "";
    if (/^i would\b/i.test(t)) {
      t = t.replace(/^i would\b/i, "In practice, I would");
    }
    if (/^do not\b/i.test(t)) {
      t = t.replace(/^do not\b/i, "Do not");
    }
    return ensureSentence(t);
  }

  function uniqLines(lines) {
    var out = [];
    var seen = {};
    (lines || []).forEach(function (line) {
      var clean = normalizeAnswerLine(line);
      if (!clean) return;
      var key = clean.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      out.push(clean);
    });
    return out;
  }

  function questionExampleLine(q) {
    if (q.example && q.example.story) {
      return ensureSentence("For example, " + sentenceClause(q.example.story));
    }
    if (q.example && q.example.walkthrough && q.example.walkthrough.length) {
      var first = q.example.walkthrough[0] || {};
      var parts = [first.step, first.result, first.detail].filter(Boolean).map(sentenceClause).filter(Boolean);
      if (parts.length) return ensureSentence("For example, " + parts.join(" — "));
    }
    if (q.tables && q.tables.length && q.tables[0].rows && q.tables[0].rows.length) {
      var row = q.tables[0].rows[0] || [];
      if (row[0] && row[1]) {
        return ensureSentence("For example, in practice we check " + sentenceClause(row[0]) + " by using " + sentenceClause(row[1]));
      }
    }
    var bySection = {
      etl: "For example, in a daily data pipeline, validate the input file first, then load with idempotent writes so reruns do not create duplicates.",
      sql: "For example, when data does not match, run a keyed join to separate missing rows from value mismatches before taking action.",
      agents: "For example, in a support workflow, use deterministic rules first and let the agent handle only the unresolved cases.",
      rag: "For example, retrieve policy text first and then answer from those passages instead of relying on model memory.",
      production: "For example, set timeouts, retries, and monitoring before exposing the feature to real users.",
      python: "For example, use a generator to process a large file line by line instead of loading everything into memory.",
      llm: "For example, verify every important number against tool output before showing it to the user.",
      langgraph: "For example, route the request through tools, validate output, and only then generate the final response."
    };
    return bySection[q.sectionId] || "";
  }

  function buildAnswerBlocks(q) {
    var raw = q.answer && q.answer.length ? q.answer : (q.simpleAnswer || []);
    var lines = uniqLines(raw);
    var one = normalizeAnswerLine(q.oneLiner || "");
    if (one && lines.indexOf(one) === -1) lines.unshift(one);

    var explanation = lines.slice(0, 7);
    var exampleLine = questionExampleLine(q);
    if (exampleLine && explanation.length < 7) explanation.push(exampleLine);
    explanation = uniqLines(explanation);
    if (!explanation.length && one) explanation = [one];

    var support = lines.slice(1, 7);
    var guard = support.find(function (line) {
      return /(validate|retry|human|check|safe|risk|monitor|alert|schema|timeout|idempotent)/i.test(line);
    }) || explanation[explanation.length - 1] || one;
    var approach = support[0] || explanation[1] || one;
    var implementation = support[1] || explanation[2] || approach;

    var interview = uniqLines([
      composeInterviewSentence("The core idea is ", one || approach),
      composeInterviewSentence("The practical approach is to ", approach),
      composeInterviewSentence("In implementation, this usually means ", implementation),
      composeInterviewSentence("A key reliability check is ", guard),
      exampleLine
    ]);
    if (!interview.length) interview = explanation.slice(0, 5);

    return { explanation: explanation, interview: interview };
  }

  function buildCodeExample(q) {
    var existing = q.example && q.example.code ? String(q.example.code).trim() : "";
    if (existing) {
      return { title: q.example.codeTitle || "Code example", code: existing };
    }

    var text = ((q.title || "") + " " + (q.category || "") + " " + (q.oneLiner || "")).toLowerCase();
    function mk(title, code) { return { title: title, code: code }; }

    if (/(join|lag|lead|group by|cte|window|duplicate|query|sql)/.test(text) || q.sectionId === "sql") {
      return mk("Code example (SQL)", [
        "WITH web AS (",
        "  SELECT order_id, item, qty, price FROM web_orders",
        "), wh AS (",
        "  SELECT order_id, item, qty, price FROM warehouse_orders",
        ")",
        "SELECT",
        "  COALESCE(w.order_id, h.order_id) AS order_id,",
        "  CASE",
        "    WHEN w.order_id IS NULL THEN 'missing_in_web'",
        "    WHEN h.order_id IS NULL THEN 'missing_in_wh'",
        "    WHEN w.qty <> h.qty THEN 'qty_mismatch'",
        "    WHEN w.price <> h.price THEN 'price_mismatch'",
        "    ELSE 'matched'",
        "  END AS status",
        "FROM web w",
        "FULL OUTER JOIN wh h ON w.order_id = h.order_id;",
      ].join("\n"));
    }

    if (/(retry|backoff|timeout)/.test(text)) {
      return mk("Code example (Python retry)", [
        "import time, random",
        "",
        "def call_with_retry(fn, retries=2):",
        "    delay = 0.5",
        "    for attempt in range(retries + 1):",
        "        try:",
        "            return fn()",
        "        except TimeoutError:",
        "            if attempt == retries:",
        "                raise",
        "            time.sleep(delay + random.uniform(0, 0.2))",
        "            delay *= 2",
      ].join("\n"));
    }

    if (/(etl|pipeline|csv|chunk|idempotent|incremental|schema)/.test(text) || q.sectionId === "etl") {
      return mk("Code example (ETL with idempotent load)", [
        "import polars as pl",
        "",
        "scan = pl.scan_csv('orders_2026-08-21.csv')",
        "clean = (",
        "    scan",
        "    .drop_nulls(['order_id', 'item'])",
        "    .with_columns(pl.col('qty').cast(pl.Int64))",
        "    .unique(subset=['order_id'], keep='last')",
        ")",
        "clean.sink_parquet('staging/orders/date=2026-08-21/')",
        "# Then MERGE into warehouse on order_id",
      ].join("\n"));
    }

    if (/(langgraph|state|node|edge|checkpoint|human)/.test(text) || q.sectionId === "langgraph") {
      return mk("Code example (LangGraph flow)", [
        "from typing import TypedDict",
        "from langgraph.graph import StateGraph, START, END",
        "",
        "class State(TypedDict):",
        "    question: str",
        "    sql_rows: list",
        "    answer: str",
        "",
        "graph = StateGraph(State)",
        "graph.add_node('tool_sql', tool_sql)",
        "graph.add_node('write_answer', write_answer)",
        "graph.add_edge(START, 'tool_sql')",
        "graph.add_edge('tool_sql', 'write_answer')",
        "graph.add_edge('write_answer', END)",
      ].join("\n"));
    }

    if (/(rag|embedding|vector|retrieve|chunk|rerank|hybrid)/.test(text) || q.sectionId === "rag") {
      return mk("Code example (RAG retrieval)", [
        "query = 'What is the return policy for damaged goods?'",
        "hits = vector_index.search(query, k=8, filter={'doc_type': 'policy'})",
        "top_chunks = reranker.rank(query, hits)[:3]",
        "",
        "prompt = {",
        "  'question': query,",
        "  'context': [c.text for c in top_chunks],",
        "  'instruction': 'Answer only from context and cite section ids.'",
        "}",
        "answer = llm.generate(prompt)",
      ].join("\n"));
    }

    if (/(agent|tool|function calling|react|prompt injection|hallucination)/.test(text) || q.sectionId === "agents") {
      return mk("Code example (tool-calling guard)", [
        "ALLOWED_TOOLS = {'get_stock', 'search_policy'}",
        "",
        "def run_tool_call(name, args):",
        "    if name not in ALLOWED_TOOLS:",
        "        raise ValueError('Tool not allowed')",
        "    result = TOOLS[name](**args)",
        "    return {'tool': name, 'result': result}",
        "",
        "# Validate final numeric claims against tool result before respond",
      ].join("\n"));
    }

    if (/(solid|dependency|factory|strategy|adapter|repository|class)/.test(text) || q.sectionId === "oop") {
      return mk("Code example (clean interface design)", [
        "from typing import Protocol",
        "",
        "class ModelClient(Protocol):",
        "    def chat(self, messages: list[dict]) -> dict: ...",
        "",
        "class StockAssistant:",
        "    def __init__(self, model: ModelClient, repo):",
        "        self.model = model",
        "        self.repo = repo",
      ].join("\n"));
    }

    if (/(process|port|journalctl|cron|linux|service|log)/.test(text) || q.sectionId === "linux") {
      return mk("Code example (Linux troubleshooting commands)", [
        "ss -lptn | rg 8000",
        "ps aux | rg gunicorn",
        "journalctl -u app-service -n 120 --no-pager",
        "free -h",
        "df -h",
      ].join("\n"));
    }

    if (/(deploy|monitor|metrics|latency|token|cache|concurrent|scale|production)/.test(text) || q.sectionId === "production") {
      return mk("Code example (production instrumentation)", [
        "start = time.time()",
        "result = llm_client.chat(messages, timeout=8)",
        "duration_ms = int((time.time() - start) * 1000)",
        "",
        "metrics.count('llm.tokens', result['usage']['total_tokens'])",
        "metrics.timing('llm.latency_ms', duration_ms)",
        "logger.info('llm_call', extra={'trace_id': trace_id, 'latency_ms': duration_ms})",
      ].join("\n"));
    }

    if (q.sectionId === "markets") {
      return mk("Code example (simple reconciliation check)", [
        "SELECT w.order_id, w.qty AS web_qty, h.qty AS wh_qty",
        "FROM web_orders w",
        "LEFT JOIN warehouse_orders h ON w.order_id = h.order_id",
        "WHERE h.order_id IS NULL OR w.qty <> h.qty;",
      ].join("\n"));
    }

    if (q.sectionId === "python") {
      if (/(generator|yield|large file|stream|chunk)/.test(text)) {
        return mk("Code example (Python generator for large files)", [
          "def iter_orders(path):",
          "    with open(path, 'r', encoding='utf-8') as f:",
          "        next(f)  # skip header",
          "        for line in f:",
          "            order_id, item, qty, price = line.strip().split(',')",
          "            yield {",
          "                'order_id': order_id,",
          "                'item': item,",
          "                'qty': int(qty),",
          "                'price': float(price),",
          "            }",
        ].join("\n"));
      }
      if (/(decorator|retry)/.test(text)) {
        return mk("Code example (retry decorator)", [
          "import time",
          "",
          "def retry(times=2, delay=0.5):",
          "    def wrap(fn):",
          "        def inner(*args, **kwargs):",
          "            last = None",
          "            for _ in range(times + 1):",
          "                try:",
          "                    return fn(*args, **kwargs)",
          "                except TimeoutError as e:",
          "                    last = e",
          "                    time.sleep(delay)",
          "            raise last",
          "        return inner",
          "    return wrap",
        ].join("\n"));
      }
      if (/(thread|process|gil|async)/.test(text)) {
        return mk("Code example (thread pool for I/O calls)", [
          "from concurrent.futures import ThreadPoolExecutor",
          "",
          "def fetch_one(order_id):",
          "    return call_remote_api(order_id)",
          "",
          "with ThreadPoolExecutor(max_workers=8) as ex:",
          "    results = list(ex.map(fetch_one, order_ids))",
        ].join("\n"));
      }
      if (/(protocol|interface|dependency|inject|solid|class)/.test(text)) {
        return mk("Code example (dependency injection with Protocol)", [
          "from typing import Protocol",
          "",
          "class ModelClient(Protocol):",
          "    def chat(self, messages: list[dict]) -> dict: ...",
          "",
          "class AssistantService:",
          "    def __init__(self, model: ModelClient):",
          "        self.model = model",
        ].join("\n"));
      }
      return null;
    }

    if (q.sectionId === "llm") {
      if (/(structured|json|schema|output|function calling|tool)/.test(text)) {
        return mk("Code example (structured LLM output)", [
          "schema = {",
          "  'type': 'object',",
          "  'properties': {",
          "    'answer': {'type': 'string'},",
          "    'confidence': {'type': 'number'}",
          "  },",
          "  'required': ['answer', 'confidence']",
          "}",
          "result = llm.generate(prompt=prompt, response_schema=schema)",
        ].join("\n"));
      }
      if (/(temperature|top-p|top-k|sampling)/.test(text)) {
        return mk("Code example (LLM settings for factual answers)", [
          "result = llm.generate(",
          "    prompt=prompt,",
          "    temperature=0.1,",
          "    top_p=0.9,",
          "    max_tokens=400,",
          ")",
        ].join("\n"));
      }
      if (/(hallucination|ground|citation|verify)/.test(text)) {
        return mk("Code example (grounded answer validation)", [
          "draft = llm.generate(prompt_with_context)",
          "facts = {row['qty'] for row in sql_rows}",
          "numbers = extract_numbers(draft)",
          "if any(n not in facts for n in numbers):",
          "    raise ValueError('Ungrounded answer')",
          "return draft",
        ].join("\n"));
      }
      return mk("Code example (prompt with explicit constraints)", [
        "prompt = '''",
        "You are an assistant for interview prep.",
        "Use only facts from CONTEXT.",
        "If data is missing, say 'I do not know'.",
        "Return 4 bullet points in simple English.",
        "'''",
        "answer = llm.generate(prompt + context_text)",
      ].join("\n"));
    }

    return null;
  }

  var CHART_COLORS = ["#1f6f5b", "#c47b2b", "#4a6fa5", "#9b3d2a", "#6b5b95", "#5a7a3a", "#8a5a3a"];

  function parseChartNumber(text) {
    var s = String(text).trim().replace(/,/g, "");
    if (!/^-?\d+(\.\d+)?%?$/.test(s)) return null;
    return Number(s.replace("%", ""));
  }

  function firstTable(q) {
    var tables = tablesForQuestion(q);
    return tables[0] || null;
  }

  function tablesForQuestion(q) {
    if (q.tables && q.tables.length) return q.tables;
    return [];
  }

  function diagramForQuestion(q) {
    if (q.diagram) return q.diagram;
    if (q.architecture && q.architecture.layers && q.architecture.layers.length) {
      return {
        type: "pipeline",
        title: "How it works",
        steps: q.architecture.layers.map(function (layer) { return layer.name; })
      };
    }
    var table = firstTable(q);
    if (table && table.title !== "Key points" && table.rows && table.rows.length) {
      return {
        type: "pipeline",
        title: table.title || "How it works",
        steps: table.rows.slice(0, 6).map(function (row) { return String(row[0] || ""); }).filter(Boolean)
      };
    }
    if (q.simpleAnswer && q.simpleAnswer.length) {
      return {
        type: "pipeline",
        title: "How it works",
        steps: q.simpleAnswer.slice(0, 3).map(function (p) {
          return String(p).split(/[.!?]/)[0].slice(0, 42);
        }).filter(Boolean)
      };
    }
    return null;
  }

  function chartForQuestion(q) {
    if (q.chart && q.chart.items && q.chart.items.length) return q.chart;
    var table = firstTable(q);
    if (table && table.title !== "Key points" && table.rows && table.rows.length) {
      var items = [];
      var numeric = true;
      table.rows.slice(0, 7).forEach(function (row) {
        var label = String(row[0] || "").slice(0, 36);
        var val = null;
        for (var i = row.length - 1; i >= 1; i--) {
          val = parseChartNumber(row[i]);
          if (val !== null) break;
        }
        if (val === null) numeric = false;
        items.push({ label: label, value: val == null ? 1 : val });
      });
      if (!items.length) return null;
      if (numeric) {
        return { type: items.length > 5 ? "hbar" : "bar", title: table.title || "Chart", items: items };
      }
      return { type: "donut", title: table.title || "Parts of the topic", items: items };
    }
    var diagram = diagramForQuestion(q);
    var steps = diagram && (diagram.steps || diagram.leftSteps || diagram.branches);
    if (steps && steps.length) {
      return {
        type: "process",
        title: (diagram && diagram.title) || "Steps",
        items: steps.map(function (step) { return { label: step, value: 1 }; })
      };
    }
    if (q.architecture && q.architecture.layers) {
      return {
        type: "process",
        title: "Layers",
        items: q.architecture.layers.map(function (layer) { return { label: layer.name, value: 1 }; })
      };
    }
    return null;
  }

  function renderChart(chart) {
    if (!chart || !chart.items || !chart.items.length) return "";
    var items = chart.items;
    var type = chart.type || "hbar";
    var html = '<div class="chart chart-' + type + '"><h4>' + escapeHtml(chart.title || "Chart") + "</h4>";
    var total = 0;
    items.forEach(function (it) { total += Number(it.value) || 0; });
    if (!total) total = 1;
    var max = 1;
    items.forEach(function (it) {
      var n = Number(it.value) || 0;
      if (n > max) max = n;
    });
    var allEqual = items.every(function (it) { return Number(it.value) === Number(items[0].value); });

    if (type === "donut") {
      var acc = 0;
      var parts = [];
      items.forEach(function (it, i) {
        var pct = (Number(it.value) || 0) / total * 100;
        parts.push(CHART_COLORS[i % CHART_COLORS.length] + " " + acc + "% " + (acc + pct) + "%");
        acc += pct;
      });
      html += '<div class="donut-wrap"><div class="donut" style="background:conic-gradient(' + parts.join(",") + ')"><span class="donut-hole"></span></div><ul class="donut-legend">';
      items.forEach(function (it, i) {
        var pct = Math.round((Number(it.value) || 0) / total * 100);
        html += '<li><span class="swatch" style="background:' + CHART_COLORS[i % CHART_COLORS.length] + '"></span>' + escapeHtml(it.label) + (allEqual ? "" : " · " + pct + "%") + "</li>";
      });
      html += "</ul></div>";
    } else if (type === "process") {
      html += '<div class="pbar">';
      items.forEach(function (it, i) {
        html += '<div class="pseg" style="background:' + CHART_COLORS[i % CHART_COLORS.length] + '">' + escapeHtml(it.label) + "</div>";
      });
      html += "</div>";
    } else if (type === "bar") {
      html += '<div class="vbars">';
      items.forEach(function (it, i) {
        var h = Math.max(10, Math.round((Number(it.value) || 0) / max * 130));
        html += '<div class="vbar"><div class="vbar-fill" style="height:' + h + 'px;background:' + CHART_COLORS[i % CHART_COLORS.length] + '"></div>';
        html += "<span>" + escapeHtml(it.label) + "</span>";
        if (!allEqual) html += '<small>' + escapeHtml(String(it.value)) + "</small>";
        html += "</div>";
      });
      html += "</div>";
    } else {
      html += '<div class="hbars">';
      items.forEach(function (it, i) {
        var w = Math.max(8, Math.round((Number(it.value) || 0) / max * 100));
        html += '<div class="hbar-row"><span class="hbar-lab">' + escapeHtml(it.label) + "</span>";
        html += '<div class="hbar-track"><span style="width:' + w + "%;background:" + CHART_COLORS[i % CHART_COLORS.length] + '"></span></div>';
        if (!allEqual) html += '<span class="hbar-val">' + escapeHtml(String(it.value)) + "</span>";
        html += "</div>";
      });
      html += "</div>";
    }
    html += "</div>";
    return html;
  }

  function renderTable(table) {
    var html = '<div class="table-wrap"><table><caption>' + escapeHtml(table.title) + "</caption><thead><tr>";
    (table.headers || []).forEach(function (h) {
      html += "<th>" + escapeHtml(h) + "</th>";
    });
    html += "</thead><tbody>";
    (table.rows || []).forEach(function (row) {
      html += "<tr>";
      row.forEach(function (cell) {
        html += "<td>" + escapeHtml(cell) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  function node(text, cls) {
    return '<div class="fnode ' + (cls || "") + '">' + escapeHtml(text) + "</div>";
  }
  function arrow() { return '<div class="farrow">↓</div>'; }

  function renderDiagram(d) {
    if (!d) return "";
    var html = '<div class="flow"><h4>' + escapeHtml(d.title) + "</h4>";

    if (d.type === "pipeline") {
      html += '<div class="flow-col">';
      html += node("START", "start") + arrow();
      d.steps.forEach(function (step, i) {
        html += node(step);
        html += i < d.steps.length - 1 ? arrow() : arrow() + node("END", "end");
      });
      html += "</div>";
    }

    if (d.type === "router") {
      html += '<div class="flow-col">';
      html += node(d.start, "start") + arrow() + node(d.router, "decision") + arrow();
      html += '<div class="frow">';
      d.branches.forEach(function (b) { html += node(b, "tool"); });
      html += "</div>" + arrow();
      (d.after || []).forEach(function (a) { html += node(a) + arrow(); });
      html += node(d.end, "end") + "</div>";
    }

    if (d.type === "pipeline-branch") {
      html += '<div class="flow-col">';
      html += node(d.start, "start") + arrow();
      (d.stepsBefore || []).forEach(function (s) { html += node(s) + arrow(); });
      html += node(d.decision, "decision") + arrow();
      html += '<div class="branch-wrap">';
      html += '<div class="branch"><div class="lbl">' + escapeHtml(d.yesLabel) + "</div>";
      (d.yesPath || []).forEach(function (s, i, arr) {
        html += node(s) + (i < arr.length - 1 ? arrow() : "");
      });
      html += '</div><div class="branch"><div class="lbl">' + escapeHtml(d.noLabel) + "</div>";
      (d.noPath || []).forEach(function (s, i, arr) {
        html += node(s) + (i < arr.length - 1 ? arrow() : "");
      });
      html += "</div></div>" + arrow() + node(d.merge) + arrow() + node(d.end, "end");
      html += "</div>";
    }

    if (d.type === "compare-two") {
      html += '<div class="compare">';
      html += '<div class="col"><h5>' + escapeHtml(d.leftTitle) + "</h5><div class='flow-col'>";
      d.leftSteps.forEach(function (s, i) {
        html += node(s) + (i < d.leftSteps.length - 1 ? arrow() : "");
      });
      html += '</div></div><div class="col"><h5>' + escapeHtml(d.rightTitle) + "</h5><div class='flow-col'>";
      d.rightSteps.forEach(function (s, i) {
        html += node(s) + (i < d.rightSteps.length - 1 ? arrow() : "");
      });
      html += "</div></div></div>";
    }

    html += "</div>";
    return html;
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function sectionById(id) {
    return (data.sections || []).find(function (s) { return s.id === id; }) || { id: id, name: id, expected: 0 };
  }

  function questionIndexById(id) {
    return data.questions.findIndex(function (q) { return q.id === id; });
  }

  function matchesSearch(q) {
    if (!search) return true;
    var blob = (q.title + " " + q.category + " " + (q.oneLiner || "")).toLowerCase();
    return blob.indexOf(search.toLowerCase()) !== -1;
  }

  function matchesFilter(q, user) {
    if (filter === "todo") return !user.practiced[q.id];
    if (filter === "done") return !!user.practiced[q.id];
    if (filter === "priority") return (q.playlists || []).indexOf("priority") !== -1;
    return true;
  }

  function filteredQuestions() {
    var user = getUser();
    return data.questions.filter(function (q) {
      return matchesSearch(q) && matchesFilter(q, user);
    });
  }

  function practicedCount(list, user) {
    return list.filter(function (q) { return user.practiced[q.id]; }).length;
  }

  function updateProgress() {
    var user = getUser();
    var ready = data.questions.length;
    var done = practicedCount(data.questions, user);
    $("progressLine").textContent = done + " of " + ready + " done";
    var bar = $("progressBar");
    if (bar) bar.style.width = (ready ? Math.round(done / ready * 100) : 0) + "%";
    if ($("brandSub")) $("brandSub").textContent = ready + " questions in " + (data.sections || []).length + " topics.";
  }

  function persistSession() {
    var user = getUser();
    user.lastView = view;
    user.lastTopicScope = topicScope;
    user.lastNavTopic = navTopic;
    if (data.questions[index]) user.lastQuestionId = data.questions[index].id;
    saveUser(user);
    var hash = "#home";
    if (view === "topic") hash = "#list-" + topicScope;
    else if (view === "question") hash = "#" + data.questions[index].id;
    if (location.hash !== hash) {
      try { history.replaceState(null, "", hash); } catch (e) {}
    }
  }

  function renderLibrary() {
    var user = getUser();
    var lastId = user.lastQuestionId;
    var last = data.questions.find(function (q) { return q.id === lastId; });
    var html = '<div class="library">';
    html += '<div class="library-hero">';
    html += "<h2>Study by topic</h2>";
    html += "<p>Open a topic, pick a question, and read the detailed answer.</p>";
    html += "</div>";

    if (last) {
      html += '<div class="continue-card"><div><strong>Continue</strong><span>' + escapeHtml(last.title) + "</span></div>";
      html += '<button type="button" class="btn install-btn" id="btnContinue">Open</button></div>';
    }

    var priorityQs = data.questions.filter(function (q) { return (q.playlists || []).indexOf("priority") !== -1; });
    html += '<div class="topic-grid">';
    html += '<button type="button" class="topic-card" data-filter="priority">';
    html += '<div class="count">' + priorityQs.length + " / " + (data.meta.totalPriority || 15) + " ready</div>";
    html += "<h3>Practice first</h3><p>The 15 highest-value questions. Start here if time is short.</p>";
    html += '<div class="bar"><span style="width:' + Math.round(priorityQs.length / (data.meta.totalPriority || 15) * 100) + '%"></span></div></button>';

    (data.sections || []).forEach(function (sec) {
      var qs = data.questions.filter(function (q) { return q.sectionId === sec.id; });
      var done = practicedCount(qs, user);
      var expected = sec.expected || qs.length || 1;
      var soon = qs.length === 0;
      html += '<button type="button" class="topic-card' + (soon ? " soon" : "") + '" data-section="' + escapeHtml(sec.id) + '"' + (soon ? " disabled" : "") + ">";
      html += '<div class="count">' + qs.length + " ready · " + done + " done · " + expected + " planned</div>";
      html += "<h3>" + escapeHtml(sec.name) + "</h3>";
      html += "<p>" + escapeHtml(sec.blurb) + (soon ? " Coming next." : "") + "</p>";
      html += '<div class="bar"><span style="width:' + Math.round((qs.length / expected) * 100) + '%"></span></div></button>';
    });
    html += "</div></div>";
    $("panel").innerHTML = html;

    var cont = $("btnContinue");
    if (cont) {
      cont.addEventListener("click", function () {
        openQuestion(questionIndexById(last.id));
      });
    }
    Array.prototype.forEach.call($("panel").querySelectorAll("[data-filter]"), function (btn) {
      btn.addEventListener("click", function () {
        filter = btn.getAttribute("data-filter");
        syncChips();
        var list = filteredQuestions();
        if (list[0]) showTopicList(btn.getAttribute("data-filter"));
        else showLibrary();
      });
    });
    Array.prototype.forEach.call($("panel").querySelectorAll("[data-section]"), function (btn) {
      btn.addEventListener("click", function () {
        showTopicList(btn.getAttribute("data-section"));
      });
    });
  }

  function topicMeta(scope) {
    if (scope === "priority") {
      return { name: "Practice first", blurb: "The 15 highest-value questions. Tap one to open it." };
    }
    var sec = sectionById(scope);
    return { name: sec.name, blurb: sec.blurb || "Tap a question to open the answer." };
  }

  function topicQuestions(scope) {
    scope = scope || topicScope;
    if (scope === "priority") {
      return data.questions.filter(function (q) { return (q.playlists || []).indexOf("priority") !== -1; });
    }
    return data.questions.filter(function (q) { return q.sectionId === scope; });
  }

  function renderTopicList() {
    var user = getUser();
    var meta = topicMeta(topicScope);
    var qs = topicQuestions(topicScope);
    var html = '<div class="library topic-list">';
    html += '<div class="library-hero">';
    html += '<button type="button" class="btn ghost" id="btnBackTopics">← All topics</button>';
    html += "<h2>" + escapeHtml(meta.name) + "</h2>";
    html += "<p>" + escapeHtml(meta.blurb) + " " + qs.length + " questions.</p>";
    html += '</div><div class="q-list">';
    qs.forEach(function (q, qi) {
      var done = user.practiced[q.id];
      html += '<button type="button" class="q-row' + (done ? " practiced" : "") + '" data-i="' + questionIndexById(q.id) + '">';
      html += '<span class="n">' + pad(qi + 1) + "</span>";
      html += '<span class="q-row-body"><strong>' + escapeHtml(q.title) + "</strong>";
      html += "<small>" + (done ? "done · " : "") + escapeHtml(q.oneLiner || "") + "</small></span>";
      html += "</button>";
    });
    if (!qs.length) html += '<p class="nav-empty">No questions in this topic yet.</p>';
    html += "</div></div>";
    $("panel").innerHTML = html;
    $("btnBackTopics").addEventListener("click", showLibrary);
    Array.prototype.forEach.call($("panel").querySelectorAll(".q-row"), function (btn) {
      btn.addEventListener("click", function () {
        openQuestion(Number(btn.getAttribute("data-i")));
      });
    });
  }

  function showTopicList(scope) {
    var qs = topicQuestions(scope);
    if (!qs.length) return;
    topicScope = scope;
    if (scope && scope !== "priority") navTopic = scope;
    view = "topic";
    if (scope === "priority") {
      filter = "priority";
      navTopic = "all";
      syncChips();
    }
    renderNav();
    renderTopicList();
    updateChrome();
    persistSession();
    $("panel").scrollTop = 0;
  }

  function renderQuestion(q) {
    var user = getUser();
    var total = data.questions.length;
    var html = "";

    html += '<div class="hero">';
    html += '<div class="pills">';
    html += '<button type="button" class="pill link" id="btnBackList">← Question list</button>';
    html += '<span class="pill">' + (questionIndexById(q.id) + 1) + " of " + total + "</span>";
    html += '<span class="pill">' + escapeHtml(sectionById(q.sectionId).name) + "</span>";
    html += '<span class="pill">' + escapeHtml(q.category) + "</span>";
    html += "</div>";
    html += "<h2>" + escapeHtml(q.title) + "</h2>";
    html += "</div>";

    var blocks = buildAnswerBlocks(q);
    html += '<section class="section"><h3>Explanation</h3>' + points(blocks.explanation) + "</section>";
    html += '<section class="section"><h3>Interview-ready answer</h3>' + points(blocks.interview) + "</section>";

    var codeExample = buildCodeExample(q);
    if (codeExample) {
      html += '<section class="section"><h3>' + escapeHtml(codeExample.title) + '</h3>';
      html += "<pre>" + escapeHtml(codeExample.code) + "</pre>";
      html += "</section>";
    }

    (tablesForQuestion(q) || []).forEach(function (t) {
      html += '<section class="section">' + renderTable(t) + "</section>";
    });

    if (q.example && (q.example.story || q.example.walkthrough || q.example.agentOutput || (q.example.tables && q.example.tables.length))) {
      html += '<section class="section"><h3>' + escapeHtml(q.example.title || "Example") + "</h3>";
      if (q.example.story) html += "<p>" + escapeHtml(q.example.story) + "</p>";
      (q.example.tables || []).forEach(function (t) { html += renderTable(t); });
      if (q.example.walkthrough) {
        html += '<div class="walk">';
        q.example.walkthrough.forEach(function (w) {
          html += '<div class="walk-item"><div><strong>' + escapeHtml(w.step) + '</strong></div><div class="tag">' + escapeHtml(w.result) + "</div><div>" + escapeHtml(w.detail) + "</div></div>";
        });
        html += "</div>";
      }
      if (q.example.agentOutput) {
        html += "<h3 style='margin-top:18px'>" + escapeHtml(q.example.agentOutput.title) + "</h3>";
        html += '<pre class="json-box">' + escapeHtml(JSON.stringify(q.example.agentOutput.jsonExample, null, 2)) + "</pre>";
      }
      html += "</section>";
    }

    html += '<section class="section notes"><div class="note-row"><label for="userNotes">Your notes (saved in this browser)</label>';
    html += '<label><input type="checkbox" id="practiced"' + (user.practiced[q.id] ? " checked" : "") + " /> Mark as done</label></div>";
    html += '<textarea id="userNotes" placeholder="Your notes...">' + escapeHtml(user.notes[q.id] || "") + "</textarea></section>";

    $("panel").innerHTML = html;

    var backList = $("btnBackList");
    if (backList) {
      backList.addEventListener("click", function () {
        showTopicList(topicScope || q.sectionId);
      });
    }
    $("userNotes").addEventListener("input", function (e) {
      var u = getUser();
      u.notes[q.id] = e.target.value;
      saveUser(u);
    });
    $("practiced").addEventListener("change", function (e) {
      var u = getUser();
      u.practiced[q.id] = e.target.checked;
      saveUser(u);
      renderNav();
      updateProgress();
    });
  }

  function renderTopicTabs(questionPool) {
    var counts = {};
    (data.sections || []).forEach(function (sec) {
      counts[sec.id] = 0;
    });
    questionPool.forEach(function (q) {
      counts[q.sectionId] = (counts[q.sectionId] || 0) + 1;
    });
    var html = "";
    html += '<button type="button" class="topic-tab' + (navTopic === "all" ? " active" : "") + '" data-topic="all" role="tab" aria-selected="' + (navTopic === "all" ? "true" : "false") + '">All <span>' + questionPool.length + "</span></button>";
    (data.sections || []).forEach(function (sec) {
      var n = counts[sec.id] || 0;
      if (!n && (search || filter !== "all")) return;
      var active = navTopic === sec.id;
      html += '<button type="button" class="topic-tab' + (active ? " active" : "") + '" data-topic="' + escapeHtml(sec.id) + '" role="tab" aria-selected="' + (active ? "true" : "false") + '">';
      html += escapeHtml(sec.name) + " <span>" + n + "</span></button>";
    });
    $("topicTabs").innerHTML = html;

    Array.prototype.forEach.call($("topicTabs").querySelectorAll("[data-topic]"), function (btn) {
      btn.addEventListener("click", function () {
        navTopic = btn.getAttribute("data-topic") || "all";
        if (view === "topic" && navTopic !== "all") {
          topicScope = navTopic;
          renderTopicList();
          updateChrome();
        } else if (view === "topic" && navTopic === "all") {
          showLibrary();
          return;
        }
        renderNav();
        persistSession();
      });
    });
  }

  function renderNav() {
    var user = getUser();
    var questionPool = filteredQuestions();
    var availableForTopic = navTopic === "all" ? questionPool : questionPool.filter(function (q) {
      return q.sectionId === navTopic;
    });
    if (navTopic !== "all" && !availableForTopic.length) navTopic = "all";
    renderTopicTabs(questionPool);

    var html = "";
    var any = false;
    (data.sections || []).forEach(function (sec) {
      var qs = questionPool.filter(function (q) { return q.sectionId === sec.id; });
      if (navTopic !== "all" && sec.id !== navTopic) return;
      var allInSection = data.questions.filter(function (q) { return q.sectionId === sec.id; });
      var current = (view === "topic" && topicScope === sec.id) || (view === "question" && data.questions[index] && data.questions[index].sectionId === sec.id);
      if (qs.length === 0 && allInSection.length === 0 && (search || filter === "todo" || filter === "done" || filter === "priority")) {
        return;
      }
      any = true;
      html += '<section class="nav-block' + (current ? " current" : "") + (allInSection.length === 0 ? " empty" : "") + '" data-section="' + escapeHtml(sec.id) + '">';
      html += '<button type="button" class="nav-block-head" data-topic="' + escapeHtml(sec.id) + '">';
      html += '<span class="nav-block-name">' + escapeHtml(sec.name) + "</span>";
      html += '<span class="nav-count">' + qs.length + "</span>";
      html += "</button><div class='nav-list'>";
      if (allInSection.length === 0) {
        html += '<p class="coming">Coming next.</p>';
      } else if (qs.length === 0) {
        html += '<p class="coming">Nothing matches this filter.</p>';
      } else {
        qs.forEach(function (q, qi) {
          var i = questionIndexById(q.id);
          var active = view === "question" && i === index;
          html += '<button type="button" class="q-btn' + (active ? " active" : "") + '" data-i="' + i + '">';
          html += '<span class="n">' + pad(qi + 1) + "</span>";
          html += '<span class="q-btn-text">' + escapeHtml(q.title) + "</span>";
          html += '<span class="q-check">' + (user.practiced[q.id] ? "✓" : "") + "</span>";
          html += "</button>";
        });
      }
      html += "</div></section>";
    });
    if (!any) html = '<p class="nav-empty">No questions match. Clear search or pick All.</p>';
    $("nav").innerHTML = html;

    Array.prototype.forEach.call($("nav").querySelectorAll("[data-topic]"), function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var id = btn.getAttribute("data-topic");
        if (!id) return;
        navTopic = id;
        if (view === "topic") {
          topicScope = id;
          renderTopicList();
          updateChrome();
        }
        renderNav();
        persistSession();
      });
    });
    Array.prototype.forEach.call($("nav").querySelectorAll("[data-i]"), function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openQuestion(Number(btn.getAttribute("data-i")));
      });
    });
    updateProgress();
  }

  function closeMenu() {
    $("sidebar").classList.remove("open");
    $("scrim").hidden = true;
    $("btnMenu").setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    $("sidebar").classList.add("open");
    $("scrim").hidden = false;
    $("btnMenu").setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
  }

  function updateChrome() {
    var list = navList();
    var pos = 0;
    var atStart = true;
    var atEnd = true;
    if (view === "question") {
      var id = data.questions[index].id;
      pos = list.findIndex(function (q) { return q.id === id; });
      if (pos < 0) pos = 0;
      atStart = pos <= 0;
      atEnd = pos >= list.length - 1;
    }
    $("btnPrevDock").disabled = view === "library";
    $("btnNextDock").disabled = false;
    if (view === "library") {
      $("dockCount").textContent = "topics";
      $("btnPrevDock").textContent = "Previous";
      $("btnPrevDock").disabled = true;
      $("btnNextDock").textContent = "Continue";
      $("btnNextDock").disabled = false;
      $("mobileTitle").textContent = "Question library";
      $("btnHomeDock").classList.add("active");
    } else if (view === "topic") {
      var meta = topicMeta(topicScope);
      var n = topicQuestions(topicScope).length;
      $("dockCount").textContent = n + " qs";
      $("btnPrevDock").textContent = "Topics";
      $("btnPrevDock").disabled = false;
      $("btnNextDock").textContent = "Next";
      $("btnNextDock").disabled = true;
      $("mobileTitle").textContent = meta.name;
      $("btnHomeDock").classList.remove("active");
    } else {
      var q = data.questions[index];
      $("dockCount").textContent = (pos + 1) + " / " + list.length;
      $("btnPrevDock").textContent = "Previous";
      $("btnNextDock").textContent = "Next";
      $("mobileTitle").textContent = q.title;
      $("btnPrevDock").disabled = false;
      $("btnNextDock").disabled = atEnd;
      $("btnHomeDock").classList.remove("active");
    }
  }

  function showLibrary() {
    view = "library";
    topicScope = null;
    if (filter === "priority") {
      filter = "all";
      syncChips();
    }
    renderNav();
    renderLibrary();
    updateChrome();
    persistSession();
    closeMenu();
    $("panel").scrollTop = 0;
  }

  function openQuestion(i) {
    if (i < 0 || i >= data.questions.length) return;
    index = i;
    view = "question";
    if (navTopic !== "all") topicScope = navTopic;
    else topicScope = null;
    renderNav();
    renderQuestion(data.questions[index]);
    updateChrome();
    persistSession();
    closeMenu();
    $("panel").scrollTop = 0;
  }

  function navList() {
    if (navTopic !== "all") {
      return filteredQuestions().filter(function (q) { return q.sectionId === navTopic; });
    }
    if (topicScope) return topicQuestions(topicScope);
    if (search || filter !== "all") return filteredQuestions();
    return data.questions;
  }

  function go(delta) {
    if (view === "topic") {
      showLibrary();
      return;
    }
    if (view !== "question") {
      var user = getUser();
      var last = questionIndexById(user.lastQuestionId);
      openQuestion(last >= 0 ? last : 0);
      return;
    }
    var list = navList();
    var id = data.questions[index].id;
    var pos = list.findIndex(function (q) { return q.id === id; });
    var next = list[pos + delta];
    if (next) openQuestion(questionIndexById(next.id));
    else if (topicScope) showTopicList(topicScope);
    else if (delta < 0) showLibrary();
  }

  function syncChips() {
    Array.prototype.forEach.call(document.querySelectorAll(".chip[data-filter]"), function (chip) {
      chip.classList.toggle("active", chip.getAttribute("data-filter") === filter);
    });
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function loadLibrary() {
    var files = ["questions.json", "questions-rest.json"];
    var base = null;
    for (var i = 0; i < files.length; i++) {
      try {
        var res = await fetch(files[i], { cache: "no-store" });
        if (!res.ok) continue;
        var json = await res.json();
        if (!base) base = json;
        else if (json.questions && json.questions.length) {
          base.questions = base.questions.concat(json.questions);
        }
      } catch (e) {}
    }
    if (!base || !base.questions) base = window.QA_DATA;
    else if (window.QA_DATA && window.QA_DATA.questions && window.QA_DATA.questions.length > base.questions.length) {
      base = window.QA_DATA;
    }
    return base;
  }

  async function boot() {
    data = await loadLibrary();
    if (!data) {
      $("panel").innerHTML = "<section class='section'><p>Could not load questions.json.</p></section>";
      return;
    }
    var packText = data.meta.role + " · " + data.meta.packTitle;
    $("packLabel").textContent = packText;

    var user = getUser();
    navTopic = user.lastNavTopic || "all";
    var hash = (location.hash || "").replace("#", "");
    if (hash.indexOf("list-") === 0) {
      showTopicList(hash.slice(5));
    } else if (hash && hash !== "home") {
      var hi = questionIndexById(hash);
      if (hi >= 0) openQuestion(hi);
      else showLibrary();
    } else if (hash === "home") {
      showLibrary();
    } else if (user.lastView === "topic" && user.lastTopicScope) {
      showTopicList(user.lastTopicScope);
    } else if (user.lastView === "question" && user.lastQuestionId) {
      var li = questionIndexById(user.lastQuestionId);
      if (li >= 0) openQuestion(li);
      else showLibrary();
    } else {
      showLibrary();
    }

    $("btnMenu").addEventListener("click", function () {
      if ($("sidebar").classList.contains("open")) closeMenu();
      else openMenu();
    });
    $("btnCloseSidebar").addEventListener("click", closeMenu);
    $("scrim").addEventListener("click", closeMenu);
    $("btnLibrary").addEventListener("click", showLibrary);
    $("btnHomeDock").addEventListener("click", showLibrary);

    var moreRoot = document.querySelector(".more");
    var moreBtn = $("btnMore");
    var moreMenu = $("moreMenu");
    function closeMoreMenu() {
      if (!moreBtn || !moreMenu) return;
      moreMenu.hidden = true;
      moreBtn.setAttribute("aria-expanded", "false");
      if (moreRoot) moreRoot.classList.remove("open");
    }
    function openMoreMenu() {
      if (!moreBtn || !moreMenu) return;
      moreMenu.hidden = false;
      moreBtn.setAttribute("aria-expanded", "true");
      if (moreRoot) moreRoot.classList.add("open");
    }
    if (moreBtn && moreMenu && moreRoot) {
      moreBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (moreMenu.hidden) openMoreMenu();
        else closeMoreMenu();
      });
      moreMenu.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      document.addEventListener("click", function (e) {
        if (!moreRoot.contains(e.target)) closeMoreMenu();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMoreMenu();
      });
    }

    function syncSearchClear() {
      $("btnClearSearch").hidden = !search;
    }
    $("search").addEventListener("input", function (e) {
      search = e.target.value.trim();
      syncSearchClear();
      renderNav();
    });
    $("btnClearSearch").addEventListener("click", function () {
      $("search").value = "";
      search = "";
      syncSearchClear();
      $("search").focus();
      renderNav();
    });
    Array.prototype.forEach.call(document.querySelectorAll(".chip[data-filter]"), function (chip) {
      chip.addEventListener("click", function () {
        filter = chip.getAttribute("data-filter");
        syncChips();
        renderNav();
      });
    });
    $("btnPrevDock").addEventListener("click", function () {
      if (view === "library") return;
      go(-1);
    });
    $("btnNextDock").addEventListener("click", function () {
      if (view === "library") go(1);
      else go(1);
    });

    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    }

    var deferredPrompt = null;
    var isAndroid = isAndroidDevice();
    function showInstall(show) {
      $("btnInstall").hidden = !show;
      $("btnInstallSidebar").hidden = !show;
    }
    function showAndroidHint(show) {
      var hint = $("androidHint");
      if (hint) hint.hidden = !show;
    }
    function refreshInstallUI() {
      var standalone = isStandaloneMode();
      var canPrompt = !!deferredPrompt;
      var showButtons = !standalone && (canPrompt || isAndroid);
      showInstall(showButtons);
      showAndroidHint(!standalone && isAndroid && !canPrompt);
    }
    if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !isStandaloneMode()) {
      $("iosHint").hidden = false;
    }
    refreshInstallUI();
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      refreshInstallUI();
    });
    window.addEventListener("appinstalled", function () {
      deferredPrompt = null;
      refreshInstallUI();
    });
    function installApp() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null;
          refreshInstallUI();
        });
        return;
      }
      if (isAndroid && !isStandaloneMode()) {
        showAndroidHint(true);
        alert("To install on Android: open browser menu (⋮) and tap Install app or Add to Home screen.");
      }
    }
    $("btnInstall").addEventListener("click", installApp);
    $("btnInstallSidebar").addEventListener("click", installApp);
    $("btnExportOfficial").addEventListener("click", function () {
      closeMoreMenu();
      download("interview-questions.json", JSON.stringify(data, null, 2));
    });
    $("btnExportUser").addEventListener("click", function () {
      closeMoreMenu();
      var payload = {
        savedAt: new Date().toISOString(),
        source: "Interview library — user notes",
        user: getUser()
      };
      download("my-interview-notes.json", JSON.stringify(payload, null, 2));
    });
    $("importUser").addEventListener("change", function (e) {
      closeMoreMenu();
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var parsed = JSON.parse(reader.result);
          var imported = parsed.user || parsed;
          if (!imported.notes) throw new Error("no notes");
          saveUser(imported);
          if (view === "library") showLibrary();
          else openQuestion(index);
        } catch (err) {
          alert("That JSON file does not look like exported notes.");
        }
      };
      reader.readAsText(file);
    });
    window.addEventListener("hashchange", function () {
      var h = (location.hash || "").replace("#", "");
      if (!h || h === "home") showLibrary();
      else if (h.indexOf("list-") === 0) showTopicList(h.slice(5));
      else {
        var i = questionIndexById(h);
        if (i >= 0) openQuestion(i);
      }
    });
  }

  boot();
})();
