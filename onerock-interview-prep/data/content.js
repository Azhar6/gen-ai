import { DEEP_ANSWERS, DEEP_CODE } from "./answers-deep.js";

const APP_INFO = {
  role: "Generative AI / Agentic AI Engineer",
  subtitle: "Mobile-first interview preparation",
  shortDescription:
    "Study direct, practical answers for Python, FastAPI, GenAI, RAG, Agentic AI, cloud, and production system design interviews."
};

const CATEGORIES = [
  {
    id: "python",
    name: "Python",
    description: "Core Python concepts, async, performance, and coding questions."
  },
  {
    id: "fastapi",
    name: "FastAPI / Flask / REST",
    description: "API design, auth, async handling, streaming, and deployment."
  },
  {
    id: "genai",
    name: "Generative AI / LLM",
    description: "Fundamentals, prompting, embeddings, retrieval, and evaluation."
  },
  {
    id: "rag",
    name: "RAG",
    description: "End-to-end retrieval architecture and debugging."
  },
  {
    id: "agentic",
    name: "Agentic AI",
    description: "Agents, tools, orchestration, memory, and control patterns."
  },
  {
    id: "agent-arch",
    name: "Agentic Architecture",
    description: "Single-agent and multi-agent architecture design patterns."
  },
  {
    id: "mcp",
    name: "MCP",
    description: "Model Context Protocol architecture, tools, and security."
  },
  {
    id: "aws",
    name: "AWS",
    description: "Cloud architecture decisions for enterprise GenAI systems."
  },
  {
    id: "azure",
    name: "Azure",
    description: "Azure OpenAI and enterprise deployment architecture."
  },
  {
    id: "gcp",
    name: "GCP",
    description: "Vertex AI, Cloud Run/GKE, and production scaling."
  },
  {
    id: "multi-cloud",
    name: "Multi-Cloud Architecture",
    description: "Abstraction-first design across AWS, Azure, and GCP."
  },
  {
    id: "containers",
    name: "Docker / Kubernetes",
    description: "Containerization, orchestration, scaling, and safe releases."
  },
  {
    id: "llmops",
    name: "LLMOps / Production",
    description: "Monitoring, evaluation, fallback, and cost control."
  },
  {
    id: "system-design",
    name: "System Design",
    description: "Full architecture design discussions for senior interviews."
  },
  {
    id: "customer",
    name: "Customer-facing Scenarios",
    description: "Requirement gathering, expectation management, and delivery."
  },
  {
    id: "poc-production",
    name: "PoC to Production",
    description: "Scaling an early demo to reliable enterprise production."
  },
  {
    id: "security",
    name: "Security",
    description: "Prompt injection, RBAC, data privacy, and safe agent tools."
  },
  {
    id: "scenario",
    name: "Scenario-based Questions",
    description: "High-pressure production troubleshooting scenarios."
  },
  {
    id: "projects",
    name: "Project Deep Dive",
    description: "How to explain your projects at architecture depth."
  }
];

const DIAGRAMS = {
  ragArchitecture: {
    title: "RAG architecture",
    type: "linear",
    nodes: [
      "User question",
      "Query rewrite",
      "Embedding + search",
      "Reranking",
      "Prompt assembly with sources",
      "LLM answer + citations"
    ]
  },
  agenticWorkflow: {
    title: "Agentic AI workflow",
    type: "linear",
    nodes: [
      "Goal input",
      "Planner",
      "Tool selection",
      "Tool execution",
      "State update",
      "Reflection / stop check",
      "Final answer"
    ]
  },
  multiAgentArchitecture: {
    title: "Multi-agent architecture",
    type: "branch",
    top: "Supervisor",
    branches: ["Research Agent", "SQL Agent", "Document Agent"],
    merge: "Reviewer Agent",
    end: "User-facing response"
  },
  mcpArchitecture: {
    title: "MCP architecture",
    type: "linear",
    nodes: [
      "LLM client",
      "MCP protocol messages",
      "MCP server",
      "Tool/resource adapters",
      "Internal APIs / DB / files",
      "Structured result to LLM"
    ]
  },
  llmAppArchitecture: {
    title: "LLM application architecture",
    type: "linear",
    nodes: [
      "UI / API Gateway",
      "Auth + quota layer",
      "Prompt + policy layer",
      "Model router / gateway",
      "Tools/RAG/DB calls",
      "Guardrails + output parser"
    ]
  },
  cloudArchitecture: {
    title: "Cloud deployment architecture",
    type: "linear",
    nodes: [
      "CDN + WAF",
      "API layer",
      "App service (FastAPI + workers)",
      "LLM provider abstraction",
      "Vector DB + SQL + object storage",
      "Observability + security controls"
    ]
  },
  apiArchitecture: {
    title: "Long-running LLM API design",
    type: "linear",
    nodes: [
      "Client request",
      "Validation + auth",
      "Queue/background worker",
      "Streaming channel (SSE/WebSocket)",
      "Retry / timeout / breaker",
      "Final persisted response"
    ]
  },
  dataPipelineArchitecture: {
    title: "Data and AI ingestion pipeline",
    type: "linear",
    nodes: [
      "Raw document intake",
      "Extraction + cleaning",
      "Chunking + metadata",
      "Embedding generation",
      "Indexing to vector DB",
      "Quality checks + monitoring"
    ]
  },
  systemDesignFlow: {
    title: "System design interview flow",
    type: "linear",
    nodes: [
      "Requirements",
      "Constraints and SLAs",
      "High-level components",
      "Data flow",
      "Scale and reliability",
      "Security and cost",
      "Trade-offs"
    ]
  }
};

const TABLES = {
  listTupleSetDict: {
    title: "list vs tuple vs set vs dictionary",
    headers: ["Type", "Main property", "When to use"],
    rows: [
      ["list", "Ordered, mutable, allows duplicates", "General ordered collections you modify"],
      ["tuple", "Ordered, immutable", "Fixed records, safe return values"],
      ["set", "Unordered, unique values", "Remove duplicates, fast membership checks"],
      ["dictionary", "Key-value mapping", "Lookups by key and structured records"]
    ]
  },
  ragVsFinetune: {
    title: "RAG vs fine-tuning",
    headers: ["Area", "RAG", "Fine-tuning"],
    rows: [
      ["Data freshness", "High; update index quickly", "Low; retrain needed"],
      ["Cost to update", "Lower for frequent changes", "Higher for retraining cycles"],
      ["Best use", "Knowledge retrieval and grounding", "Style/task behavior changes"],
      ["Explainability", "Can show citations", "Harder to trace knowledge source"]
    ]
  },
  cloudCompare: {
    title: "AWS vs Azure vs GCP (GenAI view)",
    headers: ["Cloud", "Managed model platform", "Search/vector options", "Strong point"],
    rows: [
      ["AWS", "Bedrock", "OpenSearch / Aurora pgvector", "Broad enterprise footprint"],
      ["Azure", "Azure OpenAI", "Azure AI Search", "Deep Microsoft ecosystem integration"],
      ["GCP", "Vertex AI / Gemini", "Vertex AI Vector Search", "Strong data + ML platform"]
    ]
  },
  vectorCompare: {
    title: "Vector database options",
    headers: ["Option", "Type", "Good for", "Trade-off"],
    rows: [
      ["FAISS", "Library (self-managed)", "Local or embedded retrieval", "You manage persistence/scaling"],
      ["Pinecone", "Managed service", "Fast managed operations", "Vendor cost and lock-in concerns"],
      ["Azure AI Search", "Managed search", "Hybrid + enterprise Azure workloads", "Azure-centric setup"],
      ["OpenSearch", "Managed or self-hosted", "Hybrid search with existing ELK usage", "Tuning complexity"]
    ]
  },
  transportCompare: {
    title: "REST vs WebSocket vs SSE",
    headers: ["Protocol", "Best for", "Pros", "Limits"],
    rows: [
      ["REST", "Simple request/response", "Easy and standard", "No built-in live token stream"],
      ["WebSocket", "Two-way real-time apps", "Bi-directional", "More stateful complexity"],
      ["SSE", "Server-to-client streaming", "Simple one-way stream", "Client cannot push over same channel"]
    ]
  },
  priorityRanking: {
    title: "Suggested preparation priority",
    headers: ["Priority", "Topic"],
    rows: [
      ["1", "Agentic AI"],
      ["2", "RAG"],
      ["3", "Python"],
      ["4", "FastAPI"],
      ["5", "GenAI/LLM fundamentals"],
      ["6", "System design"],
      ["7", "AWS"],
      ["8", "Azure"],
      ["9", "GCP"],
      ["10", "Docker/Kubernetes"],
      ["11", "LLMOps"],
      ["12", "MCP"],
      ["13", "Security"],
      ["14", "Customer-facing/PoC"]
    ]
  }
};

