// Section 2: FastAPI / Flask / REST (21 Questions - Deep, 5-YOE Level Study Answers & Code Samples)

export const FASTAPI_ANSWERS = {
  "Why would you choose FastAPI over Flask?": [
    "Native Async & Concurrency: Built on Starlette and ASGI, FastAPI handles asynchronous I/O natively with high throughput comparable to Go/Node.js, essential for streaming and high-latency LLM calls.",
    "Automated Type Validation & Serialization: Deep integration with Pydantic validates incoming request payloads, URL parameters, and headers automatically, returning standardized 422 errors for malformed inputs.",
    "Interactive OpenAPI Docs: Automatically generates Swagger UI (`/docs`) and ReDoc (`/redoc`) from Python type hints without third-party plugins.",
    "Built-in Dependency Injection: Sophisticated hierarchical DI (`Depends()`) simplifies authentication, database session scoping, rate limiting, and test mocking.",
    "Flask Comparison: Flask is a mature, minimalist WSGI framework, but requires manual assembly of Marshmallow, Flasgger, and async extensions (or Quart) for modern async GenAI workloads."
  ],
  "How does FastAPI handle asynchronous requests?": [
    "ASGI Event Loop: FastAPI runs on ASGI servers (Uvicorn / Hypercorn) driven by `asyncio`. When an endpoint is declared `async def`, it executes directly on the main event loop.",
    "`await` Concurrency: Awaiting I/O operations (HTTP calls to OpenAI, database queries) releases the thread to process other incoming HTTP requests concurrently.",
    "Synchronous `def` Handling: If an endpoint is declared as standard `def` (synchronous), FastAPI automatically offloads it to an internal `anyio` threadpool worker so it does NOT block the main async event loop.",
    "Golden Rule: Never use blocking synchronous calls (like `time.sleep()` or `requests.get()`) inside an `async def` endpoint; always use async libraries (`asyncio.sleep()`, `httpx.AsyncClient()`)."
  ],
  "What is Pydantic?": [
    "Data Validation & Parsing Library: Pydantic enforces type hints at runtime, parsing and coercing raw inputs into validated Python objects.",
    "Core Features (Pydantic V2): Rewritten in Rust for 5-50x speed improvements; features strict mode, field constraints (`Field(gt=0)`), custom validators (`@field_validator`), and computed fields (`@computed_field`).",
    "JSON Schema & Serialization: Automatically generates JSON Schemas used by FastAPI for OpenAPI generation and by LLM tool/function calling protocols.",
    "Settings Management: `pydantic-settings` provides environment variable parsing, casting, and validation for 12-factor application configuration."
  ],
  "Explain request validation in FastAPI.": [
    "Declarative Validation: Route parameters (`Path()`, `Query()`, `Header()`, `Cookie()`) and request bodies (Pydantic `BaseModel`) declare expected schemas with type annotations.",
    "Automated 422 Unprocessable Entity: If a payload fails validation (e.g. string passed for integer, missing required field), FastAPI automatically halts execution and returns a detailed JSON error response specifying the exact field path and failure reason.",
    "Custom Validators: Pydantic `@field_validator` and `@model_validator` allow executing domain-specific validation logic (e.g. checking password complexity, verifying end date is after start date) before reaching the route handler."
  ],
  "What is dependency injection in FastAPI?": [
    "Core Architecture: The `Depends()` mechanism allows defining reusable dependencies (database sessions, authentication contexts, configuration, rate limiters) that FastAPI resolves hierarchically on each request.",
    "`yield` Dependencies: Dependencies can execute teardown logic after request completion (e.g., `yield db_session` guarantees `db_session.close()` or commit/rollback executes).",
    "Sub-dependencies: Dependencies can depend on other dependencies (e.g., `get_current_active_user` depends on `get_current_user`, which depends on `oauth2_scheme`).",
    "Test Overrides: In unit/integration testing, `app.dependency_overrides[get_db] = override_test_db` replaces real services with mocks or test databases cleanly without monkey-patching."
  ],
  "How do you implement authentication in FastAPI?": [
    "OAuth2 Password Bearer Flow: Use `OAuth2PasswordBearer(tokenUrl='token')` to extract Bearer JWT tokens from the `Authorization` header.",
    "Token Issuance: A `/token` endpoint verifies credentials (hashed via `passlib.bcrypt` or `argon2`) and issues a signed JSON Web Token (JWT) with expiration timestamp (`exp`).",
    "Token Verification: An authenticated dependency decodes the JWT using `PyJWT` or `python-jose`, verifies the digital signature and expiration, extracts the user identifier (`sub`), and retrieves the user object.",
    "Stateless vs Stateful: JWTs allow stateless horizontal scaling without database session lookups on every request; token revocation is managed via short expiry plus refresh tokens or a Redis revocation blocklist."
  ],
  "JWT vs OAuth2?": [
    "OAuth2: An authorization framework/protocol specifying flows (Authorization Code, Client Credentials, Refresh Token) for delegating access between clients, resource servers, and identity providers.",
    "JWT (JSON Web Token): A compact, URL-safe data format (RFC 7519) consisting of Header, Payload, and Signature, used to represent signed claims.",
    "Relationship: OAuth2 often uses JWTs as bearer access tokens, but OAuth2 can also use opaque tokens. JWT is the token format; OAuth2 is the security protocol."
  ],
  "How would you implement role-based authorization?": [
    "Claims in Token: Include user roles/permissions (e.g. `roles: ['admin', 'analyst']`) inside the JWT payload during login.",
    "Parameterized Role Guard: Implement a callable class or dependency factory `RoleChecker(allowed_roles=['admin'])` that inspects the current user's roles and raises `HTTPException(403)` if unauthorized.",
    "Granular Permission RBAC: For large enterprise systems, map roles to specific permissions (e.g. `document:read`, `document:delete`) and check permissions at route decorators.",
    "Row-Level Security: Beyond role checks, verify object ownership in the repository layer (e.g. `WHERE org_id = user.org_id`) to prevent Insecure Direct Object References (IDOR)."
  ],
  "How do you handle global exceptions in FastAPI?": [
    "Custom Exception Handlers: Register global handlers with `@app.exception_handler(CustomException)` to catch domain errors and return uniform JSON response envelopes.",
    "Standardizing Validation Errors: Override `RequestValidationError` to format 422 errors into friendly user messages instead of raw Pydantic output.",
    "Catch-All Unhandled Handler: Register a handler for `Exception` to intercept unhandled 500 errors, log full tracebacks with correlation request IDs, and return a clean generic error message without leaking sensitive internals.",
    "HTTPException vs Domain Exceptions: Raise domain-specific exceptions in service layers and let global handlers map them to corresponding HTTP status codes."
  ],
  "How do you implement middleware?": [
    "HTTP Middleware (`@app.middleware('http')`): Wraps every HTTP request/response cycle. Used for injecting correlation `X-Request-ID` headers, logging request duration, and tracing.",
    "ASGI Middleware: Lower-level middleware (e.g., Starlette `CORSMiddleware`, GZipMiddleware) added via `app.add_middleware()`, operating directly at the raw ASGI receive/send event layer.",
    "Execution Order: Middleware executes in onion-style layers; middleware added last wraps around previously added middlewares.",
    "Caution: Heavy computing or streaming response consumption inside HTTP middleware can buffer entire responses into memory or degrade event loop throughput."
  ],
  "How would you implement API versioning?": [
    "URI Path Versioning (Industry Standard): Prefix routers with version numbers: `v1_router = APIRouter(prefix='/v1')` and `app.include_router(v1_router)`. Explicit and easily cached by CDNs.",
    "Header/Accept Versioning: Inspecting headers (e.g., `Accept: application/vnd.company.v2+json`) via custom middleware or dependency. Cleaner URLs, but harder to test in browser and cache.",
    "Service Decoupling: Keep business logic in version-agnostic service classes; router layers simply serialize/deserialize according to versioned Pydantic schemas.",
    "Deprecation Policy: Announce sunset timelines via `Sunset` and `Deprecation` HTTP response headers."
  ],
  "How do you handle CORS?": [
    "`CORSMiddleware`: Add `CORSMiddleware` with explicit `allow_origins=['https://app.domain.com']` whitelist.",
    "Wildcard Danger: Never set `allow_origins=['*']` alongside `allow_credentials=True` (browsers block this for security, and it creates CSRF vulnerabilities).",
    "Preflight Requests: Browsers send an `OPTIONS` preflight request for non-simple cross-origin requests; ensure CORS middleware intercepts these before authentication dependencies run.",
    "Multi-Environment Config: Read allowed origins dynamically from environment configuration variables."
  ],
  "How would you implement rate limiting?": [
    "Distributed Redis Backend: In multi-worker/container deployments, in-memory rate limiters fail because state is not shared. Use Redis with sliding window or token bucket algorithms.",
    "Sliding Window with Redis Sorted Sets: Add request timestamp to a Redis sorted set (`ZADD`), remove timestamps outside window (`ZREMRANGEBYSCORE`), and count cardinality (`ZCARD`).",
    "Client Identification: Rate limit based on authenticated `user_id` or `api_key`, with client IP fallback for anonymous endpoints.",
    "429 Response Standards: Return HTTP 429 Too Many Requests with `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers."
  ],
  "How would you handle long-running GenAI requests?": [
    "Anti-Pattern: Never keep a synchronous HTTP connection open for 60+ seconds; edge gateways, load balancers, and browsers timeout at 30-60s.",
    "Pattern 1 - Real-time Streaming: Stream tokens as they are generated using Server-Sent Events (SSE) or WebSockets via FastAPI's `StreamingResponse`.",
    "Pattern 2 - Async Background Worker: For batch generation or complex workflows, accept the request, return `202 Accepted` with a `job_id`, push the task to a message queue (Celery, ARQ, Redis Queue, SQS), and let workers process it. The client polls `GET /jobs/{id}` or listens to a webhook.",
    "Resilience: Implement idempotency keys so network retries do not re-run expensive generation jobs."
  ],
  "How do you stream an LLM response through FastAPI?": [
    "`StreamingResponse`: Return FastAPI `StreamingResponse(generator_coro(), media_type='text/event-stream')`.",
    "SSE Format: Yield data formatted according to the Server-Sent Events specification: `data: {\"token\": \"...\"}\\n\\n`.",
    "Async Generator: Consume tokens from the LLM SDK's async stream (`for chunk in await openai_client.chat.completions.create(stream=True)`) and yield immediately.",
    "Client Disconnection: Handle `asyncio.CancelledError` inside the generator to gracefully abort LLM API generation if the user closes the browser."
  ],
  "REST vs WebSocket vs Server-Sent Events?": [
    "REST: Traditional request-response over HTTP. Best for CRUD, predictable operations, and metadata endpoints. Lacks native streaming.",
    "Server-Sent Events (SSE): Unidirectional, text-based streaming from server to client over standard HTTP/2. Automatic reconnection, native browser `EventSource` API, works seamlessly through standard HTTP firewalls and reverse proxies. Optimal for LLM token streaming.",
    "WebSocket: Full-duplex bidirectional communication over a single TCP connection. Ideal for collaborative editing, interactive multi-turn agent voice sessions, and real-time gaming, but requires stateful connection management and custom load balancer configuration."
  ],
  "How would you design a production-grade FastAPI service?": [
    "Layered Clean Architecture: Routers -> Service Layer -> Repository/Client Layer -> Domain Models.",
    "Configuration & Secrets: Centralized `pydantic-settings` reading typed configs from environment with zero hardcoded credentials.",
    "Observability & Tracing: Structured JSON logging with injected correlation IDs, Prometheus metrics middleware (`/metrics`), and OpenTelemetry distributed tracing spans.",
    "Resilience: Circuit breakers (`pybreaker`), exponential retry backoff on upstream LLM APIs, database connection pooling (`asyncpg`), and Redis rate limiting.",
    "Containerization: Multi-stage Docker build running under a non-root user, orchestrated with Kubernetes Deployments, HPA, and rolling updates."
  ],
  "How do you perform health checks?": [
    "Two-Tier Health Architecture: Separate `/health/live` (Liveness) and `/health/ready` (Readiness).",
    "Liveness Check (`/health/live`): Confirms the Python web process is responsive and the event loop is running. Must be lightweight and execute with zero external I/O.",
    "Readiness Check (`/health/ready`): Executes shallow queries against critical external dependencies (Postgres `SELECT 1`, Redis `PING`, upstream LLM mock ping). Returns 200 if ready to receive traffic, 503 if degrading.",
    "Response Format: Return structured JSON indicating status of individual subsystem checks for easy monitoring parsing."
  ],
  "Liveness vs readiness probes?": [
    "Liveness Probe: Monitors whether the container is healthy and running. If it fails consecutive checks, Kubernetes kills the pod and restarts a fresh container.",
    "Readiness Probe: Monitors whether the container is currently prepared to accept customer traffic. If it fails, Kubernetes removes the pod from the Service load balancer without killing it.",
    "Startup Probe: Used for slow-starting applications (e.g. downloading 5 GB model weights into memory) to pause liveness checks until initialization completes.",
    "Critical Pitfall: Placing database connectivity checks inside a liveness probe causes a cascade failure: if the database blips, Kubernetes restarts all API pods simultaneously, worsening the outage."
  ],
  "How would you deploy FastAPI using Docker and Kubernetes?": [
    "Production Dockerfile: Use `python:3.12-slim`, install dependencies in a build stage, copy only artifacts to final stage, create a non-root user `appuser`, and run with `uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1` (let K8s scale pods instead of multi-workers in container).",
    "Kubernetes Manifests: Define Deployment with resource requests/limits, ConfigMap for environment settings, Secret for credentials, and HorizontalPodAutoscaler.",
    "Networking: Kubernetes Service (ClusterIP) exposed via Ingress Controller (NGINX/Traefik) terminating TLS and routing paths.",
    "Zero-Downtime Deployment: Set `strategy.rollingUpdate.maxUnavailable: 0` and `maxSurge: 1` combined with proper readiness probes and graceful SIGTERM shutdown handlers."
  ],
  "Your LLM API takes 30–60 seconds to respond. How would you design the FastAPI service?": [
    "Architecture Blueprint: Combine client-side streaming (SSE) with background task queues and resilient caching.",
    "1. Streaming Channel: Stream tokens via Server-Sent Events (`StreamingResponse`) so time-to-first-token (TTFT) is <800ms, providing instant visual feedback to users.",
    "2. Async Queue for Non-Interactive Calls: For batch operations, use `202 Accepted` + job queue (Redis / SQS + Celery/ARQ workers) with client polling or webhooks.",
    "3. Semantic Caching: Cache answers to repeated or semantically identical queries in Redis/GPTCache to return responses in <50ms without hitting the LLM.",
    "4. Circuit Breakers & Fallback: If OpenAI exceeds 10s latency or throws 503s, circuit breaker trips and routes to fallback models (Azure OpenAI or Anthropic).",
    "5. Timeout Governance: Configure client-side and reverse proxy (NGINX/Cloudflare) timeouts to 120s+ to prevent prematurely severed connections."
  ]
};

