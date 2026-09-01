// Section 14 & 15: System Design & Customer-Facing Scenarios (20 Questions - Deep, 5-YOE Level Study Answers & Code Samples)

export const SYSTEM_CUSTOMER_ANSWERS = {
  /* ---------------- Section 14: System Design ---------------- */
  "Design an enterprise RAG platform.": [
    "Functional Requirements: Ingest multi-format documents (PDFs, Confluence, SharePoint, DBs), enforce fine-grained user RBAC, provide semantic hybrid search with sub-second retrieval, and generate grounded answers with precise inline citations.",
    "Non-Functional Requirements: P95 latency < 2.5s, 99.9% uptime, 10M+ document capacity, multi-tenant isolation, SOC2/GDPR compliance.",
    "Architecture Breakdown:",
    "1. Ingestion Plane (Async): Connectors -> S3 Raw Bucket -> SQS Queue -> Worker Fleet (OCR layout parser + Chunking Engine) -> Batch Embedding Service -> Vector DB + Metadata Index.",
    "2. Query Plane (Real-time): API Gateway -> FastAPI Service -> Query Rewriter (HyDE) -> Hybrid Search (BM25 + Dense) with Tenant/Role Metadata Filter -> Cross-Encoder Reranker -> LLM Streaming with citations via SSE.",
    "3. Governance & Evaluation: Continuous Ragas evaluation pipeline in CI/CD, prompt registry, and Langfuse tracing.",
    "Trade-offs: Dense-only vs Hybrid Search (chose Hybrid for exact keyword accuracy), Dedicated Vector DB vs pgvector (chose dedicated Pinecone/OpenSearch for 10M+ scale)."
  ],
  "Design a multi-agent customer-support system.": [
    "Requirements: Automatically resolve 60%+ of tier-1 support tickets, query order database, search product return policies, draft empathetic responses, and escalate complex/angry cases to humans.",
    "Agent Architecture (Hierarchical Supervisor with LangGraph):",
    "1. Triage / Supervisor Agent: Analyzes user sentiment and intent, decomposes the issue, and delegates to specialized sub-agents.",
    "2. Policy Agent: RAG tool over company knowledge base to verify return/refund policies.",
    "3. Order & Billing Agent: Executes read-only SQL queries against transactional DB to check shipment and payment status.",
    "4. Escalation / Action Agent: Human-in-the-loop tool that pauses execution, creates Zendesk ticket with full summary, and routes to live human agent if refund > $100.",
    "5. Reviewer Agent: Audits output against safety rules and formatting standards before sending reply.",
    "Observability: Traces mapped to ticket IDs; resolution rate, deflection rate, and human escalation percentage tracked in real-time."
  ],
  "Design an AI data accelerator platform.": [
    "Requirements: Enable enterprise data engineering teams to auto-generate ETL pipelines, detect schema anomalies, clean messy tabular datasets, and transform raw enterprise data into AI-ready vector embeddings.",
    "Architecture:",
    "1. Data Plane: Apache Spark / Polars streaming workers executing batch transformations on Amazon EMR or Databricks.",
    "2. AI Metadata Engine: LLM agents analyze incoming table schemas and column distributions to auto-generate DBT SQL models and Polars transformation scripts.",
    "3. Quality & Anomaly Detection: Great Expectations + statistical validation rules flagging outlier rows and schema drifts.",
    "4. Vector Ingestion Accelerator: Standardized connector framework that reads curated parquet tables, generates embeddings via batch API, and sinks to OpenSearch/Pinecone.",
    "5. Control Plane & UI: FastAPI backend managing data source connections, job schedules, and data lineage visualization."
  ],
  "Design a document intelligence platform that processes millions of PDFs.": [
    "Requirements: Ingest, OCR, extract key-value data from 10,000,000 PDFs (invoices, tax forms, contracts) in under 3 days, providing a search and structured extraction API.",
    "Scale Estimation: 10M docs * ~5s per doc = 50M compute seconds = ~13,888 compute hours. Distributed across 200 worker containers = ~69 hours (under 3 days).",
    "Architecture:",
    "1. S3 Event Grid & Partitioning: Raw documents uploaded with partitioned keys `s3://docs/{tenant}/{year}/{hash}.pdf`.",
    "2. Distributed Queue (SQS / Kafka): Distributes job messages across worker fleet with Dead-Letter Queues (DLQ) for corrupted PDFs.",
    "3. High-Throughput Worker Fleet: Spot/Preemptible ECS Fargate containers running high-performance C++ PyMuPDF bindings and Textract for scanned pages.",
    "4. Idempotent Ingestion: Document state stored in DynamoDB/PostgreSQL keyed by SHA-256 hash to prevent duplicate reprocessing on worker crash retries.",
    "5. Search & Query Layer: Extracted entities stored in OpenSearch and PostgreSQL for structured faceted search."
  ],
  "Design a GenAI application supporting AWS, Azure and GCP.": [
    "Requirements: A single unified SaaS application capable of being deployed into AWS, Azure, or GCP based on client data sovereignty mandates.",
    "Architecture Pattern: Clean Architecture with Dependency Inversion and Cloud Provider Adapters.",
    "Adapter Layer Interfaces: `LLMClient` (Bedrock / Azure OpenAI / Vertex AI), `VectorDB` (OpenSearch / AI Search / Vertex Vector Search), `ObjectStorage` (S3 / Blob / GCS), `SecretsClient` (Secrets Manager / Key Vault / Secret Manager).",
    "Deployment Strategy: Standardized Docker containers deployed via modular Terraform templates matching the destination cloud (AWS ECS, Azure Container Apps, GCP Cloud Run).",
    "Configuration: Single environment variable `CLOUD_PROVIDER=aws|azure|gcp` initializes the corresponding concrete SDK adapter at application startup."
  ],
  "Design an agent that can query SQL databases and documents.": [
    "Architecture: Dual-Engine Intent Router combining Text-to-SQL with Semantic RAG.",
    "Workflow:",
    "1. Intent Classification: LLM router categorizes incoming question: Analytical/Numeric -> SQL Path, Unstructured Policy/Text -> RAG Path, Hybrid -> Parallel Execution.",
    "2. Text-to-SQL Engine: Semantic layer provides table schemas and column descriptions -> LLM generates SQL -> AST Validator parses with `sqlglot` (enforces SELECT-only, whitelisted tables, and `LIMIT 500`) -> Executes on read-only replica -> Formats tabular result.",
    "3. Document RAG Engine: Hybrid search over vector DB with cross-encoder reranking -> Returns citations.",
    "4. Synthesis Engine: Combines tabular SQL numbers with contextual document text into a cohesive, grounded response."
  ],
  "Design a production LLM gateway supporting multiple models/providers.": [
    "Role: Centralized API proxy layer between internal company applications and external AI providers.",
    "Core Modules:",
    "1. Virtual Key Management & Auth: Issues internal developer API keys with role-based rate limits and monthly budget quotas.",
    "2. Dynamic Model Routing & Failover: Routes requests based on cost, latency, or provider uptime with automatic circuit-breaker failover (OpenAI -> Azure OpenAI -> Bedrock).",
    "3. Semantic Caching: In-memory Redis cache storing embeddings of prompt queries to serve instant 20ms cached answers for identical requests.",
    "4. Security & Compliance: Real-time PII masking (redacting credit cards, SSNs, emails) and prompt-injection guardrail filtering.",
    "5. Telemetry & Billing: Unified OpenTelemetry tracing, token usage logging, and cost analytics per team."
  ],
  "Design a scalable FastAPI backend for an AI application.": [
    "Two-Plane Scalable Architecture:",
    "1. Synchronous Real-time Plane (FastAPI + Uvicorn): Handles user authentication, chat session management, and SSE streaming token generation. Stateless containers horizontally autoscaling on Kubernetes with HPA.",
    "2. Asynchronous Background Plane (Celery / ARQ + Redis/SQS): Handles long-running PDF parsing, heavy batch embeddings generation, dataset exports, and automated evaluation tasks.",
    "3. Data Layer: PostgreSQL (ACID relational user/tenant metadata via asyncpg connection pool), Redis (session state, rate limiting, semantic cache), Vector DB (Pinecone/OpenSearch for RAG).",
    "4. Reliability: Exponential retries on third-party APIs, circuit breakers, timeout governance, and structured JSON logging with correlation IDs."
  ],

  /* ---------------- Section 15: Customer-Facing Scenarios ---------------- */
  "How do you gather requirements from a customer who doesn't know exactly what they need?": [
    "1. Focus on Pain Points & Workflows, Not AI Jargon: Avoid asking 'what LLM do you want?'; ask 'walk me through the most repetitive, frustrating 2 hours of your team's day.'",
    "2. Collect Concrete Artifacts: Request real sample inputs (the last 20 customer tickets, messy PDFs, internal emails) rather than hypothetical descriptions.",
    "3. Define Quantifiable Success Metrics: Translate vague desires ('we want a smart bot') into measurable KPIs: 'reduce average ticket handle time from 15 minutes to 3 minutes with >90% factual accuracy.'",
    "4. Build a Rapid Interactive Prototype (Thin Slice): Deploy a working 1-week prototype on their real sample data; customers clarify requirements 10x faster when interacting with a live UI than reviewing static requirement documents.",
    "5. Explicitly Document Out-of-Scope Items: Clearly list what the system will NOT do in v1 to prevent scope creep."
  ],
  "How do you convert a business problem into an AI solution?": [
    "Framework (The 5-Stage Translation Pipeline):",
    "Stage 1 - Disqualification Test: Check if traditional software (regex, SQL, rules, deterministic scripts) can solve it cheaper and with 100% predictability. If yes, avoid AI.",
    "Stage 2 - Pattern Mapping: Map business goal to an AI pattern: Text Generation -> Drafting, Document Search -> RAG, Multi-step actions across tools -> Agentic Workflow, Complex categorization -> LLM Classification.",
    "Stage 3 - Data Readiness Audit: Verify accessibility, cleanliness, and security permissions of required company knowledge sources.",
    "Stage 4 - Human-in-the-Loop Design: Define where human review is required before external actions execute.",
    "Stage 5 - PoC & Validation: Run controlled evaluation on representative benchmark cases to prove business ROI."
  ],
  "How do you explain RAG to a non-technical customer?": [
    "The 'Open-Book Exam' Metaphor:",
    "'Think of standard AI like a student taking a closed-book exam based on general memory from school years ago - they can write well, but might misremember exact company details or invent plausible facts.'",
    "'RAG turns it into an OPEN-BOOK exam. Whenever an employee asks a question, our system instantly opens your company's official, updated documents, finds the exact 3 relevant paragraphs, hands them to the AI, and says: Answer using ONLY these paragraphs and show me the page number.'",
    "Key Business Value: 100% based on your private data, zero hallucinations on company policies, answers cite exact source pages, and your confidential data is never used to train public models."
  ],
  "How do you handle a customer asking for an unrealistic AI solution?": [
    "1. Validate the Underlying Business Goal: Acknowledge the ambition and restate the core problem they are trying to solve.",
    "2. Demonstrate Constraints with Concrete Data: Explain technical boundaries using real examples (e.g. '100% autonomous contract signing without human review carries significant legal liability due to probabilistic edge cases').",
    "3. Propose the 'Crawl-Walk-Run' Phased Roadmap: Phase 1 (AI drafts contract review + Human approves in 1 click -> 80% time savings with 0% liability risk), Phase 2 (Auto-approve low-risk $100 clauses after 6 months of proven telemetry), Phase 3 (Extended autonomy).",
    "4. Quantify Risk vs Reward: Frame phased autonomy in terms of cost and risk mitigation."
  ],
  "How would you estimate a GenAI PoC?": [
    "Scope Guardrails: Lock scope to 1 specific use case, 50-100 representative test documents, and an agreed golden evaluation benchmark of 30 test questions.",
    "Timeline Breakdown (Typical 3-4 Week PoC):",
    "Week 1: Data ingestion setup, parsing, and baseline RAG pipeline build.",
    "Week 2: Prompt engineering, hybrid search tuning, and reranker integration.",
    "Week 3: Evaluation benchmark execution (Ragas scoring), edge case debugging, and UI integration.",
    "Week 4: Stakeholder demo, business ROI presentation, and production roadmap delivery.",
    "Cost Model: Itemize developer engineering hours + estimated cloud infrastructure and LLM token consumption costs ($100-$500 for PoC volume)."
  ],
  "How do you decide whether a use case needs GenAI?": [
    "Decision Matrix: A use case genuinely needs GenAI if it meets 3 criteria:",
    "1. Unstructured Data Complexity: The input/output involves natural language, complex documents, audio, or visual data where deterministic rules fail.",
    "2. High Variance & Semantic Nuance: Users phrase queries in hundreds of different ways, requiring semantic reasoning rather than rigid keyword matching.",
    "3. Tolerance for Probabilistic Output: The workflow allows for AI-assisted human review or can be constrained by deterministic schema guardrails.",
    "Negative Indicators: Mathematical calculation, deterministic ledger accounting, and fixed boolean business rules should NEVER use LLMs."
  ],
  "How do you handle conflicting requirements?": [
    "1. Document the Trade-off Triangle: Map conflicts visually on the classic engineering triad: Speed vs Accuracy vs Cost (e.g. 'Sub-second response time conflicts with running deep cross-encoder reranking and multi-agent reflection').",
    "2. Present Data-Driven Options: Option A (Fast & Cheap: 800ms latency, 88% accuracy), Option B (Maximum Accuracy: 3.5s latency with Reranker, 97% accuracy).",
    "3. Align on Business Priority: Have product stakeholders select the target trade-off based on business SLAs.",
    "4. Implement Hybrid Adaptive Routing: Route critical enterprise VIP queries through the deep pipeline and routine queries through the fast pipeline."
  ],
  "What would you do if your PoC works but production performance is poor?": [
    "Diagnostic Methodology:",
    "1. Investigate Data Distribution Drift: PoC was likely tested on clean, curated PDFs; production users are uploading messy scanned images, huge tables, and conversational shorthand.",
    "2. Analyze Concurrency & Latency Bottlenecks: Individual components that took 1s in isolation now experience connection pool exhaustion or provider rate limits under concurrent user load.",
    "3. Inspect Retrieval Recall on Real Queries: Build a new evaluation benchmark using real production failure queries.",
    "Action Plan: Upgrade parsing to layout-aware OCR, implement hybrid search + reranking, add Redis semantic caching, and introduce asynchronous job workers."
  ],
  "How do you communicate technical limitations?": [
    "1. Speak in Probabilities and Guardrails, Not Absolutes: Never promise 'the AI is 100% accurate'; explain 'the system achieves 94% accuracy, and we have built automated confidence filters to flag the remaining 6% for human review.'",
    "2. Explain the Operational Boundary: Clearly state what data the system has access to and where its knowledge cutoffs lie.",
    "3. Highlight Mitigations: Pair every limitation with an active engineering safeguard (e.g. 'LLMs can experience token limits on 100-page files, so our architecture uses map-reduce chunking to summarize each section individually')."
  ],
  "How do you convince a customer to move from PoC to production?": [
    "1. Present Hard Telemetry & ROI Metrics: Show PoC evaluation benchmark results: 'Across 200 real tickets, the AI achieved 92% accurate resolution, saving an estimated 420 engineering hours/month.'",
    "2. Provide a Hardened Security & Compliance Blueprint: Present architecture diagrams showing VPC isolation, private endpoints, encryption at rest, and zero model training on customer data.",
    "3. Offer a Phased Pilot Rollout: Propose launching to 1 team (10% traffic) with full human-in-the-loop review for 30 days before broader expansion.",
    "4. Define Predictable Monthly Cost Forecasts: Provide transparent cost projections covering token consumption and cloud infrastructure at scale."
  ],
  "Tell me about a difficult customer problem you solved.": [
    "Structure using STAR Framework (Situation, Task, Action, Result):",
    "Situation: Enterprise client with 50,000 scanned insurance claim PDFs complained that their RAG system was giving 45% incorrect answers due to complex nested financial tables.",
    "Task: Redesign the ingestion and retrieval pipeline to achieve >90% factual accuracy on tabular claims.",
    "Action: Replaced raw text extraction with Azure Document Intelligence layout OCR to extract tables as structured Markdown; implemented hybrid search with Cohere Reranking; added a Text-to-SQL tool for quantitative queries.",
    "Result: Extraction accuracy jumped to 94%, retrieval recall increased by 40%, and the customer successfully transitioned the project into full enterprise production."
  ],
  "Tell me about a production issue you handled.": [
    "Structure using Incident Response Protocol:",
    "Incident: Shortly after production launch, the GenAI API experienced severe latency spikes (P95 jumped from 2s to 35s) and multiple HTTP 504 gateway timeouts.",
    "Immediate Triage & Mitigation: Inspected distributed traces in Langfuse; discovered an upstream OpenAI rate limit (HTTP 429) was triggering synchronized retries across all worker pods (thundering herd). Immediately enabled circuit breaker failover to Azure OpenAI backup deployment to restore service in 4 minutes.",
    "Root Cause & Permanent Fix: Implemented Redis-based distributed token bucket rate limiting on outbound requests, added full exponential backoff with random jitter, and enabled semantic caching for frequent queries.",
    "Postmortem: Shared blameless postmortem with stakeholders and added CloudWatch alarms tracking upstream provider latency."
  ]
};

