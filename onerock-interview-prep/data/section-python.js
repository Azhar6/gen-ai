// Section 1: Python (30 Questions - Deep, 5-YOE Level Study Answers & Code Samples)

export const PYTHON_ANSWERS = {
  "What is the difference between a list, tuple, set, and dictionary?": [
    "List (`list`): An ordered, mutable collection that allows duplicate elements. Implemented as a dynamic array with amortized O(1) append and O(n) insert/delete at arbitrary positions.",
    "Tuple (`tuple`): An ordered, immutable collection. Because of immutability, tuples are hashable (if all contents are hashable), use less memory than lists, and are safely used as dictionary keys or record returns.",
    "Set (`set`): An unordered collection of unique, hashable elements. Backed by a hash table with average O(1) lookup, insertion, and deletion, making it ideal for deduplication and membership checks.",
    "Dictionary (`dict`): An unordered (insertion-ordered in Python 3.7+) key-value hash map. Lookups, inserts, and deletes are average O(1). Keys must be immutable and hashable.",
    "Memory & Performance: Lists allocate extra capacity for fast resizing; tuples allocate exact memory. Sets and dictionaries have higher memory overhead due to hash table sparse tables.",
    "Interview takeaway: Choose tuples for fixed heterogeneous records, lists for homogeneous dynamic sequences, sets for uniqueness/membership tests, and dicts for indexed lookups."
  ],
  "Explain mutable vs immutable objects in Python.": [
    "Core Definition: An object is mutable if its internal state or data can be changed in place without changing its memory address (`id()`). Immutable objects cannot be modified after instantiation.",
    "Mutable Types: `list`, `dict`, `set`, `bytearray`, and user-defined class instances (unless frozen).",
    "Immutable Types: `int`, `float`, `bool`, `str`, `tuple`, `frozenset`, `bytes`.",
    "Parameter Passing Mechanics: Python uses 'pass-by-assignment' (or call-by-object-reference). Modifying a mutable argument inside a function mutates the caller's object.",
    "Default Argument Trap: Writing `def func(x=[])` creates a single shared list across all invocations. Always use `def func(x=None): if x is None: x = []`.",
    "Hashability: Only immutable objects can implement `__hash__()` safely; mutable objects cannot be used as dictionary keys or set elements because mutating them breaks hash table indexing."
  ],
  "What are *args and **kwargs?": [
    "`*args`: Collects variable non-keyword (positional) arguments into a single `tuple` within the function body.",
    "`**kwargs`: Collects variable keyword (named) arguments into a standard `dict`.",
    "Order of Arguments: Parameter definition must follow: `def func(pos1, pos2, *args, kw_only1, **kwargs)`.",
    "Unpacking Operator: When calling functions, `*list_or_tuple` unpacks elements as positional arguments, and `**dict` unpacks key-values as named arguments.",
    "Senior Production Pattern: Widely used in decorators, proxy classes, and wrapper functions to forward arguments cleanly without tight coupling to underlying signatures."
  ],
  "Explain shallow copy vs deep copy.": [
    "Shallow Copy (`copy.copy(obj)` or `list(obj)` / `obj[:]`): Creates a new outer compound object, but inserts references into it for all nested objects. Changing nested mutable data affects both copies.",
    "Deep Copy (`copy.deepcopy(obj)`): Recursively constructs a new compound object and copies all nested objects inside it. Mutating deep copies has zero side effects on the original.",
    "Cycle Handling: `copy.deepcopy()` maintains an internal memoization dictionary of already copied objects to prevent infinite recursion on circular references.",
    "Performance Impact: Deep copies can be orders of magnitude slower and consume heavy memory for large graphs or config objects. Use shallow copies where nested objects are immutable."
  ],
  "What are decorators? Give a real-world use case.": [
    "Core Concept: A decorator is a callable that takes another function as input, extends or alters its behavior, and returns a new callable without altering the original function's source code.",
    "Syntax Sugar: `@my_decorator` placed above a function definition is syntactically equivalent to `func = my_decorator(func)`.",
    "`functools.wraps`: Always apply `@functools.wraps(func)` to preserve docstrings, function names, and annotations for debugging and introspection.",
    "Real-World Production Cases: Logging request/response metrics, enforcing authentication & RBAC, applying exponential retry backoff on API timeouts, response caching (memoization), and rate limiting."
  ],
  "What are generators and why would you use them?": [
    "Core Mechanism: A generator is a function containing the `yield` statement. When called, it returns a generator iterator object without executing the whole body immediately.",
    "State Preservation: Calling `next()` executes until the next `yield`, returning the value and freezing execution state (local variables, instruction pointer) until the next iteration.",
    "Memory Efficiency (O(1) space): Instead of allocating a 10 GB list in RAM, a generator streams elements one at a time. Ideal for processing large database cursors, log streams, and huge CSVs.",
    "Pipelines: Generators can be chained together (filter -> transform -> sink) to form low-memory lazy data transformation pipelines."
  ],
  "What is the difference between an iterator and an iterable?": [
    "Iterable: Any Python object capable of returning its members one at a time. Implements the `__iter__()` method (or `__getitem__()`). Examples: `list`, `str`, `dict`, `range`.",
    "Iterator: The stateful object representing a stream of data. Implements both `__iter__()` (which returns `self`) and `__next__()` (which returns the next item or raises `StopIteration`).",
    "Conversion: Calling `iter(my_iterable)` invokes its `__iter__()` and returns a new iterator instance.",
    "Exhaustion: Iterators are single-use streams; once exhausted, subsequent `next()` calls continuously raise `StopIteration`. Lists can be iterated multiple times because each loop creates a new iterator."
  ],
  "Explain Python's GIL.": [
    "Global Interpreter Lock: A mutex in CPython that prevents multiple native threads from executing Python bytecodes in parallel at the same time.",
    "Why It Exists: Simplifies memory management in CPython; reference counting is not thread-safe without either per-object locks or a global lock (which avoids single-thread overhead and deadlocks).",
    "Impact on Multithreading: CPU-bound tasks (e.g., matrix math, image transforms) get zero performance gain and often run slower due to thread context-switching overhead.",
    "I/O Bound Exemption: During blocking I/O operations (network socket reads, file I/O, database queries) or within C-extensions like NumPy/PyTorch, the GIL is explicitly released, allowing concurrent I/O.",
    "Python 3.13+ Free-Threaded Mode (PEP 703): Experimental build disabling GIL using mimalloc and biased reference counting."
  ],
  "When would you use multiprocessing vs multithreading?": [
    "Multithreading (`threading` / `asyncio`): Use for I/O-bound tasks where the process spends time waiting on network, disk, or external LLM APIs. Threads share the same memory space, keeping memory footprint low.",
    "Multiprocessing (`multiprocessing` / `concurrent.futures.ProcessPoolExecutor`): Use for CPU-bound tasks (data preprocessing, tokenization, custom embeddings, feature extraction). Each worker has its own Python interpreter, memory space, and GIL.",
    "Inter-Process Communication (IPC): Multiprocessing requires serializing data across processes (Pickle via Queues/Pipes) which incurs serialization overhead.",
    "GenAI Context: Use `asyncio` for high-throughput async LLM API calls and embeddings retrieval, and `multiprocessing` for CPU-heavy document parsing, OCR pipelines, or dataset tokenization."
  ],
  "How does asyncio work?": [
    "Event Loop Architecture: `asyncio` runs a single-threaded cooperative multitasking event loop. It tracks active tasks and waits for OS notifications (via `epoll` on Linux, `kqueue` on macOS).",
    "Coroutines: Defined with `async def`. Calling a coroutine returns a coroutine object; it does not execute until awaited or scheduled on the loop via `asyncio.create_task()`.",
    "Cooperative Yielding: When code executes `await some_io_call()`, it yields control back to the event loop so other ready tasks run while waiting for I/O to complete.",
    "Blocking Pitfall: A synchronous CPU-heavy function or blocking library (e.g. `requests.get()` or `time.sleep()`) blocks the entire event loop. Offload blocking calls using `asyncio.to_thread()`."
  ],
  "What is the difference between synchronous and asynchronous programming?": [
    "Synchronous: Code executes sequentially line by line. When an I/O operation (HTTP request, DB query) starts, the thread blocks and remains idle until data returns.",
    "Asynchronous: Non-blocking execution where a single thread starts an I/O operation and immediately registers a callback or awaits an event, freely serving other requests in the meantime.",
    "Concurrency vs Parallelism: Async is concurrent single-threaded I/O multiplexing; parallelism requires multiple CPU cores executing code simultaneously.",
    "Scale Profile: Synchronous architectures require 1 thread per connection (costly OS thread stacks at 10,000 users). Async handles tens of thousands of idle/waiting connections with minimal memory."
  ],
  "Explain async and await.": [
    "`async def`: Declares a coroutine function. Its return type is a coroutine object that must be scheduled on an event loop.",
    "`await`: Can only be used inside `async def` functions. Pauses execution of the current coroutine until the awaited awaitable (coroutine, Task, or Future) yields a result, allowing the event loop to execute other tasks.",
    "Awaitables: Objects that implement the `__await__()` dunder method.",
    "Task Creation: Wrapping a coroutine with `asyncio.create_task()` schedules it concurrently on the loop without blocking the caller immediately."
  ],
  "How would you handle exceptions in a large Python application?": [
    "Domain-Specific Hierarchy: Define a base `AppException(Exception)` and inherit domain errors like `EntityNotFoundError`, `LLMProviderTimeoutError`, `AuthorizationFailedError`, `ValidationError`.",
    "Catch Specifically: Never use bare `except:`; catch specific exception types at appropriate architectural boundaries (API routers, message queue consumers).",
    "Exception Chaining: Use `raise CustomError('failed to fetch') from err` to preserve the original stack trace context for debugging while providing clean domain abstractions.",
    "Context Managers for Cleanup: Utilize `try...finally` or context managers (`with`) to ensure DB transactions, file handles, and connection pools release reliably on failure.",
    "Global Handlers & Sentry: Centralize unhandled exception logging with correlation IDs, error codes, and breadcrumbs in centralized APM tools (e.g., Sentry, OpenTelemetry)."
  ],
  "What are context managers?": [
    "Core Concept: Objects that manage setup and teardown logic around a block of code using the `with` statement, guaranteeing cleanup even if unhandled exceptions occur.",
    "Protocol: Implements `__enter__(self)` (executes setup and returns context resource) and `__exit__(self, exc_type, exc_val, exc_tb)` (handles teardown, error inspection, and optional error suppression).",
    "`contextlib.contextmanager`: Utility decorator allowing generator functions with a single `yield` to act as context managers without writing custom classes.",
    "`async with`: Asynchronous context managers implementing `__aenter__()` and `__aexit__()` for non-blocking resource acquisition (e.g., `aiohttp.ClientSession`, `asyncpg.Connection`)."
  ],
  "Explain dependency injection in Python.": [
    "Definition: A design pattern where a class or function receives its dependencies (database connections, config, LLM clients) from an external injector rather than instantiating them internally.",
    "Benefits: Decouples business logic from concrete infrastructure, enables high testability (swapping OpenAI with mock LLM clients during unit tests), and centralizes configuration.",
    "Pythonic Approaches: Passing interfaces/callables as default arguments, utilizing dependency injection frameworks (e.g., `injector`, `dependency_injector`), or using framework-level DI (FastAPI `Depends()`)."
  ],
  "How would you structure a production Python project?": [
    "Clean Architecture Layout: Separate concerns into `api/` (routes, routers, serializers), `services/` (core business logic), `repositories/` (data access, vector DB, SQL), `models/` (domain models, Pydantic schemas), and `core/` (config, logging, security).",
    "Environment & Dependency Management: Use `pyproject.toml` with Poetry, UV, or Hatch. Pin dependencies lockfiles (`poetry.lock` / `uv.lock`) for reproducible container builds.",
    "Configuration: Single source of truth using `pydantic-settings` reading from `.env` and environment variables with strict type validation.",
    "Quality Gates: Pre-commit hooks running Ruff (lint + format), MyPy (strict type checking), Pytest (unit + integration suites with >85% coverage).",
    "Containerization: Multi-stage Dockerfile with non-root security context and health check endpoints."
  ],
  "How do you manage configuration and secrets?": [
    "12-Factor App Principles: Store configuration in environment variables, completely separated from source code.",
    "Pydantic Settings: Use `BaseSettings` for strongly typed config models with default fallbacks, casting, and validation on app startup.",
    "Cloud Secrets Management: In production, load secrets dynamically at startup or via IAM-authenticated secrets clients (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault).",
    "Never Commit Secrets: Enforce `.gitignore` on `.env` files and add automated Git hooks / CI scanners (`gitleaks`, `trufflehog`) to reject commits with hardcoded tokens."
  ],
  "How do you optimize a slow Python API?": [
    "Step 1 - Profile & Measure: Never optimize blindly. Trace requests with OpenTelemetry or profile with `py-spy` / `cProfile` to identify exact bottlenecks (DB, external APIs, serialization).",
    "Step 2 - Eliminate Blocking I/O: Convert synchronous blocking HTTP/DB calls to asynchronous equivalents (`httpx.AsyncClient`, `asyncpg`, `motor`).",
    "Step 3 - Caching Strategy: Cache expensive idempotent operations (LLM query answers, frequent DB lookups) in Redis using cache keys with appropriate TTLs.",
    "Step 4 - Query Optimization: Add DB indexes, eliminate N+1 queries using JOINs/eager loading, and implement connection pooling.",
    "Step 5 - Async Background Jobs: Offload heavy tasks (email sending, document parsing, embeddings generation) to Celery/ARQ/Redis Queue."
  ],
  "How do you profile Python code?": [
    "`cProfile`: Standard deterministic CPU profiler measuring function call counts and cumulative execution times (`python -m cProfile -s cumtime script.py`).",
    "`py-spy`: Sampling profiler that attaches to running Python processes without altering code or causing significant overhead; generates flame graphs.",
    "`line_profiler`: Granular line-by-line execution time profiling for optimizing hot numerical loops.",
    "`memory_profiler` / `tracemalloc`: Tracks memory allocations, peaks, and object retention to catch memory leaks in long-running services.",
    "APM Tracing: Distributed tracing via OpenTelemetry, Datadog, or Sentry to view spans across microservices and DB/LLM calls."
  ],
  "How would you implement logging in a production application?": [
    "Structured JSON Logging: Output logs as single-line JSON strings so collectors (Fluentd, Logstash, CloudWatch, Datadog) parse fields without regex.",
    "Correlation IDs: Inject a unique `request_id` / `trace_id` into every log record using ContextVar or middleware, allowing end-to-end trace correlation.",
    "Log Levels & Guidelines: Use `INFO` for lifecycle events, `WARNING` for handled non-critical anomalies, `ERROR` for operation failures with stack traces (`exc_info=True`), and `DEBUG` for verbose troubleshooting.",
    "Sanitization: Implement filters to redact sensitive PII, credit cards, bearer tokens, and passwords before writing to stdout.",
    "Non-blocking Output: Log strictly to `stdout`/`stderr` and let the container orchestrator handle log aggregation."
  ],

  /* --- Coding Problems --- */

  "Find duplicate elements in an array.": [
    "Approach: Iterate through the array maintaining a `seen` set and a `duplicates` set to record values seen more than once.",
    "Time Complexity: O(n) single pass through the array.",
    "Space Complexity: O(n) to store unique items in the sets.",
    "Alternative (In-place if numbers 1 to n): Index negation technique achieves O(1) extra space."
  ],
  "Find the first non-repeating character.": [
    "Approach: Count character frequencies in a first pass using `collections.Counter` or hash map. In the second pass, return the first character with frequency 1.",
    "Time Complexity: O(n) where n is string length.",
    "Space Complexity: O(k) where k is the number of distinct characters (at most O(1) for fixed alphabet like ASCII).",
    "Edge Cases: Empty string, all repeating characters (returns `None`)."
  ],
  "Implement an LRU cache.": [
    "Data Structure: Combine a Hash Map (O(1) key-to-node lookup) with a Doubly Linked List (O(1) node removal and insertion to head).",
    "Python Shortcut: `collections.OrderedDict` internally maintains this structure with `move_to_end()` and `popitem(last=False)`.",
    "Get Operation: If key exists, move node to MRU (most recent) position and return value; else return -1/None.",
    "Put Operation: If key exists, update value and move to MRU. If key is new and capacity is exceeded, evict the tail node (LRU) and insert new node at head."
  ],
  "Implement a rate limiter.": [
    "Token Bucket Algorithm: Maintain current token count and last timestamp. On each request, compute elapsed time, add `elapsed * refill_rate` tokens (up to max capacity), and consume 1 token if available.",
    "Sliding Window Counter: Uses Redis sorted sets where timestamps are scored; removes timestamps older than `now - window` and counts remaining elements.",
    "Distributed Considerations: In multi-worker deployments, implement atomicity using Redis Lua scripts to prevent race conditions during token subtraction."
  ],
  "Merge overlapping intervals.": [
    "Algorithm: Sort intervals by start time `intervals.sort(key=lambda x: x[0])`. Initialize merged list with the first interval.",
    "Iterate & Merge: For each subsequent interval, if its start time <= current merged interval's end time, update end time to `max(current_end, next_end)`. Otherwise, append the interval as a new range.",
    "Time Complexity: O(n log n) dominated by initial sorting.",
    "Space Complexity: O(n) to hold merged output list."
  ],
  "Find the top K frequent elements.": [
    "Algorithm 1 (Min-Heap): Count frequencies using `collections.Counter`. Maintain a min-heap of size K keyed by frequency. Push elements and pop smallest when heap size > K.",
    "Algorithm 2 (Bucket Sort - O(n)): Group elements into buckets where bucket index equals frequency count. Traverse buckets backwards to collect top K items.",
    "Time Complexity: O(n log k) with Min-Heap, O(n) with Bucket Sort.",
    "Space Complexity: O(n) for frequency map and heap/buckets."
  ],
  "Implement retry with exponential backoff.": [
    "Formula: `delay = min(max_delay, base_delay * (2 ** attempt)) + jitter`.",
    "Why Jitter Matters: Adding random jitter (`random.uniform(0, 0.1 * delay)`) prevents the 'thundering herd' problem where thousands of failed clients retry simultaneously and overwhelm the recovered backend.",
    "Selective Retries: Only retry transient network errors (HTTP 429, 502, 503, 504, ConnectionReset); never retry 4xx client validation errors."
  ],
  "Process a large file without loading it completely into memory.": [
    "Line-by-Line Streaming: Iterate over the file object directly `for line in file:` which uses internal buffer streaming in O(1) memory.",
    "Chunked Binary Streaming: For binary files or fixed records, use `file.read(chunk_size)` inside an iterator.",
    "Memory-Mapped Files (`mmap`): For random access on multi-gigabyte files, map the file directly to virtual address space without full RAM loading.",
    "Polars/Pandas Chunking: For tabular datasets, use `pl.scan_csv()` (lazy streaming evaluation) or `pd.read_csv(chunksize=10000)`."
  ],
  "Implement a producer-consumer pattern.": [
    "Concurrency Primitive: Use `asyncio.Queue` (for async coroutines) or `queue.Queue` (for multi-threaded workers).",
    "Decoupling: Producers push work without waiting for processing; consumers pull work at their own pace.",
    "Poison Pill Shutdown: Producers push `None` (or sentinel token) when done to signal consumers to gracefully terminate loops.",
    "Backpressure: Use bounded queues `Queue(maxsize=100)` so producers pause if consumers lag behind, preventing out-of-memory crashes."
  ],
  "Write an async function that calls multiple APIs concurrently.": [
    "`asyncio.gather`: Takes multiple coroutine tasks and executes them concurrently on the event loop, returning an ordered list of results.",
    "Exception Handling: Pass `return_exceptions=True` so a single failing API call returns an `Exception` object in the list instead of terminating remaining sibling calls.",
    "Timeouts: Wrap with `asyncio.timeout()` or pass timeouts to `httpx.AsyncClient(timeout=5.0)` to avoid indefinite hanging.",
    "Concurrency Throttling: Use `asyncio.Semaphore(limit)` to cap max simultaneous outbound connections and respect provider rate limits."
  ]
};

