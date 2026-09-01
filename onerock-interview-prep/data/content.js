import { PYTHON_ANSWERS, PYTHON_CODE } from "./section-python.js";
import { FASTAPI_ANSWERS, FASTAPI_CODE } from "./section-fastapi.js";
import { GENAI_ANSWERS, GENAI_CODE } from "./section-genai.js";
import { RAG_ANSWERS, RAG_CODE } from "./section-rag.js";
import { AGENTIC_ANSWERS, AGENTIC_CODE } from "./section-agentic.js";
import { CLOUD_ANSWERS, CLOUD_CODE } from "./section-cloud.js";
import { OPS_ANSWERS, OPS_CODE } from "./section-ops.js";
import { SYSTEM_CUSTOMER_ANSWERS, SYSTEM_CUSTOMER_CODE } from "./section-system-customer.js";
import { SECURITY_SCENARIO_ANSWERS, SECURITY_SCENARIO_CODE } from "./section-security-scenarios.js";

const APP_INFO = {
  role: "Generative AI / Agentic AI Engineer",
  subtitle: "Mobile-first interview preparation",
  shortDescription:
    "Study direct, practical, 5-YOE senior answers for Python, FastAPI, GenAI, RAG, Agentic AI, Cloud, and Production System Design interviews."
};

const CATEGORIES = [
  {
    id: "python",
    name: "Python",
    description: "Core Python internals, memory, async concurrency, OOP, and coding algorithms."
  },
  {
    id: "fastapi",
    name: "FastAPI / Flask / REST",
    description: "ASGI, request validation, auth, streaming tokens, middleware, and K8s deployment."
  },
  {
    id: "genai",
    name: "Generative AI / LLM",
    description: "Transformer mechanics, embeddings, attention, hallucinations, and evaluation."
  },
  {
    id: "rag",
    name: "RAG",
    description: "End-to-end retrieval architectures, layout parsing, chunking, and debugging."
  },
  {
    id: "agentic",
    name: "Agentic AI",
    description: "ReAct patterns, planning, tools, reflection, state, and loop safeguards."
  },
  {
    id: "agent-arch",
    name: "Agentic Architecture",
    description: "Hierarchical supervisors, multi-agent networks, and enterprise routing."
  },
  {
    id: "mcp",
    name: "MCP",
    description: "Model Context Protocol architecture, tools, resources, prompts, and security."
  },
  {
    id: "aws",
    name: "AWS",
    description: "Production GenAI on AWS: Bedrock, OpenSearch, ECS, SQS, and IAM security."
  },
  {
    id: "azure",
    name: "Azure",
    description: "Enterprise Azure OpenAI, AI Search, Container Apps, and Managed Identity."
  },
  {
    id: "gcp",
    name: "GCP",
    description: "Vertex AI, Gemini, Cloud Run, GKE, and serverless AI scalability."
  },
  {
    id: "multi-cloud",
    name: "Multi-Cloud Architecture",
    description: "Provider abstraction layers across AWS, Azure, and GCP."
  },
  {
    id: "containers",
    name: "Docker / Kubernetes",
    description: "Multi-stage builds, Pod lifecycle, Services, Ingress, HPA, and zero-downtime rolling deploys."
  },
  {
    id: "llmops",
    name: "LLMOps / Production",
    description: "Continuous evaluation, token tracking, semantic caching, and multi-provider failover."
  },
  {
    id: "system-design",
    name: "System Design",
    description: "High-scale enterprise RAG, multi-agent support, and production LLM gateways."
  },
  {
    id: "customer",
    name: "Customer-facing Scenarios",
    description: "Requirement discovery, non-technical RAG framing, and PoC to production buy-in."
  },
  {
    id: "poc-production",
    name: "PoC to Production",
    description: "Hardening 10,000-user architectures with caching, queues, RBAC, and telemetry."
  },
  {
    id: "security",
    name: "Security",
    description: "Prompt injection, indirect injection, RBAC pre-filtering, and sandboxed tools."
  },
  {
    id: "scenario",
    name: "Scenario-based Questions",
    description: "Troubleshooting RAG accuracy drops, 5x cost spikes, high latency, and tool loops."
  },
  {
    id: "projects",
    name: "Project Deep Dive",
    description: "The 5-stage senior architecture storytelling framework for interviews."
  }
];

