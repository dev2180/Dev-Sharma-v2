/**
 * Project dossier data — researched from the live GitHub repos:
 *   github.com/dev2180/rag-async-chat  (D-RAG)
 *   github.com/dev2180/DeadCrypt
 */

export interface PipelineStage {
  id: string;
  name: string;
  detail: string;
}

export interface Dossier {
  slug: string;
  codename: string;
  title: string;
  classification: string;
  status: string;
  tagline: string;
  description: string;
  repo: string;
  stack: { tech: string; role: string }[];
  pipeline: PipelineStage[];
  features: { title: string; body: string }[];
  fileTree: string[];
  sequence: string[];
  metrics: { label: string; value: string }[];
}

export const DOSSIERS: Dossier[] = [
  {
    slug: "d-rag",
    codename: "MISSION 01",
    title: "D-RAG",
    classification: "PRODUCTION RAG ENGINE",
    status: "DEPLOYED",
    tagline: "Ask questions about your PDFs. Get answers grounded in them.",
    description:
      "A production-grade Retrieval-Augmented Generation system with two operating modes: an asynchronous FastAPI + Redis Queue API for production, and a synchronous CLI for development. Every answer is grounded in document content, with conversational memory, multi-query expansion, cross-encoder reranking and context compression keeping the LLM honest.",
    repo: "https://github.com/dev2180/rag-async-chat",
    stack: [
      { tech: "FastAPI", role: "Async HTTP API server" },
      { tech: "Redis / Valkey + RQ", role: "Job queue & chat memory" },
      { tech: "Qdrant", role: "Hybrid dense + sparse vector DB" },
      { tech: "SentenceTransformers", role: "Dense embeddings · all-MiniLM-L6-v2 · 384-dim" },
      { tech: "FastEmbed BM25", role: "Sparse keyword-exact embeddings" },
      { tech: "CrossEncoder", role: "ms-marco-MiniLM reranking" },
      { tech: "Ollama · llama3.2", role: "Grounded answer generation" },
      { tech: "pypdf + NLTK", role: "PDF parsing & sentence-aware chunking" },
    ],
    pipeline: [
      { id: "query", name: "QUERY", detail: "User question + session history" },
      { id: "optimizer", name: "OPTIMIZER", detail: "3 diverse query variants · anaphora resolution" },
      { id: "retriever", name: "HYBRID RETRIEVER", detail: "Dense + BM25 merged via Reciprocal Rank Fusion" },
      { id: "reranker", name: "RERANKER", detail: "CrossEncoder re-scores all candidates" },
      { id: "compressor", name: "COMPRESSOR", detail: "Score threshold + keyword overlap · ≥1 chunk guaranteed" },
      { id: "llm", name: "LLM", detail: "Ollama streams a grounded, cited answer" },
    ],
    features: [
      { title: "Multi-query expansion", body: "The optimizer rewrites every question into 3 diverse variants and resolves pronouns against chat history — maximizing retrieval coverage before a single vector is searched." },
      { title: "Hybrid RRF search", body: "Dense semantic vectors and BM25 sparse keyword vectors are searched in parallel inside Qdrant, then merged with Reciprocal Rank Fusion — semantic recall with keyword-exact precision." },
      { title: "CrossEncoder reranking", body: "A ms-marco cross-encoder re-scores every candidate chunk against the original query, filtering 60% of low-quality chunks before they reach the LLM." },
      { title: "Context compression", body: "Two-pass filtering by score threshold and keyword overlap cuts token waste, with a guaranteed minimum of one chunk so the LLM never answers blind." },
      { title: "Async job architecture", body: "POST /api/chat enqueues a job and returns instantly; RQ workers process the pipeline and clients poll /api/result/{job_id}. The API never blocks on a 2-second LLM call." },
      { title: "Hash-based ingestion", body: "SHA-256 file hashing skips unchanged PDFs and reconciles deleted ones, so the vector store always mirrors the document folder exactly." },
      { title: "Per-stage observability", body: "A LatencyTracker context manager times every pipeline stage, and a trace log records the full 'thinking process' of each answer." },
      { title: "Strict layer isolation", body: "Every module has explicit 'must NOT' boundaries with abstract base interfaces — embedders and LLMs are swappable without touching the engine." },
    ],
    fileTree: [
      "app/",
      "├─ api/         routes · schemas",
      "├─ rag/         engine · retriever · optimizer · reranker · compressor · citations",
      "├─ embedding/   dense (MiniLM) · sparse (BM25)",
      "├─ ingestion/   pdf_loader · chunker · hasher · pipeline",
      "├─ llm/         ollama_client (blocking + streaming)",
      "├─ queue/       redis + RQ connection",
      "├─ chat/        redis-backed session memory",
      "├─ tasks/       rag_chat_task (worker entry)",
      "├─ utils/       latency tracker · trace logger",
      "├─ vectorstore/ qdrant hybrid RRF wrapper",
      "└─ workers/     cross-platform worker bootstrap",
      "tests/          chunker · compressor · optimizer · reranker · e2e",
    ],
    sequence: [
      "Client POSTs /api/chat with session id + query",
      "FastAPI enqueues rag_chat_task → returns job_id instantly",
      "RQ worker dequeues → RAGEngine.answer()",
      "history → optimize → hybrid search → rerank → compress → prompt → Ollama",
      "Result stored in Redis with citations + per-stage metrics",
      "Client polls GET /api/result/{job_id} → grounded answer",
    ],
    metrics: [
      { label: "Retrieval coverage", value: "+40%" },
      { label: "Low-quality chunks filtered", value: "−60%" },
      { label: "Embedding dimensions", value: "384" },
      { label: "Query variants per question", value: "3×" },
    ],
  },
  {
    slug: "deadcrypt",
    codename: "MISSION 02",
    title: "DEADCRYPT",
    classification: "DATA-TO-VIDEO CODEC",
    status: "OPERATIONAL",
    tagline: "Any file, hidden in plain sight as TV static.",
    description:
      "A systems-level Python tool that encodes arbitrary files into videos of static-like RGB pixel frames — the look of a dead TV channel — and decodes them back, byte-perfect. Raw bytes become pixel values, pixel frames become video, and FFmpeg's lossless FFV1 codec guarantees that what comes out is exactly what went in.",
    repo: "https://github.com/dev2180/DeadCrypt",
    stack: [
      { tech: "Python", role: "Core encoder / decoder logic" },
      { tech: "NumPy", role: "Byte → RGB pixel array mapping" },
      { tech: "Pillow", role: "Frame image construction" },
      { tech: "FFmpeg · FFV1", role: "Lossless video encoding" },
    ],
    pipeline: [
      { id: "file", name: "ANY FILE", detail: "Raw bytes read from disk" },
      { id: "bytes", name: "BYTE STREAM", detail: "Sequential byte values 0–255" },
      { id: "pixels", name: "RGB PIXELS", detail: "Bytes mapped to pixel channel values" },
      { id: "frames", name: "FRAMES", detail: "Pixels packed into YouTube-standard resolutions" },
      { id: "video", name: "FFV1 VIDEO", detail: "Lossless codec — zero data corruption" },
    ],
    features: [
      { title: "Lossless round-trip", body: "FFV1 is a lossless codec, so encode → decode returns a byte-identical file. The decoder doubles as an integrity verifier." },
      { title: "Resolution presets", body: "Output targets standard YouTube resolutions, so an encoded file looks like any other video to a platform." },
      { title: "Static-noise aesthetic", body: "Frames look like classic TV 'no signal' static — data hiding in the most ignorable visual texture that exists." },
      { title: "Zero-config workflow", body: "encoder.py and decoder.py auto-create encoded/ and decoded/ directories and walk you through file selection numerically." },
    ],
    fileTree: [
      "DeadCrypt/",
      "├─ encoder.py    file → static-frame video",
      "├─ decoder.py    video → original file",
      "├─ encoded/      output videos",
      "└─ decoded/      restored files",
    ],
    sequence: [
      "Run encoder.py and point it at any file",
      "Bytes are mapped into RGB pixel values via NumPy",
      "Pixels are packed into frames at the chosen resolution",
      "FFmpeg writes a lossless FFV1 video to encoded/",
      "decoder.py reverses every step → byte-identical file in decoded/",
    ],
    metrics: [
      { label: "Data integrity", value: "100%" },
      { label: "Codec", value: "FFV1" },
      { label: "Input formats", value: "ANY" },
      { label: "Visual cover", value: "TV STATIC" },
    ],
  },
];

export function getDossier(slug: string) {
  return DOSSIERS.find((d) => d.slug === slug);
}