export const FASTAPI_CODE = {
  "How do you implement authentication in FastAPI?": {
    language: "python",
    code: `from datetime import datetime, timedelta, timezone
import jwt
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

SECRET_KEY = "your-secure-secret-key-from-env"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return {"username": username, "roles": payload.get("roles", [])}
    except jwt.PyJWTError:
        raise credentials_exception

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Verify user from DB (mocked here)
    if form_data.username == "alice" and form_data.password == "secret123":
        token = create_access_token({"sub": form_data.username, "roles": ["admin"]})
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect username or password")

@app.get("/users/me")
async def read_current_user(user: dict = Depends(get_current_user)):
    return user`
  },
  "How would you implement role-based authorization?": {
    language: "python",
    code: `from fastapi import Depends, HTTPException, status

class RoleChecker:
    def __init__(self, required_roles: list[str]):
        self.required_roles = required_roles

    def __call__(self, current_user: dict = Depends(get_current_user)) -> dict:
        user_roles = current_user.get("roles", [])
        if not any(role in self.required_roles for role in user_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User requires one of the following roles: {self.required_roles}"
            )
        return current_user

# Route protection usage:
@app.delete("/documents/{doc_id}", dependencies=[Depends(RoleChecker(["admin", "superadmin"]))])
async def delete_document(doc_id: str):
    return {"message": f"Document {doc_id} deleted successfully"}`
  },
  "How do you handle global exceptions in FastAPI?": {
    language: "python",
    code: `import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

logger = logging.getLogger("api")
app = FastAPI()

class ServiceException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

@app.exception_handler(ServiceException)
async def service_exception_handler(request: Request, exc: ServiceException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "path": request.url.path,
                "request_id": getattr(request.state, "request_id", None)
            }
        }
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error processing {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": {"code": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred."}}
    )`
  },
  "How do you implement middleware?": {
    language: "python",
    code: `import time
import uuid
from fastapi import FastAPI, Request

app = FastAPI()

@app.middleware("http")
async def add_process_time_and_correlation_id(request: Request, call_next):
    # 1. Generate or extract correlation ID
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id

    # 2. Track latency
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time

    # 3. Inject headers on response
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{process_time * 1000:.2f}ms"
    return response`
  },
  "How do you stream an LLM response through FastAPI?": {
    language: "python",
    code: `import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI

app = FastAPI()
client = AsyncOpenAI()

async def token_generator(prompt: str):
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    try:
        async for chunk in response:
            token = chunk.choices[0].delta.content or ""
            if token:
                # Format as Server-Sent Event (SSE)
                yield f"data: {token}\\n\\n"
    except asyncio.CancelledError:
        # Gracefully handle client disconnecting early
        print("Client disconnected, terminating generation stream.")
        raise

@app.post("/chat/stream")
async def chat_stream(prompt: str):
    return StreamingResponse(token_generator(prompt), media_type="text/event-stream")`
  },
  "Your LLM API takes 30–60 seconds to respond. How would you design the FastAPI service?": {
    language: "python",
    code: `import uuid
from fastapi import FastAPI, BackgroundTasks, HTTPException, status
from pydantic import BaseModel

app = FastAPI()
job_store = {}  # In production, use Redis or Postgres

class AnalysisRequest(BaseModel):
    document_text: str

async def process_heavy_llm_pipeline(job_id: str, text: str):
    job_store[job_id]["status"] = "processing"
    try:
        # Simulate 40s agent workflow / map-reduce summarization
        import asyncio
        await asyncio.sleep(5) 
        job_store[job_id]["status"] = "completed"
        job_store[job_id]["result"] = {"summary": "Processed summary result"}
    except Exception as e:
        job_store[job_id]["status"] = "failed"
        job_store[job_id]["error"] = str(e)

@app.post("/analyze", status_code=status.HTTP_202_ACCEPTED)
async def submit_analysis(req: AnalysisRequest, bg_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    job_store[job_id] = {"status": "queued", "result": None}
    bg_tasks.add_task(process_heavy_llm_pipeline, job_id, req.document_text)
    return {"job_id": job_id, "status_url": f"/jobs/{job_id}"}

@app.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in job_store:
        raise HTTPException(status_code=404, detail="Job not found")
    return job_store[job_id]`
  }
};
