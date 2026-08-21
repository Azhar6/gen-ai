# Build remaining interview Q&A (simple English, shop/warehouse examples).
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent / "questions-rest.json"


def F(case, happens, fix):
    return {"case": case, "whatHappens": happens, "fix": fix}


def card(
    qid, number, section, title, category, time, one, simple, why, say,
    layers=None, tables=None, story=None, walk=None, code=None, code_title=None,
    design=None, fails=None, prod=None, diagram=None, play=None, extra_tables=None,
):
    simple = simple if isinstance(simple, list) else [p.strip() for p in simple.split("\n") if p.strip()]
    answer = [one] + simple
    if say:
        answer.append(say)
    if layers:
        answer.append("Here is how the pieces fit together.")
        answer.extend([a + ": " + b for a, b in layers])
    if design:
        answer.extend(design)
    q = {
        "id": qid,
        "number": number,
        "sectionId": section,
        "playlists": play or [],
        "title": title,
        "category": category,
        "oneLiner": one,
        "answer": answer,
        "simpleAnswer": answer,
    }
    if layers:
        q["architecture"] = {"title": "How to think about it", "layers": [{"name": a, "what": b} for a, b in layers]}
    if diagram:
        q["diagram"] = diagram
    tabs = []
    if tables:
        tabs.append({"title": tables[0], "headers": tables[1], "rows": tables[2]})
    if extra_tables:
        tabs.extend(extra_tables)
    if tabs:
        q["tables"] = tabs
    if story or walk or code:
        ex = {"title": "Example", "story": story or "A small shop example."}
        if extra_tables and not tables:
            ex["tables"] = extra_tables
        if walk:
            ex["walkthrough"] = [{"step": a, "result": b, "detail": c} for a, b, c in walk]
        if code:
            ex["codeTitle"] = code_title or "Example code"
            ex["code"] = code
        q["example"] = ex
    return q


Q = []

# --- Priority 6-15 (same depth as first 5) ---
Q.append(card(
    "q6", 6, "etl", "Design an ETL pipeline for daily data", "Data Engineering / ETL", "8–12 minutes",
    "Land the file, validate, transform, dedupe, load with idempotent writes, then check totals and alert.",
    "ETL means Extract, Transform, Load. You pull data from a source, clean it, then save it where the app can use it.\n"
    "A simple nightly job: the shop drops orders_YYYYMMDD.csv at 19:00. You must have clean rows in the database before 22:00.\n"
    "Do not jump to Spark. Draw the stages first. Then pick the tool that fits the file size.",
    "This is a core data-engineering question. They want a pipeline, not a pandas notebook.",
    "I would land the file with a checksum, validate schema, transform to one item-code and UTC dates, dedupe on order_id, MERGE into the warehouse so reruns do not double-count, then compare row counts and money totals. Bad rows go to a reject table, never silent delete.",
    play=["priority"],
    diagram={"type": "pipeline", "title": "Nightly order pipeline", "steps": [
        "File lands", "Checksum + copy", "Validate", "Transform", "Dedupe", "Load (MERGE)", "Control totals", "Alert"
    ]},
    layers=[
        ("Extract", "Copy from SFTP/S3. Store the original. Record size and checksum."),
        ("Validate", "Header, types, required fields, file not truncated."),
        ("Transform", "Dates to ISO, item codes upper-case, prices as decimals."),
        ("Load", "Partition by date. Upsert on order_id."),
        ("Observe", "Counts, duration, reject %, amount total vs control file."),
    ],
    tables=["Stages vs what can go wrong", ["Stage", "Good check", "If it fails"], [
        ["Land", "Checksum matches sender", "Do not process a half file"],
        ["Validate", "Required columns exist", "Fail the file, page ops"],
        ["Transform", "Item code matches the item list", "Reject the row with a reason"],
        ["Load", "Rerun does not add duplicates", "MERGE / delete+reload that date"],
        ["Totals", "Sum(qty*price) matches control", "Stop downstream jobs"],
    ]],
    story="orders_20260821.csv arrives at 19:10. 2 million rows. You have until 22:00.",
    walk=[
        ("19:12", "Land", "Copy + SHA256. Keep the raw file."),
        ("19:30", "Validate + transform", "Polars scan. Write parquet by date."),
        ("20:10", "Load", "MERGE on order_id. job_id=20260821-001."),
        ("20:25", "Totals", "Amount matches control within 0.00. Then the recon job may start."),
    ],
    code="raw = pl.scan_csv('orders_20260821.csv')\nclean = raw.unique(subset=['order_id'], keep='last')\nclean.sink_parquet('curated/order_date=2026-08-21/')",
    design=["Original file is never edited.", "Idempotent load is mandatory.", "Rejects are stored with reasons."],
    fails=[
        F("pandas.read_csv the whole file", "Out of memory. Missed SLA.", "Scan or chunk. Write parquet."),
        F("Append on retry", "Yesterday's orders count twice.", "MERGE on order_id."),
        F("Silent drop of bad rows", "Stock is quietly wrong.", "Dead-letter table + alert if reject % > 0.5%."),
    ],
    prod=["SLA clock on a dashboard.", "One job_id per run.", "Same code for backfill of 30 days."],
))