const DIAGRAMS = {
  ragArchitecture: {
    title: "Enterprise RAG Architecture Flow",
    type: "linear",
    nodes: [
      "User Query Intake",
      "Query Transformation (HyDE / Multi-Query)",
      "Hybrid Retrieval (BM25 + Dense Vectors)",
      "Cross-Encoder Reranking (Top 3-5 Chunks)",
      "Prompt Assembly with Chunk Citations",
      "LLM Streamed Generation (SSE)"
    ]
  },
  agenticWorkflow: {
    title: "Agentic AI ReAct Execution Cycle",
    type: "linear",
    nodes: [
      "Objective / Task Input",
      "Thought / Planning & Task Decomposition",
      "Tool Selection & JSON Schema Validation",
      "Sandboxed Tool Execution",
      "Observation & State Update",
      "Reflection & Critique Loop",
      "Final Answer Output"
    ]
  },
  multiAgentArchitecture: {
    title: "Multi-Agent Supervisor Architecture",
    type: "branch",
    top: "Supervisor / Orchestrator Agent",
    branches: ["Research Agent (RAG)", "Data Agent (Text-to-SQL)", "Code Agent (Sandbox)"],
    merge: "Critic / Reviewer Agent",
    end: "Grounded User Response"
  },
  mcpArchitecture: {
    title: "Model Context Protocol (MCP) Architecture",
    type: "linear",
    nodes: [
      "AI Host / Client (Claude / FastAPI)",
      "JSON-RPC 2.0 Protocol (stdio / SSE)",
      "MCP Server Layer",
      "Tools, Resources & Prompt Registries",
      "Enterprise Backend (DB / Files / APIs)",
      "Structured Output Return"
    ]
  },
  llmAppArchitecture: {
    title: "Multi-Cloud LLM Application Architecture",
    type: "linear",
    nodes: [
      "Edge Layer (WAF + CDN)",
      "API Gateway (Auth + Rate Limiting)",
      "FastAPI Application Service",
      "Cloud Abstraction Layer",
      "Provider Adapters (Bedrock / Azure OpenAI / Vertex)",
      "Observability & Guardrails (OpenTelemetry)"
    ]
  },
  cloudArchitecture: {
    title: "AWS Production Cloud Architecture",
    type: "linear",
    nodes: [
      "CloudFront + AWS WAF",
      "Application Load Balancer",
      "ECS Fargate / EKS Pods (Private Subnets)",
      "AWS Bedrock (via PrivateLink VPC Endpoints)",
      "OpenSearch Serverless + RDS Aurora",
      "CloudWatch + SQS Ingestion Workers"
    ]
  },
  apiArchitecture: {
    title: "Long-Running Async LLM API Pattern",
    type: "linear",
    nodes: [
      "Client Request Intake",
      "Token Validation & Quota Check",
      "Task Enqueued to Redis / SQS",
      "Background Worker Fleet (Celery / ARQ)",
      "Streaming Response (SSE / WebSockets)",
      "State Checkpointing & Result Delivery"
    ]
  },
  dataPipelineArchitecture: {
    title: "Document Ingestion & Indexing Pipeline",
    type: "linear",
    nodes: [
      "S3 / Blob Storage File Landing",
      "Layout-Aware OCR Parsing (Textract / Azure DI)",
      "Semantic & Structure-Aware Chunking",
      "Batch Embedding Generation",
      "Vector DB Upsert + Metadata ACL Tagging",
      "Automated Extraction Quality Verification"
    ]
  },
  systemDesignFlow: {
    title: "System Design Interview Framework",
    type: "linear",
    nodes: [
      "Functional & Non-Functional Requirements",
      "Throughput & Storage Scale Estimations",
      "High-Level Component Architecture",
      "Detailed Data & Sequence Flows",
      "Bottlenecks, Failure Modes & Mitigations",
      "Security, Cost & Trade-off Justifications"
    ]
  }
};

