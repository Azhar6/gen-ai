const CATEGORY_META = {
  python: { icon: "🐍", color: "#2563eb" },
  fastapi: { icon: "⚡", color: "#0d9488" },
  genai: { icon: "🤖", color: "#7c3aed" },
  rag: { icon: "📚", color: "#c026d3" },
  agentic: { icon: "🧠", color: "#4f46e5" },
  "agent-arch": { icon: "🏗️", color: "#9333ea" },
  mcp: { icon: "🔌", color: "#0891b2" },
  aws: { icon: "🟧", color: "#d97706" },
  azure: { icon: "🔷", color: "#0284c7" },
  gcp: { icon: "🌈", color: "#dc2626" },
  "multi-cloud": { icon: "🌍", color: "#059669" },
  containers: { icon: "🐳", color: "#0369a1" },
  llmops: { icon: "📈", color: "#b45309" },
  "system-design": { icon: "🧩", color: "#7c3aed" },
  customer: { icon: "🤝", color: "#0d9488" },
  "poc-production": { icon: "🚀", color: "#e11d48" },
  security: { icon: "🔐", color: "#dc2626" },
  scenario: { icon: "🎯", color: "#ea580c" },
  projects: { icon: "💼", color: "#4338ca" }
};

function catMeta(categoryId) {
  return CATEGORY_META[categoryId] || { icon: "📘", color: "#4f46e5" };
}