Q.append(card(
    "q7", 7, "etl", "How would you validate and handle bad records?", "Data Engineering / ETL", "6–8 minutes",
    "Fail the whole file if the file itself is broken. Quarantine bad rows if most of the file is fine. Never drop rows in silence.",
    "Validation is a set of rules: required fields, types, allowed values, ranges, and 'does this item code exist?'.\n"
    "If the header is wrong or the checksum fails, stop. Do not load a truncated file.\n"
    "If 1% of rows have a missing item code, load the rest and write the 1% to orders_reject with reason=BAD_ITEM.",
    "They want to know you will not hide dirty data, and you will not block the whole night for one optional comment field.",
    "I split file-level failures from row-level failures. File broken: stop. A few bad rows: quarantine with a reason code, load the rest, alert if the reject rate spikes.",
    play=["priority"],
    tables=["Row rules for a shop order file", ["Field", "Rule", "If bad"], [
        ["order_id", "Not empty, unique", "Reject row, reason=NO_ID"],
        ["item", "Matches item list", "Reject row, reason=BAD_ITEM"],
        ["qty", "Integer > 0", "Reject row, reason=BAD_QTY"],
        ["price", "Decimal >= 0", "Reject row, reason=BAD_PRICE"],
        ["comment", "Optional text", "Keep row, set comment=null"],
    ]],
    story="82 million rows. 821,000 have item='blu shirt' instead of TSHIRT-BLU.",
    walk=[
        ("File checks", "Pass", "Checksum and header OK, so we do not fail the night."),
        ("Row checks", "1% reject", "Those rows go to orders_reject."),
        ("Alert", "Ops sees 1%", "If yesterday was 0.02%, this is a mapping bug, not 'dirty customers'."),
        ("Fix", "Mapping table", "Add an alias blu shirt → TSHIRT-BLU, then replay rejects only."),
    ],
    design=["Two levels: file vs row.", "Every reject has a reason.", "Optional fields must not block core fields."],
    fails=[
        F("Fail the whole 20 GB for missing comments", "Business has no data.", "Only core fields are blocking."),
        F("Load bad qty as 0", "Stock looks sold out.", "Reject. Do not guess."),
        F("No alert on reject spike", "You learn next week.", "Page if reject % > threshold."),
    ],
    prod=["Dashboard: rows in, rows out, reject % by reason.", "Replay path for the reject table.", "Schema contract tests in CI."],
))

