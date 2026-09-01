// Section 8, 9, 10, 11: Cloud Architecture - AWS, Azure, GCP & Multi-Cloud (46 Questions - Deep, 5-YOE Level Study Answers & Code Samples)

export const CLOUD_ANSWERS = {
  /* ---------------- Section 8: AWS ---------------- */
  "EC2 vs Lambda?": [
    "EC2: Full VM control (OS, kernel, custom hardware/GPUs). Best for long-running, continuous compute, persistent WebSocket connections, large in-memory model caches, and custom C++/CUDA runtimes.",
    "AWS Lambda: Serverless, event-driven ephemeral compute scaling instantly per request (max 15-minute execution). Ideal for lightweight webhook handlers, S3 event ingestion triggers, and bursty glue tasks.",
    "Cost Model: EC2 is billed per instance-hour (steady workloads); Lambda is billed per execution millisecond + memory allocated.",
    "GenAI Context: Use Lambda for S3 document upload triggers and small preprocessing tasks; use EC2/ECS for FastAPI inference proxies, heavy OCR, and embedding pipelines."
  ],
  "ECS vs EKS?": [
    "AWS ECS (Elastic Container Service): AWS-native container orchestrator. Simpler operational model, lower cognitive overhead, zero master-node management costs, and seamless integration with IAM roles, CloudWatch, and ALB.",
    "AWS EKS (Elastic Kubernetes Service): Managed upstream Kubernetes. Standard K8s APIs, multi-cloud portability, rich open-source ecosystem (Helm, KEDA, Istio), and advanced scheduling controls.",
    "Decision Rule: Choose ECS if your team is AWS-native and wants minimal DevOps maintenance. Choose EKS if you already run Kubernetes infrastructure or require complex mesh/custom resource controllers."
  ],
  "S3 vs EFS?": [
    "Amazon S3: Highly durable (11 9s), scalable object storage accessible via REST API. Best for raw document storage (PDFs, images), training data lake, and static web assets.",
    "Amazon EFS: Managed POSIX network file system that can be mounted concurrently by hundreds of EC2 instances or Lambda functions. Best for shared local file access, model weight caching, and persistent legacy app storage.",
    "RAG Architecture: Documents land in S3, metadata points to S3 object keys; EFS is rarely needed for modern vector-based RAG."
  ],
  "API Gateway?": [
    "Role: Managed front door handling TLS termination, API routing, rate limiting/usage plans, API key validation, and authentication (Cognito, IAM, or custom Lambda authorizers).",
    "Timeouts: Hard 29-second integration timeout. Long-running LLM generation requests (>30s) must use WebSocket APIs or asynchronous worker queues behind it.",
    "Protections: Native WAF integration and token-bucket throttling to shield expensive downstream LLM infrastructure from DDoS attacks."
  ],
  "IAM?": [
    "Core Concept: Identity and Access Management controlling authentication and authorization for AWS resources.",
    "IAM Roles for Service Accounts (IRSA) / Task Roles: Assign least-privilege IAM roles directly to ECS Tasks or EKS Pods so applications obtain short-lived credentials automatically via AWS STS, eliminating static hardcoded API keys.",
    "Policy Best Practices: Grant specific resource ARNs and exact actions (e.g. `s3:GetObject` on `arn:aws:s3:::company-docs/*` only) rather than broad wildcards."
  ],
  "Secrets Manager?": [
    "Role: Secure encrypted key-value store for database credentials, third-party LLM API keys (OpenAI/Anthropic), and JWT signing secrets.",
    "Features: Built-in automatic rotation using Lambda functions, cross-account sharing, and fine-grained IAM policy enforcement.",
    "Caching: Applications should fetch and cache secrets in memory on startup with periodic TTL refreshes to minimize Secrets Manager API call costs."
  ],
  "CloudWatch?": [
    "Observability Suite: CloudWatch Metrics (CPU, memory, request counts), CloudWatch Logs (structured JSON application logs), and CloudWatch Alarms.",
    "Custom GenAI Metrics: Publish custom metrics: `TokensConsumedPerMinute`, `LLMGenerationLatencyP95`, `RetrievalHitRate`, `ProviderErrorCount`.",
    "Alarms: Trigger SNS alerts or auto-scaling policies when error rates exceed 2% or when token budgets hit warning thresholds."
  ],
  "SQS vs SNS?": [
    "Amazon SQS: Distributed message queue (Pull model). Decouples producers from consumers, provides message buffering, retry mechanisms, and Dead-Letter Queues (DLQ) for failed jobs.",
    "Amazon SNS: Pub/Sub broadcast notification service (Push model). Fans out a single message to multiple subscribers (email, SMS, Lambda, SQS queues).",
    "Fan-Out Pattern (SNS -> SQS): Document uploaded -> SNS publishes event -> 2 separate SQS queues receive copies (one for text extraction/vector indexing, one for compliance auditing)."
  ],
  "RDS vs DynamoDB?": [
    "Amazon RDS (PostgreSQL/Aurora): Relational database supporting ACID transactions, complex relational JOINs, foreign keys, and vector search via `pgvector`.",
    "Amazon DynamoDB: Single-digit millisecond NoSQL key-value/document store with automatic horizontal scaling to any throughput volume.",
    "GenAI Mapping: Use RDS/Aurora for complex document relational metadata, user management, and vector search; use DynamoDB for high-throughput chat session history and message caching."
  ],
  "What is Bedrock?": [
    "Amazon Bedrock: AWS's fully managed foundation model platform offering unified API access to leading models (Anthropic Claude, Meta Llama, Mistral, Amazon Titan).",
    "Key Advantages: Zero data leaves the customer's AWS boundary (models run in private AWS infrastructure), native IAM role authorization, no public API keys needed, and HIPAA/SOC compliance.",
    "Additional Features: Bedrock Knowledge Bases (managed RAG), Bedrock Agents (orchestration), and Bedrock Guardrails (PII masking and prompt injection filtering)."
  ],
  "How would you deploy an LLM application on AWS?": [
    "Architecture Blueprint:",
    "1. Ingress & Edge: Route 53 DNS -> CloudFront CDN -> AWS WAF -> Application Load Balancer / API Gateway.",
    "2. Compute Layer: FastAPI microservice running on Amazon ECS Fargate (or EKS) in private subnets.",
    "3. LLM Layer: Amazon Bedrock (Anthropic Claude 3.5 Sonnet / Llama 3) accessed via IAM role over AWS PrivateLink VPC endpoints.",
    "4. Vector & Relational Storage: Amazon OpenSearch Service (or Aurora PostgreSQL with `pgvector`) for vector chunks and RDS for relational data.",
    "5. Async Processing: S3 for raw documents -> SQS queue -> worker fleet for document parsing and embedding generation."
  ],
  "How would you build RAG using AWS services?": [
    "Ingestion: Files upload to S3 -> S3 Event triggers Lambda -> Document text extracted using Amazon Textract -> Chunks embedded with Amazon Titan / Cohere Embed -> Vectors indexed into Amazon OpenSearch Serverless.",
    "Retrieval & Generation: User queries FastAPI on ECS -> ECS embeds query and performs hybrid search on OpenSearch -> Retrieved chunks injected into prompt -> Prompt sent to Amazon Bedrock (Claude 3.5) -> Streamed answer returned to user.",
    "Security: All data encrypted at rest with AWS KMS; all inter-service traffic stays inside VPC."
  ],
  "How would you store documents in S3 and process them?": [
    "Bucket Structure: Separate buckets/prefixes: `s3://company-rag-raw/{tenant_id}/{doc_id}/original.pdf` and `s3://company-rag-curated/{tenant_id}/{doc_id}/chunks.parquet`.",
    "Event-Driven Ingestion: S3 ObjectCreated event sends message to SQS queue.",
    "Worker Processing: ECS worker container polls SQS, reads raw PDF, executes layout-aware parsing, generates embeddings, writes vectors to OpenSearch, and updates document status in DynamoDB/RDS.",
    "Lifecycle Rules: Move raw documents to S3 Glacier Flexible Retrieval after 90 days to optimize storage costs."
  ],
  "How would you scale your inference/API layer?": [
    "Horizontal Autoscaling: ECS Target Tracking scaling on `ALBRequestCountPerTarget` (e.g. scale up when average requests > 50 req/sec per container).",
    "Asynchronous Decoupling: Non-interactive generation tasks push to SQS and execute on background workers, keeping API pods responsive.",
    "Cross-Region Model Resilience: Use Bedrock Cross-Region Inference profiles to automatically route requests across multiple AWS regions when primary region experiences capacity limits.",
    "Caching: Cache common query embeddings and LLM answers in Amazon ElastiCache (Redis)."
  ],
  "How would you secure an AWS GenAI application?": [
    "Network Isolation: Run all containers, databases, and OpenSearch clusters in Private Subnets with no public IPs. Reach Bedrock, S3, and Secrets Manager via AWS VPC Endpoints (PrivateLink).",
    "Authentication & IAM: Enforce OAuth2 / Cognito JWT authentication at API Gateway. Use IAM Task Roles for least-privilege service access with zero static credentials.",
    "Data Encryption: Encrypt S3 buckets, OpenSearch indexes, and RDS databases with Customer-Managed Keys (KMS CMK).",
    "GenAI Guardrails: Enable Amazon Bedrock Guardrails to block prompt injection attacks and redact sensitive PII before model processing."
  ],
  "Design a production RAG application on AWS.": [
    "End-to-End Enterprise Design:",
    "Edge: Route 53 + CloudFront + AWS WAF protecting API endpoints from bot attacks.",
    "API Layer: FastAPI on ECS Fargate deployed across 3 Availability Zones behind an Application Load Balancer.",
    "Async Ingestion Pipeline: S3 Bucket -> SQS -> Worker Tasks running PyMuPDF/Textract -> Embeddings via Bedrock Titan -> OpenSearch Serverless Hybrid Index.",
    "Real-time Query Path: API receives request -> Embeds query -> OpenSearch Hybrid Search (BM25 + Dense) with Tenant Metadata Filter -> Rerank with Cohere on Bedrock -> Stream generation from Bedrock Claude 3.5 Sonnet -> Stream to user via SSE.",
    "Data & Caching: RDS PostgreSQL for user/tenant ACLs, ElastiCache Redis for semantic caching and token rate limiting.",
    "Observability: CloudWatch Logs/Metrics, AWS X-Ray distributed tracing, and automated Ragas evaluation pipeline in CI/CD."
  ],

  /* ---------------- Section 9: Azure ---------------- */
  "Azure OpenAI?": [
    "Enterprise Managed OpenAI: Microsoft's managed offering of OpenAI models (GPT-4o, text-embedding-3) running within Azure's enterprise security and compliance boundary.",
    "Enterprise Differentiators: Private networking via Azure Private Link (no public internet traversal), customer-managed encryption keys (CMK), data residency guarantees in specified Azure regions, and zero customer data retained for public model training.",
    "Capacity Management (PTUs): Offers Provisioned Throughput Units for reserved GPU throughput, guaranteeing consistent latency and eliminating HTTP 429 rate limit throttling during peak enterprise load.",
    "Ecosystem Integration: Seamless native integration with Azure AI Search ('Azure OpenAI On Your Data'), Azure Key Vault, and Microsoft Entra ID (Azure AD) Managed Identities."
  ],
  "Azure AI Search?": [
    "Enterprise Hybrid Search Engine: Managed PaaS search service combining BM25 keyword matching, dense vector search, and integrated Semantic Reranking (powered by Bing's multi-head cross-encoders).",
    "Automated Document Cracking & AI Skills: Built-in indexers pull documents directly from Azure Blob Storage with automated OCR, layout analysis, table extraction, and chunking.",
    "Security Trimming: Native integration with Microsoft Entra ID allows indexing security group ACLs and pre-filtering search queries based on user group memberships.",
    "Scale & Performance: Scales to billions of vectors with partitioned sharding, multi-replica high availability, and sub-second query latency."
  ],
  "Azure Functions?": [
    "Serverless Event-Driven Compute: Executes lightweight Python code in response to platform events with automatic scaling.",
    "Event Integrations: Directly triggered by Azure Blob Storage uploads, Azure Service Bus queue messages, Event Grid events, and HTTP requests.",
    "GenAI Architecture Role: Acts as the event ingestion trigger that captures document upload events in Blob Storage and dispatches indexing tasks to Container Apps or Service Bus queues."
  ],
  "Azure Container Apps?": [
    "Managed Serverless Container Platform: Built on top of AKS and KEDA, providing serverless container hosting without the complexity of managing Kubernetes control planes.",
    "Autoscaling Triggers: Scales dynamically based on HTTP request concurrency, CPU/RAM utilization, or Azure Service Bus queue depth (scaling from zero to hundreds of replicas).",
    "GenAI Fit: The primary Azure host for FastAPI microservices, MCP servers, and background document processing workers."
  ],
  "AKS?": [
    "Azure Kubernetes Service: Enterprise-grade managed upstream Kubernetes on Azure.",
    "When to Choose Over Container Apps: Required for complex multi-microservice meshes (Istio), custom GPU node pools (NVIDIA A100/H100) for self-hosting open-source LLMs (vLLM, Ollama), and advanced network security policies (Azure CNI).",
    "Security: Integrates with Microsoft Entra ID Workload Identity to eliminate static service account keys."
  ],
  "Azure Blob Storage?": [
    "Enterprise Object Storage: Highly available, durable, and cost-effective object storage for unstructured enterprise data (raw PDFs, images, dataset exports).",
    "Access Tiers: Hot (active data), Cool (infrequent access), Cold, and Archive (long-term compliance storage) with automated lifecycle policies.",
    "Security: Enforces Azure Active Directory IAM, Customer-Managed Keys (SSE with CMK), and Private Endpoints."
  ],
  "Azure Key Vault?": [
    "Hardware-Backed Security Store: Secure repository for secrets, API tokens, database connection strings, and cryptographic TLS certificates.",
    "Zero-Password Pattern: Container Apps and Azure Functions authenticate to Key Vault using Managed Identity (RBAC), eliminating hardcoded secrets from code, environment variables, or Git.",
    "Compliance: FIPS 140-2 Level 2 and Level 3 validation with full audit access logging in Log Analytics."
  ],
  "Azure Service Bus?": [
    "Enterprise Message Broker: Fully managed asynchronous messaging service featuring queues (point-to-point) and topics (publish-subscribe).",
    "Production Guarantees: FIFO message delivery ordering, automatic duplicate detection, transaction support, and Dead-Letter Queues (DLQ) for failed document processing tasks."
  ],
  "Azure Monitor?": [
    "Unified Observability Platform: Combines Application Insights (APM distributed tracing and live metrics) with Log Analytics (centralized structured querying).",
    "GenAI Telemetry: Auto-instruments Python FastAPI services, tracking HTTP dependency latency, P95 response times, database query durations, and exception stack traces."
  ],
  "Managed Identity?": [
    "Elimination of Static Credentials: Assigns an automatic identity in Microsoft Entra ID to Azure resources (Container Apps, VMs, Functions).",
    "How It Works: Applications request short-lived Azure AD tokens from the local metadata endpoint to authenticate directly with Azure OpenAI, Azure AI Search, and Key Vault without storing client IDs or secret strings.",
    "Senior Principle: 'The most secure credential is the one that was never created in the first place.'"
  ],
  "How would you build RAG using Azure OpenAI + AI Search?": [
    "1. Ingestion: Documents upload to Azure Blob Storage -> Event triggers Azure Function -> Ingested and parsed by Azure AI Search with text-embedding-3-large embeddings.",
    "2. Search & Security Trimming: FastAPI on Container Apps receives user query -> Queries Azure AI Search with Hybrid Search (BM25 + Vector) + Semantic Reranker -> Azure AI Search filters by user's Entra ID group permissions.",
    "3. Generation: Top chunks injected into Azure OpenAI (GPT-4o deployment) over Private Endpoint -> Answer streamed back to client via SSE with source citations."
  ],
  "Azure OpenAI vs OpenAI API?": [
    "Azure OpenAI: Guaranteed SLAs, enterprise Microsoft contracts, regional data residency within customer VNet, Private Endpoints, Entra ID RBAC, PTU capacity reservations. Best for enterprise compliance.",
    "OpenAI Public API: Faster access to early preview models and experimental features, direct developer self-service, but runs over public endpoints and lacks Azure-native enterprise VNet integration."
  ],
  "How would you secure Azure OpenAI?": [
    "Disable Public Network Access: Enforce traffic to flow exclusively through Azure Private Endpoints inside a private Virtual Network (VNet).",
    "Identity Authentication: Authenticate API requests using Microsoft Entra ID Managed Identities and Azure RBAC (`Cognitive Services OpenAI User`) instead of static API keys.",
    "Content Safety: Enable Azure AI Content Safety filters to automatically detect prompt injection, jailbreaks, hate speech, and PII."
  ],
  "How would you deploy FastAPI to Azure?": [
    "Deploy to Azure Container Apps: 1) Build container image and push to Azure Container Registry (ACR), 2) Create Container App with Managed Identity granted ACR Pull rights, 3) Configure ingress on port 8000, 4) Configure autoscaling (min replicas: 1, max: 20) with HTTP concurrency rules, 5) Interconnect with Azure OpenAI via Private Endpoints."
  ],
  "How would you implement enterprise RAG on Azure?": [
    "End-to-End Enterprise Architecture: Azure Container Apps (FastAPI) + Azure AI Search (Hybrid + Semantic Ranker) + Azure OpenAI (GPT-4o) + Azure Key Vault + Application Insights.",
    "Security: All components interconnected via Private Endpoints; authentication governed by Microsoft Entra ID with document-level security group ACL filtering in Azure AI Search."
  ],

  /* ---------------- Section 10: GCP ---------------- */
  "Vertex AI?": [
    "GCP's Unified AI/ML Platform: Fully managed platform providing API access to Google's Gemini models, Imagen, Model Garden (open models like Llama 3, Mistral), Vertex Vector Search, and Feature Store.",
    "Enterprise Features: Zero customer data used for model training, VPC Service Controls, Customer-Managed Encryption Keys (CMEK), and Grounding with Google Search or custom enterprise data."
  ],
  "Gemini?": [
    "Google's Flagship Multimodal Model Family: Native multimodal reasoning across text, code, audio, image, and video without separate external encoder pipelines.",
    "Industry-Leading Context Window: Up to 2 million tokens in Gemini 1.5 Pro, enabling ingestion of entire codebases, hour-long videos, or massive document libraries in a single prompt.",
    "Model Tiers: Gemini 1.5 Pro (complex multi-step reasoning) and Gemini 1.5 Flash (ultra-fast, cost-effective high-throughput tasks)."
  ],
  "Cloud Run?": [
    "GCP's Serverless Container Platform: Deploys containerized web applications scaling automatically from zero to thousands of instances based on incoming request concurrency.",
    "Streaming: Native support for HTTP/2 and Server-Sent Events (SSE) streaming, making it the premier GCP choice for FastAPI LLM services.",
    "Cost Model: Pay only while requests are actively being processed, with configurable min-instances to eliminate cold starts."
  ],
  "GKE?": [
    "Google Kubernetes Engine: The industry-leading managed Kubernetes service on GCP.",
    "When to Choose: Required for complex microservice architectures, custom service meshes (Istio), persistent volumes, and orchestrating self-hosted open-source LLMs across GPU (NVIDIA H100/A100) node pools with GKE Autopilot."
  ],
  "Cloud Functions?": [
    "GCP Serverless Event-Driven Compute: Executes Python functions in response to Cloud Storage uploads, Pub/Sub messages, or HTTP calls (equivalent to AWS Lambda). Best for asynchronous ingestion triggers."
  ],
  "Cloud Storage?": [
    "Durable & Scalable Object Storage (GCS): Stores raw PDFs, images, training datasets, and model checkpoints with multi-region redundancy and lifecycle management."
  ],
  "BigQuery?": [
    "Serverless Analytics Data Warehouse: Petabyte-scale SQL database with built-in BigQuery ML and native Vector Search capabilities, enabling similarity search and ML inference directly inside SQL queries."
  ],
  "Vertex AI Vector Search?": [
    "Managed High-Performance Vector Database (formerly ScaNN): Delivers sub-millisecond approximate nearest neighbor search at billion-scale vector volume with state-of-the-art recall and latency."
  ],
  "Secret Manager?": [
    "Secure Key-Value Store: Stores API keys, database credentials, and certificates with fine-grained Cloud IAM access control and automatic secret versioning."
  ],
  "Pub/Sub?": [
    "Globally Distributed Messaging Middleware: Ingestion pipeline message broker providing at-least-once message delivery, automatic scaling, and dead-letter topics for asynchronous document processing."
  ],
  "How would you deploy a FastAPI GenAI application on GCP?": [
    "1. Build & Push: Build container image and push to Google Artifact Registry.",
    "2. Cloud Run Deployment: Deploy container to Cloud Run with dedicated Service Account assigned `Vertex AI User` and `Secret Manager Secret Accessor` IAM roles.",
    "3. Concurrency & Networking: Configure instance concurrency (e.g. 80 requests/container), set min-instances to 1 (zero cold starts), and place behind Cloud Load Balancing with Cloud Armor WAF."
  ],
  "How would you build RAG using Vertex AI?": [
    "1. Ingestion: Documents upload to Cloud Storage -> Cloud Function extracts text -> Embeds using `text-embedding-004` -> Upserts into Vertex AI Vector Search.",
    "2. Query Path: Cloud Run FastAPI receives query -> Executes ANN search on Vertex Vector Search -> Injects retrieved chunks into Gemini 1.5 Pro prompt -> Streams answer to client via SSE."
  ],
  "Cloud Run vs GKE?": [
    "Cloud Run: Zero cluster management, serverless scaling to zero, simpler operational model, lower cost for standard stateless web APIs and LLM streaming proxies.",
    "GKE: Required when you need dedicated GPU hardware node pools for self-hosted models, custom service meshes, persistent volumes, or multi-container pod scheduling."
  ],
  "How would you scale an AI application on GCP?": [
    "Configure Cloud Run concurrency (80 concurrent requests per container instance), set min-instances to prevent cold starts, use Vertex AI Vector Search for horizontal retrieval scale, offload background jobs to Cloud Tasks / Pub/Sub, and cache hot embeddings in Memorystore (Redis)."
  ],

  /* ---------------- Section 11: Multi-Cloud Architecture ---------------- */
  "How would you design the same GenAI application to run on AWS, Azure and GCP?": [
    "Architecture Philosophy - The Abstraction Layer:",
    "1. Provider-Agnostic Core: Application business logic, agent workflows, and prompt templates are completely abstracted from underlying cloud SDKs.",
    "2. Pluggable Adapters: Implement standard interfaces: `LLMProvider` (Bedrock / Azure OpenAI / Vertex AI), `VectorStore` (OpenSearch / Azure AI Search / Vertex Vector Search), `ObjectStore` (S3 / Blob / GCS), `SecretsProvider` (Secrets Manager / Key Vault / Secret Manager).",
    "3. Standardized Messaging: Use normalized chat message schemas (OpenAI-compatible) translated in the adapter layer.",
    "4. Infrastructure as Code (IaC): Terraform modules deploy the identical containerized FastAPI app into AWS ECS, Azure Container Apps, or GCP Cloud Run depending on client deployment preference.",
    "5. Unified Evaluation: A single golden evaluation suite runs against all cloud adapters in CI/CD to verify consistent answer quality."
  ]
};

