// Section 12 & 13: Containers (Docker/K8s) & LLMOps / Production (32 Questions - Deep, 5-YOE Level Study Answers & Code Samples)

export const OPS_ANSWERS = {
  /* ---------------- Section 12: Docker / Kubernetes ---------------- */
  "What is Docker?": [
    "Core Concept: An open-source platform that packages applications and their complete runtime dependencies (Python version, system libraries, C-extensions) into immutable, portable container images.",
    "OS-Level Virtualization: Containers share the host Linux kernel while running in isolated user spaces using Linux cgroups (resource constraints) and namespaces (process/network isolation).",
    "Benefits: Eliminates 'works on my machine' environmental drift between local development, CI/CD pipelines, and multi-cloud Kubernetes clusters.",
    "GenAI Context: Essential for packaging consistent environments with complex dependencies like CUDA runtime, PyTorch, Tokenizers, and FastMCP servers."
  ],
  "Image vs container?": [
    "Docker Image: An immutable, read-only template composed of layered file systems. Built from a Dockerfile and stored in container registries (ECR, ACR, Docker Hub).",
    "Docker Container: A running, stateful instance of an image. Adds a thin read/write layer on top of the immutable image layers to execute application processes.",
    "Analogy: An Image is a class; a Container is an instantiated object in memory."
  ],
  "Dockerfile optimization?": [
    "1. Multi-Stage Builds: Use a builder stage to compile dependencies and copy only clean virtualenvs to a minimal runtime stage.",
    "2. Layer Caching Order: Copy `requirements.txt` / `pyproject.toml` and run `pip install` BEFORE copying source code so code edits don't invalidate dependency caches.",
    "3. Minimal Base Images: Use `python:3.12-slim` (or distroless) instead of full Ubuntu images to reduce image size from 1.2 GB to ~180 MB and minimize CVE vulnerability footprint.",
    "4. Clean Package Caches: Combine `apt-get update && apt-get install -y --no-install-recommends ... && rm -rf /var/lib/apt/lists/*` and use `pip install --no-cache-dir`.",
    "5. Security Hardening: Run as a non-root user (`USER appuser`) and add a `.dockerignore` file."
  ],
  "Multi-stage builds?": [
    "Mechanism: Multiple `FROM` statements in a single Dockerfile. Early stages compile code, install C-compilers (gcc, g++), and build wheels; final stage copies only the built artifacts into a slim base image.",
    "Benefits: 1) Dramatically smaller final image size (faster pod autoscaling pull times in K8s), 2) Zero build-time compilers or secrets left in final production container.",
    "Example: Build stage installs PyTorch and dependencies; runtime stage copies only `/venv` and source code."
  ],
  "Docker networking?": [
    "Network Modes: 1) Bridge (default - container gets private IP on bridge network), 2) Host (container shares host's network namespace, zero network isolation, highest speed), 3) None (fully isolated, no network access).",
    "Container Name DNS: Containers on the same user-defined bridge network resolve each other by container name (e.g., `fastapi-app` reaches Redis via `redis:6379`).",
    "Port Mapping: `-p 8000:8000` maps host port to container port via iptables NAT rules."
  ],
  "Kubernetes pod?": [
    "Atomic Unit: The smallest deployable computing unit in Kubernetes, representing a single instance of a running process in your cluster.",
    "Shared Resources: All containers inside a pod share the same Network namespace (same IP address, reach each other over `localhost`), IPC namespace, and mounted storage Volumes.",
    "Sidecar Pattern: Common in AI architectures (e.g. main FastAPI app container + logging/telemetry forwarder or Envoy proxy sidecar).",
    "Ephemeral Nature: Pods are designed to be mortal; they are created, scaled, and destroyed dynamically by controllers."
  ],
  "Deployment?": [
    "Controller Role: Declarative manager for Pods and ReplicaSets. Ensures a specified number of identical pod replicas are running and healthy across cluster nodes.",
    "Key Capabilities: 1) Automated rolling updates with zero downtime, 2) Rollback to previous revisions (`kubectl rollout undo`), 3) Self-healing (restarts failed pods, reschedules pods if a worker node crashes).",
    "Configuration: Specifies container images, environment variables (from ConfigMaps/Secrets), resource requests/limits, and health probes."
  ],
  "Service?": [
    "Abstraction: An immutable network abstraction providing a stable IP address and DNS name (`http://my-service.namespace.svc.cluster.local`) in front of a dynamic set of Pods matching a label selector.",
    "Service Types: 1) ClusterIP (default - internal cluster-only traffic), 2) NodePort (exposes static port on each node), 3) LoadBalancer (provisions cloud-provider LB like AWS ALB).",
    "Load Balancing: Automatically distributes traffic across all pods that pass their Readiness Probes."
  ],
  "ConfigMap?": [
    "Role: Decouples non-confidential configuration artifacts from container image binaries.",
    "Usage: Injected into pods as environment variables, command-line arguments, or mounted as configuration files in a volume.",
    "Dynamic Updates: Updating a mounted ConfigMap updates files inside running pods without rebuilding images."
  ],
  "Secret?": [
    "Role: Securely stores sensitive data (API keys, database passwords, TLS certificates).",
    "Security Caveat: Standard Kubernetes Secrets are only Base64-encoded, not encrypted by default. Production requires enabling Encryption at Rest in etcd and using External Secrets Operator (syncing from AWS Secrets Manager / Azure Key Vault).",
    "Injection: Mounted as read-only tmpfs memory files or environment variables."
  ],
  "Ingress?": [
    "Role: Layer 7 HTTP/HTTPS reverse proxy and load balancer that routes external internet traffic to internal Kubernetes Services based on hostnames and URL paths.",
    "Features: SSL/TLS termination (cert-manager), URL rewriting, path-based routing (`/api/v1` -> `api-svc`), and rate limiting.",
    "Ingress Controllers: Implemented by NGINX Ingress, Traefik, AWS Load Balancer Controller, or Envoy-based Gateway APIs."
  ],
  "Horizontal Pod Autoscaler?": [
    "Role: Automatically scales the number of Pod replicas in a Deployment up or down based on observed resource utilization.",
    "Metrics: Default scales on CPU / Memory utilization; for AI services, best practice is scaling on Custom Metrics (e.g., HTTP request concurrency or SQS queue depth via KEDA).",
    "Formula: `Desired Replicas = ceil(Current Replicas * (Current Metric Value / Target Metric Value))`."
  ],
  "Liveness vs readiness?": [
    "Liveness Probe: Determines if container is healthy and operational. If failed -> Kubernetes kills container and restarts it according to `restartPolicy`.",
    "Readiness Probe: Determines if container is ready to accept user traffic. If failed -> Kubernetes removes pod IP from Service endpoints so no traffic routes to it (pod is NOT killed).",
    "Startup Probe: Protects slow-starting applications (e.g. loading large PyTorch models) by disabling liveness checks until initialization completes."
  ],
  "How would you deploy FastAPI on Kubernetes?": [
    "Architecture Manifests: 1) Deployment with 3 replicas, resource requests (`cpu: 500m, memory: 512Mi`), limits (`cpu: 2, memory: 2Gi`), liveness probe (`/health/live`), readiness probe (`/health/ready`), 2) ConfigMap for application settings, 3) ExternalSecret syncing LLM keys, 4) Service (ClusterIP), 5) Ingress with TLS, 6) HPA targeting 70% CPU or concurrency.",
    "Zero-Downtime Rolling Updates: Set `strategy.rollingUpdate: {maxSurge: 25%, maxUnavailable: 0}`."
  ],
  "How would you scale an LLM application?": [
    "1. API Proxy Layer Scaling: Scale FastAPI pods horizontally on Kubernetes using HPA/KEDA based on concurrent active connections and incoming request rate.",
    "2. Asynchronous Decoupling: Non-interactive tasks push to SQS/Kafka and process via Celery/ARQ workers scaling on queue backlog length.",
    "3. LLM Provider Throttling & Multi-Region: Distribute requests across multiple provider deployments and regions with token-bucket rate limiters and circuit breakers.",
    "4. Semantic & Embedding Caching: Cache repeated queries in Redis to bypass LLM inference completely for 20-40% of standard traffic.",
    "5. Vector Database Sharding: Scale vector search across read replicas with HNSW index partitioning."
  ],
  "How do you handle model/API credentials in Kubernetes?": [
    "1. Cloud Secrets Store as Source of Truth: Store API keys in AWS Secrets Manager, Azure Key Vault, or GCP Secret Manager.",
    "2. External Secrets Operator (ESO): Deploy ESO in cluster to continuously sync cloud secrets into native Kubernetes `Secret` objects.",
    "3. Workload Identity (No Static Keys): Configure Pod ServiceAccounts with IAM roles (IRSA on EKS, Workload Identity on GKE/AKS) to access cloud services (Bedrock, S3) using temporary STS tokens.",
    "4. In-Memory Injection: Mount secrets as memory-backed volume files (`/var/run/secrets`) rather than plain text environment variables to prevent accidental leak in process dumps."
  ],
  "How do you perform zero-downtime deployment?": [
    "1. Rolling Update Strategy: Configure Deployment `maxUnavailable: 0` and `maxSurge: 1` so new pods boot and pass readiness probes before old pods receive termination signals.",
    "2. Graceful Shutdown (SIGTERM Handling): The application must intercept SIGTERM, stop accepting new HTTP requests, complete in-flight LLM generations within `terminationGracePeriodSeconds` (e.g. 60s), and close database pools cleanly.",
    "3. Backward-Compatible Database Migrations: Use the Expand-Contract pattern (Add nullable columns first -> Deploy new code -> Backfill data -> Contract old schema)."
  ],

  /* ---------------- Section 13: LLMOps / Production ---------------- */
  "How do you monitor an LLM application?": [
    "Three-Pillar Monitoring Architecture:",
    "1. System Metrics (APM): Request throughput (RPS), P50/P95/P99 latency, HTTP error rate (4xx/5xx), container CPU/memory.",
    "2. LLM Operational Telemetry: Token counts (Prompt vs Completion), Token Cost ($/request & $/tenant), Time-to-First-Token (TTFT), Tokens-Per-Second (TPS), Model provider error & fallback rates.",
    "3. Quality & Evaluation Telemetry: Faithfulness (Groundedness), Answer Relevance, Context Recall, User Feedback (Thumbs Up/Down, edits).",
    "Tooling: OpenTelemetry + Prometheus + Grafana + Langfuse/LangSmith/Arize Phoenix."
  ],
  "What metrics do you track?": [
    "Core Golden Signals for GenAI:",
    "1. TTFT (Time to First Token): Measures streaming latency perceived by the user (<800ms target).",
    "2. Generation Latency & Throughput: Tokens generated per second.",
    "3. Token Consumption & Cost: Ingested tokens, generated tokens, dollar cost per user session.",
    "4. Groundedness / Faithfulness Score: Automated percentage of factual claims backed by context.",
    "5. Tool Error & Abort Rate: Percentage of agent tool executions that fail or enter loops.",
    "6. Provider Availability & Fallback Rate: Frequency of failover to backup LLM models."
  ],
  "How do you track token consumption?": [
    "Middleware & Trace Extraction: Extract `usage.prompt_tokens` and `usage.completion_tokens` from provider API response objects in the application adapter layer.",
    "Structured Log Injection: Include token counts, model name, and tenant ID in structured log records for every completion call.",
    "Metrics Aggregation: Increment Prometheus counters `llm_tokens_total{model='gpt-4o', tenant='org_1', type='prompt'}`.",
    "Billing & Budget Alarms: Aggregate token logs in analytics (BigQuery/Athena) to track real-time spending vs monthly quotas."
  ],
  "How do you control LLM costs?": [
    "1. Intelligent Model Tiering: Route simple classification, intent routing, and extraction to small models (GPT-4o-mini, Claude 3.5 Haiku) and reserve frontier models only for complex reasoning.",
    "2. Prompt Optimization & Context Pruning: Trim excessive system prompts, eliminate conversational bloat, and retrieve only top-3 high-signal chunks.",
    "3. Semantic Caching: Cache answers to common questions in Redis using embedding similarity (similarity threshold > 0.95).",
    "4. Max Token Limits: Hardcode `max_tokens` on every completion call to prevent runaway generation.",
    "5. Hard Spending Quotas: Enforce per-tenant monthly dollar caps at the API gateway layer."
  ],
  "How do you detect hallucinations?": [
    "1. Automated Faithfulness Evaluation: Use an evaluator LLM (with structured rubric) or NLI (Natural Language Inference) model to verify if every sentence in the response is logically entailed by the provided RAG context.",
    "2. Citation Matching: Check that every claim carries a citation anchor and that cited text semantically matches the claim.",
    "3. Self-Consistency Checking: Sample 3 completions at `temperature = 0.7`; if answers contradict each other, flag as hallucination risk.",
    "4. Guardrail Classifiers: NeMo Guardrails or Llama Guard scanning output for ungrounded claims."
  ],
  "How do you evaluate prompts?": [
    "CI/CD Prompt Regression Benchmarks: Curate a dataset of 50-200 representative test cases with reference ground truth.",
    "Automated Scoring: Test new prompt variants across the benchmark suite, calculating automated scores for: 1) JSON schema adherence, 2) Answer correctness, 3) Token cost, 4) Latency.",
    "A/B Testing: Deploy prompt updates as canaries to 5% of production traffic and compare user satisfaction metrics before full rollout."
  ],
  "How do you version prompts?": [
    "Prompts as Code: Store prompt templates in Git repository version control alongside application code in structured YAML or Jinja2 files.",
    "Metadata Tracking: Each prompt file defines `id`, `version: '2.1.0'`, `model_target`, `temperature`, and `changelog`.",
    "Runtime Injection: Inject active prompt version ID into all trace spans and log records so every response in production can be traced back to the exact prompt commit."
  ],
  "How do you version models?": [
    "Explicit Model Pinning: Always pin exact dated model snapshot versions in configuration (e.g. `gpt-4o-2024-08-06`, `claude-3-5-sonnet-20241022`) instead of floating alias tags like `gpt-4o` or `latest`.",
    "Model Registry: Track self-hosted open-source model weights (HuggingFace checkpoints, fine-tuned LoRA adapters) in an artifact registry (MLflow / S3 / HuggingFace Hub) with commit hashes.",
    "Regression Validation: Run the full evaluation benchmark suite before updating model pins in production."
  ],
  "How do you perform A/B testing between models?": [
    "Deterministic Traffic Splitting: API Gateway or feature flag service (LaunchDarkly / Unleash) hashes `user_id` to route 50% of traffic to Model A (GPT-4o) and 50% to Model B (Claude 3.5 Sonnet).",
    "Comparative Observability: Tag all metrics, traces, and user feedback with `model_variant: 'variant_a'` vs `'variant_b'`.",
    "Success Criteria: Compare Faithfulness, latency P95, cost per user, and user retention/thumbs-up rate over 2 weeks with statistical significance testing before declaring a winner."
  ],
  "How do you trace an agent?": [
    "DAG Span Hierarchy: The user request creates a root trace span. Each sub-step generates a child span: 1) Plan generation, 2) Tool execution (with serialized inputs/outputs), 3) Vector retrieval, 4) Final synthesis.",
    "Trace Context Propagation: Propagate W3C TraceContext headers (`traceparent`) across microservice and async queue boundaries.",
    "Observability Platforms: Use Langfuse, LangSmith, or OpenTelemetry to inspect and replay agent reasoning trajectories."
  ],
  "What is observability in GenAI?": [
    "Definition: The ability to understand the internal state, reasoning steps, retrieval quality, and failure causes of a non-deterministic AI system from its external telemetry.",
    "The 3 Pillars of GenAI Observability: 1) Distributed Traces (step-by-step DAG visualization), 2) LLM Operational Metrics (tokens, cost, latency, TTFT), 3) Quality & Safety Telemetry (faithfulness, toxicity, user feedback).",
    "Continuous Improvement: Production traces feed directly into offline evaluation benchmark datasets to fix edge-case bugs."
  ],
  "How do you handle model failures?": [
    "Classification & Response Strategy:",
    "1. HTTP 429 (Rate Limit) -> Exponential backoff with jitter.",
    "2. HTTP 503 / Provider Outage -> Trigger circuit breaker and route immediately to fallback model provider.",
    "3. Malformed / Invalid JSON Output -> Re-prompt model with specific validation error message (Self-Correction Loop).",
    "4. Severe Timeout (>15s) -> Return graceful degraded message to user and alert on-call engineer."
  ],
  "What happens if OpenAI/Azure OpenAI/Bedrock is unavailable?": [
    "Multi-Provider Circuit Breaker Architecture: Use `pybreaker` to monitor provider error rates. If OpenAI error rate exceeds 50% over 1 minute, the circuit trips (OPEN) and all traffic automatically redirects to AWS Bedrock or Azure OpenAI via unified adapter layer.",
    "Graceful Degradation: If all cloud providers experience simultaneous outages, fall back to cached answers or return clean service unavailability messages with user-friendly retry guidance."
  ],
  "How do you implement fallback models?": [
    "Priority Chain: Define a priority list in config: `PRIMARY: OpenAI gpt-4o -> SECONDARY: Azure OpenAI gpt-4o -> TERTIARY: Bedrock Claude 3.5 Sonnet -> DEGRADED: GPT-4o-mini`.",
    "Compatibility Testing: Ensure all system prompts and tool schemas are pre-tested and validated across all fallback models in CI/CD.",
    "Telemetry: Emit metrics `llm_fallback_invoked_total{from='openai', to='bedrock'}` to alert engineering on primary provider degradation."
  ],
  "How do you implement retries without creating duplicate operations?": [
    "Idempotency Key Pattern: Every write/action request includes a unique `Idempotency-Key` (UUIDv4) generated by the client.",
    "Atomic Check in Database: Before executing, check Redis/Postgres for the key. If found, return cached response; if not found, lock key, execute action, store result, and unlock.",
    "Safe Retries: Network retries that replay the exact same idempotency key simply receive the stored result without re-executing credit card charges, database writes, or email sends."
  ]
};