Q.append(card(
    "q8", 8, "etl", "What is idempotency and why does it matter in pipelines?", "Data Engineering / ETL", "5–7 minutes",
    "Idempotent means running the same job twice gives the same stored result. Nightly jobs fail. You must be able to rerun without double-counting.",
    "If your load is INSERT only, a retry adds the same 2 million orders again. Stock and sales explode.\n"
    "Idempotent load uses a business key: order_id. MERGE: update if it exists, insert if it does not. Or delete that date partition and reload it.\n"
    "The job key should include the file date and checksum so you know which file you processed.",
    "This is a must-answer for ETL. If you miss it, they assume you have not owned a production job.",
    "I make the load idempotent on order_id plus source date. A retry, a crash at 80%, or a replay tomorrow does not double-count. I store job_id and checksum so I can prove what ran.",
    play=["priority"],
    tables=["Not idempotent vs idempotent", ["Action", "Bad", "Good"], [
        ["Retry after crash", "INSERT again", "MERGE or replace that date"],
        ["Same file two nights", "Duplicate rows", "Same keys overwrite"],
        ["Partial success", "80% in, 20% missing, then 180%", "Replace partition, then one complete set"],
    ]],
    story="Job dies at 80%. Ops clicks rerun.",
    walk=[
        ("Bad design", "Double count", "First run inserted 1.6M. Second run inserts 2M more."),
        ("Good design", "Same 2M", "MERGE on order_id. Extra rows from the first run are updated, not copied."),
        ("Proof", "Counts match", "warehouse count for that date equals unique order_ids in the file."),
    ],
    code="-- MERGE INTO orders t\n-- USING staging s ON t.order_id = s.order_id\n-- WHEN MATCHED THEN UPDATE SET ...\n-- WHEN NOT MATCHED THEN INSERT ...",
    design=["Business key first.", "Rerun is a feature, not an emergency.", "Never 'append and hope'."],
    fails=[
        F("Only unique in memory", "Two jobs in parallel both insert.", "Database constraint + MERGE."),
        F("Delete all orders then load", "A fail after delete leaves an empty shop.", "Replace one date partition, not the whole table."),
        F("No unique key in the file", "You cannot MERGE.", "Build a key: date+item+customer+qty+price, and tell the sender to add order_id."),
    ],
    prod=["Unique index on order_id.", "job_id on every row.", "Alert if row count for a date jumps 2x."],
))

Q.append(card(
    "q9", 9, "sql", "How would you find mismatched records in Python and SQL?", "SQL + Python", "6–8 minutes",
    "Match on a business key in SQL or pandas/Polars. Exact matches stay in SQL. Use Python only to inspect leftovers and to join files that are not in the database yet.",
    "A mismatch is a row in file A with no twin in file B, or the same key with a different qty or price.\n"
    "In SQL: FULL OUTER JOIN on order_id, then filter where one side is null or qty differs.\n"
    "In Python: build a dict keyed by order_id, or a Polars join. Do not nested-loop 2 million rows in pure Python.",
    "They want you to pick the right tool: set logic, not an LLM, for matching.",
    "I would join on order_id. Missing in warehouse, missing on website, quantity breaks, and price breaks become four result sets. SQL for data already loaded. Polars join for two big files. The agent only reads the break table.",
    play=["priority"],
    tables=["Break queries", ["Break", "How you find it"], [
        ["Missing in B", "A left join B where B.key is null"],
        ["Missing in A", "B left join A where A.key is null"],
        ["Qty break", "Inner join where a.qty <> b.qty"],
        ["Price break", "Inner join where a.price <> b.price"],
        ["Duplicates", "GROUP BY key HAVING COUNT(*) > 1"],
    ]],
    story="Website 4 orders, warehouse 4 rows. Same example as Q1, now in SQL.",
    walk=[
        ("Keys", "order_id or date+item+customer+qty", "If ids differ (WEB-1 vs WH-88), you need a second key."),
        ("Join", "Four buckets", "matched, missing, qty break, price break."),
        ("Python", "Same join in Polars", "web.join(wh, on=['date','item','customer','qty'], how='full')."),
    ],
    code="SELECT w.order_id, w.qty AS web_qty, h.qty AS wh_qty\nFROM web_orders w\nFULL OUTER JOIN wh_orders h ON w.date=h.date AND w.item=h.item\n AND w.customer=h.customer AND w.qty=h.qty\nWHERE w.order_id IS NULL OR h.wh_id IS NULL OR w.price <> h.price;",
    design=["Matching is deterministic.", "Do not ask the LLM to 'see if these look the same'.", "Keep break types separate so ops can work the queue."],
    fails=[
        F("Match on item name only", "Blue T-shirt vs blue hoodie mix.", "Use item code."),
        F("Nested Python loops", "Too slow on 2M rows.", "Join in SQL or Polars."),
        F("Float compare for prices", "12.00 vs 12.0000001 looks like a break.", "Compare as decimal cents."),
    ],
    prod=["Index the join keys.", "Store break_type on the result table.", "Count each break type every night."],
))

