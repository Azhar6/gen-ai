// Section 4: RAG (Retrieval-Augmented Generation) (21 Questions - Deep, 5-YOE Level Study Answers & Code Samples)

export const RAG_ANSWERS = {
  "Explain RAG end-to-end.": [
    "Phase 1: Ingestion Pipeline (Offline/Async): 1) Connectors ingest raw multi-format files (PDF, DOCX, HTML, DB records), 2) Parsing & OCR extraction with layout preservation, 3) Text cleaning & deduplication, 4) Structure-aware semantic chunking, 5) Dense embedding generation, 6) Upserting vectors + metadata + ACL permissions into a vector/hybrid database.",
    "Phase 2: Retrieval Pipeline (Online/Real-time): 1) User query intake & security context extraction, 2) Query transformation (Hypothetical Document Embeddings / HyDE or multi-query expansion), 3) Hybrid search (BM25 sparse + ANN dense vectors) with metadata ACL filtering, 4) Cross-Encoder Reranking to select top 3-5 high-signal chunks.",
    "Phase 3: Generation & Synthesis: 1) System prompt assembly injecting structured context chunks with explicit chunk IDs, 2) LLM generation enforcing strict citations and 'if unverified, refuse' constraints, 3) Output validation & guardrail checks.",
    "Phase 4: Observability & Continuous Evaluation: Trace latency per stage, log user queries and cited chunks, and compute automated Faithfulness and Context Precision scores."
  ],
  "What happens when a PDF enters your RAG system?": [
    "Step 1 - Ingestion & Storage: File uploads to S3/Azure Blob Storage; triggers an S3 Event notification to an SQS queue. Raw file is stored immutably with SHA-256 hash checksum.",
    "Step 2 - Extraction & Layout Analysis: Worker pulls task from queue. If digital PDF, extracts text and font metadata via PyMuPDF/pdfplumber. If scanned image, routes to OCR layout engines (AWS Textract, Azure Document Intelligence) to extract hierarchical headings and markdown tables.",
    "Step 3 - Chunking & Metadata Enrichment: Splits document into 500-token chunks with 10% overlap, preserving document section headings, page numbers, tenant ID, and ACL tags.",
    "Step 4 - Embedding & Upsert: Chunks are batched and embedded using `text-embedding-3-small`. Dense vectors + chunk text + metadata payload are upserted into the vector database in an idempotent transaction.",
    "Step 5 - Status Update: Document status marked as `INDEXED` in SQL registry, and notification emitted via WebSocket/SSE to user interface."
  ],
  "How do you extract text from PDFs?": [
    "Text-Layer PDFs: Use high-speed native extraction libraries like `PyMuPDF` (fitz) or `pdfplumber`. 100x faster than OCR with zero image distortion.",
    "Scanned / Image-heavy PDFs: Use OCR pipelines with layout awareness. Cloud APIs (AWS Textract, Azure Document Intelligence, Google Document AI) extract key-value pairs, nested tables, and reading order far better than raw Tesseract.",
    "Complex Visual Documents (Forms, Infographics): Convert PDF pages to images and process using Vision-Language Models (e.g. GPT-4o Vision or ColPali) to generate semantic descriptions.",
    "Layout Preservation: Always extract text with structure (Markdown headings `#`, `##`, table delimiters `|---|`) so downstream chunkers respect logical document hierarchy."
  ],
  "What is chunking?": [
    "Definition: The process of breaking continuous long documents into discrete, semantically coherent text segments prior to embedding and indexing.",
    "Why Chunking is Necessary: 1) Embedding models and LLM context windows have fixed token limits, 2) Dense vector similarity performs best when matching concise, topic-specific passages rather than diluted 50-page documents.",
    "Chunk Anatomy: A production chunk contains 1) Main text content, 2) Parent document hierarchy header (e.g. `Document > Section 2 > Subclause A`), 3) Metadata dictionary (page, author, creation date, ACL permissions, source URI)."
  ],
  "What chunk size would you choose?": [
    "Empirical Standard: 256 to 512 tokens is the industry sweet spot for general Q&A and technical documentation.",
    "Small Chunks (128-256 tokens): Maximizes embedding precision and semantic similarity matching; risk of losing broader surrounding context (mitigated by Small-to-Big / Parent Document retrieval).",
    "Large Chunks (512-1024 tokens): Retains rich narrative context and complex explanations; risk of diluting vector similarity and filling prompt budget with irrelevant text.",
    "Decision Framework: Base chunk size on target query granularity. Fine-grained fact lookup (FAQ, numbers) -> small chunks; reasoning and legal synthesis -> larger chunks with reranking."
  ],
  "What is chunk overlap?": [
    "Definition: The number of tokens shared between consecutive chunks (typically 10% to 20% of chunk size, e.g., 50 tokens for a 500-token chunk).",
    "Problem Solved: Prevents critical semantic statements or split sentences from being bifurcated across chunk boundaries, ensuring retrieval captures the complete thought regardless of where the sliding window cut falls.",
    "Trade-off: Increases total vector storage and embedding API costs by ~15%, but universally improves retrieval recall."
  ],
  "Fixed-size chunking vs semantic chunking?": [
    "Fixed-Size Chunking: Splits text purely based on character/token count (e.g., every 500 tokens with 50-token overlap). Fast and computationally trivial, but frequently cuts sentences mid-thought or merges unrelated paragraphs.",
    "Semantic Chunking: Analyzes semantic similarity between consecutive sentences using embedding distance or natural document syntax (headings, markdown headers, paragraph breaks). Chunks break only when the semantic topic shifts.",
    "Recommendation: Use Recursive Character Splitting (splitting by `\\n\\n`, `\\n`, `.`, ` `) as the production baseline, and Semantic/Markdown splitting for highly structured technical and legal documents."
  ],
  "How do you handle tables in PDFs?": [
    "Problem: Naive PDF text extractors flatten tables into unreadable sequences of unordered numbers and words, destroying row-column relationships.",
    "Strategy 1 - Markdown / HTML Representation: Extract tables using Azure Document Intelligence, Camelot, or AWS Textract and format as Markdown tables (`| Col1 | Col2 |`). Chunks containing tables must never split across rows.",
    "Strategy 2 - Table Summarization: Pass the table to a small LLM to generate a dense semantic summary (e.g. 'Table comparing Q3 revenue by region showing APAC up 14%'), embed the summary for retrieval, and inject the raw table as context.",
    "Strategy 3 - Text-to-SQL Offloading: For massive relational tables, load data into a SQL database and equip an AI agent with a SQL query tool instead of embedding raw rows in vector DB."
  ],
  "How do you preserve document metadata?": [
    "Payload Storage: Vector databases store dense vectors alongside a JSON metadata payload for each chunk.",
    "Essential Metadata Fields: `doc_id`, `chunk_id`, `file_name`, `page_number`, `section_title`, `created_at`, `tenant_id`, `access_roles`.",
    "Search-Time Filtering: Query time applies metadata filters (e.g. `filter={'tenant_id': 'org_123', 'access_roles': {'$in': user.roles}}`), guaranteeing security isolation and eliminating search across unauthorized or out-of-date documents.",
    "Document Lifecycle: Maintain a relational SQL catalog tracking document version numbers to cleanly delete/update all vector chunks when a document is updated or deleted."
  ],
  "How do you generate embeddings?": [
    "Batching Pipeline: Batch text chunks into arrays of 100-500 passages per embedding API request to maximize throughput.",
    "Model Consistency: The EXACT same embedding model (and version) must be used for both document ingestion and runtime query embedding. Mixing models produces garbage distance calculations.",
    "Prefix Requirements: Certain models (E5, BGE, Cohere) require explicit task prefixes (e.g. `search_document:` for chunks and `search_query:` for user queries) to align asymmetry.",
    "Normalization: Ensure vectors are L2-normalized so fast inner product / dot product operations equal cosine similarity."
  ],
  "Where do you store embeddings?": [
    "Dedicated Vector Databases: Pinecone, Qdrant, Milvus, Weaviate - optimized for billion-scale vector indexes, fast HNSW graph traversal, and distributed sharding.",
    "Relational Extension (pgvector): PostgreSQL extension supporting vector search alongside standard ACID relational data. Best choice when you already run Postgres and have <10M vectors.",
    "Enterprise Search Engines: Azure AI Search, OpenSearch, Elasticsearch - combine native BM25 search, vector search, and enterprise security in a single cluster.",
    "In-Memory Libraries (FAISS): Facebook AI Similarity Search library for embedded, ephemeral, or single-node Python search."
  ],
  "Vector DB vs traditional database?": [
    "Query Paradigm: Traditional DBs execute exact boolean matching (`WHERE age > 21 AND status = 'ACTIVE'`); Vector DBs execute approximate high-dimensional nearest neighbor similarity search (`FIND 10 NEAREST VECTORS TO Q`).",
    "Indexing: Traditional DBs use B-Trees and Hash Indexes; Vector DBs use Approximate Nearest Neighbor (ANN) graphs (HNSW) or inverted file indexes (IVF).",
    "Compute Profile: Vector search is GPU/CPU matrix math intensive (calculating dot products across thousands of dimensions).",
    "Production Standard: Modern architectures use hybrid databases (pgvector, OpenSearch) or pair a relational DB for transactions/metadata with a vector DB for similarity search."
  ],
  "FAISS vs Pinecone vs Azure AI Search vs OpenSearch?": [
    "FAISS: Low-level C++/Python library. Extremely fast, zero network latency (in-process), but lacks native persistence, replication, metadata filtering, or multi-tenant API management.",
    "Pinecone: Fully managed serverless cloud vector database. Zero ops overhead, high availability, instant scaling, metadata filtering, but closed-source and incurs recurring SaaS costs.",
    "Azure AI Search: Enterprise managed search engine. World-class hybrid search (BM25 + vector + semantic reranking), native Azure RBAC integration, and built-in document cracking.",
    "OpenSearch: Open-source distributed search engine. Excellent for teams already running ELK stacks who want full control over hybrid search on AWS infrastructure."
  ],
  "What is approximate nearest neighbor search?": [
    "Exact KNN vs ANN: Exact K-Nearest Neighbors calculates distances against every single vector in the database (O(N) brute force), which becomes intolerably slow (>1 second) at millions of vectors.",
    "ANN Concept: Uses probabilistic algorithms to sacrifice a tiny fraction of accuracy (<1% recall loss) to find nearest vectors in logarithmic O(log N) or sub-linear time (milliseconds).",
    "Key Algorithm Families: 1) Graph-based (HNSW), 2) Inverted File Indexing with Quantization (IVF-PQ), 3) Tree-based (Annoy)."
  ],
  "What is HNSW?": [
    "Hierarchical Navigable Small World: The gold-standard graph-based indexing algorithm for vector similarity search.",
    "Multi-Layer Skip-List Graph: Builds multi-layered geometric graphs. Upper layers have long-distance links for fast global routing across vector space; bottom layer has dense localized links for fine-grained nearest neighbor selection.",
    "Pros: Outstanding query latency, high recall (>98%), and support for dynamic incremental vector additions.",
    "Cons: High RAM consumption (stores graph adjacency lists in memory) and longer build/indexing time."
  ],
  "What is hybrid search?": [
    "Combination Architecture: Executes simultaneous BM25 keyword search and dense vector search, then merges results using Reciprocal Rank Fusion (RRF).",
    "Addresses Vector Search Weaknesses: Vector embeddings frequently miss exact matches on product codes (`X-500`), acronyms, employee IDs, and specific alphanumeric tokens. BM25 guarantees exact keyword recall.",
    "RRF Formula: `RRF_Score(d) = sum( 1 / (60 + rank_dense(d)) + 1 / (60 + rank_sparse(d)) )`.",
    "Production Requirement: Any enterprise RAG system serving customer search must implement hybrid search to meet baseline accuracy expectations."
  ],
  "Why do you need reranking?": [
    "Overcoming First-Stage Limits: Vector search (Bi-Encoders) embeds queries and documents independently into fixed-length vectors, compressing complex nuances. Fast for top-100 filtering, but noisy.",
    "Deep Cross-Attention: Rerankers (Cross-Encoders) take the user query and candidate chunk together as a joint input sequence, allowing every query token to attend to every document token.",
    "Latency & Accuracy Balance: Running a Cross-Encoder on 10,000 documents takes seconds; running it on the top 30 candidate chunks from vector search takes ~50ms and yields a massive boost in precision.",
    "Context Window Optimization: Eliminates irrelevant chunks so only the top 3-5 highest-signal context passages enter the LLM prompt, reducing token cost and preventing hallucinations."
  ],
  "How would you improve poor retrieval?": [
    "1. Hybrid Search + Reranker: Upgrade from pure vector search to Hybrid (BM25 + Dense) followed by a Cross-Encoder reranker (Cohere/BGE).",
    "2. Query Expansion & Rewriting: Use an LLM step to rewrite conversational user queries into standalone search statements or generate hypothetical document answers (HyDE).",
    "3. Structure-Aware Chunking: Adjust chunk sizes (test 256 vs 512 tokens) and ensure metadata headers (section names) are prepended to chunk bodies.",
    "4. Small-to-Big / Parent Document Retrieval: Embed small, concise sentences for accurate matching, but retrieve and feed the entire parent paragraph to the LLM.",
    "5. Contextual Embeddings: Prepend document-level context summaries to individual chunks before embedding (Anthropic contextual retrieval technique)."
  ],
  "What happens if the correct information exists in the document but isn't retrieved?": [
    "Root Cause Identification: 1) Bad Chunking (fact split across chunk boundaries), 2) Query-Document Mismatch (query vocabulary diverges from document phrasing), 3) Semantic Dilution (chunk is too large and the critical sentence's vector is drowned out), 4) Strict/Erroneous Metadata Filters.",
    "Fix 1 - Query Rewriting & HyDE: Expand user query with synonyms or hypothetical completions to align vector space.",
    "Fix 2 - Multi-Vector / Parent-Child Indexing: Index smaller chunk embeddings linked to full parent documents.",
    "Fix 3 - Increase Initial Top-K: Retrieve top 50 candidates from vector DB instead of top 5, and let the Cross-Encoder reranker filter down to top 5.",
    "Fix 4 - Hybrid Search: Enable BM25 to catch specific terminology that dense embeddings missed."
  ],
  "How do you evaluate RAG?": [
    "The RAG Triad Framework (Ragas / TruLens):",
    "1. Context Relevance: Are the retrieved chunks relevant and noise-free for answering the user's query? (Measures Retrieval Quality).",
    "2. Groundedness / Faithfulness: Is every claim in the generated answer directly supported by the retrieved context? (Measures Hallucination Rate).",
    "3. Answer Relevance: Does the generated answer directly address the user's original question? (Measures Generation Quality).",
    "Ground Truth Benchmarking: Curate 100+ golden Q&A pairs and run automated regression evaluation pipelines on every prompt, chunking, or embedding change."
  ],
  "Your RAG system is giving wrong answers even though the answer exists in the document. How would you debug it?": [
    "Systematic Stage-by-Stage Diagnostic Protocol:",
    "Stage 1 - Document Parsing Audit: Inspect raw extracted text in database. Did OCR mangle the text or drop table columns during PDF ingestion?",
    "Stage 2 - Chunking Inspection: Locate the exact chunk containing the answer. Was the critical sentence severed across chunk boundaries without overlap?",
    "Stage 3 - Retrieval Verification: Run the query through the retrieval engine. Did the correct chunk appear in top-K candidates? If NO -> vocabulary mismatch; fix with query rewrite or BM25 hybrid search.",
    "Stage 4 - Reranker Inspection: Did the chunk get retrieved in top 50 but filtered out by the reranker? If YES -> adjust reranker score threshold.",
    "Stage 5 - Prompt & Context Inspection: Was the chunk actually present in the final prompt sent to the LLM? Check for context window truncation or 'lost in the middle' positioning.",
    "Stage 6 - LLM Generation & System Prompt: If context is verified present in prompt, inspect instructions: is temperature too high? Are conflicting chunks confusing the model? Tighten system prompt to 'Answer only from context and cite chunk ID'."
  ]
};