const CHARTS = {
  priorityChart: {
    title: "Preparation weight (higher first)",
    items: [
      { label: "Agentic AI", value: 10 },
      { label: "RAG", value: 9 },
      { label: "Python", value: 8 },
      { label: "FastAPI", value: 8 },
      { label: "LLM basics", value: 7 },
      { label: "System design", value: 7 },
      { label: "Cloud + Ops + Security", value: 6 }
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

const EXPLICIT_ANSWERS = {
  "What is the difference between a list, tuple, set, and dictionary?": [
    "A list stores values in order and you can change it later.",
    "A tuple also keeps order, but it is immutable (cannot be changed after creation).",
    "A set stores only unique values and is useful for fast membership checks.",
    "A dictionary stores key-value pairs for quick lookup by key."
  ],
  "Explain mutable vs immutable objects in Python.": [
    "Mutable objects can change in place, like list, dict, and set.",
    "Immutable objects cannot change after creation, like int, str, tuple, and frozenset.",
    "With immutables, changing a value creates a new object.",
    "This matters in function arguments because mutable values can be modified by called functions."
  ],
  "What are *args and **kwargs?": [
    "`*args` collects extra positional arguments as a tuple.",
    "`**kwargs` collects extra named arguments as a dictionary.",
    "They are useful for wrapper functions, decorators, and flexible APIs."
  ],
  "Explain shallow copy vs deep copy.": [
    "A shallow copy creates a new outer container, but nested objects are still shared.",
    "A deep copy recursively copies nested objects too.",
    "Use `copy.copy()` for shallow copy and `copy.deepcopy()` for deep copy."
  ],
  "What are decorators? Give a real-world use case.": [
    "A decorator wraps a function and adds behavior without changing the original function body.",
    "Real use case: add logging, timing, auth checks, retries, or caching to API handlers.",
    "In FastAPI, decorators are used to map path operations like `@app.get('/users')`."
  ],
  "What are generators and why would you use them?": [
    "A generator yields one item at a time instead of building the full collection in memory.",
    "Use generators for large files, streaming, and pipelines where memory efficiency matters.",
    "Generators are created with `yield`."
  ],
  "What is the difference between an iterator and an iterable?": [
    "An iterable is any object you can loop over, like list or dict.",
    "An iterator is the object that actually produces items one by one using `__next__()`.",
    "You call `iter(iterable)` to get an iterator."
  ],
  "Explain Python's GIL.": [
    "The GIL (Global Interpreter Lock) allows only one Python thread to execute Python bytecode at a time in CPython.",
    "It limits CPU-bound parallelism with threads.",
    "For I/O-bound tasks, threads still help because waiting on network/disk releases execution time.",
    "For CPU-bound parallelism, use multiprocessing or native extensions."
  ],
  "When would you use multiprocessing vs multithreading?": [
    "Use multithreading for I/O-bound work like HTTP calls and file/network waits.",
    "Use multiprocessing for CPU-bound work like heavy transforms and numeric compute.",
    "Processes avoid GIL limits but cost more memory and process management overhead."
  ],
  "How does asyncio work?": [
    "Asyncio runs an event loop that schedules many coroutines cooperatively.",
    "When a coroutine reaches `await`, it yields control so another task can run.",
    "This allows high-concurrency I/O with fewer threads."
  ],
  "What is the difference between synchronous and asynchronous programming?": [
    "Synchronous flow waits for each step to finish before moving on.",
    "Asynchronous flow can start multiple waiting operations and continue when each is ready.",
    "Async improves throughput for I/O-heavy workloads."
  ],
  "Explain async and await.": [
    "`async def` defines a coroutine function.",
    "`await` pauses that coroutine until an awaited task is done, while letting the event loop run other tasks.",
    "Use them with non-blocking libraries (async DB clients, async HTTP clients)."
  ],
  "How would you handle exceptions in a large Python application?": [
    "Use custom exception classes by domain (ValidationError, ProviderTimeout, AuthError).",
    "Catch expected errors near boundaries (API handlers, workers), not everywhere.",
    "Add global error handling for consistent API responses and logs with correlation IDs.",
    "Never hide errors silently; log them with enough context."
  ],
  "What are context managers?": [
    "Context managers control setup and cleanup around a block of code using `with`.",
    "They ensure cleanup runs even if errors happen.",
    "Common use: file handles, DB sessions, locks, and temporary resources."
  ],
  "Explain dependency injection in Python.": [
    "Dependency injection means passing required collaborators (DB client, config, provider) into code instead of hardcoding them.",
    "It improves testability and modularity.",
    "In FastAPI, dependencies are commonly injected using `Depends()`."
  ],
  "How would you structure a production Python project?": [
    "Split by domain modules (api, services, repositories, models, infrastructure).",
    "Keep configuration and secrets outside code, and use environment-based settings.",
    "Add tests (unit/integration), linting, typing, and CI checks.",
    "Include structured logging, metrics, retries, and health endpoints."
  ],
  "How do you manage configuration and secrets?": [
    "Keep non-secret config in environment variables or typed settings files.",
    "Store secrets in a secret manager (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager).",
    "Never hardcode secrets in source code or commit `.env` files.",
    "Rotate keys and track secret access."
  ],
  "How do you optimize a slow Python API?": [
    "Measure first using traces/profiler to find bottlenecks.",
    "Reduce blocking I/O with async clients and connection pooling.",
    "Cache repeated expensive calls and batch remote requests.",
    "Move heavy jobs to background workers and keep response payloads minimal."
  ],
  "How do you profile Python code?": [
    "Use `cProfile` for function-level CPU time.",
    "Use line profilers or sampling profilers to find hot lines.",
    "Profile in realistic workloads, not only tiny local examples.",
    "Pair profiling with tracing/metrics to map slow paths in production."
  ],
  "How would you implement logging in a production application?": [
    "Use structured logs (JSON) with fields: timestamp, level, service, request_id, user/tenant, and error code.",
    "Keep logs consistent across API and workers.",
    "Avoid logging secrets/PII and apply redaction filters.",
    "Send logs to centralized observability storage with retention and alerting."
  ],
  "Find duplicate elements in an array.": [
    "Use a set to track seen values and another set for duplicates.",
    "Time complexity is O(n) and space complexity is O(n).",
    "This is fast and simple for unsorted arrays."
  ],
  "Find the first non-repeating character.": [
    "Count each character first, then scan the string again to return the first count of 1.",
    "This keeps order correctness.",
    "Time complexity O(n), space O(k) where k is distinct characters."
  ],
  "Implement an LRU cache.": [
    "Use `OrderedDict` or hashmap + doubly-linked-list to keep recent order.",
    "On `get`, move key to most recent end.",
    "On `put`, evict least-recent key when capacity is exceeded."
  ],
  "Implement a rate limiter.": [
    "A practical approach is token bucket per user/IP.",
    "Store last refill timestamp and available tokens.",
    "Allow request only if tokens are available; otherwise return 429."
  ],
  "Merge overlapping intervals.": [
    "Sort by start time, then iterate and merge when the next interval starts before current ends.",
    "If no overlap, push current and move to next.",
    "Time complexity O(n log n) due to sorting."
  ],
  "Find the top K frequent elements.": [
    "Count with hashmap, then use a min-heap of size K (or bucket sort).",
    "Min-heap keeps only K most frequent elements efficiently.",
    "Useful for logs, tags, and recommendation prep."
  ],
  "Implement retry with exponential backoff.": [
    "Retry only transient errors (timeouts, 5xx), not validation errors.",
    "Wait times grow exponentially (e.g., 0.5s, 1s, 2s, 4s) with jitter.",
    "Set max attempts and total timeout to avoid endless retry loops."
  ],
  "Process a large file without loading it completely into memory.": [
    "Read line by line or in fixed-size chunks.",
    "Process and write output incrementally.",
    "Use streaming APIs and avoid collecting full data in lists."
  ],
  "Implement a producer-consumer pattern.": [
    "Use a queue where producers push work and consumers pull work.",
    "This decouples data ingestion from processing speed.",
    "Add bounded queues, retries, and poison-pill shutdown for safety."
  ],
  "Write an async function that calls multiple APIs concurrently.": [
    "Use `asyncio.gather` with async HTTP client calls.",
    "Set per-call timeout and handle partial failures.",
    "Return merged results with clear status per upstream API."
  ],
  "Why would you choose FastAPI over Flask?": [
    "FastAPI gives built-in request validation, OpenAPI docs, and async support out of the box.",
    "It uses type hints and Pydantic for cleaner contracts and fewer input bugs.",
    "Flask is flexible and lightweight, but you wire many production features manually."
  ],
  "How does FastAPI handle asynchronous requests?": [
    "Async endpoints run on an ASGI server (for example Uvicorn).",
    "When code reaches `await`, the event loop handles other requests.",
    "This improves concurrency for I/O-heavy workloads."
  ],
  "What is Pydantic?": [
    "Pydantic is a Python library for parsing and validating data using type annotations.",
    "FastAPI uses it for request/response models and automatic schema generation.",
    "It reduces manual input checks and enforces consistent payload formats."
  ],
  "Explain request validation in FastAPI.": [
    "Define request models with Pydantic classes.",
    "FastAPI validates types, required fields, and constraints before entering business logic.",
    "Invalid requests get consistent 422 responses with field-level errors."
  ],
  "JWT vs OAuth2?": [
    "JWT is a token format, while OAuth2 is an authorization framework/flow.",
    "OAuth2 can issue JWT access tokens, but tokens can also be opaque.",
    "Use OAuth2 when delegated access and identity-provider integration are required."
  ],
  "REST vs WebSocket vs Server-Sent Events?": [
    "REST is best for standard request/response APIs.",
    "WebSocket is best for full two-way real-time channels.",
    "SSE is best for server-to-client token streaming with simpler infrastructure.",
    "For LLM text streaming, SSE is often the easiest production default."
  ],
  "Your LLM API takes 30–60 seconds to respond. How would you design the FastAPI service?": [
    "Accept request quickly, validate auth/limits, and enqueue a job for background processing.",
    "Provide client updates via SSE/WebSocket streaming channel or polling endpoint.",
    "Use strict timeouts, retries with jitter, circuit breakers, and fallback model routing.",
    "Cache repeat prompts when possible and emit observability events for every stage."
  ],
  "What is an LLM?": [
    "An LLM (Large Language Model) is a neural network trained on large text corpora to predict the next token.",
    "It can generate text, summarize, classify, translate, and call tools when configured.",
    "LLMs are powerful but must be grounded and validated for enterprise use."
  ],
  "What is RAG?": [
    "RAG means Retrieval-Augmented Generation.",
    "Before generating an answer, the system retrieves relevant documents and adds them to the prompt.",
    "This improves factual accuracy and allows up-to-date knowledge without retraining."
  ],
  "Why is RAG preferred over fine-tuning for frequently changing data?": [
    "RAG updates knowledge by refreshing indexed documents, which is faster than retraining.",
    "It is cheaper for frequently changing enterprise content.",
    "It can return citations to show where the answer came from."
  ],
  "What are embeddings?": [
    "Embeddings are numeric vectors that represent semantic meaning of text.",
    "Text with similar meaning has vectors that are close in vector space.",
    "They are used for semantic search, clustering, and retrieval in RAG."
  ],
  "How are embeddings generated?": [
    "Text is passed through an embedding model that outputs a fixed-length vector.",
    "Before embedding, clean and chunk text to preserve context quality.",
    "Store vectors with metadata in a vector index for retrieval."
  ],
  "What is cosine similarity?": [
    "Cosine similarity measures the angle between two vectors, not their length.",
    "Higher cosine value means the texts are semantically closer.",
    "It is a common metric for embedding search."
  ],
  "What is semantic search?": [
    "Semantic search retrieves content by meaning, not exact keyword match.",
    "It uses embeddings to find conceptually similar chunks.",
    "It handles paraphrases better than plain keyword search."
  ],
  "What is hybrid search?": [
    "Hybrid search combines vector similarity with keyword/BM25 signals.",
    "It improves recall when exact terms and semantics both matter.",
    "Many production RAG systems use weighted hybrid scoring."
  ],
  "What is reranking?": [
    "Reranking reorders retrieved candidates using a stronger relevance model.",
    "It improves top-k quality before prompt construction.",
    "This often boosts answer quality without changing the base LLM."
  ],
  "What is grounding?": [
    "Grounding means forcing model answers to rely on trusted provided context.",
    "Grounded answers reference retrieved documents or structured data.",
    "It is a key method to reduce hallucinations."
  ],
  "What is structured output?": [
    "Structured output means the model returns data in a strict schema such as JSON.",
    "Schema validation makes downstream processing safer and more reliable.",
    "It is better than free text for workflows and integrations."
  ],
  "What is function/tool calling?": [
    "Tool calling lets an LLM request external functions with structured arguments.",
    "The application executes approved tools and returns results back to the model.",
    "It connects language reasoning with real actions/data."
  ],
  "What is an LLM gateway?": [
    "An LLM gateway is a central layer that routes requests to one or many model providers.",
    "It standardizes auth, quotas, prompts, policy checks, logging, and fallback.",
    "This avoids provider-specific logic spread across all services."
  ],
  "Explain RAG end-to-end.": [
    "Ingestion: extract documents, clean text, chunk content, and create embeddings with metadata.",
    "Retrieval: for each user query, embed the query, run vector/hybrid search, and rerank top chunks.",
    "Generation: build prompt with selected context and ask LLM to answer with citations.",
    "Evaluation/ops: monitor retrieval quality, answer quality, latency, and cost."
  ],
  "What happens when a PDF enters your RAG system?": [
    "Store raw PDF, assign document ID, and capture ownership/tenant metadata.",
    "Extract text/tables, clean OCR noise, split into chunks, and compute embeddings.",
    "Index chunks in vector DB with metadata and access-control fields.",
    "Run quality checks (chunk count, extraction confidence, sample retrieval tests)."
  ],
  "Fixed-size chunking vs semantic chunking?": [
    "Fixed-size chunking is simple and fast, with predictable size.",
    "Semantic chunking follows natural boundaries like headings/paragraph meaning.",
    "Start with fixed + overlap, then use semantic chunking for complex technical documents."
  ],
  "Vector DB vs traditional database?": [
    "Vector DB is optimized for similarity search over high-dimensional vectors.",
    "Traditional DB is optimized for exact filters, transactions, and relational queries.",
    "Most production systems use both: vector retrieval + relational metadata and business data."
  ],
  "FAISS vs Pinecone vs Azure AI Search vs OpenSearch?": [
    "FAISS is a local library: fast and flexible, but you manage operations yourself.",
    "Pinecone is fully managed and simple to operate at scale.",
    "Azure AI Search adds strong enterprise + hybrid retrieval in Azure stacks.",
    "OpenSearch works well when you already run Elastic-style search and need hybrid capabilities."
  ],
  "What is approximate nearest neighbor search?": [
    "ANN finds very close vectors quickly without checking every vector exactly.",
    "It trades tiny accuracy loss for big speed gains at large scale.",
    "ANN is required for real-time retrieval with millions of chunks."
  ],
  "What is HNSW?": [
    "HNSW (Hierarchical Navigable Small World) is an ANN index structure.",
    "It builds layered graph links to navigate quickly to nearest vectors.",
    "It offers strong recall/speed trade-off for many vector search workloads."
  ],
  "Why do you need reranking?": [
    "Initial retrieval can include noisy or loosely related chunks.",
    "Reranking improves final top context quality before calling the LLM.",
    "Higher context precision usually gives better factual answers."
  ],
  "Your RAG system is giving wrong answers even though the answer exists in the document. How would you debug it?": [
    "Debug stage by stage: extraction -> cleaning -> chunking -> embedding -> indexing -> retrieval -> reranking -> prompt -> generation.",
    "Verify if the exact answer text exists in any chunk and whether that chunk is retrievable for realistic query variants.",
    "Inspect filters/metadata permissions that may be hiding correct chunks.",
    "If retrieval is good but answer is wrong, improve prompt constraints, citations, and output validation."
  ],
  "What is Agentic AI?": [
    "Agentic AI means an LLM-driven system that can plan steps, call tools, observe results, and iterate toward a goal.",
    "It is more than plain Q&A because it executes actions across systems.",
    "Good agent design adds strict boundaries, budgets, and human approval points."
  ],
  "RAG vs Agentic RAG?": [
    "RAG is usually a fixed retrieval + generation pipeline.",
    "Agentic RAG lets an agent choose tools, reformulate queries, and run multi-step retrieval actions.",
    "Agentic RAG is more flexible but needs stronger controls for cost, loops, and safety."
  ],
  "LLM application vs AI agent?": [
    "A normal LLM app follows mostly predefined paths.",
    "An AI agent dynamically plans actions and selects tools based on context.",
    "Agents solve complex tasks but need stronger governance and observability."
  ],
  "What is multi-agent architecture?": [
    "Multi-agent architecture splits responsibilities among specialized agents.",
    "A supervisor coordinates worker agents and resolves conflicts.",
    "Use it only when decomposition improves quality or maintainability."
  ],
  "How do you prevent an agent from entering an infinite loop?": [
    "Set max step/tool-call limits and max wall-clock runtime per task.",
    "Detect repeated tool-call patterns and force a stop with escalation.",
    "Require explicit stop criteria and confidence thresholds before final output."
  ],
  "How do you secure tools?": [
    "Expose only allow-listed tools with least privilege.",
    "Validate tool arguments with strict schemas and policy checks.",
    "Log every tool call and require human approval for high-risk actions."
  ],
  "How do you implement human-in-the-loop?": [
    "Add approval checkpoints for sensitive decisions or low-confidence outputs.",
    "Show context, proposed action, and reason so reviewers can approve/reject quickly.",
    "Track reviewer actions in audit logs for compliance."
  ],
  "How do you trace an agent's execution?": [
    "Capture step-level traces: prompt version, tool chosen, tool args, tool results, token usage, and latency.",
    "Attach a single correlation ID from API call to all sub-steps.",
    "Store traces in searchable observability tooling for debugging and evaluation."
  ],
  "Design an AI agent that receives a user's question, searches company documents, queries a database, and generates a final answer.": [
    "Use one orchestration service that receives the request and builds a safe task plan.",
    "Run document retrieval and SQL retrieval through separate read-only tools with schema validation.",
    "Merge retrieved evidence, rerank, and generate grounded answer with citations and confidence score.",
    "Add RBAC checks, tool timeouts, retries, and escalation to human review when confidence is low."
  ],
  "How would you build a multi-agent system?": [
    "Start with a supervisor agent that decomposes the user task into sub-tasks.",
    "Assign specialized worker agents (research, data, document, reviewer) with clear bounded tools.",
    "Use shared state and explicit contracts between agents to avoid ambiguity.",
    "Add final reviewer/validator agent, cost guardrails, and stop conditions."
  ],
  "What is MCP?": [
    "MCP (Model Context Protocol) is a standard way for LLM clients to connect to external tools, resources, and prompts.",
    "It gives a consistent interface so models can use enterprise systems safely and predictably.",
    "It reduces custom one-off integrations for each model vendor."
  ],
  "MCP client vs MCP server?": [
    "The MCP client is inside your app/agent runtime and requests tools/resources.",
    "The MCP server exposes those tools/resources with schemas and access policies.",
    "Client asks; server validates and executes."
  ],
  "MCP vs REST API?": [
    "REST is generic HTTP endpoints. MCP is a model-centric protocol with tool and resource semantics.",
    "MCP gives richer interaction patterns for LLM orchestration, including prompt/resource discovery.",
    "REST services can still be wrapped and exposed through MCP."
  ],
  "MCP vs function calling?": [
    "Function calling is usually provider-specific model capability.",
    "MCP is vendor-neutral protocol standardizing tool/resource access outside the model API itself.",
    "MCP can be used underneath function-calling workflows to keep infrastructure portable."
  ],
  "How would you secure an MCP server?": [
    "Use strong authN/authZ at the MCP server boundary.",
    "Apply least privilege per tool and per tenant, with strict input schemas.",
    "Log tool invocations with request identity, and mask sensitive outputs."
  ],
  "What is Bedrock?": [
    "Amazon Bedrock is AWS managed service for accessing foundation models through unified APIs.",
    "It supports multiple model providers and AWS-native security/governance controls.",
    "It is useful when you want enterprise controls and multi-model options in AWS."
  ],
  "How would you deploy an LLM application on AWS?": [
    "Put API behind CloudFront + API Gateway or ALB with WAF and auth.",
    "Run FastAPI service on ECS/EKS with background workers for long tasks.",
    "Use Bedrock/OpenAI integration, OpenSearch/vector storage, and S3 for documents.",
    "Add CloudWatch logs/metrics/traces and IAM least-privilege policies."
  ],
  "How would you build RAG using AWS services?": [
    "Ingest files to S3, trigger extraction/chunking via Lambda/ECS jobs.",
    "Generate embeddings and index into OpenSearch (or pgvector).",
    "Serve retrieval + generation via FastAPI service and Bedrock model calls.",
    "Add metadata filters, tenant isolation, and observability dashboards."
  ],
  "Design a production RAG application on AWS.": [
    "Use CDN + WAF + API Gateway front door, then containerized app layer on ECS/EKS.",
    "Separate ingestion pipeline from query pipeline using SQS and worker services.",
    "Store raw docs in S3, vectors in OpenSearch/pgvector, operational data in RDS.",
    "Implement IAM least privilege, KMS encryption, monitoring, and disaster recovery."
  ],
  "Azure OpenAI vs OpenAI API?": [
    "Azure OpenAI gives Azure enterprise controls, networking options, and compliance integration.",
    "OpenAI public API is direct provider access with global endpoints and provider-native updates.",
    "Choice depends on compliance, governance, and cloud strategy requirements."
  ],
  "How would you build RAG using Azure OpenAI + AI Search?": [
    "Store docs in Blob Storage, extract/chunk with processing service, and index to Azure AI Search.",
    "Use Azure OpenAI for embedding + generation models.",
    "Use FastAPI/API Management for query path and enforce tenant/security filters.",
    "Monitor through Azure Monitor + Application Insights."
  ],
  "How would you deploy FastAPI to Azure?": [
    "Use Azure Container Apps or AKS depending on control and scale needs.",
    "Store config/secrets in Key Vault and use Managed Identity for access.",
    "Put API behind API Management/Application Gateway and enable logging/alerts."
  ],
  "How would you implement enterprise RAG on Azure?": [
    "Use Azure OpenAI, Azure AI Search, Blob Storage, and secure app hosting (Container Apps/AKS).",
    "Enforce RBAC and tenant-aware metadata filters on every retrieval call.",
    "Add evaluation pipeline, prompt/version control, and full audit logging."
  ],
  "Cloud Run vs GKE?": [
    "Cloud Run is simpler serverless containers with fast operations for stateless services.",
    "GKE gives deeper control for complex networking, custom runtimes, and large orchestrated systems.",
    "Start with Cloud Run unless you need Kubernetes-level controls."
  ],
  "How would you build RAG using Vertex AI?": [
    "Ingest and preprocess docs, generate embeddings with Vertex models, and index in Vertex AI Vector Search.",
    "Build query service in Cloud Run/GKE that performs retrieval and generation with Gemini/Vertex models.",
    "Protect secrets with Secret Manager and monitor with Cloud Logging/Monitoring."
  ],
  "How would you design the same GenAI application to run on AWS, Azure and GCP?": [
    "Build a provider-agnostic application core with abstraction layers for model calls, vector search, and storage.",
    "Use pluggable adapters: Bedrock/Azure OpenAI/Vertex for LLM, and matching search adapters per cloud.",
    "Keep prompt formats, evaluation, and business logic centralized so behavior stays consistent.",
    "Automate environment-specific deployment via IaC and shared CI/CD standards."
  ],
  "How would you monitor an LLM application?": [
    "Track API latency, error rates, token usage, retrieval quality, answer quality, and tool failure rates.",
    "Use traces to inspect full request journey including model and retrieval steps.",
    "Set alerts on SLA breaches, cost spikes, and quality drops."
  ],
  "How do you control LLM costs?": [
    "Use prompt compression, response length limits, and caching for repeated prompts.",
    "Route simple tasks to smaller/cheaper models and use premium models only when needed.",
    "Track per-tenant/token budgets and enforce hard spending guards."
  ],
  "How do you implement fallback models?": [
    "Define primary and secondary provider/model chain with compatibility-tested prompts.",
    "Trigger fallback on timeout, 5xx, or quality gate failure.",
    "Return clear metadata indicating fallback path to aid debugging."
  ],
  "Design an enterprise RAG platform.": [
    "Split into ingestion plane, retrieval plane, generation plane, and governance plane.",
    "Ingestion handles extraction/chunking/indexing with tenant metadata and quality checks.",
    "Retrieval plane handles query rewrite, hybrid retrieval, reranking, and policy filters.",
    "Governance plane handles evaluation, observability, cost controls, and access/security policies."
  ],
  "Design a multi-agent customer-support system.": [
    "Use supervisor + specialized agents (policy, product docs, order status, escalation).",
    "Each agent gets scoped tools and read-only access unless approved.",
    "Use reviewer/guardrail layer before returning final customer response.",
    "Track business metrics (resolution rate, escalation rate, CSAT, latency)."
  ],
  "Design a production LLM gateway supporting multiple models/providers.": [
    "Expose one internal API contract and map it to provider-specific APIs with adapters.",
    "Include auth, quota, routing policy, retries, fallback, and safety filters in gateway.",
    "Track latency/cost/quality per provider and use policy-based routing rules.",
    "Keep prompt templates versioned and test-compatible across providers."
  ],
  "You built a successful RAG PoC. The customer now wants 10,000 users. What changes?": [
    "Move from single-service PoC to scalable architecture with separate API, worker, and ingestion pipelines.",
    "Add authentication/authorization, tenant isolation, and rate limiting.",
    "Scale retrieval/index infrastructure, add caching, and optimize model routing for latency/cost.",
    "Add CI/CD, observability, load testing, security controls, and disaster recovery."
  ],
  "How do you prevent prompt injection?": [
    "Treat external content as untrusted data, never as executable instruction.",
    "Use prompt separators, allow-listed tools, and strict output schemas.",
    "Add policy checks before sensitive tool calls and keep human approval for high-risk actions."
  ],
  "How do you handle PII?": [
    "Classify and minimize PII collection from the start.",
    "Mask/redact sensitive fields in logs and prompts where possible.",
    "Encrypt at rest/in transit, apply strict access controls, and define retention/deletion policies."
  ],
  "How do you implement RBAC in RAG?": [
    "Tag each chunk with access metadata (tenant, role, document ACL).",
    "Apply authorization filters at retrieval time before context assembly.",
    "Never rely only on post-generation filtering; prevent unauthorized retrieval itself."
  ],
  "How do you evaluate an LLM application?": [
    "Define quality metrics first: factual accuracy, task success rate, latency, and cost.",
    "Create evaluation datasets with expected outputs and edge cases.",
    "Run offline tests for prompt/model changes and online A/B checks in production.",
    "Track user feedback and failure categories to drive continuous improvement."
  ],
  "How do you evaluate RAG?": [
    "Measure retrieval quality (recall@k, precision@k, MRR) separately from generation quality.",
    "Check grounded answer accuracy and citation correctness on labeled test questions.",
    "Track latency, token cost, and failure reasons by pipeline stage.",
    "Evaluate by domain/use-case because one global score can hide critical weaknesses."
  ],
  "How do you evaluate an agent?": [
    "Evaluate task success, tool-call correctness, step efficiency, latency, and cost.",
    "Track unsafe actions, loop rate, and hallucinated tool-call rate.",
    "Use replayable benchmark tasks and scenario tests for regression detection.",
    "Add human review sampling for high-risk workflows."
  ],
  "How does an agent decide which tool to use?": [
    "The model uses tool descriptions, input schema, and task context to pick a tool.",
    "Better tool naming, clear descriptions, and strict argument schemas improve selection accuracy.",
    "A planner/routing layer can pre-filter allowed tools by user role and task type."
  ],
  "How do you handle tool failures?": [
    "Return structured error types from tools (timeout, auth, validation, upstream failure).",
    "Retry only transient failures with limits and fallback path.",
    "If tool remains unavailable, degrade gracefully and explain the limitation to the user."
  ],
  "How do you handle hallucinated tool calls?": [
    "Validate tool name and arguments against an allow-list and JSON schema before execution.",
    "Block unknown tools and return explicit error context to the model.",
    "Add examples in prompt showing when tool use is not needed."
  ],
  "How do you handle multiple LLM providers?": [
    "Build a provider abstraction layer with a common request/response contract.",
    "Keep prompt templates portable and test them across providers.",
    "Use policy-based routing for latency, cost, region, and compliance needs.",
    "Enable fallback and collect per-provider quality/cost telemetry."
  ],
  "How do you stream an LLM response through FastAPI?": [
    "Use `StreamingResponse` with `text/event-stream` for token-by-token output.",
    "Keep generation in async iterator and flush chunks quickly.",
    "Include cancellation handling if client disconnects, and log partial completion safely."
  ],
  "How would you improve poor retrieval?": [
    "Check query rewrite quality, chunking strategy, and embedding model fit for your domain.",
    "Tune top-k, hybrid search weights, and metadata filters.",
    "Add reranking and evaluate retrieval metrics before changing generation prompts."
  ],
  "What happens if the correct information exists in the document but isn't retrieved?": [
    "This is a retrieval failure, not necessarily an LLM failure.",
    "Inspect chunk boundaries, embedding quality, search filters, and ANN index settings.",
    "Add query rewriting or hybrid search so lexical and semantic signals both contribute."
  ],
  "How do you perform A/B testing between models?": [
    "Split traffic by stable user/session keys to avoid skew.",
    "Compare quality metrics, latency, safety violations, and token cost side-by-side.",
    "Run enough sample size and include rollback trigger thresholds."
  ],
  "How do you track token consumption?": [
    "Capture prompt/completion token counts for every call with request metadata.",
    "Aggregate by endpoint, tenant, model, and feature to find heavy usage patterns.",
    "Set alerts for abnormal token spikes."
  ],
  "How do you detect hallucinations?": [
    "Use grounding checks against retrieved sources and structured business rules.",
    "Add evaluator models or rule-based validators for factual consistency checks.",
    "Track user correction signals and manual review labels."
  ],
  "How do you version prompts?": [
    "Treat prompts as code: store in version control with IDs and changelogs.",
    "Reference prompt version in runtime traces and experiment results.",
    "Roll out with canary/A-B testing and quick rollback."
  ],
  "How do you version models?": [
    "Pin explicit model IDs and configuration in deployment manifests.",
    "Record model version in every request trace for reproducibility.",
    "Regression-test before upgrading model versions."
  ],
  "How do you handle model failures?": [
    "Classify failures: timeout, rate limit, malformed output, and provider outage.",
    "Use retries with jitter for transient failures and fallback model/provider for hard failures.",
    "Return graceful degraded response and capture failure telemetry."
  ],
  "What happens if OpenAI/Azure OpenAI/Bedrock is unavailable?": [
    "Circuit breaker marks provider unhealthy and stops sending new traffic temporarily.",
    "Requests route to secondary provider through model abstraction layer.",
    "If all providers fail, serve cached/partial response with clear status and alert on-call."
  ],
  "How do you implement retries without creating duplicate operations?": [
    "Use idempotency keys so repeated requests map to same operation/result.",
    "Retry only safe/transient operations and set bounded retry policy.",
    "Store operation state so worker restarts do not re-apply side effects."
  ],
  "Your RAG accuracy is only 60%. What do you investigate?": [
    "Measure retrieval recall first: can relevant chunks be found for real user queries?",
    "Inspect chunking strategy, metadata filters, embeddings model choice, and reranker quality.",
    "Review prompt quality and whether citations enforce grounded generation.",
    "Run error analysis by query type to prioritize the highest-impact fixes."
  ],
  "LLM response latency is 15 seconds. Customer wants <3 seconds. What do you do?": [
    "Profile latency budget by stage (retrieval, model call, post-processing, network).",
    "Use faster model for first response, stream output early, and cache frequent intents.",
    "Reduce prompt/context size with smarter retrieval and compression.",
    "Precompute heavy features and parallelize independent sub-steps."
  ],
  "LLM costs increased 5× after production launch. How do you fix it?": [
    "Audit token usage by endpoint, tenant, and prompt template to find cost hotspots.",
    "Reduce unnecessary context size and cap generation length.",
    "Enable caching and model tiering by task complexity.",
    "Set budget guardrails and anomaly alerts."
  ],
  "Azure OpenAI is down. Your application must continue working. Design the fallback.": [
    "Detect provider outage quickly with health checks and circuit-breaker logic.",
    "Route traffic to pre-integrated secondary provider through an abstraction gateway.",
    "Keep compatible prompt/schema contracts across providers to avoid emergency rewrites.",
    "Log fallback events and degrade gracefully if some premium features are unavailable."
  ],
  "Different customers have different document permissions. How would you implement multi-tenant RAG?": [
    "Use tenant-aware indexing and ACL metadata on every chunk.",
    "Apply strict retrieval-time filters for tenant, role, and document permissions.",
    "Isolate storage/keys/logging per tenant where required by policy.",
    "Add permission tests and audit trails to prove no cross-tenant leakage."
  ],
  "The customer wants an agent that can execute SQL queries. How do you prevent destructive queries?": [
    "Expose a read-only SQL tool restricted to SELECT and approved views/stored procedures.",
    "Validate generated SQL against allow-lists and block dangerous keywords.",
    "Use row-level security and query timeouts/limits.",
    "Require human approval for any action that could mutate data."
  ],
  "How should you explain your projects deeply for this interview?": [
    "Prepare 2-3 projects and explain each as: problem, architecture, design choices, your role, and business impact.",
    "Be ready to justify alternatives and discuss trade-offs at 10x scale.",
    "Cover security, reliability, monitoring, and what you would improve in production."
  ]
};

const CODE_EXAMPLES = {
  "Find duplicate elements in an array.": {
    language: "python",
    code:
      "def find_duplicates(items):\n    seen = set()\n    dup = set()\n    for value in items:\n        if value in seen:\n            dup.add(value)\n        else:\n            seen.add(value)\n    return sorted(dup)\n"
  },
  "Find the first non-repeating character.": {
    language: "python",
    code:
      "from collections import Counter\n\ndef first_non_repeating(text):\n    counts = Counter(text)\n    for ch in text:\n        if counts[ch] == 1:\n            return ch\n    return None\n"
  },
  "Implement an LRU cache.": {
    language: "python",
    code:
      "from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.data = OrderedDict()\n\n    def get(self, key):\n        if key not in self.data:\n            return None\n        self.data.move_to_end(key)\n        return self.data[key]\n\n    def put(self, key, value):\n        if key in self.data:\n            self.data.move_to_end(key)\n        self.data[key] = value\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)\n"
  },
  "Implement a rate limiter.": {
    language: "python",
    code:
      "import time\n\nclass TokenBucket:\n    def __init__(self, rate_per_sec, burst):\n        self.rate = rate_per_sec\n        self.capacity = burst\n        self.tokens = burst\n        self.last = time.monotonic()\n\n    def allow(self):\n        now = time.monotonic()\n        elapsed = now - self.last\n        self.last = now\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)\n        if self.tokens >= 1:\n            self.tokens -= 1\n            return True\n        return False\n"
  },
  "Merge overlapping intervals.": {
    language: "python",
    code:
      "def merge_intervals(intervals):\n    if not intervals:\n        return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0][:]]\n    for start, end in intervals[1:]:\n        last = merged[-1]\n        if start <= last[1]:\n            last[1] = max(last[1], end)\n        else:\n            merged.append([start, end])\n    return merged\n"
  },
  "Find the top K frequent elements.": {
    language: "python",
    code:
      "from collections import Counter\nimport heapq\n\ndef top_k_frequent(values, k):\n    counts = Counter(values)\n    return [item for item, _ in heapq.nlargest(k, counts.items(), key=lambda pair: pair[1])]\n"
  },
  "Implement retry with exponential backoff.": {
    language: "python",
    code:
      "import asyncio\nimport random\n\nasync def with_retry(call, attempts=5, base_delay=0.5):\n    for i in range(attempts):\n        try:\n            return await call()\n        except Exception:\n            if i == attempts - 1:\n                raise\n            delay = base_delay * (2 ** i)\n            jitter = random.uniform(0, delay * 0.1)\n            await asyncio.sleep(delay + jitter)\n"
  },
  "Process a large file without loading it completely into memory.": {
    language: "python",
    code:
      "def process_large_file(path):\n    with open(path, 'r', encoding='utf-8') as handle:\n        for line in handle:\n            line = line.strip()\n            if not line:\n                continue\n            # process line incrementally\n            yield line\n"
  },
  "Implement a producer-consumer pattern.": {
    language: "python",
    code:
      "import asyncio\n\nasync def producer(queue):\n    for i in range(100):\n        await queue.put(i)\n    await queue.put(None)\n\nasync def consumer(queue):\n    while True:\n        item = await queue.get()\n        if item is None:\n            break\n        # process item\n\nasync def main():\n    queue = asyncio.Queue(maxsize=100)\n    await asyncio.gather(producer(queue), consumer(queue))\n"
  },
  "Write an async function that calls multiple APIs concurrently.": {
    language: "python",
    code:
      "import asyncio\nimport httpx\n\nasync def fetch_many(urls):\n    async with httpx.AsyncClient(timeout=10) as client:\n        tasks = [client.get(url) for url in urls]\n        responses = await asyncio.gather(*tasks, return_exceptions=True)\n    return responses\n"
  },
  "How do you stream an LLM response through FastAPI?": {
    language: "python",
    code:
      "from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\n\napp = FastAPI()\n\nasync def token_stream():\n    for token in ['Hello', ' ', 'world']:\n        yield f\"data: {token}\\n\\n\"\n\n@app.get('/stream')\nasync def stream_answer():\n    return StreamingResponse(token_stream(), media_type='text/event-stream')\n"
  }
};

const ENRICHMENTS = {
  "What is the difference between a list, tuple, set, and dictionary?": { tableId: "listTupleSetDict" },
  "RAG vs Fine-tuning?": { tableId: "ragVsFinetune" },
  "Prompt engineering vs fine-tuning?": { tableId: "ragVsFinetune" },
  "What is RAG?": { diagramId: "ragArchitecture" },
  "Explain RAG end-to-end.": { diagramId: "ragArchitecture" },
  "What happens when a PDF enters your RAG system?": { diagramId: "dataPipelineArchitecture" },
  "What is Agentic AI?": { diagramId: "agenticWorkflow" },
  "What is multi-agent architecture?": { diagramId: "multiAgentArchitecture" },
  "How would you build a multi-agent system?": { diagramId: "multiAgentArchitecture" },
  "What is MCP?": { diagramId: "mcpArchitecture" },
  "How does an LLM interact with an MCP server?": { diagramId: "mcpArchitecture" },
  "How would you design a production-grade FastAPI service?": { diagramId: "apiArchitecture" },
  "Your LLM API takes 30–60 seconds to respond. How would you design the FastAPI service?": { diagramId: "apiArchitecture" },
  "How would you deploy an LLM application on AWS?": { diagramId: "cloudArchitecture" },
  "How would you design the same GenAI application to run on AWS, Azure and GCP?": { tableId: "cloudCompare", diagramId: "llmAppArchitecture" },
  "Design an AI agent that receives a user's question, searches company documents, queries a database, and generates a final answer.": { diagramId: "llmAppArchitecture" },
  "Design an enterprise RAG platform.": { diagramId: "systemDesignFlow" },
  "Design a production RAG application on AWS.": { diagramId: "cloudArchitecture" },
  "FAISS vs Pinecone vs Azure AI Search vs OpenSearch?": { tableId: "vectorCompare" },
  "REST vs WebSocket vs Server-Sent Events?": { tableId: "transportCompare" }
};

const DIFFICULTY_KEYWORDS = [
  { word: "design", level: "advanced" },
  { word: "scenario", level: "advanced" },
  { word: "fallback", level: "advanced" },
  { word: "security", level: "advanced" },
  { word: "what is", level: "beginner" },
  { word: "difference", level: "beginner" }
];

function inferDifficulty(question, categoryId) {
  if (categoryId === "system-design" || categoryId === "scenario") return "advanced";
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

const TERM_DEFINITIONS = {
  "api gateway": "API Gateway is the managed front door that handles auth, throttling, and routing for API calls.",
  iam: "IAM (Identity and Access Management) controls who can access which cloud resources.",
  "secrets manager": "Secrets Manager stores and rotates sensitive credentials safely.",
  cloudwatch: "CloudWatch is AWS observability for metrics, logs, dashboards, and alerts.",
  "azure openai": "Azure OpenAI provides OpenAI models through Azure enterprise controls and networking.",
  "azure ai search": "Azure AI Search is managed search with keyword, vector, and hybrid retrieval.",
  "azure functions": "Azure Functions is serverless event-driven compute for short tasks.",
  "azure container apps": "Azure Container Apps is managed container hosting with autoscaling and simplified operations.",
  aks: "AKS is Azure Kubernetes Service for running containerized apps with Kubernetes control.",
  "azure blob storage": "Azure Blob Storage is object storage for files and unstructured data.",
  "azure key vault": "Azure Key Vault manages secrets, keys, and certificates securely.",
  "azure service bus": "Azure Service Bus is a reliable managed messaging service with queues/topics.",
  "azure monitor": "Azure Monitor collects logs, metrics, and traces for monitoring and alerting.",
  "managed identity": "Managed Identity gives Azure services an identity to access resources without hardcoded secrets.",
  "vertex ai": "Vertex AI is GCP's managed ML/GenAI platform for model development and serving.",
  gemini: "Gemini is Google's family of multimodal foundation models.",
  "cloud run": "Cloud Run is serverless container hosting for stateless workloads with automatic scaling.",
  gke: "GKE is Google Kubernetes Engine for managed Kubernetes clusters.",
  "cloud functions": "Cloud Functions runs event-driven serverless functions.",
  "cloud storage": "Cloud Storage is GCP object storage for large-scale file data.",
  bigquery: "BigQuery is a serverless analytics data warehouse for large SQL workloads.",
  "vertex ai vector search": "Vertex AI Vector Search is managed ANN vector indexing and retrieval service.",
  "secret manager": "Secret Manager stores and controls access to sensitive credentials.",
  "pub/sub": "Pub/Sub is managed asynchronous messaging for event-driven pipelines.",
  docker: "Docker packages applications and dependencies into portable container images.",
  "kubernetes pod": "A Pod is the smallest deployable unit in Kubernetes, containing one or more containers.",
  deployment: "A Kubernetes Deployment manages rolling updates and desired replica state for Pods.",
  service: "A Kubernetes Service gives a stable network endpoint for a set of Pods.",
  configmap: "ConfigMap stores non-secret configuration data for Kubernetes workloads.",
  secret: "Kubernetes Secret stores sensitive config values that should not be in plain text config maps.",
  ingress: "Ingress routes external HTTP/HTTPS traffic to internal Kubernetes services.",
  "horizontal pod autoscaler": "HPA automatically scales pod replicas based on metrics like CPU or custom signals.",
  "azure openai?": "Azure OpenAI provides OpenAI models through Azure enterprise controls and networking.",
  "azure ai search?": "Azure AI Search is managed search with keyword, vector, and hybrid retrieval.",
  "vertex ai?": "Vertex AI is GCP's managed ML/GenAI platform for model development and serving.",
  "gemini?": "Gemini is Google's family of multimodal foundation models."
};

const COMPARISON_ANSWERS = {
  "ec2 vs lambda?": [
    "EC2 gives full server control and is good for long-running or custom runtime workloads.",
    "Lambda is serverless and best for event-driven short tasks with fast operational setup.",
    "Use Lambda for bursty glue tasks; use EC2 when you need deep runtime control."
  ],
  "ecs vs eks?": [
    "ECS is simpler AWS-native container orchestration with lower operational overhead.",
    "EKS is managed Kubernetes for portability and deeper orchestration features.",
    "Choose ECS for speed; choose EKS when Kubernetes ecosystem control is required."
  ],
  "s3 vs efs?": [
    "S3 is object storage for documents, backups, and large immutable blobs.",
    "EFS is shared network file system for POSIX-style file access across instances.",
    "RAG documents usually start in S3; use EFS only when shared file semantics are required."
  ],
  "sqs vs sns?": [
    "SQS is queue-based pull messaging for decoupled worker processing.",
    "SNS is pub/sub fan-out notifications to multiple subscribers.",
    "Use SNS -> SQS when you need fan-out plus reliable worker queues."
  ],
  "rds vs dynamodb?": [
    "RDS is relational SQL database with joins and transactional consistency.",
    "DynamoDB is NoSQL key-value/document database with very high scale and low latency.",
    "Use RDS for relational business logic; use DynamoDB for massive key-based access patterns."
  ],
  "single agent vs multi-agent?": [
    "Single agent is simpler, cheaper, and easier to debug for many workflows.",
    "Multi-agent helps when tasks naturally split into specialized roles or tools.",
    "Do not use multi-agent unless specialization clearly improves quality or maintainability."
  ],
  "image vs container?": [
    "An image is a read-only package of app code, runtime, and dependencies.",
    "A container is a running instance of that image with runtime state.",
    "One image can run many containers."
  ],
  "cloud run vs gke?": [
    "Cloud Run is simpler serverless containers for stateless services.",
    "GKE is better for advanced networking, custom scheduling, and complex distributed systems.",
    "Start with Cloud Run and move to GKE only when needed."
  ],
  "liveness vs readiness?": [
    "Liveness says if container should be restarted because it is unhealthy.",
    "Readiness says if container is ready to receive traffic.",
    "Use both so Kubernetes avoids routing traffic to half-initialized instances."
  ]
};

function buildFallbackAnswer(question, category) {
  const q = question.toLowerCase();
  const normalized = q.trim();

  if (COMPARISON_ANSWERS[normalized]) {
    return COMPARISON_ANSWERS[normalized];
  }

  const shortTerm = question.replace(/\?$/, "").toLowerCase();
  if (TERM_DEFINITIONS[shortTerm]) {
    return [
      TERM_DEFINITIONS[shortTerm],
      "Use it as one part of a larger production architecture, not as a standalone solution.",
      "Mention security, monitoring, and cost implications when discussing it in interviews."
    ];
  }

  if (q.startsWith("what is ")) {
    const concept = question.replace(/^What is /i, "").replace(/\?$/, "");
    return [
      `${concept} is a core concept in ${category.name}.`,
      "In practical terms, explain what problem it solves in a real system.",
      "Then describe one implementation example and one production risk to monitor."
    ];
  }
  if (q.includes("difference") || q.includes("vs")) {
    return [
      "Compare by: purpose, performance, operational complexity, and cost.",
      "Choose the simpler option when it meets reliability and scale needs.",
      "State one clear example where each option is the better fit."
    ];
  }
  if (q.startsWith("how do you") || q.startsWith("how would you")) {
    return [
      "Start by defining goal, constraints, and success metrics.",
      "Design a step-by-step implementation with validation, retries, observability, and security.",
      "Add a failure strategy and explain trade-offs between speed, cost, and reliability."
    ];
  }
  if (q.startsWith("design ")) {
    return [
      "Clarify requirements, workload shape, latency SLOs, and compliance needs first.",
      "Propose modular components: API layer, orchestration layer, data layer, and observability.",
      "Explain scaling strategy, failure handling, and cost controls.",
      "Close with trade-offs and phased rollout plan."
    ];
  }
  return [
    "Give a direct definition first in simple terms.",
    "Add one practical implementation view.",
    "Add one production risk and how to handle it."
  ];
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
    "vector"
  ].forEach((term) => {
    if (lowered.includes(term)) tokens.add(term);
  });
  return Array.from(tokens);
}

const QUESTIONS = QUESTION_BANK.map((item, index) => {
  const category = CATEGORIES.find((entry) => entry.id === item.categoryId);
  const answer =
    DEEP_ANSWERS[item.question] ||
    EXPLICIT_ANSWERS[item.question] ||
    buildFallbackAnswer(item.question, category);
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
    codeExample: DEEP_CODE[item.question] || CODE_EXAMPLES[item.question] || null
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