Q.append(card(
    "q10", 10, "production", "How would you make an LLM application production-ready?", "Production / System Design", "8–10 minutes",
    "Treat it like any API: timeouts, retries, limits, logs, tests, a kill switch, and a way to change the model without rewriting the app.",
    "A demo calls OpenAI from a notebook. Production has auth, rate limits, tracing, cost caps, fallback models, and human review for risky actions.\n"
    "You also need evaluation: a small set of golden questions you run on every prompt change.\n"
    "Never log full personal data. Never let the model write to the orders table in v1.",
    "This is how they see if you can own the service, not only a prompt.",
    "I would ship a small Python service with a model adapter, timeouts, retries with jitter, caching, tracing, token and latency metrics, JSON-schema outputs, and a golden-question eval in CI. Writes stay behind a human. I can switch Gemini to Claude by changing config.",
    play=["priority"],
    diagram={"type": "pipeline", "title": "Production LLM request", "steps": [
        "Auth + rate limit", "Cache lookup", "Call model (timeout)", "Validate JSON", "Retry or fallback", "Log metrics", "Response"
    ]},
    layers=[
        ("Edge", "HTTPS, auth, per-user rate limit."),
        ("App", "Use-case service, not 'one giant prompt'."),
        ("Model adapter", "Provider is swappable."),
        ("Safety", "Schema validation, allow-listed tools."),
        ("Observe", "Trace id, tokens, latency, error rate, cost."),
    ],
    tables=["Demo vs production", ["Topic", "Demo", "Production"], [
        ["Timeout", "Wait forever", "8s, then fallback"],
        ["Retry", "Click again", "2 retries, no retry on 400"],
        ["Output", "Free text", "JSON schema"],
        ["Secrets", "Key in code", "Vault / env, never in git"],
        ["Test", "Looks good", "Golden set + eval score"],
    ]],
    story="Shop chat: 'How many blue T-shirts in WH-12?'",
    walk=[
        ("Request", "Auth OK", "User id + rate limit."),
        ("Tools", "SQL + catalog", "Timeouts 2s each."),
        ("Validate", "qty=40 is in SQL rows", "If the draft says 400, retry or refuse."),
        ("Ship", "Answer + sources", "Trace stored. Cost $0.002."),
    ],
    design=["Adapter for the LLM vendor.", "Fail closed on money and writes.", "Eval in CI so prompt edits cannot silently break."],
    fails=[
        F("No timeout", "One hung call blocks workers.", "Timeout + extra worker budget."),
        F("Retry on 400", "You pay for the same bad prompt.", "Retry only 429/5xx."),
        F("No golden set", "A prompt tweak breaks stock answers.", "20 questions run on every merge."),
    ],
    prod=["Dashboards for latency p95, error %, tokens, $.","Feature flag to disable tools.","Runbook: if provider is down, switch model."],
))