export const SYSTEM_CUSTOMER_CODE = {
  "Design an agent that can query SQL databases and documents.": {
    language: "python",
    code: `from typing import Literal
from pydantic import BaseModel, Field

# Dual-Engine Router Pattern
class IntentClassification(BaseModel):
    query_type: Literal["SQL_ANALYTICS", "DOCUMENTS_RAG", "HYBRID"]
    sql_query: str | None = Field(default=None, description="Generated SELECT query if needed")
    doc_search_term: str | None = Field(default=None, description="Search terms for RAG")

async def dual_engine_router(user_prompt: str, client, sql_runner, vector_search):
    classification = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[{"role": "system", "content": "Classify if query needs SQL, Documents, or Both."},
                  {"role": "user", "content": user_prompt}],
        response_format=IntentClassification
    ).choices[0].message.parsed
    
    results = {}
    if classification.query_type in ["SQL_ANALYTICS", "HYBRID"] and classification.sql_query:
        results["sql_data"] = await sql_runner.execute(classification.sql_query)
    if classification.query_type in ["DOCUMENTS_RAG", "HYBRID"] and classification.doc_search_term:
        results["rag_docs"] = await vector_search.query(classification.doc_search_term)
        
    return results`
  },
  "Design a production LLM gateway supporting multiple models/providers.": {
    language: "python",
    code: `from fastapi import FastAPI, Header, HTTPException
import httpx
import os

app = FastAPI()

PROVIDERS = {
    "openai": {"url": "https://api.openai.com/v1/chat/completions", "key": os.getenv("OPENAI_KEY")},
    "azure": {"url": os.getenv("AZURE_OPENAI_URL"), "key": os.getenv("AZURE_KEY")},
}

@app.post("/v1/chat/completions")
async def gateway_chat_completion(payload: dict, x_tenant_id: str = Header(...)):
    # 1. Enforce Per-Tenant Token Quota & PII Redaction
    # 2. Primary Route: OpenAI -> Fallback: Azure OpenAI
    async with httpx.AsyncClient(timeout=10.0) as client:
        for provider_name, config in PROVIDERS.items():
            try:
                headers = {"Authorization": f"Bearer {config['key']}", "Content-Type": "application/json"}
                response = await client.post(config["url"], json=payload, headers=headers)
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                print(f"Provider {provider_name} failed: {e}. Trying fallback...")
                continue
                
    raise HTTPException(status_code=503, detail="All LLM providers currently unavailable")`
  }
};