export const RAG_CODE = {
  "What is chunking?": {
    language: "python",
    code: `def recursive_character_chunking(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:
    """Splits text recursively by paragraphs, sentences, and words to preserve semantics."""
    separators = ["\\n\\n", "\\n", ". ", " "]
    chunks = []
    
    def split_text(sub_text: str, sep_idx: int):
        if len(sub_text) <= chunk_size or sep_idx >= len(separators):
            chunks.append(sub_text.strip())
            return
        
        sep = separators[sep_idx]
        parts = sub_text.split(sep)
        current_chunk = ""
        
        for part in parts:
            if len(current_chunk) + len(part) + len(sep) <= chunk_size:
                current_chunk += (sep if current_chunk else "") + part
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = part
        if current_chunk:
            chunks.append(current_chunk.strip())
            
    split_text(text, 0)
    return chunks`
  },
  "Explain RAG end-to-end.": {
    language: "python",
    code: `import openai

openai_client = openai.OpenAI()

def generate_rag_answer(query: str, user_tenant_id: str, vector_db, reranker) -> dict:
    # 1. Embed query
    q_vec = openai_client.embeddings.create(
        input=query, model="text-embedding-3-small"
    ).data[0].embedding

    # 2. Hybrid Retrieval with Metadata ACL filtering (Top 30)
    candidate_chunks = vector_db.query(
        vector=q_vec,
        top_k=30,
        filter={"tenant_id": user_tenant_id, "is_active": True}
    )

    # 3. Cross-Encoder Reranking (Select Top 4)
    ranked_chunks = reranker.rerank(
        query=query, 
        documents=[c["text"] for c in candidate_chunks], 
        top_n=4
    )

    # 4. Assemble Grounded Prompt with Citations
    context_text = "\\n\\n".join(
        [f"[Chunk {idx+1}]: {doc.text}" for idx, doc in enumerate(ranked_chunks)]
    )
    
    system_prompt = (
        "You are an enterprise AI assistant. Answer the user question STRICTLY using only the provided chunks below. "
        "Cite chunk numbers like [Chunk 1] for every factual claim. If the answer is not in the context, say 'I cannot find this in the documents.'\\n\\n"
        f"Context Chunks:\\n{context_text}"
    )

    # 5. LLM Synthesis
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        temperature=0.0,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]
    )

    return {
        "answer": response.choices[0].message.content,
        "citations": [c.metadata for c in ranked_chunks]
    }`
  }
};