Q.append(card(
    "q11", 11, "llm", "How would you prevent hallucinations?", "LLM fundamentals", "6–8 minutes",
    "Ground answers in retrieved or queried facts, force JSON, check every number against tool output, and say 'I do not know' when data is missing.",
    "A hallucination is a fluent answer that is not true. In a shop bot, that is 'WH-12 has 400 shirts' when SQL returned 40.\n"
    "You cannot fully stop an LLM from guessing. You can stop guesses from reaching the user: retrieve first, calculate in Python, validate, refuse.\n"
    "Lower temperature helps a bit. Grounding and checks help a lot.",
    "They want controls, not 'we will write a better prompt'.",
    "I would retrieve or query first, put only those facts in the prompt, compute totals in Python, validate that every number in the draft exists in tool output, and return a safe refusal if validation fails. I also cite the source and as-of time.",
    play=["priority"],
    tables=["Controls that actually help", ["Control", "What it does"], [
        ["RAG / SQL first", "Model sees real rows, not memory"],
        ["Low temperature", "Less random wording, not a guarantee"],
        ["JSON schema", "No extra made-up fields"],
        ["Number check", "Draft qty must be in tool JSON"],
        ["Refusal", "Better than a wrong stock number"],
        ["Citations", "User can see the source"],
    ]],
    story="SQL returns qty=40. Model writes 400.",
    walk=[
        ("Draft", "Wrong", "Validator extracts numbers: 400."),
        ("Check", "Fail", "400 not in {40, 12.00}."),
        ("Retry", "Once", "Prompt: 'Only use these JSON fields'."),
        ("Still bad", "Refuse", "'I cannot confirm stock. Please see the warehouse screen.'"),
    ],
    design=["Python owns numbers.", "Missing data is a first-class answer.", "Never use the model as the database."],
    fails=[
        F("Higher temperature for 'creativity' on stock", "Wrong qty.", "Temperature near 0 for facts."),
        F("No source", "User cannot check.", "Always show as-of and query id."),
        F("Fine-tune instead of grounding", "Still stale.", "RAG/SQL for changing data."),
    ],
    prod=["Track 'validator fail %'.", "Spot-check 20 answers a day.", "Alert if refusal rate jumps (often retrieval is down)."],
))

Q.append(card(
    "q12", 12, "rag", "RAG vs fine-tuning", "AI + RAG", "5–7 minutes",
    "Use RAG when facts change or you must cite documents. Use fine-tuning when you need a stable style or a skill, not a living catalog.",
    "RAG = retrieve then generate. You search your files or database, then the model writes using those chunks.\n"
    "Fine-tuning = change the model weights with examples. Good for tone, format, or a skill like extracting JSON from messy text.\n"
    "Shop catalog prices change daily. That is RAG or SQL, not a weekly fine-tune.",
    "They want the right tool. Fine-tuning is expensive and goes stale. RAG is the default for company knowledge.",
    "I would RAG (or SQL) for policies and changing facts. I would fine-tune only for style or a narrow extraction skill. For a shop assistant I start with RAG plus tools, not a custom model.",
    play=["priority"],
    diagram={"type": "compare-two", "title": "RAG vs fine-tune", "leftTitle": "RAG", "leftSteps": ["User question", "Search docs/DB", "Stuff chunks", "Generate + cite"], "rightTitle": "Fine-tune", "rightSteps": ["Collect examples", "Train", "Deploy new weights", "Answer from memory"]},
    tables=["When to pick which", ["Need", "Pick"], [
        ["Today's price or stock", "SQL / tools, not RAG of a PDF from last year"],
        ["Return policy PDF", "RAG"],
        ["Always answer as a short bullet list", "Fine-tune or a strict prompt"],
        ["Extract order fields from emails", "Fine-tune or a small extractor model"],
        ["Must quote section 3.2", "RAG with citations"],
    ]],
    story="Policy changes on Monday. Fine-tuned model still quotes Friday.",
    walk=[
        ("RAG", "Update the doc, re-index", "Monday's answers use the new PDF."),
        ("Fine-tune", "Needs new examples and a train job", "Too slow for a policy tweak."),
        ("Hybrid", "Fine-tune style + RAG facts", "Common in production."),
    ],
    design=["Changing facts → retrieve.", "Style/skill → maybe fine-tune.", "Start with RAG. Fine-tune later if you have data."],
    fails=[
        F("Fine-tune the whole catalog", "Stale by Tuesday.", "Query the catalog API."),
        F("RAG without chunking thought", "Wrong paragraph retrieved.", "Tune chunk size and metadata filters."),
        F("No eval", "You cannot tell which is better.", "Same golden questions for both."),
    ],
    prod=["Index freshness SLA.", "Cost: RAG adds retrieval latency; fine-tune adds train cost.", "Rollback for both index and model version."],
))