export const OPS_CODE = {
  "How would you deploy FastAPI using Docker and Kubernetes?": {
    language: "yaml",
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: genai-fastapi-service
  namespace: production
  labels:
    app: genai-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: genai-api
  template:
    metadata:
      labels:
        app: genai-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
      containers:
      - name: api
        image: 123456789.dkr.ecr.us-east-1.amazonaws.com/genai-api:v1.4.2
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8000
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "2000m"
            memory: "2Gi"
        envFrom:
        - configMapRef:
            name: genai-api-config
        - secretRef:
            name: genai-api-secrets
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5`
  },
  "How do you implement retries without creating duplicate operations?": {
    language: "python",
    code: `import asyncpg
from fastapi import FastAPI, Header, HTTPException

app = FastAPI()

async def execute_idempotent_action(idempotency_key: str, action_fn, pool: asyncpg.Pool):
    async with pool.acquire() as conn:
        async with conn.transaction():
            # 1. Check if operation was already completed
            row = await conn.fetchrow(
                "SELECT status, response_json FROM idempotency_keys WHERE key = $1 FOR UPDATE",
                idempotency_key
            )
            if row and row["status"] == "COMPLETED":
                # Return previously stored result without re-running action
                return row["response_json"]

            if not row:
                await conn.execute(
                    "INSERT INTO idempotency_keys (key, status) VALUES ($1, 'IN_PROGRESS')",
                    idempotency_key
                )

            # 2. Execute the actual side-effect action
            result = await action_fn()

            # 3. Store result atomically
            await conn.execute(
                "UPDATE idempotency_keys SET status = 'COMPLETED', response_json = $2 WHERE key = $1",
                idempotency_key, result
            )
            return result`
  }
};