export const CLOUD_CODE = {
  "How would you design the same GenAI application to run on AWS, Azure and GCP?": {
    language: "python",
    code: `from typing import Protocol, AsyncIterator
import os

class LLMProvider(Protocol):
    async def stream_completion(self, prompt: str) -> AsyncIterator[str]: ...

class AWSBedrockAdapter:
    def __init__(self):
        import boto3
        self.client = boto3.client("bedrock-runtime", region_name="us-east-1")
    async def stream_completion(self, prompt: str):
        # AWS Bedrock Invocation
        yield "Bedrock response token"

class AzureOpenAIAdapter:
    def __init__(self):
        from openai import AsyncAzureOpenAI
        self.client = AsyncAzureOpenAI(
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            api_version="2024-06-01"
        )
    async def stream_completion(self, prompt: str):
        # Azure OpenAI Invocation
        yield "Azure response token"

class GCPVertexAIAdapter:
    def __init__(self):
        import vertexai
        from vertexai.generative_models import GenerativeModel
        vertexai.init(project=os.getenv("GCP_PROJECT"))
        self.model = GenerativeModel("gemini-1.5-pro")
    async def stream_completion(self, prompt: str):
        # GCP Vertex AI Invocation
        yield "Vertex response token"

def get_cloud_llm_provider() -> LLMProvider:
    cloud = os.getenv("CLOUD_PROVIDER", "aws").lower()
    if cloud == "aws": return AWSBedrockAdapter()
    elif cloud == "azure": return AzureOpenAIAdapter()
    elif cloud == "gcp": return GCPVertexAIAdapter()
    raise ValueError(f"Unsupported cloud: {cloud}")`
  }
};
