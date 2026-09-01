// Section 5, 6, 7: Agentic AI, Agentic Architecture, and MCP (42 Questions - Deep, 5-YOE Level Study Answers & Code Samples)

export const AGENTIC_ANSWERS = {
  /* ---------------- Section 5: Agentic AI ---------------- */
  "What is Agentic AI?": [
    "Core Concept: Autonomous systems where Large Language Models act as reasoning and decision engines that iteratively plan, use external tools, inspect environmental feedback, update state, and solve multi-step goals.",
    "Contrast with Static LLM Apps: Traditional LLM apps follow deterministic sequential pipelines (Prompt -> LLM -> Output). Agentic AI features dynamic branching: the model determines runtime control flow, selecting tools and revising strategies based on intermediate outputs.",
    "Fundamental Loop: Perceive / Context -> Reason & Plan -> Act (execute tool) -> Observe & Critique -> Terminate or Iterate.",
    "Production Safeguards: Agents require bounded state graphs, strict tool allow-lists, per-run step and cost budgets, and Human-in-the-Loop (HITL) checkpoints for irreversible side effects."
  ],
  "RAG vs Agentic RAG?": [
    "Standard RAG: Deterministic single-shot retrieval. Query -> Search Vector DB -> Inject Top Chunks -> Generate Answer. Fails if the initial search query is ambiguous or if multi-hop cross-document reasoning is needed.",
    "Agentic RAG: An intelligent agent orchestrates retrieval dynamically. 1) Evaluates query complexity, 2) Deconstructs into sub-queries, 3) Selects between multiple search sources (Vector DB, SQL, Web API), 4) Evaluates if retrieved chunks actually contain the answer, 5) Reformulates search queries if retrieval is insufficient, 6) Synthesizes final answer once confident.",
    "Key Benefit: Dramatically higher accuracy on complex, multi-hop, analytical enterprise questions."
  ],
  "LLM application vs AI agent?": [
    "LLM Application: A predefined workflow (e.g. summarizer, translator, standard RAG) where the developer hardcodes the sequence of steps and API calls. The LLM is used as a text transform component.",
    "AI Agent: An autonomous entity given an objective and a set of tools. The LLM dynamically decides which steps to take, which tools to call, what arguments to pass, and when the goal is achieved.",
    "Deterministic vs Non-Deterministic Control: LLM apps have predictable execution paths and costs; Agents trade predictability for problem-solving autonomy and adaptability."
  ],
  "What is an agent?": [
    "Architectural Anatomy: 1) Brain (LLM reasoning core), 2) Planning (task decomposition & reflection), 3) Memory (short-term working state + long-term persistent store), 4) Tools (interfaces to external APIs, databases, files, and code execution environments).",
    "Autonomy Spectrum: From simple ReAct tool-calling loops to complex multi-agent collaborative networks (LangGraph, CrewAI, AutoGen).",
    "Production Standard: Enterprise agents are never given unconstrained access; they run inside sandbox environments with least-privilege tool access."
  ],
  "What is a tool?": [
    "Definition: A discrete function or API endpoint exposed to the LLM with a standardized JSON Schema describing its name, purpose, input parameters, and return types.",
    "Prompt Engineering for Tools: The quality and clarity of tool descriptions (`description` attribute) directly determines whether the LLM routes queries accurately.",
    "Execution Safety: Tools must be deterministic, idempotent where possible, validate inputs with Pydantic, and return concise, token-efficient responses (stripping HTML/excess JSON)."
  ],
  "What is tool calling?": [
    "Protocol: The model outputs structured JSON representing a function call instead of conversational text: `{\"name\": \"get_user_orders\", \"arguments\": {\"user_id\": \"U123\"}}`.",
    "Host Role: The client runtime parses the arguments, performs authorization and schema validation, executes the real Python/SQL function, and returns the result as a `tool` message to the LLM.",
    "Parallel Tool Calling: Modern frontier models can emit multiple independent tool calls in a single completion turn (e.g., querying stock price and weather in parallel)."
  ],
  "What is agent orchestration?": [
    "Definition: The framework governing state management, routing, branching, loops, error recovery, and execution flow across agent nodes.",
    "Graph-Based Orchestration (LangGraph): Models agent workflows as cyclical state graphs where Nodes represent actions/LLM calls and Edges represent conditional routing logic.",
    "Core Responsibilities: Checkpointing state, managing token budgets, enforcing timeout limits, and recording distributed traces for every step."
  ],
  "What is planning?": [
    "Core Capability: The agent's ability to decompose a complex objective into sequential or parallel sub-tasks before execution.",
    "Planning Techniques: 1) Plan-and-Solve: Generates full task list first, then executes sequentially, 2) ReAct: Interleaves step-by-step reasoning with immediate action, 3) Tree of Thoughts (ToT): Explores multiple reasoning paths and evaluates progress.",
    "Adaptive Replanning: When a tool returns an error or empty result, an effective agent updates its plan rather than giving up."
  ],
  "What is memory?": [
    "Role: Retaining conversational and operational context across multiple turns and long-running execution lifecycles.",
    "Short-Term Memory: In-context conversation history, working scratchpad, and state objects for the active session.",
    "Long-Term Memory: Persistent user preferences, domain knowledge, and past session summaries stored in SQL/Vector DBs and retrieved via semantic similarity.",
    "Episodic vs Semantic Memory: Episodic stores past specific interactions ('User prefers Python over Java'); Semantic stores generalized facts ('Company refund policy is 30 days')."
  ],
  "Short-term vs long-term memory?": [
    "Short-Term Memory: Ephemeral, session-scoped. Stored in RAM, Redis, or LLM context window. Managed via sliding context windows, message pruning, and recursive summarization.",
    "Long-Term Memory: Persistent, cross-session. Stored in vector databases or key-value stores. Dynamically retrieved at conversation start using semantic search over user query.",
    "Privacy & GDPR: Long-term memory requires explicit user consent, tenant partitioning, and deletion APIs (Right to be Forgotten)."
  ],
  "What is state management?": [
    "Definition: Tracking and immutably updating the shared data schema across every step of an agent's execution cycle.",
    "State Schema: Holds message histories, extracted variables, active tool outputs, retry counters, and human approval flags.",
    "Persistence & Checkpointing: Storing state snapshots in PostgreSQL/Redis after every node execution enables resuming interrupted long-running tasks and rewinding execution for debugging (time-travel debugging in LangGraph)."
  ],
  "What is reflection?": [
    "Definition: A meta-cognitive step where the agent critiques its own generated outputs, code, or tool results against requirements before presenting them to the user.",
    "Self-Correction Loop: Draft -> Critique (Check against schema, factual grounding, lint rules) -> Refine -> Final Output.",
    "Evaluation Frameworks: Reflexion and CRITIC architectures show dramatic performance gains on code generation and mathematical reasoning."
  ],
  "What is ReAct?": [
    "Reason + Act Paradigm (Yao et al., 2022): Interleaves verbal reasoning traces with domain-specific tool actions.",
    "Step Sequence: 1) Thought (LLM analyzes current state and decides what info is needed), 2) Action (LLM emits structured tool call), 3) Observation (Environment returns tool execution result), 4) Repeat until Goal is satisfied -> 5) Final Answer.",
    "Why It Outperforms Pure Action: Explicit reasoning steps reduce hallucinated tool arguments and prevent premature conclusions."
  ],
  "What is multi-agent architecture?": [
    "Concept: Decomposing a complex system into specialized, autonomous agent roles (e.g., Researcher, Coder, Reviewer, SQL Analyst) that communicate via message passing.",
    "Collaboration Topologies: 1) Hierarchical (Supervisor / Worker), 2) Sequential Pipeline (Agent A -> Agent B -> Agent C), 3) Peer-to-Peer Collaborative Network.",
    "Why Multi-Agent: Reduces context window pollution, allows specialized system prompts and tool subsets per agent, and improves modular testing."
  ],
  "Single agent vs multi-agent?": [
    "Single Agent: Simpler architecture, lower token consumption, faster debugging, and lower cost. Best for single-domain tasks with <10 tools.",
    "Multi-Agent: High separation of concerns, specialized personas and scoped toolsets. Best for complex enterprise workflows requiring distinct domain expertise (e.g. Software Dev team: Product Manager -> Architect -> Developer -> QA).",
    "Senior Principle: Never use multi-agent just because it is trendy; single agents with good routing often outperform complex multi-agent systems with less latency and cost."
  ],
  "What is an agent supervisor?": [
    "Role: A coordinator LLM node in a hierarchical multi-agent graph responsible for routing and delegating sub-tasks to worker agents.",
    "How it Works: Receives user input, consults the state, chooses which worker agent should execute next (or outputs FINISH), and synthesizes worker outputs into the final response.",
    "Routing Mechanism: Uses structured outputs (`NextStep(next_agent='SQLAgent')`) to conditionally route execution edges in frameworks like LangGraph."
  ],
  "How does an agent decide which tool to use?": [
    "Semantic Matching: The model compares the user query and reasoning step against the semantic descriptions and JSON Schemas of all provided tools in its system context.",
    "Instruction Guidance: Explicit system prompt rules (e.g. 'Always query the vector database before answering product questions').",
    "Few-Shot Routing Exemplars: Providing 2-3 examples of ambiguous queries and their correct tool selections in the prompt dramatically increases routing accuracy."
  ],
  "How do you prevent an agent from entering an infinite loop?": [
    "1. Hard Iteration Caps: Enforce `max_iterations = 10` or `recursion_limit` in the orchestration engine.",
    "2. Loop Detection: Track history of `(tool_name, tool_arguments)`. If the exact same call repeats 2+ times consecutively, halt and trigger an error/human escalation.",
    "3. Total Wall-Clock & Cost Timeout: Set execution timeouts (e.g., max 60 seconds) and token spend limits ($0.20 max per task).",
    "4. Explicit Exit Criteria: Instruct system prompts to output a structured failure status if a tool fails twice rather than endlessly re-trying."
  ],
  "How do you control agent cost?": [
    "Model Tiering (LLM Routing): Use fast, cheap models (GPT-4o-mini, Claude 3.5 Haiku) for planning, classification, and simple tool extraction; reserve frontier models (GPT-4o, Claude 3.5 Sonnet) only for complex synthesis.",
    "Strict Iteration Limits: Cap step count and tool executions.",
    "Semantic Caching: Cache identical tool and sub-query results in Redis.",
    "Context Pruning: Pass concise tool summaries between agent nodes rather than echoing 10,000-word raw JSON payloads across the entire conversation history.",
    "Hard Budget Caps: Track token usage in real-time and terminate execution if budget is exceeded."
  ],
  "How do you handle tool failures?": [
    "Structured Error Propagation: When a tool fails (e.g. database timeout, invalid parameter), catch the exception in host code and return a clear error message as the `tool` message: `{\"status\": \"error\", \"message\": \"User ID U999 does not exist. Please check the ID or search by email.\"}`.",
    "Model Self-Correction: Feeding clean error messages back allows the LLM to understand why it failed and adjust its arguments in the next iteration.",
    "Circuit Breakers: Disable broken external tools after consecutive 5xx errors and fallback to degraded behavior."
  ],
  "How do you handle hallucinated tool calls?": [
    "1. Host-Side Validation: Never trust raw LLM output. Validate tool name against an allowed registry and parse arguments strictly using Pydantic schemas before execution.",
    "2. Rejection & Feedback: If the model emits a non-existent tool or bad arguments, return a `ToolError` message into context explaining the exact schema requirements.",
    "3. Narrow Tool Scope: Provide only 3-8 relevant tools per agent rather than dumping 50 tools into a single prompt.",
    "4. Constrained Grammar Sampling: Use native structured outputs to guarantee valid JSON arguments."
  ],
  "How do you secure tools?": [
    "Least Privilege: Tools should use dedicated IAM roles / DB users with minimal permissions (e.g. read-only SELECT permissions on specific views).",
    "Input Sanitization: Parameterized SQL queries, URL whitelisting, and strict type constraints to prevent SQL injection and SSRF via LLM tool arguments.",
    "Network Sandboxing: Run dynamic code execution tools (Python interpreters, shell) inside ephemeral Docker containers or gVisor/Firecracker microVMs (e.g., E2B, Modal).",
    "Audit Logging: Record immutable logs of user identity, generated tool arguments, execution timestamp, and output."
  ],
  "How do you implement human-in-the-loop?": [
    "State Interrupt Pattern: The agent pauses execution before calling high-impact, irreversible tools (e.g., sending email, executing SQL updates, charging credit cards).",
    "Persistent Checkpoint: Agent serializes its current state to database and transitions status to `PENDING_APPROVAL`, notifying a human reviewer via Slack/UI.",
    "Reviewer Action: Human reviews proposed parameters, and either approves, edits parameters, or rejects the action with feedback.",
    "Resume Execution: On approval, orchestrator loads checkpointed state and resumes execution seamlessly from the paused node."
  ],
  "How do you trace an agent's execution?": [
    "Distributed Trace Spans: Every agent run generates a Root Trace ID. Each node (LLM call, Tool execution, Retrieval step, State transition) creates a nested child span with inputs, outputs, token counts, and latency.",
    "Observability Platforms: Instrument using OpenTelemetry, LangSmith, Langfuse, Arize Phoenix, or Datadog LLM Observability.",
    "Debugging Value: Allows visualizing the exact reasoning DAG to identify which node caused a failure, where time was spent, and which prompt version was active."
  ],
  "How do you evaluate an agent?": [
    "End-to-End Task Success Rate: Percentage of benchmark tasks where the agent successfully achieved the objective verified against ground truth.",
    "Trajectory / Step Efficiency: Measures whether the agent took optimal paths (e.g. solving in 3 steps vs wandering for 12 steps).",
    "Tool Selection Accuracy: Precision and Recall of choosing the correct tool given specific task intents.",
    "Cost & Latency per Task: Dollar spend and wall-clock execution time distribution.",
    "Deterministic Benchmark Suites: Evaluated using frameworks like GAIA, SWE-bench, or custom domain test suites run in CI/CD."
  ],

  /* ---------------- Section 6: Agentic Architecture ---------------- */
  "Design an AI agent that receives a user's question, searches company documents, queries a database, and generates a final answer.": [
    "Architecture Overview: A Router/Supervisor Agent backed by two specialized tools: 1) Document RAG Tool (Vector DB + Hybrid Search), 2) Text-to-SQL Tool (Relational DB with Schema Catalog).",
    "Execution Flow: 1) User submits query via API Gateway, 2) Agent analyzes intent and plans required tool calls, 3) If question requires unstructured knowledge -> calls `search_documents(query)`, 4) If question requires analytical numbers -> calls `execute_safe_sql(query)` using read-only parameterized views, 5) If both needed -> calls both tools in parallel, 6) Synthesizes combined outputs into a unified answer with citations and data tables.",
    "Security & Guardrails: SQL tool validates against SELECT-only whitelist and appends `LIMIT 500`. Document search filters by user's tenant/role ACLs. Global timeout and budget caps enforced."
  ],
  "How would you build a multi-agent system?": [
    "Framework: LangGraph / StateGraph using a Supervisor routing topology with typed state.",
    "Agent Roles: 1) Supervisor (routes tasks, coordinates plan), 2) Research Agent (queries vector search & web), 3) Data Agent (writes and executes SQL queries), 4) Reviewer / Critic Agent (audits final answer for citations, accuracy, and formatting).",
    "Communication: Agents interact by reading and updating a shared immutable State object containing message history, scratchpad data, and execution flags.",
    "Termination & Guardrails: Explicit `FINISH` condition evaluated by Supervisor; maximum 10 total graph transitions; human-in-the-loop interrupt before any external action."
  ],

  /* ---------------- Section 7: MCP (Model Context Protocol) ---------------- */
  "What is MCP?": [
    "Model Context Protocol (Anthropic, 2024): An open standard protocol that standardizes how AI applications and LLM clients securely connect to external tools, resources, and prompt templates.",
    "Client-Server Architecture: An MCP Host (e.g. Claude Desktop, IDE, custom AI agent) connects to multiple MCP Servers (PostgreSQL server, GitHub server, Jira server) over JSON-RPC 2.0.",
    "Why It Matters: Eliminates the N×M integration problem where every AI framework needed custom tool integrations for every SaaS API. Build one MCP server, and all AI clients can use it."
  ],
  "Why do we need MCP?": [
    "Fragmentation Problem: Previously, developers wrote bespoke tool-calling wrappers for LangChain, LlamaIndex, Semantic Kernel, and custom OpenAI scripts.",
    "Standardized Interface: MCP standardizes three core primitives: 1) Tools (executable functions), 2) Resources (file/data context), 3) Prompts (reusable parameterized prompt templates).",
    "Enterprise Security: Centralizes enterprise data access governance, authorization, and audit logging at the MCP Server layer."
  ],
  "MCP client vs MCP server?": [
    "MCP Client (Host): The AI runtime/application (e.g., Claude, Cursor, FastAPI Agent) that discovers available capabilities, exposes them to the LLM, and dispatches execution requests.",
    "MCP Server: A lightweight service exposing specific backend capabilities (e.g., SQLite server, Filesystem server, AWS SDK server) implementing the MCP protocol specification over stdio or SSE/HTTP transport.",
    "Decoupled Lifecycle: Servers run independently from the LLM application and can be written in any language (Python, TypeScript, Go)."
  ],
  "What is an MCP tool?": [
    "Definition: An executable function exposed by an MCP server that performs actions or mutates state in an external system.",
    "Protocol Schema: Implements `tools/list` (returns tool names, descriptions, and JSON Schemas) and `tools/call` (receives parameters, executes logic, and returns text/image content).",
    "Use Cases: Creating tickets, querying databases, sending messages, running automated code scripts."
  ],
  "What is an MCP resource?": [
    "Definition: Read-only data sources exposed by an MCP server that provide contextual information without side effects.",
    "URI-Based Addressing: Accessed via custom URIs (e.g., `postgres://database/table/schema`, `file:///logs/app.log`, `github://repo/issues`).",
    "Subscription Support: MCP clients can subscribe to resources to receive real-time notifications when underlying files or records change."
  ],
  "What are MCP prompts?": [
    "Definition: Pre-packaged, parameterized prompt templates and workflow recipes managed and served directly by the MCP server.",
    "Use Case: An engineering MCP server might expose a prompt `git-commit-review(pr_number)` that automatically bundles diff resources with proven review instructions.",
    "Discovery: Clients query `prompts/list` to show slash-commands or preset prompts dynamically to end users."
  ],
  "How does an LLM interact with an MCP server?": [
    "1. Discovery: MCP Client connects to MCP Server and calls `tools/list` to fetch all available tool schemas.",
    "2. Prompt Assembly: Client translates MCP tool schemas into the LLM's native function calling format (OpenAI / Anthropic tools) and sends user query.",
    "3. Decision: LLM generates a tool call request.",
    "4. Execution: MCP Client forwards the request to the MCP Server via JSON-RPC `tools/call`.",
    "5. Response: MCP Server executes code and returns result to Client, which injects it back into LLM context for final answer synthesis."
  ],
  "MCP vs REST API?": [
    "REST API: Designed for direct programmatic CRUD operations between software services. Lacks built-in self-discovery schemas and prompt semantics for LLMs.",
    "MCP: Protocol designed specifically for AI-native interaction. Bundles function schemas (Tools), read-only contextual streams (Resources), and prompt templates over unified bidirectional JSON-RPC transports.",
    "Relationship: An MCP Server often wraps an existing REST API to expose its capabilities to LLMs."
  ],
  "MCP vs function calling?": [
    "Function Calling: A model-level API capability (provided by OpenAI, Anthropic, etc.) for generating structured JSON arguments.",
    "MCP: A higher-level application protocol and architectural standard for tool/resource discovery, transport, and client-server decoupling.",
    "Integration: The MCP Client uses the model's native Function Calling mechanism to trigger MCP Server tools."
  ],
  "How would you build an MCP server in Python?": [
    "Using FastMCP (Official SDK): 1) Initialize `mcp = FastMCP('server_name')`, 2) Decorate functions with `@mcp.tool()` using type annotations and docstrings, 3) Decorate resource endpoints with `@mcp.resource('uri://...')`, 4) Run via stdio `mcp.run()` or SSE transport.",
    "Input Validation: Pydantic handles automatic schema generation and type enforcement.",
    "Error Handling: Exceptions are converted into standardized MCP error codes returned to the client."
  ],
  "How would you expose an existing REST API through MCP?": [
    "Wrapper Strategy: Build an MCP server that uses `httpx.AsyncClient` to call backend REST endpoints.",
    "Intent-Driven Tool Design: Instead of exposing 50 raw CRUD endpoints, create high-level intent tools tailored for LLM reasoning (e.g. `get_customer_360_view(customer_id)` which combines 3 REST calls).",
    "Token Efficiency: Strip headers, pagination bloat, and redundant JSON fields in the MCP server before returning data to the AI host."
  ],
  "How would you secure an MCP server?": [
    "1. Authentication: Enforce OAuth2 / API Key verification on all incoming JSON-RPC connections over HTTP/SSE.",
    "2. Parameter Sanitization: Validate all tool parameters with Pydantic; enforce strict regexes on SQL, file paths, and shell inputs.",
    "3. Scoped Permissions (Least Privilege): Restrict tool access based on the authenticated client identity; read-only access by default.",
    "4. Comprehensive Auditing: Log all tool invocations, caller identity, parameters, execution latency, and return status."
  ],
  "How would you deploy MCP on Azure/AWS?": [
    "Containerized Deployment: Package the Python/TypeScript MCP server as a Docker container.",
    "Hosting: Run on Azure Container Apps or AWS ECS/Fargate configured with the HTTP/SSE transport mode.",
    "Ingress & Gateway: Place behind Azure API Management or AWS API Gateway for TLS termination, client auth, and rate limiting.",
    "Identity: Use AWS IAM Task Roles or Azure Managed Identity to securely access backend databases and S3/Blob storage without static secrets."
  ],
  "How would you connect MCP to an enterprise database?": [
    "Read-Only Replica: Connect the MCP server to a dedicated read-only database replica.",
    "Parameterized Queries: Implement tools that execute parameterized SQL or stored procedures (`get_sales_by_region(region, start_date)`) rather than raw arbitrary SQL.",
    "Row-Level Security: Pass tenant context in tool calls to ensure queries cannot access cross-tenant data.",
    "Query Guardrails: Enforce statement timeouts (e.g. max 3s) and hard row limits (`LIMIT 500`) to prevent denial-of-service."
  ],
  "How would you handle authorization for MCP tools?": [
    "Caller Identity Propagation: Pass user JWTs or claims through the MCP client to the server.",
    "Dynamic Tool Filtering: The MCP server's `tools/list` endpoint dynamically returns only the tools the authenticated user is authorized to use.",
    "Execution-Time RBAC: Every `tools/call` verifies user roles before executing underlying business logic.",
    "Audit Trail: Log every tool invocation mapped to user ID for compliance."
  ]
};