Q.append(card(
    "q13", 13, "oop", "Explain SOLID and design a modular LLM service", "OOP + Design Patterns", "8–10 minutes",
    "SOLID is five design rules. For LLM apps, the key is: depend on an interface, not Gemini or Claude. Swap the provider without rewriting the shop.",
    "S: one class, one reason to change. O: add a new model adapter without editing callers. L: any ModelClient must work. I: do not force a tiny FAQ bot to implement image APIs. D: high-level code depends on abstractions.\n"
    "A ModelClient with chat(messages) -> Result lets you switch vendors in config.\n"
    "Tools, prompts, and storage are also interfaces: SqlStore, CatalogClient, PromptRepo.",
    "This is the 5-year question. They want architecture, not a SOLID poster.",
    "I would put a ModelClient interface in the middle. GeminiClient and ClaudeClient implement it. The order-assistant service asks the interface, not the vendor. Prompts and tools are injected. Changing Claude tomorrow is a new class plus config, not a rewrite.",
    play=["priority"],
    layers=[
        ("API layer", "HTTP routes. No vendor SDKs here."),
        ("Use case", "AnswerStockQuestion. Depends on ModelClient + StockRepo."),
        ("Adapters", "GeminiClient, ClaudeClient, PostgresStock, FakeStock for tests."),
        ("Config", "MODEL=claude. No if/else in business code."),
    ],
    tables=["SOLID in this service", ["Letter", "Meaning here"], [
        ["S", "StockService does not also send emails"],
        ["O", "Add ClaudeClient without editing StockService"],
        ["L", "Tests use FakeClient; prod uses GeminiClient"],
        ["I", "ChatClient has no generate_image"],
        ["D", "StockService(ModelClient), not StockService(genai.Client)"],
    ]],
    story="Today Gemini. Tomorrow Claude.",
    walk=[
        ("Bad", "Rewrite", "Gemini calls are copied in 12 files."),
        ("Good", "One swap", "config.model_client = ClaudeClient(api_key)."),
        ("Test", "FakeClient", "Unit tests never hit the network."),
    ],
    code="class ModelClient(Protocol):\n    def chat(self, messages: list[dict], **kw) -> ModelResult: ...\n\nclass GeminiClient:\n    def chat(self, messages, **kw): ...\n\nclass StockAssistant:\n    def __init__(self, model: ModelClient, stock: StockRepo): ...\n",
    design=["Dependency inversion is the interview gold.", "Fakes for tests.", "Prompts in files, not string soup in business logic."],
    fails=[
        F("SDK in the route handler", "Vendor lock.", "Adapter."),
        F("God class Assistant", "Cannot test.", "Split retrieve, tool, write."),
        F("If provider == gemini everywhere", "Still a rewrite.", "Strategy/factory on one interface."),
    ],
    prod=["Feature flag for provider.", "Contract tests: both clients return ModelResult.", "Token accounting inside the adapter."],
))