const TABLES = {
  listTupleSetDict: {
    title: "Python Core Data Structures Comparison",
    headers: ["Type", "Mutability", "Ordering", "Duplicates", "Time Complexity", "Primary Use Case"],
    rows: [
      ["list", "Mutable", "Ordered (Indexable)", "Allowed", "O(1) append, O(n) insert/delete", "Homogeneous dynamic collections"],
      ["tuple", "Immutable", "Ordered (Indexable)", "Allowed", "O(1) access, lower memory", "Heterogeneous fixed records, dict keys"],
      ["set", "Mutable", "Unordered", "Unique Only", "Average O(1) add/lookup/remove", "Deduplication and fast membership tests"],
      ["dict", "Mutable", "Insertion-Ordered", "Unique Keys", "Average O(1) key lookup/insert", "Fast indexed key-value lookups"]
    ]
  },
  ragVsFinetune: {
    title: "RAG vs Fine-Tuning Decision Matrix",
    headers: ["Dimension", "RAG (Retrieval-Augmented Generation)", "Fine-Tuning (SFT / LoRA / QLoRA)"],
    rows: [
      ["Knowledge Freshness", "Instant (seconds via vector DB upsert)", "Static (requires retraining cycles)"],
      ["Source Attribution", "Exact inline citations with page/chunk IDs", "Black-box neural memory (no audit trail)"],
      ["Data Access Control (RBAC)", "Dynamic pre-filtering based on user role", "Cannot gate or un-learn facts per user"],
      ["Cost & Infrastructure", "Low recurring cost (embeddings + vector search)", "High GPU cluster compute & training time"],
      ["Best Used For", "Dynamic factual enterprise knowledge", "Specialized tone, compact syntax, niche jargon"],
      ["Hallucination Defense", "High (constrained to verified retrieved text)", "Moderate (can still hallucinate facts)"]
    ]
  },
  cloudCompare: {
    title: "AWS vs Azure vs GCP - Enterprise GenAI Comparison",
    headers: ["Cloud Platform", "Managed Foundation Models", "Search & Vector Engines", "Enterprise Security Highlights"],
    rows: [
      ["AWS", "Amazon Bedrock (Claude, Llama, Titan)", "Amazon OpenSearch Serverless, pgvector", "IAM Task Roles, VPC PrivateLink, Bedrock Guardrails"],
      ["Azure", "Azure OpenAI (GPT-4o, Embeddings)", "Azure AI Search (Hybrid + Semantic Ranker)", "Microsoft Entra ID Managed Identity, Private Endpoints"],
      ["GCP", "Vertex AI (Gemini 1.5 Pro, Model Garden)", "Vertex AI Vector Search (ScaNN)", "Cloud IAM, Secret Manager, VPC Service Controls"]
    ]
  },
  vectorCompare: {
    title: "Vector Database Solutions Matrix",
    headers: ["Vector Database", "Type & Ops Model", "Index Type", "Key Strengths", "Trade-offs"],
    rows: [
      ["Pinecone", "Fully Managed Cloud SaaS", "Proprietary Graph / ANN", "Zero maintenance, instant scaling, metadata filters", "Vendor lock-in, recurring SaaS cost"],
      ["pgvector (Postgres)", "Open-Source DB Extension", "HNSW / IVFFlat", "ACID transactions, relational joins, no new infra", "Slower at 10M+ scale, needs Postgres tuning"],
      ["Azure AI Search", "Managed Enterprise Search", "HNSW + BM25 + Semantic", "Integrated OCR, hybrid ranking, Entra ID RBAC", "Azure-centric ecosystem"],
      ["Amazon OpenSearch", "Managed / Self-Hosted", "HNSW / k-NN + BM25", "Native ELK integration, highly customizable", "Operational complexity to scale cluster"],
      ["FAISS", "In-Memory C++ Library", "HNSW / IVF-PQ", "Sub-millisecond speed, zero network latency", "No native persistence, replication, or metadata APIs"]
    ]
  },
  transportCompare: {
    title: "API Streaming Protocols Comparison",
    headers: ["Protocol", "Direction", "Transport Layer", "Pros for GenAI", "Limitations"],
    rows: [
      ["REST HTTP", "Request-Response", "HTTP/1.1 or HTTP/2", "Simple, universal tooling, easy caching", "No native token streaming (high perceived latency)"],
      ["Server-Sent Events (SSE)", "Server -> Client (Unidirectional)", "Standard HTTP/2", "Automatic reconnection, works via standard firewalls", "Client cannot push messages over same stream"],
      ["WebSocket", "Bidirectional (Full-Duplex)", "Persistent TCP Socket", "Real-time audio, interactive voice agents", "Stateful connections, complex load balancing"]
    ]
  },
  priorityRanking: {
    title: "Senior GenAI / Agentic AI Interview Preparation Priority",
    headers: ["Priority", "Domain", "Estimated Interview Focus", "Core Study Objectives"],
    rows: [
      ["🔴 1", "Agentic AI & Architecture", "30%", "ReAct, supervisor graphs, tool safety, state management, loops"],
      ["🔴 2", "RAG & Vector Retrieval", "25%", "End-to-end flow, layout parsing, chunking, hybrid search, rerank"],
      ["🔴 3", "Python & Async Concurrency", "15%", "GIL, asyncio event loop, memory, decorators, coding algorithms"],
      ["🔴 4", "FastAPI & Production APIs", "10%", "Pydantic V2, dependency injection, auth, SSE streaming, K8s"],
      ["🔴 5", "System Design & Architecture", "10%", "High-scale RAG, multi-agent support, LLM gateways, multi-cloud"],
      ["🟠 6", "Cloud (AWS / Azure / GCP)", "5%", "Bedrock, Azure OpenAI, Vertex, PrivateLink, Managed Identity"],
      ["🟠 7", "Containers, LLMOps & Security", "5%", "Docker multi-stage, K8s probes, prompt injection, RBAC, tracing"]
    ]
  }
};