function catStyle(categoryId) {
  return `style="--cat-color:${catMeta(categoryId).color}"`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInline(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function miniBar(percent) {
  return `<div class="mini-bar"><span style="width:${percent}%"></span></div>`;
}

function progressRing(percent, size = 92) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return `
    <div class="progress-ring" role="img" aria-label="${percent}% complete">
      <svg width="${size}" height="${size}">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="100%" stop-color="#a855f7"/>
          </linearGradient>
        </defs>
        <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${radius}"/>
        <circle class="ring-fill" cx="${size / 2}" cy="${size / 2}" r="${radius}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="ring-label">
        <div>
          <strong>${percent}%</strong><br/>
          <small>done</small>
        </div>
      </div>
    </div>
  `;
}

function difficultyBadge(level) {
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return `<span class="badge ${level}">${label}</span>`;
}

function categoryBadge(question) {
  return `<span class="badge cat" ${catStyle(question.categoryId)}>${catMeta(question.categoryId).icon} ${escapeHtml(question.categoryName)}</span>`;
}

function emptyState(emoji, message) {
  return `
    <div class="empty-state card">
      <span class="emoji">${emoji}</span>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/* ---------- tables / charts / diagrams / code ---------- */

function renderTable(table) {
  if (!table) return "";
  const headers = (table.headers || []).map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const rows = (table.rows || [])
    .map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `
    <section class="section-block card">
      <h4><span class="emoji">📊</span>${escapeHtml(table.title)}</h4>
      <div class="table-wrap">
        <table>
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderChart(chart) {
  if (!chart || !Array.isArray(chart.items)) return "";
  const max = Math.max(...chart.items.map((item) => item.value), 1);
  const rows = chart.items
    .map((item) => {
      const width = Math.max(4, Math.round((item.value / max) * 100));
      return `
        <div class="chart-row">
          <span>${escapeHtml(item.label)}</span>
          <div class="chart-track"><span class="chart-fill" style="width:${width}%"></span></div>
          <strong>${item.value}</strong>
        </div>`;
    })
    .join("");
  return `
    <section class="section-block card">
      <h4><span class="emoji">📉</span>${escapeHtml(chart.title)}</h4>
      <div class="chart">${rows}</div>
    </section>
  `;
}

function renderLinearDiagram(diagram) {
  return `
    <div class="diagram-flow">
      ${diagram.nodes
        .map(
          (node, index) => `
            <div class="flow-node">${escapeHtml(node)}</div>
            ${index < diagram.nodes.length - 1 ? '<div class="flow-arrow">▼</div>' : ""}`
        )
        .join("")}
    </div>
  `;
}

function renderBranchDiagram(diagram) {
  return `
    <div class="diagram-flow">
      <div class="flow-node">${escapeHtml(diagram.top)}</div>
      <div class="flow-arrow">▼</div>
      <div class="flow-row">${diagram.branches
        .map((branch) => `<div class="flow-node">${escapeHtml(branch)}</div>`)
        .join("")}</div>
      <div class="flow-arrow">▼</div>
      <div class="flow-node">${escapeHtml(diagram.merge)}</div>
      <div class="flow-arrow">▼</div>
      <div class="flow-node">${escapeHtml(diagram.end)}</div>
    </div>
  `;
}

function renderDiagram(diagram, questionId) {
  if (!diagram) return "";
  const body = diagram.type === "branch" ? renderBranchDiagram(diagram) : renderLinearDiagram(diagram);
  return `
    <section class="section-block card">
      <h4><span class="emoji">🗺️</span>${escapeHtml(diagram.title)}</h4>
      <div class="diagram">
        <div class="diagram-toolbar">
          <label>Zoom
            <input type="range" min="80" max="160" value="100" step="10" data-diagram-zoom="${questionId}">
          </label>
        </div>
        <div class="diagram-canvas" data-diagram-canvas="${questionId}">
          ${body}
        </div>
      </div>
    </section>
  `;
}

function highlightCode(code, language) {
  const source = escapeHtml(code);
  if (language !== "python" && language !== "json" && language !== "javascript" && language !== "bash") {
    return source;
  }
  let out = source;
  out = out.replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>');
  out = out.replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="tok-string">$1</span>');
  out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>');
  out = out.replace(
    /\b(def|class|return|if|else|elif|for|while|in|import|from|try|except|finally|async|await|with|as|True|False|None|const|let|function|new|throw)\b/g,
    '<span class="tok-keyword">$1</span>'
  );
  return out;
}

function renderCodeBlock(codeExample, questionId) {
  if (!codeExample) return "";
  return `
    <section class="section-block card">
      <h4><span class="emoji">💻</span>Code example</h4>
      <div class="code-wrap">
        <div class="code-head">
          <span class="code-lang">${escapeHtml(codeExample.language)}</span>
          <button type="button" class="copy-btn" data-copy-code="${questionId}">Copy</button>
        </div>
        <pre><code data-code-body="${questionId}">${highlightCode(codeExample.code, codeExample.language)}</code></pre>
      </div>
    </section>
  `;
}

/* ---------- pages ---------- */

function renderHome(content, progress, recentQuestions, state, continueQuestion) {
  const { info, categories, questions } = content;
  const bookmarkCount = Object.values(state.bookmarks).filter(Boolean).length;

  const continueLabel = continueQuestion ? "Continue learning" : "Start learning";
  const continueTarget = continueQuestion
    ? `data-open-question="${continueQuestion.id}"`
    : 'data-route-go="#/categories"';
  const continueHint = continueQuestion
    ? `<p class="sub">Pick up where you left off: “${escapeHtml(continueQuestion.question)}”</p>`
    : `<p class="sub">${escapeHtml(info.shortDescription)}</p>`;

  // 1. Dynamic Question of the Day based on day of the year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const dailyQuestion = questions[dayOfYear % questions.length] || questions[0];
  const isDailyDone = Boolean(state.completed[dailyQuestion.id]);
  const isDailySaved = Boolean(state.bookmarks[dailyQuestion.id]);

  // 2. High-Impact Quick Topic Chips
  const topCategories = ["agentic", "rag", "python", "fastapi", "genai", "system-design", "mcp", "security"];
  const quickChips = topCategories
    .map((id) => {
      const category = categories.find((entry) => entry.id === id);
      if (!category) return "";
      const catQs = questions.filter(q => q.categoryId === id);
      const catDone = catQs.filter(q => state.completed[q.id]).length;
      return `
        <button class="quick-topic" type="button" data-open-category="${category.id}">
          <span class="emoji">${catMeta(category.id).icon}</span>
          <span>${escapeHtml(category.name)}</span>
          <small class="muted" style="font-size:0.75rem;font-weight:700;">(${catDone}/${catQs.length})</small>
        </button>`;
    })
    .join("");

  // 3. Recently viewed
  const recent = recentQuestions.length
    ? `<div class="grid">${recentQuestions
        .slice(0, 4)
        .map(
          (question) => `
            <article class="question-row card" ${catStyle(question.categoryId)}>
              <button class="q-check ${state.completed[question.id] ? "checked" : ""}" type="button"
                data-toggle-complete="${question.id}" aria-label="Toggle completed">✓</button>
              <button class="q-row-body ${state.completed[question.id] ? "completed" : ""}" type="button"
                data-open-question="${question.id}" style="border:0;background:none;padding:0;text-align:left;cursor:pointer;color:inherit;font:inherit;">
                <p class="q-title">${escapeHtml(question.question)}</p>
                <div class="badge-row">
                  ${categoryBadge(question)}
                  ${difficultyBadge(question.difficulty)}
                </div>
              </button>
              <button class="q-star ${state.bookmarks[question.id] ? "saved" : ""}" type="button"
                data-toggle-bookmark="${question.id}" aria-label="Toggle bookmark">${state.bookmarks[question.id] ? "★" : "☆"}</button>
            </article>`
        )
        .join("")}</div>`
    : emptyState("🕐", "Questions you open will show up here for quick revision.");

  return `
    <section class="hero-banner">
      <p class="greeting">${greeting()} 👋</p>
      <h3>${escapeHtml(info.role)}</h3>
      ${continueHint}
      <button class="hero-cta" type="button" ${continueTarget}>${continueLabel} →</button>
    </section>

    <!-- Daily High-Yield Question Card -->
    <article class="daily-challenge-card card" ${catStyle(dailyQuestion.categoryId)}>
      <div class="daily-header">
        <span class="daily-tag">⭐ Question of the Day</span>
        <div class="badge-row">
          ${categoryBadge(dailyQuestion)}
          ${difficultyBadge(dailyQuestion.difficulty)}
        </div>
      </div>
      <h4 class="daily-title">${escapeHtml(dailyQuestion.question)}</h4>
      <p class="muted" style="margin:0;font-size:0.84rem;line-height:1.45;">
        ${escapeHtml(dailyQuestion.answerPoints[0] || "Master this core senior concept today.")}
      </p>
      <div class="daily-actions">
        <button class="tiny-btn primary" type="button" data-open-question="${dailyQuestion.id}">Study full answer & code →</button>
        <button class="tiny-btn success" type="button" data-toggle-complete="${dailyQuestion.id}">
          ${isDailyDone ? "✓ Done" : "Mark done"}
        </button>
        <button class="tiny-btn" type="button" data-toggle-bookmark="${dailyQuestion.id}">
          ${isDailySaved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </article>

    <!-- High-Impact Study Tracks -->
    <div class="section-heading">
      <h4>🎯 Quick Study Tracks</h4>
      <button type="button" data-route-go="#/categories">All 19 Topics ›</button>
    </div>
    <div class="study-modes-grid">
      <button class="mode-card" type="button" data-mode-filter="code">
        <span class="mode-icon">💻</span>
        <strong>Coding & Algorithms</strong>
        <span>95 questions with runnable Python/FastAPI code</span>
      </button>
      <button class="mode-card" type="button" data-mode-filter="system-design">
        <span class="mode-icon">🏗️</span>
        <strong>System Design</strong>
        <span>Enterprise RAG & Multi-Agent architecture</span>
      </button>
      <button class="mode-card" type="button" data-mode-filter="scenario">
        <span class="mode-icon">🎯</span>
        <strong>Production Scenarios</strong>
        <span>Debugging 60% RAG accuracy & cost spikes</span>
      </button>
      <button class="mode-card" type="button" data-mode-filter="agentic">
        <span class="mode-icon">🧠</span>
        <strong>Agentic AI & MCP</strong>
        <span>ReAct, supervisors, and tool calling</span>
      </button>
    </div>

    <!-- Progress Stats -->
    <div class="stats-row">
      <div class="ring-card card">${progressRing(progress.percent)}</div>
      <div class="stat-card card">
        <span class="stat-icon">✅</span>
        <span class="stat-value">${progress.done}<span class="muted" style="font-size:0.8rem;font-weight:600;">/${progress.total}</span></span>
        <span class="stat-label">Completed questions</span>
      </div>
      <div class="stat-card card">
        <span class="stat-icon">⭐</span>
        <span class="stat-value">${bookmarkCount}</span>
        <span class="stat-label">Saved for revision</span>
      </div>
    </div>

    <!-- Fast Topic Jumper -->
    <div class="section-heading">
      <h4>⚡ Priority Topics</h4>
    </div>
    <div class="quick-topics">${quickChips}</div>

    <!-- Architecture & Interview Cheat Sheets -->
    <div class="section-heading">
      <h4>💡 Senior Cheat Sheets</h4>
    </div>
    <div class="cheat-sheet-grid">
      <div class="cheat-card card" style="--primary: #c026d3;">
        <h5><span class="emoji">📚</span> RAG Formula: Bi-Encoder + Cross-Encoder</h5>
        <p>Retrieve top 30 candidates with <code>Hybrid Search (BM25 + Dense)</code>, then pass through a <code>Cross-Encoder Reranker</code> to select top 3-5 high-signal chunks for synthesis.</p>
      </div>
      <div class="cheat-card card" style="--primary: #4f46e5;">
        <h5><span class="emoji">🧠</span> Agentic Safeguard Triad</h5>
        <p>Always enforce <code>max_iterations = 10</code>, duplicate call signature hashing to prevent infinite loops, and <code>Human-in-the-Loop</code> checkpoints for state-mutating tools.</p>
      </div>
      <div class="cheat-card card" style="--primary: #0d9488;">
        <h5><span class="emoji">⚡</span> TTFT Optimization for FastAPI</h5>
        <p>Use <code>StreamingResponse(media_type="text/event-stream")</code> for immediate token streaming (<800ms Time-to-First-Token) and offload long batch jobs to Celery/SQS.</p>
      </div>
    </div>

    <!-- Recently Viewed -->
    <div class="section-heading">
      <h4>🕐 Recently Viewed</h4>
    </div>
    ${recent}

    ${renderTable(content.tables.priorityRanking)}
    ${renderChart(content.charts.priorityChart)}
  `;
}

function renderCategories(categories, questions, completedMap) {
  const cards = categories
    .map((category) => {
      const list = questions.filter((question) => question.categoryId === category.id);
      const done = list.filter((question) => completedMap[question.id]).length;
      const percent = list.length ? Math.round((done / list.length) * 100) : 0;
      return `
      <button class="category-card card" type="button" data-open-category="${category.id}" ${catStyle(category.id)}>
        <span class="category-icon">${catMeta(category.id).icon}</span>
        <span class="category-body">
          <h4>${escapeHtml(category.name)}</h4>
          <p class="cat-desc">${escapeHtml(category.description)}</p>
          <span class="cat-meta">
            <span>${list.length} questions</span>
            ${done ? `<span class="done-count">✓ ${done} done</span>` : ""}
            ${miniBar(percent)}
          </span>
        </span>
        <span class="chevron">›</span>
      </button>`;
    })
    .join("");

  return `<section class="grid cols-3">${cards}</section>`;
}

function questionRow(question, state) {
  const completed = Boolean(state.completed[question.id]);
  const bookmarked = Boolean(state.bookmarks[question.id]);
  return `
    <article class="question-row card" ${catStyle(question.categoryId)}>
      <button class="q-check ${completed ? "checked" : ""}" type="button"
        data-toggle-complete="${question.id}" aria-label="Toggle completed" title="Mark as done">✓</button>
      <button class="q-row-body ${completed ? "completed" : ""}" type="button"
        data-open-question="${question.id}" style="border:0;background:none;padding:0;text-align:left;cursor:pointer;color:inherit;font:inherit;">
        <p class="q-title">${escapeHtml(question.question)}</p>
        <div class="badge-row">
          ${categoryBadge(question)}
          ${difficultyBadge(question.difficulty)}
        </div>
      </button>
      <button class="q-star ${bookmarked ? "saved" : ""}" type="button"
        data-toggle-bookmark="${question.id}" aria-label="Toggle bookmark" title="Bookmark">${bookmarked ? "★" : "☆"}</button>
    </article>`;
}

function renderQuestionList(category, questions, state) {
  if (!questions.length) {
    return emptyState("🔍", "No questions match the current search or filters. Try clearing them.");
  }
  const done = questions.filter((question) => state.completed[question.id]).length;
  const header = category.id
    ? `
      <header class="list-header card" ${catStyle(category.id)}>
        <span class="category-icon">${catMeta(category.id).icon}</span>
        <div>
          <h3>${escapeHtml(category.name)}</h3>
          <p>${escapeHtml(category.description)} · ${done}/${questions.length} done</p>
        </div>
      </header>`
    : `
      <header class="list-header card">
        <span class="category-icon">🔍</span>
        <div>
          <h3>${escapeHtml(category.name)}</h3>
          <p>${escapeHtml(category.description)}</p>
        </div>
      </header>`;

  return `
    ${header}
    <section class="grid">
      ${questions.map((question) => questionRow(question, state)).join("")}
    </section>
  `;
}

function renderQuestionDetail(content, question, state, relatedQuestions, navInfo) {
  const table = question.tableId ? content.tables[question.tableId] : null;
  const diagram = question.diagramId ? content.diagrams[question.diagramId] : null;
  const completed = Boolean(state.completed[question.id]);
  const bookmarked = Boolean(state.bookmarks[question.id]);
  const initialPoints = question.answerPoints.slice(0, 6);
  const extraPoints = question.answerPoints.slice(6);

  const related = relatedQuestions.length
    ? `
      <div class="related-grid">
        ${relatedQuestions
          .map(
            (item) =>
              `<button class="related-btn" type="button" data-open-question="${item.id}">${escapeHtml(item.question)}</button>`
          )
          .join("")}
      </div>`
    : '<p class="muted">No related questions available.</p>';

  const scenarioHint =
    question.categoryId === "scenario" || question.categoryId === "system-design"
      ? `
    <div class="callout">
      <span class="emoji">💡</span>
      <span>Keep your answer structured: problem → diagnosis → actions → trade-offs → monitoring.</span>
    </div>`
      : "";

  return `
    <section class="question-detail" ${catStyle(question.categoryId)}>
      <article class="question-head card">
        <div class="badge-row">
          ${categoryBadge(question)}
          ${difficultyBadge(question.difficulty)}
          <span class="badge" style="background:var(--panel-soft);color:var(--muted);">${navInfo.position} / ${navInfo.total}</span>
        </div>
        <h3>${escapeHtml(question.question)}</h3>
        <div class="detail-actions">
          <button class="action-chip ${completed ? "done" : ""}" type="button" data-toggle-complete="${question.id}">
            ${completed ? "✓ Completed" : "Mark as done"}
          </button>
          <button class="action-chip ${bookmarked ? "saved" : ""}" type="button" data-toggle-bookmark="${question.id}">
            ${bookmarked ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </article>

      <section class="section-block card">
        <h4><span class="emoji">✅</span>Direct answer</h4>
        <ul class="answer-list">
          ${initialPoints.map((point) => `<li>${formatInline(point)}</li>`).join("")}
        </ul>
        ${
          extraPoints.length
            ? `<details class="collapsible">
                <summary>Show more details</summary>
                <ul class="answer-list">${extraPoints
                  .map((point) => `<li>${formatInline(point)}</li>`)
                  .join("")}</ul>
              </details>`
            : ""
        }
        ${scenarioHint}
      </section>

      ${renderCodeBlock(question.codeExample, question.id)}
      ${renderTable(table)}
      ${renderDiagram(diagram, question.id)}

      <section class="section-block card">
        <h4><span class="emoji">🔗</span>Related questions</h4>
        ${related}
      </section>

      <nav class="detail-nav" aria-label="Question navigation">
        <button class="nav-prev" type="button" data-nav-prev="${question.id}" ${navInfo.hasPrev ? "" : "disabled"}>← Prev</button>
        <button class="nav-up" type="button" data-back-to-category="${question.categoryId}">${catMeta(question.categoryId).icon} List</button>
        <button class="nav-next" type="button" data-nav-next="${question.id}" ${navInfo.hasNext ? "" : "disabled"}>Next →</button>
      </nav>
    </section>
  `;
}

function renderBookmarks(bookmarkedQuestions, state) {
  if (!bookmarkedQuestions.length) {
    return emptyState("⭐", "Tap the star on any question to save it here for quick revision.");
  }
  return `
    <section class="grid">
      ${bookmarkedQuestions.map((question) => questionRow(question, state)).join("")}
    </section>
  `;
}

function renderProgressPage(progress, categoryRows) {
  return `
    <section class="progress-hero card">
      ${progressRing(progress.percent, 104)}
      <div>
        <h3 class="big">${progress.done} of ${progress.total} questions</h3>
        <p>${progress.percent === 100 ? "All done — you are interview ready! 🎉" : "Keep going — steady progress wins interviews."}</p>
      </div>
    </section>
    <section class="grid">
      ${categoryRows
        .map(
          (row) => `
          <article class="progress-cat-row card" ${catStyle(row.id)}>
            <span class="category-icon">${catMeta(row.id).icon}</span>
            <div class="row-body">
              <strong>${escapeHtml(row.name)}</strong>
              ${miniBar(row.percent)}
            </div>
            <span class="pct">${row.percent}%</span>
          </article>
        `
        )
        .join("")}
    </section>
  `;
}

function wireRichInteractions(root) {
  root.querySelectorAll("[data-copy-code]").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-copy-code");
      const codeNode = root.querySelector(`[data-code-body="${id}"]`);
      if (!codeNode) return;
      const text = codeNode.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        const old = button.textContent;
        button.textContent = "Copied ✓";
        setTimeout(() => {
          button.textContent = old;
        }, 1200);
      } catch (_) {
        button.textContent = "Copy failed";
      }
    });
  });

  root.querySelectorAll("[data-diagram-zoom]").forEach((slider) => {
    slider.addEventListener("input", () => {
      const id = slider.getAttribute("data-diagram-zoom");
      const canvas = root.querySelector(`[data-diagram-canvas="${id}"]`);
      if (!canvas) return;
      // `zoom` affects layout, so the overflow container scrolls correctly
      // instead of clipping the scaled content like transform would.
      canvas.style.zoom = String(Number(slider.value) / 100);
    });
  });
}

export {
  renderHome,
  renderCategories,
  renderQuestionList,
  renderQuestionDetail,
  renderBookmarks,
  renderProgressPage,
  wireRichInteractions
};