export const PYTHON_CODE = {
  "What is the difference between a list, tuple, set, and dictionary?": {
    language: "python",
    code: `# List: Ordered, mutable, allows duplicates
my_list = [1, 2, 2, "apple"]
my_list.append(3)  # [1, 2, 2, 'apple', 3]

# Tuple: Ordered, immutable, hashable (safe dict key)
my_tuple = (1, 2, 2, "apple")
point_map = {(0, 0): "origin", (1, 2): "target"}

# Set: Unordered, unique elements, O(1) membership check
my_set = {1, 2, 2, 3}  # {1, 2, 3}
if 2 in my_set:  # Average O(1) time
    print("Found in O(1)")

# Dictionary: Key-value map, average O(1) lookup
my_dict = {"user_id": 101, "role": "admin"}
print(my_dict.get("role"))  # 'admin'`
  },
  "Explain mutable vs immutable objects in Python.": {
    language: "python",
    code: `# 1. Immutable objects (int, str, tuple): Reassigned, not changed in place
x = 10
print(id(x))
x += 1
print(id(x))  # Different memory address!

# 2. Mutable objects (list, dict, set): Modified in-place
lst = [1, 2]
print(id(lst))
lst.append(3)
print(id(lst))  # Same memory address!

# 3. The Dangerous Default Argument Trap:
def bad_append(val, target=[]):  # Shared list across all calls!
    target.append(val)
    return target

def good_append(val, target=None):  # Idiomatic pattern
    if target is None:
        target = []
    target.append(val)
    return target`
  },
  "What are *args and **kwargs?": {
    language: "python",
    code: `def flexible_api_caller(endpoint: str, *args, timeout: float = 5.0, **kwargs):
    """
    *args captures extra positional arguments as a tuple.
    **kwargs captures extra keyword arguments as a dictionary.
    """
    print(f"Endpoint: {endpoint}")
    print(f"Positional args: {args}")      # e.g. ('arg1', 'arg2')
    print(f"Keyword kwargs: {kwargs}")      # e.g. {'retry': 3, 'auth': 'bearer'}
    print(f"Timeout: {timeout}")

# Unpacking callers:
params = ("v1", "users")
options = {"retry": 3, "auth": "bearer_token"}
flexible_api_caller("/api", *params, timeout=10.0, **options)`
  },
  "Explain shallow copy vs deep copy.": {
    language: "python",
    code: `import copy

original = {"model": "gpt-4o", "params": {"temperature": 0.7, "max_tokens": 1000}}

# Shallow Copy: copies outer dict, but nested dict reference is SHARED
shallow = copy.copy(original)
shallow["params"]["temperature"] = 0.0
print(original["params"]["temperature"])  # 0.0 (Original was mutated!)

# Deep Copy: recursively clones all nested objects
original["params"]["temperature"] = 0.7
deep = copy.deepcopy(original)
deep["params"]["temperature"] = 0.0
print(original["params"]["temperature"])  # 0.7 (Original is safe and isolated)`
  },
  "What is the difference between an iterator and an iterable?": {
    language: "python",
    code: `# Iterable: implements __iter__()
numbers = [1, 2, 3]  # Iterable

# Iterator: stateful stream object implementing __iter__() and __next__()
iterator = iter(numbers)  # calls numbers.__iter__()

print(next(iterator))  # 1
print(next(iterator))  # 2
print(next(iterator))  # 3
# next(iterator) -> raises StopIteration

# Custom Iterator class:
class CountDown:
    def __init__(self, start):
        self.count = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.count <= 0:
            raise StopIteration
        self.count -= 1
        return self.count + 1`
  },
  "Explain Python's GIL.": {
    language: "python",
    code: `import threading
import time

# CPU-bound task: GIL prevents multi-core parallel speedup
def cpu_heavy(n):
    count = 0
    for _ in range(n):
        count += 1
    return count

# I/O-bound task: GIL is released during socket/file I/O
def io_heavy(url):
    import urllib.request
    with urllib.request.urlopen(url) as resp:
        return resp.read()

# Threads run concurrently for I/O, but sequentially for Python bytecodes
threads = [threading.Thread(target=io_heavy, args=("https://python.org",)) for _ in range(5)]
for t in threads: t.start()
for t in threads: t.join()`
  },
  "When would you use multiprocessing vs multithreading?": {
    language: "python",
    code: `from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import math

def cpu_task(n):
    return sum(math.sqrt(i) for i in range(n))

def io_task(url):
    import time; time.sleep(0.5); return f"Fetched {url}"

# 1. Use ProcessPoolExecutor for CPU-bound computation (bypasses GIL)
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_task, [10_000_000] * 4))

# 2. Use ThreadPoolExecutor or asyncio for I/O-bound network waits
with ThreadPoolExecutor(max_workers=10) as executor:
    pages = list(executor.map(io_task, ["url1", "url2", "url3"]))`
  },
  "How does asyncio work?": {
    language: "python",
    code: `import asyncio
import time

async def fetch_llm_response(prompt: str, delay: float) -> str:
    print(f"Starting request for: {prompt}")
    await asyncio.sleep(delay)  # Yields execution back to event loop
    print(f"Completed: {prompt}")
    return f"Result for {prompt}"

async def main():
    start = time.perf_counter()
    # Runs concurrently on single thread
    results = await asyncio.gather(
        fetch_llm_response("summarize", 1.0),
        fetch_llm_response("extract", 1.0),
        fetch_llm_response("translate", 1.0),
    )
    # Total time: ~1.0s (not 3.0s!)
    print(f"All done in {time.perf_counter() - start:.2f}s: {results}")

asyncio.run(main())`
  },
  "What is the difference between synchronous and asynchronous programming?": {
    language: "python",
    code: `import time
import asyncio

# Synchronous: Blocking sequential execution (Total: 3.0s)
def sync_worker():
    def fetch(): time.sleep(1.0)
    start = time.perf_counter()
    fetch(); fetch(); fetch()
    print(f"Sync took: {time.perf_counter() - start:.2f}s")

# Asynchronous: Non-blocking cooperative concurrency (Total: 1.0s)
async def async_worker():
    async def fetch(): await asyncio.sleep(1.0)
    start = time.perf_counter()
    await asyncio.gather(fetch(), fetch(), fetch())
    print(f"Async took: {time.perf_counter() - start:.2f}s")`
  },
  "Explain async and await.": {
    language: "python",
    code: `import asyncio

async def query_vector_db(query: str) -> list[str]:
    # 'async def' defines a coroutine function
    print(f"Embedding query: {query}")
    await asyncio.sleep(0.2)  # 'await' pauses here until I/O completes
    return ["chunk_1", "chunk_2"]

async def main():
    # Calling a coroutine returns a coroutine object
    coro = query_vector_db("RAG design")
    # 'await' executes it and retrieves the value
    chunks = await coro
    print(f"Retrieved: {chunks}")

asyncio.run(main())`
  },
  "How would you handle exceptions in a large Python application?": {
    language: "python",
    code: `class AppException(Exception):
    """Base application domain exception."""
    def __init__(self, message: str, code: str = "INTERNAL_ERROR"):
        super().__init__(message)
        self.code = code

class LLMProviderTimeout(AppException):
    def __init__(self, provider: str):
        super().__init__(f"Provider {provider} timed out after 10s", code="LLM_TIMEOUT")

def call_upstream_service():
    try:
        raise TimeoutError("Socket timeout")
    except TimeoutError as err:
        # Exception chaining preserves root cause stack trace
        raise LLMProviderTimeout(provider="OpenAI") from err

try:
    call_upstream_service()
except AppException as e:
    print(f"Caught clean domain error: {e.code} - {e}")`
  },
  "How would you structure a production Python project?": {
    language: "bash",
    code: `my_genai_service/
├── pyproject.toml              # Dependencies & build config (Poetry/UV/Hatch)
├── Dockerfile                  # Multi-stage container build
├── .env.example                # Example environment variable template
├── src/
│   ├── main.py                 # FastAPI application instantiation & lifecycle
│   ├── core/
│   │   ├── config.py           # Pydantic BaseSettings config
│   │   ├── logging.py          # Structured JSON logging
│   │   └── security.py         # JWT tokens & encryption
│   ├── api/
│   │   └── v1/
│   │       ├── router.py       # Versioned router aggregator
│   │       └── endpoints/      # Route handlers (/chat, /documents)
│   ├── services/               # Core business & agent orchestration logic
│   ├── repositories/           # Vector DB, SQL DB, S3 clients
│   └── models/                 # Pydantic request/response schemas
└── tests/
    ├── unit/                   # Fast mocked unit tests
    └── integration/            # E2E tests with Testcontainers`
  },
  "How do you manage configuration and secrets?": {
    language: "python",
    code: `from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, SecretStr

class AppSettings(BaseSettings):
    app_env: str = Field(default="production", alias="APP_ENV")
    database_url: str = Field(alias="DATABASE_URL")
    openai_api_key: SecretStr = Field(alias="OPENAI_API_KEY")
    max_connections: int = Field(default=20, gt=0)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate single typed configuration instance
config = AppSettings()
# Access safe values: config.database_url
# Access secret value securely: config.openai_api_key.get_secret_value()`
  },
  "How do you optimize a slow Python API?": {
    language: "python",
    code: `import asyncio
import asyncpg
import redis.asyncio as redis

# 1. Connection pooling for Database
async def create_db_pool():
    return await asyncpg.create_pool("postgresql://user:pass@localhost/db", min_size=5, max_size=20)

# 2. Redis Caching for expensive idempotent computations
async def get_user_profile(user_id: str, r_client: redis.Redis, db_pool: asyncpg.Pool):
    cache_key = f"user:{user_id}"
    cached = await r_client.get(cache_key)
    if cached:
        return cached.decode("utf-8")

    async with db_pool.acquire() as conn:
        profile = await conn.fetchval("SELECT profile_json FROM users WHERE id = $1", user_id)
        await r_client.setex(cache_key, 300, profile)  # 5 min TTL
        return profile`
  },
  "How do you profile Python code?": {
    language: "python",
    code: `import cProfile
import pstats
import io

def heavy_computation():
    return [i ** 2 for i in range(1_000_000)]

# Deterministic function call profiling
profiler = cProfile.Profile()
profiler.enable()

heavy_computation()

profiler.disable()
s = io.StringIO()
ps = pstats.Stats(profiler, stream=s).sort_stats("cumulative")
ps.print_stats(10)  # Print top 10 most time-consuming calls
print(s.getvalue())

# Production sampling profile via terminal:
# py-spy top --pid 12345
# py-spy record -o profile.svg --pid 12345`
  },
  "What are decorators? Give a real-world use case.": {
    language: "python",
    code: `import functools
import time
import logging

logger = logging.getLogger("api")

def retry_with_backoff(max_retries=3, base_delay=1.0):
    """Decorator that retries an async operation with exponential backoff."""
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            delay = base_delay
            for attempt in range(1, max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as exc:
                    if attempt == max_retries:
                        logger.error(f"Final failure after {attempt} retries: {exc}")
                        raise
                    logger.warning(f"Attempt {attempt} failed ({exc}). Retrying in {delay:.2f}s...")
                    time.sleep(delay)
                    delay *= 2
        return wrapper
    return decorator

# Usage:
# @retry_with_backoff(max_retries=3)
# async def call_llm_api(prompt: str): ...`
  },
  "What are generators and why would you use them?": {
    language: "python",
    code: `def stream_large_dataset(file_path: str, batch_size: int = 1000):
    """Yields batches of lines lazily with O(1) memory overhead."""
    batch = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            batch.append(line.strip())
            if len(batch) == batch_size:
                yield batch
                batch = []
        if batch:
            yield batch

# Usage:
# for chunk in stream_large_dataset("10GB_docs.jsonl"):
#     process_and_embed(chunk)`
  },
  "What are context managers?": {
    language: "python",
    code: `from contextlib import asynccontextmanager
import asyncpg

@asynccontextmanager
async def db_transaction_scope(pool: asyncpg.Pool):
    """Async context manager managing connection acquisition and transaction rollback/commit."""
    conn = await pool.acquire()
    tx = conn.transaction()
    await tx.start()
    try:
        yield conn
        await tx.commit()
    except Exception:
        await tx.rollback()
        raise
    finally:
        await pool.release(conn)

# Usage:
# async with db_transaction_scope(app_pool) as conn:
#     await conn.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1")`
  },
  "Explain dependency injection in Python.": {
    language: "python",
    code: `from typing import Protocol
from fastapi import FastAPI, Depends

# 1. Interface abstraction
class LLMProvider(Protocol):
    async def complete(self, prompt: str) -> str: ...

# 2. Concrete implementations
class OpenAIProvider:
    async def complete(self, prompt: str) -> str:
        return "OpenAI response"

class MockLLMProvider:
    async def complete(self, prompt: str) -> str:
        return "Mocked test response"

# 3. Factory dependency
def get_llm_service() -> LLMProvider:
    return OpenAIProvider()

app = FastAPI()

@app.post("/generate")
async def generate_text(prompt: str, llm: LLMProvider = Depends(get_llm_service)):
    return {"result": await llm.complete(prompt)}

# Unit tests can simply override:
# app.dependency_overrides[get_llm_service] = lambda: MockLLMProvider()`
  },
  "How would you implement logging in a production application?": {
    language: "python",
    code: `import logging
import json
import sys
from contextvars import ContextVar

request_id_ctx: ContextVar[str] = ContextVar("request_id", default="N/A")

class JSONLogFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "request_id": request_id_ctx.get(),
            "path": f"{record.pathname}:{record.lineno}",
        }
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JSONLogFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler])`
  },
  "Find duplicate elements in an array.": {
    language: "python",
    code: `def find_duplicates(nums: list[int]) -> list[int]:
    seen = set()
    duplicates = set()
    for num in nums:
        if num in seen:
            duplicates.add(num)
        else:
            seen.add(num)
    return list(duplicates)

# Example:
# print(find_duplicates([1, 2, 3, 2, 4, 5, 1])) -> [1, 2]`
  },
  "Find the first non-repeating character.": {
    language: "python",
    code: `from collections import Counter

def first_unique_char(s: str) -> str | None:
    counts = Counter(s)
    for ch in s:
        if counts[ch] == 1:
            return ch
    return None

# Example:
# print(first_unique_char("leetcode")) -> "l"
# print(first_unique_char("loveleetcode")) -> "v"`
  },
  "Implement an LRU cache.": {
    language: "python",
    code: `class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> Node
        self.head, self.tail = Node(), Node()
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node: Node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_head(self, node: Node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert_head(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert_head(node)
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`
  },
  "Implement a rate limiter.": {
    language: "python",
    code: `import time

class TokenBucketRateLimiter:
    def __init__(self, rate: float, capacity: float):
        self.rate = rate          # tokens added per second
        self.capacity = capacity  # max tokens bucket can hold
        self.tokens = capacity
        self.last_updated = time.monotonic()

    def allow_request(self, tokens_needed: float = 1.0) -> bool:
        now = time.monotonic()
        elapsed = now - self.last_updated
        self.last_updated = now

        # Refill tokens based on elapsed time
        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)

        if self.tokens >= tokens_needed:
            self.tokens -= tokens_needed
            return True
        return False

# Usage:
# limiter = TokenBucketRateLimiter(rate=10, capacity=20) # 10 req/s, burst 20
# if limiter.allow_request(): proceed() else: raise 429`
  },
  "Merge overlapping intervals.": {
    language: "python",
    code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current in intervals[1:]:
        prev_start, prev_end = merged[-1]
        curr_start, curr_end = current

        if curr_start <= prev_end:
            # Overlap -> merge by updating end
            merged[-1][1] = max(prev_end, curr_end)
        else:
            merged.append(current)
    return merged

# Example:
# print(merge_intervals([[1,3],[2,6],[8,10],[15,18]])) -> [[1,6],[8,10],[15,18]]`
  },
  "Find the top K frequent elements.": {
    language: "python",
    code: `from collections import Counter
import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    # Min-heap storing tuples of (frequency, num)
    min_heap = []
    for num, freq in count.items():
        heapq.heappush(min_heap, (freq, num))
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return [num for freq, num in min_heap]

# Example:
# print(top_k_frequent([1,1,1,2,2,3], k=2)) -> [2, 1]`
  },
  "Implement retry with exponential backoff.": {
    language: "python",
    code: `import asyncio
import random
import logging

logger = logging.getLogger(__name__)

async def retry_async(coro_fn, max_retries: int = 4, base_delay: float = 0.5, max_delay: float = 8.0):
    """Executes an async callable with exponential backoff and jitter."""
    for attempt in range(max_retries):
        try:
            return await coro_fn()
        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"Exhausted retries. Raising: {e}")
                raise
            # Exponential backoff + full jitter
            delay = min(max_delay, base_delay * (2 ** attempt))
            jittered_delay = delay + random.uniform(0, 0.1 * delay)
            logger.warning(f"Retry {attempt + 1}/{max_retries} in {jittered_delay:.2f}s due to: {e}")
            await asyncio.sleep(jittered_delay)`
  },
  "Process a large file without loading it completely into memory.": {
    language: "python",
    code: `def process_large_csv(input_path: str, output_path: str):
    """Processes gigabytes of CSV data in constant memory."""
    with open(input_path, mode="r", encoding="utf-8") as infile, \\
         open(output_path, mode="w", encoding="utf-8") as outfile:
        header = infile.readline()
        outfile.write(header)
        for line_num, line in enumerate(infile, start=2):
            fields = line.strip().split(",")
            # Transformation logic
            if fields[2] == "ACTIVE":
                outfile.write(",".join(fields) + "\\n")`
  },
  "Implement a producer-consumer pattern.": {
    language: "python",
    code: `import asyncio
import random

async def producer(queue: asyncio.Queue, producer_id: int):
    for i in range(5):
        item = f"task_{producer_id}_{i}"
        await queue.put(item)
        print(f"Producer {producer_id} produced {item}")
        await asyncio.sleep(random.uniform(0.1, 0.3))

async def consumer(queue: asyncio.Queue, consumer_id: int):
    while True:
        item = await queue.get()
        if item is None:  # Sentinel value indicating shutdown
            queue.task_done()
            break
        print(f"Consumer {consumer_id} processed {item}")
        await asyncio.sleep(random.uniform(0.2, 0.4))
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=10)
    producers = [asyncio.create_task(producer(queue, i)) for i in range(2)]
    consumers = [asyncio.create_task(consumer(queue, i)) for i in range(3)]
    await asyncio.gather(*producers)
    # Send poison pills to stop consumers
    for _ in consumers:
        await queue.put(None)
    await queue.join()
    await asyncio.gather(*consumers)`
  },
  "Write an async function that calls multiple APIs concurrently.": {
    language: "python",
    code: `import asyncio
import httpx

async def fetch_endpoint(client: httpx.AsyncClient, url: str, semaphore: asyncio.Semaphore) -> dict:
    async with semaphore:
        try:
            resp = await client.get(url, timeout=5.0)
            resp.raise_for_status()
            return {"url": url, "status": resp.status_code, "data": resp.json()}
        except Exception as exc:
            return {"url": url, "error": str(exc)}

async def fetch_all_concurrently(urls: list[str]) -> list[dict]:
    # Semaphore limits concurrent connections to avoid socket exhaustion
    sem = asyncio.Semaphore(10)
    async with httpx.AsyncClient() as client:
        tasks = [fetch_endpoint(client, url, sem) for url in urls]
        return await asyncio.gather(*tasks)`
  }
};