const CHARTS = {
  priorityChart: {
    title: "Interview Topic Weight Distribution (5-YOE Role)",
    items: [
      { label: "Agentic AI & Architecture", value: 30 },
      { label: "RAG & Retrieval Systems", value: 25 },
      { label: "Python & Async Concurrency", value: 15 },
      { label: "FastAPI & API Design", value: 10 },
      { label: "System Design & Scale", value: 10 },
      { label: "Cloud Platforms & Infra", value: 5 },
      { label: "LLMOps & Security", value: 5 }
    ]
  }
};

const QUESTION_BANK = [
  ...[
    "What is the difference between a list, tuple, set, and dictionary?",
    "Explain mutable vs immutable objects in Python.",
    "What are *args and **kwargs?",
    "Explain shallow copy vs deep copy.",
    "What are decorators? Give a real-world use case.",
    "What are generators and why would you use them?",
    "What is the difference between an iterator and an iterable?",
    "Explain Python's GIL.",
    "When would you use multiprocessing vs multithreading?",
    "How does asyncio work?",
    "What is the difference between synchronous and asynchronous programming?",
    "Explain async and await.",
    "How would you handle exceptions in a large Python application?",
    "What are context managers?",
    "Explain dependency injection in Python.",
    "How would you structure a production Python project?",
    "How do you manage configuration and secrets?",
    "How do you optimize a slow Python API?",
    "How do you profile Python code?",
    "How would you implement logging in a production application?",
    "Find duplicate elements in an array.",
    "Find the first non-repeating character.",
    "Implement an LRU cache.",
    "Implement a rate limiter.",
    "Merge overlapping intervals.",
    "Find the top K frequent elements.",
    "Implement retry with exponential backoff.",
    "Process a large file without loading it completely into memory.",
    "Implement a producer-consumer pattern.",
    "Write an async function that calls multiple APIs concurrently."
  ].map((question) => ({ categoryId: "python", question })),
  ...[
    "Why would you choose FastAPI over Flask?",
    "How does FastAPI handle asynchronous requests?",
    "What is Pydantic?",
    "Explain request validation in FastAPI.",
    "What is dependency injection in FastAPI?",
    "How do you implement authentication in FastAPI?",
    "JWT vs OAuth2?",
    "How would you implement role-based authorization?",
    "How do you handle global exceptions in FastAPI?",
    "How do you implement middleware?",
    "How would you implement API versioning?",
    "How do you handle CORS?",
    "How would you implement rate limiting?",
    "How would you handle long-running GenAI requests?",
    "How do you stream an LLM response through FastAPI?",
    "REST vs WebSocket vs Server-Sent Events?",
    "How would you design a production-grade FastAPI service?",
    "How do you perform health checks?",
    "Liveness vs readiness probes?",
    "How would you deploy FastAPI using Docker and Kubernetes?",
    "Your LLM API takes 30–60 seconds to respond. How would you design the FastAPI service?"
  ].map((question) => ({ categoryId: "fastapi", question })),
  ...[
    "What is an LLM?",
    "How does a Transformer work?",
    "Explain attention mechanism.",
    "What are tokens?",
    "What is a context window?",
    "What are temperature and top-p?",
    "What is hallucination?",
    "Why do LLMs hallucinate?",
    "How do you reduce hallucinations?",
    "Prompt engineering vs fine-tuning?",
    "When would you fine-tune a model?",
    "What is RAG?",
    "Why is RAG preferred over fine-tuning for frequently changing data?",
    "What are embeddings?",
    "How are embeddings generated?",
    "What is cosine similarity?",
    "What is semantic search?",
    "What is hybrid search?",
    "What is reranking?",
    "What is grounding?",
    "What is structured output?",
    "What is function/tool calling?",
    "What is an LLM gateway?",
    "How would you handle multiple LLM providers?",
    "How do you evaluate an LLM application?"
  ].map((question) => ({ categoryId: "genai", question })),
  ...[
    "Explain RAG end-to-end.",
    "What happens when a PDF enters your RAG system?",
    "How do you extract text from PDFs?",
    "What is chunking?",
    "What chunk size would you choose?",
    "What is chunk overlap?",
    "Fixed-size chunking vs semantic chunking?",
    "How do you handle tables in PDFs?",
    "How do you preserve document metadata?",
    "How do you generate embeddings?",
    "Where do you store embeddings?",
    "Vector DB vs traditional database?",
    "FAISS vs Pinecone vs Azure AI Search vs OpenSearch?",
    "What is approximate nearest neighbor search?",
    "What is HNSW?",
    "What is hybrid search?",
    "Why do you need reranking?",
    "How would you improve poor retrieval?",
    "What happens if the correct information exists in the document but isn't retrieved?",
    "How do you evaluate RAG?",
    "Your RAG system is giving wrong answers even though the answer exists in the document. How would you debug it?"
  ].map((question) => ({ categoryId: "rag", question })),
  ...[
    "What is Agentic AI?",
    "RAG vs Agentic RAG?",
    "LLM application vs AI agent?",
    "What is an agent?",
    "What is a tool?",
    "What is tool calling?",
    "What is agent orchestration?",
    "What is planning?",
    "What is memory?",
    "Short-term vs long-term memory?",
    "What is state management?",
    "What is reflection?",
    "What is ReAct?",
    "What is multi-agent architecture?",
    "Single agent vs multi-agent?",
    "What is an agent supervisor?",
    "How does an agent decide which tool to use?",
    "How do you prevent an agent from entering an infinite loop?",
    "How do you control agent cost?",
    "How do you handle tool failures?",
    "How do you handle hallucinated tool calls?",
    "How do you secure tools?",
    "How do you implement human-in-the-loop?",
    "How do you trace an agent's execution?",
    "How do you evaluate an agent?"
  ].map((question) => ({ categoryId: "agentic", question })),
  ...[
    "Design an AI agent that receives a user's question, searches company documents, queries a database, and generates a final answer.",
    "How would you build a multi-agent system?"
  ].map((question) => ({ categoryId: "agent-arch", question })),
  ...[
    "What is MCP?",
    "Why do we need MCP?",
    "MCP client vs MCP server?",
    "What is an MCP tool?",
    "What is an MCP resource?",
    "What are MCP prompts?",
    "How does an LLM interact with an MCP server?",
    "MCP vs REST API?",
    "MCP vs function calling?",
    "How would you build an MCP server in Python?",
    "How would you expose an existing REST API through MCP?",
    "How would you secure an MCP server?",
    "How would you deploy MCP on Azure/AWS?",
    "How would you connect MCP to an enterprise database?",
    "How would you handle authorization for MCP tools?"
  ].map((question) => ({ categoryId: "mcp", question })),
  ...[
    "EC2 vs Lambda?",
    "ECS vs EKS?",
    "S3 vs EFS?",
    "API Gateway?",
    "IAM?",
    "Secrets Manager?",
    "CloudWatch?",
    "SQS vs SNS?",
    "RDS vs DynamoDB?",
    "What is Bedrock?",
    "How would you deploy an LLM application on AWS?",
    "How would you build RAG using AWS services?",
    "How would you store documents in S3 and process them?",
    "How would you scale your inference/API layer?",
    "How would you secure an AWS GenAI application?",
    "Design a production RAG application on AWS."
  ].map((question) => ({ categoryId: "aws", question })),
  ...[
    "Azure OpenAI?",
    "Azure AI Search?",
    "Azure Functions?",
    "Azure Container Apps?",
    "AKS?",
    "Azure Blob Storage?",
    "Azure Key Vault?",
    "Azure Service Bus?",
    "Azure Monitor?",
    "Managed Identity?",
    "How would you build RAG using Azure OpenAI + AI Search?",
    "Azure OpenAI vs OpenAI API?",
    "How would you secure Azure OpenAI?",
    "How would you deploy FastAPI to Azure?",
    "How would you implement enterprise RAG on Azure?"
  ].map((question) => ({ categoryId: "azure", question })),
  ...[
    "Vertex AI?",
    "Gemini?",
    "Cloud Run?",
    "GKE?",
    "Cloud Functions?",
    "Cloud Storage?",
    "BigQuery?",
    "Vertex AI Vector Search?",
    "Secret Manager?",
    "Pub/Sub?",
    "How would you deploy a FastAPI GenAI application on GCP?",
    "How would you build RAG using Vertex AI?",
    "Cloud Run vs GKE?",
    "How would you scale an AI application on GCP?"
  ].map((question) => ({ categoryId: "gcp", question })),
  ...[
    "How would you design the same GenAI application to run on AWS, Azure and GCP?"
  ].map((question) => ({ categoryId: "multi-cloud", question })),
  ...[
    "What is Docker?",
    "Image vs container?",
    "Dockerfile optimization?",
    "Multi-stage builds?",
    "Docker networking?",
    "Kubernetes pod?",
    "Deployment?",
    "Service?",
    "ConfigMap?",
    "Secret?",
    "Ingress?",
    "Horizontal Pod Autoscaler?",
    "Liveness vs readiness?",
    "How would you deploy FastAPI on Kubernetes?",
    "How would you scale an LLM application?",
    "How do you handle model/API credentials in Kubernetes?",
    "How do you perform zero-downtime deployment?"
  ].map((question) => ({ categoryId: "containers", question })),
  ...[
    "How do you monitor an LLM application?",
    "What metrics do you track?",
    "How do you track token consumption?",
    "How do you control LLM costs?",
    "How do you detect hallucinations?",
    "How do you evaluate prompts?",
    "How do you version prompts?",
    "How do you version models?",
    "How do you perform A/B testing between models?",
    "How do you trace an agent?",
    "What is observability in GenAI?",
    "How do you handle model failures?",
    "What happens if OpenAI/Azure OpenAI/Bedrock is unavailable?",
    "How do you implement fallback models?",
    "How do you implement retries without creating duplicate operations?"
  ].map((question) => ({ categoryId: "llmops", question })),
  ...[
    "Design an enterprise RAG platform.",
    "Design a multi-agent customer-support system.",
    "Design an AI data accelerator platform.",
    "Design a document intelligence platform that processes millions of PDFs.",
    "Design a GenAI application supporting AWS, Azure and GCP.",
    "Design an agent that can query SQL databases and documents.",
    "Design a production LLM gateway supporting multiple models/providers.",
    "Design a scalable FastAPI backend for an AI application."
  ].map((question) => ({ categoryId: "system-design", question })),
  ...[
    "How do you gather requirements from a customer who doesn't know exactly what they need?",
    "How do you convert a business problem into an AI solution?",
    "How do you explain RAG to a non-technical customer?",
    "How do you handle a customer asking for an unrealistic AI solution?",
    "How would you estimate a GenAI PoC?",
    "How do you decide whether a use case needs GenAI?",
    "How do you handle conflicting requirements?",
    "What would you do if your PoC works but production performance is poor?",
    "How do you communicate technical limitations?",
    "How do you convince a customer to move from PoC to production?",
    "Tell me about a difficult customer problem you solved.",
    "Tell me about a production issue you handled."
  ].map((question) => ({ categoryId: "customer", question })),
  ...[
    "You built a successful RAG PoC. The customer now wants 10,000 users. What changes?"
  ].map((question) => ({ categoryId: "poc-production", question })),
  ...[
    "How do you secure LLM APIs?",
    "How do you prevent prompt injection?",
    "What is indirect prompt injection?",
    "How do you prevent data leakage?",
    "How do you handle PII?",
    "How do you implement RBAC in RAG?",
    "How do you ensure users only retrieve documents they're authorized to see?",
    "How do you protect secrets?",
    "How do you secure agent tools?",
    "What happens if an agent has access to a dangerous tool?",
    "How do you implement human approval for sensitive actions?"
  ].map((question) => ({ categoryId: "security", question })),
  ...[
    "Your RAG accuracy is only 60%. What do you investigate?",
    "LLM response latency is 15 seconds. Customer wants <3 seconds. What do you do?",
    "LLM costs increased 5× after production launch. How do you fix it?",
    "Your agent is repeatedly calling the same tool. What's wrong?",
    "The LLM chooses the wrong tool. How do you fix it?",
    "The customer says the AI answer is incorrect, but your retrieved documents are correct. How do you debug?",
    "Azure OpenAI is down. Your application must continue working. Design the fallback.",
    "A customer has 10 million documents. How would you build the ingestion pipeline?",
    "Different customers have different document permissions. How would you implement multi-tenant RAG?",
    "The customer wants an agent that can execute SQL queries. How do you prevent destructive queries?"
  ].map((question) => ({ categoryId: "scenario", question })),
  ...[
    "How should you explain your projects deeply for this interview?"
  ].map((question) => ({ categoryId: "projects", question }))
];