export const AGENTIC_CODE = {
  "What is ReAct?": {
    language: "python",
    code: `import json
from openai import OpenAI

client = OpenAI()

def execute_react_step(prompt: str, tools: list) -> str:
    messages = [
        {"role": "system", "content": "You are a ReAct agent. Reason step-by-step (Thought) before calling an Action."},
        {"role": "user", "content": prompt}
    ]
    
    for _ in range(5):  # Max 5 reasoning steps
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
        )
        msg = response.choices[0].message
        messages.append(msg)
        
        if not msg.tool_calls:
            # Final answer reached
            return msg.content
        
        # Execute tool calls and feed observations back
        for tool_call in msg.tool_calls:
            tool_name = tool_call.function.name
            tool_args = json.loads(tool_call.function.arguments)
            # Execute actual tool logic (mocked)
            observation = f"Result of {tool_name}({tool_args})"
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": observation
            })`
  },
  "Design an AI agent that receives a user's question, searches company documents, queries a database, and generates a final answer.": {
    language: "python",
    code: `from typing import Literal
from pydantic import BaseModel, Field

class SearchDocsInput(BaseModel):
    query: str = Field(description="Semantic search query for company documents")

class SQLQueryInput(BaseModel):
    sql: str = Field(description="SELECT SQL query against the enterprise database")

def search_company_docs(query: str) -> str:
    # 1. Calls Vector DB + Hybrid Search
    return "Retrieved: Policy states 20 days annual leave."

def query_sql_db(sql: str) -> str:
    # 2. Validates SELECT only and executes on read-replica
    if not sql.strip().upper().startswith("SELECT"):
        raise ValueError("Only SELECT queries allowed")
    return "SQL Output: [{'employee_id': 101, 'remaining_leave': 14}]"

# Agent Tool Registry
TOOLS = [
    {"type": "function", "function": {"name": "search_docs", "parameters": SearchDocsInput.model_json_schema()}},
    {"type": "function", "function": {"name": "query_sql", "parameters": SQLQueryInput.model_json_schema()}}
]`
  },
  "How would you build an MCP server in Python?": {
    language: "python",
    code: `from mcp.server.fastmcp import FastMCP
from pydantic import Field

# 1. Initialize MCP Server
mcp = FastMCP("enterprise-data-server")

# 2. Expose a Tool
@mcp.tool()
async def query_customer_orders(customer_id: str = Field(description="Unique customer ID")) -> str:
    """Query customer order history from the enterprise database."""
    # Production database query (read-only)
    return f"Orders for {customer_id}: [Order #101: $450 (Delivered), Order #102: $120 (Shipped)]"

# 3. Expose a Resource
@mcp.resource("docs://compliance/refund_policy")
def get_refund_policy() -> str:
    """Read-only refund policy document context."""
    return "Refund Policy: Customers can return items within 30 days of purchase."

# 4. Expose a Prompt Template
@mcp.prompt()
def customer_support_ticket(ticket_id: str) -> str:
    return f"Review ticket #{ticket_id}. Query customer order history and draft a polite resolution."

if __name__ == "__main__":
    mcp.run()  # Defaults to standard stdio transport`
  }
};
