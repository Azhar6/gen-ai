(function () {
  const USER_KEY = "interview-qa-user-v1";
  let data = null;
  let index = 0;
  let view = "library";
  let filter = "all";
  let search = "";
  let openGroups = {};
  let topicScope = null;

  function $(id) { return document.getElementById(id); }

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
    view = "topic";
    if (scope !== "priority") openGroups[scope] = true;
    if (scope === "priority") {
      filter = "priority";
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

    var answer = q.answer && q.answer.length ? q.answer : (q.simpleAnswer || []);
    if (q.oneLiner && answer.indexOf(q.oneLiner) === -1) {
      answer = [q.oneLiner].concat(answer);
    }
    html += '<section class="section"><h3>Answer</h3>' + paras(answer) + "</section>";

    (tablesForQuestion(q) || []).forEach(function (t) {
      html += '<section class="section">' + renderTable(t) + "</section>";
    });

    var chart = chartForQuestion(q);
    if (chart) {
      html += '<section class="section"><h3>Chart</h3>' + renderChart(chart) + "</section>";
    }

    var diagram = diagramForQuestion(q);
    if (diagram) {
      html += '<section class="section"><h3>Flow</h3>' + renderDiagram(diagram) + "</section>";
    }

    if (q.example && (q.example.story || q.example.walkthrough || q.example.code || q.example.agentOutput || (q.example.tables && q.example.tables.length))) {
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
      if (q.example.code) {
        html += "<h3 style='margin-top:18px'>" + escapeHtml(q.example.codeTitle || "Example code") + "</h3>";
        html += "<pre>" + escapeHtml(q.example.code) + "</pre>";
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

  function renderNav() {
    var user = getUser();
    var html = "";
    var any = false;
    (data.sections || []).forEach(function (sec) {
      var qs = data.questions.filter(function (q) {
        return q.sectionId === sec.id && matchesSearch(q) && matchesFilter(q, user);
      });
      if (filter !== "all" && qs.length === 0 && !search) {
        if (filter === "priority") return;
      }
      var allInSection = data.questions.filter(function (q) { return q.sectionId === sec.id; });
      var current = (view === "topic" && topicScope === sec.id) || (view === "question" && data.questions[index] && data.questions[index].sectionId === sec.id);
      var isOpen;
      if (search && qs.length > 0) isOpen = true;
      else if (Object.prototype.hasOwnProperty.call(openGroups, sec.id)) isOpen = !!openGroups[sec.id];
      else isOpen = current;
      if (qs.length === 0 && allInSection.length === 0 && (search || filter === "todo" || filter === "done" || filter === "priority")) {
        return;
      }
      any = true;
      html += '<div class="nav-group' + (isOpen ? " open" : "") + (current ? " current" : "") + (allInSection.length === 0 ? " empty" : "") + '" data-section="' + escapeHtml(sec.id) + '">';
      html += '<button type="button" class="nav-group-head" data-toggle="' + escapeHtml(sec.id) + '" aria-expanded="' + (isOpen ? "true" : "false") + '">';
      html += '<span class="nav-toggle" aria-hidden="true">▸</span>';
      html += '<span class="nav-group-name">' + escapeHtml(sec.name) + "</span>";
      html += '<span class="nav-count">' + qs.length + "</span>";
      html += "</button><div class='nav-group-body'>";
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
      html += "</div></div>";
    });
    if (!any) html = '<p class="nav-empty">No questions match. Clear search or pick All.</p>';
    $("nav").innerHTML = html;

    Array.prototype.forEach.call($("nav").querySelectorAll("[data-toggle]"), function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id = btn.getAttribute("data-toggle");
        var group = btn.closest(".nav-group");
        var open = !group.classList.contains("open");
        openGroups[id] = open;
        group.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
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
    if (data.questions[i].sectionId) openGroups[data.questions[i].sectionId] = true;
    if (!topicScope) topicScope = data.questions[i].sectionId;
    renderNav();
    renderQuestion(data.questions[index]);
    updateChrome();
    persistSession();
    closeMenu();
    $("panel").scrollTop = 0;
  }

  function navList() {
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
    Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (chip) {
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
    Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (chip) {
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
    function showInstall(show) {
      $("btnInstall").hidden = !show;
      $("btnInstallSidebar").hidden = !show;
    }
    var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone) {
      $("iosHint").hidden = false;
    }
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      if (!standalone) showInstall(true);
    });
    window.addEventListener("appinstalled", function () {
      deferredPrompt = null;
      showInstall(false);
    });
    function installApp() {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        showInstall(false);
      });
    }
    $("btnInstall").addEventListener("click", installApp);
    $("btnInstallSidebar").addEventListener("click", installApp);
    $("btnExportOfficial").addEventListener("click", function () {
      download("interview-questions.json", JSON.stringify(data, null, 2));
    });
    $("btnExportUser").addEventListener("click", function () {
      var payload = {
        savedAt: new Date().toISOString(),
        source: "Interview library — user notes",
        user: getUser()
      };
      download("my-interview-notes.json", JSON.stringify(payload, null, 2));
    });
    $("importUser").addEventListener("change", function (e) {
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