// Combine all section-by-section answers and code examples
const MASTER_ANSWERS = {
  ...PYTHON_ANSWERS,
  ...FASTAPI_ANSWERS,
  ...GENAI_ANSWERS,
  ...RAG_ANSWERS,
  ...AGENTIC_ANSWERS,
  ...CLOUD_ANSWERS,
  ...OPS_ANSWERS,
  ...SYSTEM_CUSTOMER_ANSWERS,
  ...SECURITY_SCENARIO_ANSWERS
};

const MASTER_CODE = {
  ...PYTHON_CODE,
  ...FASTAPI_CODE,
  ...GENAI_CODE,
  ...RAG_CODE,
  ...AGENTIC_CODE,
  ...CLOUD_CODE,
  ...OPS_CODE,
  ...SYSTEM_CUSTOMER_CODE,
  ...SECURITY_SCENARIO_CODE
};

const ENRICHMENTS = {
  "What is the difference between a list, tuple, set, and dictionary?": { tableId: "listTupleSetDict" },
  "Prompt engineering vs fine-tuning?": { tableId: "ragVsFinetune" },
  "When would you fine-tune a model?": { tableId: "ragVsFinetune" },
  "What is RAG?": { diagramId: "ragArchitecture" },
  "Explain RAG end-to-end.": { diagramId: "ragArchitecture" },
  "What happens when a PDF enters your RAG system?": { diagramId: "dataPipelineArchitecture" },
  "What is Agentic AI?": { diagramId: "agenticWorkflow" },
  "What is ReAct?": { diagramId: "agenticWorkflow" },
  "What is multi-agent architecture?": { diagramId: "multiAgentArchitecture" },
  "How would you build a multi-agent system?": { diagramId: "multiAgentArchitecture" },
  "What is MCP?": { diagramId: "mcpArchitecture" },
  "How does an LLM interact with an MCP server?": { diagramId: "mcpArchitecture" },
  "How would you design a production-grade FastAPI service?": { diagramId: "apiArchitecture" },
  "Your LLM API takes 30–60 seconds to respond. How would you design the FastAPI service?": { diagramId: "apiArchitecture" },
  "How would you deploy an LLM application on AWS?": { diagramId: "cloudArchitecture" },
  "How would you build RAG using AWS services?": { diagramId: "cloudArchitecture" },
  "Design a production RAG application on AWS.": { diagramId: "cloudArchitecture" },
  "How would you design the same GenAI application to run on AWS, Azure and GCP?": { tableId: "cloudCompare", diagramId: "llmAppArchitecture" },
  "Design an AI agent that receives a user's question, searches company documents, queries a database, and generates a final answer.": { diagramId: "llmAppArchitecture" },
  "Design an enterprise RAG platform.": { diagramId: "systemDesignFlow" },
  "FAISS vs Pinecone vs Azure AI Search vs OpenSearch?": { tableId: "vectorCompare" },
  "Where do you store embeddings?": { tableId: "vectorCompare" },
  "REST vs WebSocket vs Server-Sent Events?": { tableId: "transportCompare" }
};