Q.append(card(
    "q14", 14, "production", "Design an AI-powered daily reporting system", "Production / System Design", "8–12 minutes",
    "Batch the numbers in a normal ETL job. Use the LLM only to write the narrative from those numbers. Humans approve before it goes to the shop manager.",
    "A daily report should not let the model query raw 20 GB files. Overnight: aggregate sales, stock, and breaks into a small metrics table.\n"
    "Morning: a job loads yesterday's metrics, asks the LLM for a short summary, validates every figure, stores draft + JSON, then a human clicks send.\n"
    "If metrics are missing, do not invent a story.",
    "They want system design: batch vs chat, where the model sits, and how you keep numbers honest.",
    "I would compute metrics with ETL, then a small LangGraph job: load metrics → draft summary → validate numbers → human approve → email. The LLM never sees the raw file. If validation fails, the report is held.",
    play=["priority"],
    diagram={"type": "pipeline", "title": "Daily AI report", "steps": [
        "Nightly ETL metrics", "Load metrics JSON", "LLM draft", "Validate numbers", "Human approve", "Send + archive"
    ]},
    layers=[
        ("Metrics job", "SQL aggregates: units, revenue, top items, break counts."),
        ("Writer job", "LLM turns JSON into 8 bullets."),
        ("Guard", "Every number in the draft must be in metrics JSON."),
        ("HITL", "Manager approves in a queue."),
        ("Deliver", "Email/Slack + store the exact prompt and output."),
    ],
    story="Yesterday: 1,204 orders, revenue $18,440, 12 price breaks, top item TSHIRT-BLU.",
    walk=[
        ("ETL", "Metrics row", "One JSON blob, 2 KB, not 20 GB."),
        ("Draft", "Readable", "LLM writes bullets using only that JSON."),
        ("Validate", "Pass/fail", "If it says $19,000, hold the report."),
        ("Approve", "Send", "Audit: who approved, at what time."),
    ],
    design=["Numbers from ETL.", "LLM is a writer, not an analyst of raw dumps.", "Approval for anything that leaves the company."],
    fails=[
        F("Model scans parquet itself", "Cost and hallucinations.", "Pre-aggregate."),
        F("No human for external send", "Wrong revenue in a customer email.", "HITL."),
        F("No archive", "You cannot debug last Tuesday.", "Store metrics+prompt+output."),
    ],
    prod=["Report SLA 08:00.", "If ETL fails, skip AI, send a 'data not ready' mail.", "Cost cap per report."],
))

Q.append(card(
    "q15", 15, "agents", "Tell me about an AI system you built", "Behavioral + System Design", "8–12 minutes",
    "Tell a real story with architecture, one hard decision, one failure, how it scaled, and what you would change. Use a shop-style example if you do not have a public one.",
    "Interviewers want ownership, not a tool list. Pick one system. Draw it. Name the trade-off.\n"
    "Structure: problem → design → why → what broke → scale → what I would do next.\n"
    "If you built a RAG FAQ, say chunk size, why you skipped fine-tuning, the 2s latency budget, and the day retrieval returned the wrong policy.",
    "This is often the last question. A crisp story beats a vague 'we used LangChain'.",
    "I would walk through a file-reconciliation assistant: rules first, LangGraph only for leftover breaks, JSON outputs, human approval, Polars for the nightly file. I would admit an early version let the model change qty, and that we removed write tools. Next I would add better evals and cheaper routing.",
    play=["priority"],
    layers=[
        ("Problem", "Two order files never agreed. Ops spent hours in Excel."),
        ("Design", "ETL match + agent on breaks + HITL."),
        ("Decision", "No free-form SQL. Named queries only."),
        ("Failure", "Prompt injection in a comment field. We treated comments as data."),
        ("Scale", "From 50k rows to 20 GB with Polars, not pandas."),
        ("Next", "Parallel tools, better break taxonomy, cost caps."),
    ],
    tables=["Story checklist", ["Beat", "Say one sentence"], [
        ["Problem", "Who hurt, how often"],
        ["Architecture", "Boxes and arrows"],
        ["Trade-off", "What you did not do, and why"],
        ["Incident", "What broke in prod"],
        ["Metric", "Latency, cost, or match rate"],
        ["Learn", "What you would change"],
    ]],
    story="Practice this out loud for 90 seconds, then details if they ask.",
    walk=[
        ("Start", "Problem", "Ops compared two CSVs every night."),
        ("Middle", "Design + failure", "Rules + agent. One incident: model wanted to edit qty."),
        ("End", "Result + next", "Match rate 97%. I would add evals and a cheaper router."),
    ],
    design=["Specific > generic.", "Own a failure.", "Numbers if you have them."],
    fails=[
        F("Only list libraries", "No ownership signal.", "Draw the system."),
        F("Claim zero failures", "Not believable.", "Pick a real miss."),
        F("Talk for 10 minutes", "They lose the thread.", "90-second spine, then pause."),
    ],
    prod=["This answer should mention logs, owners, and rollback even in a story."],
))

if __name__ == "__main__":
    print("priority", len(Q))
    Path(OUT).write_text(json.dumps({"questions": Q}, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", OUT, "count", len(Q))