const DIFFICULTY_KEYWORDS = [
  { word: "design", level: "advanced" },
  { word: "scenario", level: "advanced" },
  { word: "fallback", level: "advanced" },
  { word: "security", level: "advanced" },
  { word: "architecture", level: "advanced" },
  { word: "what is", level: "beginner" },
  { word: "difference", level: "beginner" }
];

function inferDifficulty(question, categoryId) {
  if (categoryId === "system-design" || categoryId === "scenario" || categoryId === "poc-production" || categoryId === "agent-arch") return "advanced";
  const lowered = question.toLowerCase();
  for (const rule of DIFFICULTY_KEYWORDS) {
    if (lowered.includes(rule.word)) return rule.level;
  }
  return "intermediate";
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function buildTags(question, category) {
  const tokens = new Set([category.id, category.name.toLowerCase()]);
  const lowered = question.toLowerCase();
  [
    "python",
    "fastapi",
    "flask",
    "llm",
    "rag",
    "agent",
    "mcp",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "security",
    "sql",
    "api",
    "async",
    "stream",
    "production",
    "system design",
    "vector",
    "token",
    "embedding",
    "prompt"
  ].forEach((term) => {
    if (lowered.includes(term)) tokens.add(term);
  });
  return Array.from(tokens);
}

const QUESTIONS = QUESTION_BANK.map((item, index) => {
  const category = CATEGORIES.find((entry) => entry.id === item.categoryId);
  const answer = MASTER_ANSWERS[item.question] || [
    "Comprehensive technical definition and key architectural principles.",
    "Step-by-step production implementation details and best practices.",
    "Trade-offs, edge-case failure modes, and monitoring strategies."
  ];
  const enrichment = ENRICHMENTS[item.question] || {};
  return {
    id: `q-${index + 1}-${slugify(item.question)}`,
    order: index + 1,
    categoryId: item.categoryId,
    categoryName: category.name,
    question: item.question,
    difficulty: inferDifficulty(item.question, item.categoryId),
    answerPoints: answer,
    tags: buildTags(item.question, category),
    tableId: enrichment.tableId || null,
    diagramId: enrichment.diagramId || null,
    codeExample: MASTER_CODE[item.question] || null
  };
});

const APP_CONTENT = {
  info: APP_INFO,
  categories: CATEGORIES,
  questions: QUESTIONS,
  tables: TABLES,
  diagrams: DIAGRAMS,
  charts: CHARTS
};

export { APP_CONTENT };
