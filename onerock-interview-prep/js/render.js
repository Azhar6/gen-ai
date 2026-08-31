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

function renderProgressBar(percent) {
  return `<div class="progress-bar" aria-label="Progress ${percent}%"><span style="width:${percent}%"></span></div>`;
}

function renderTable(table) {
  if (!table) return "";
  const headers = (table.headers || []).map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const rows = (table.rows || [])
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`
    )
    .join("");
  return `
    <section class="section-block card">
      <h4>${escapeHtml(table.title)}</h4>
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
      <h4>${escapeHtml(chart.title)}</h4>
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
            ${index < diagram.nodes.length - 1 ? '<div class="flow-arrow">↓</div>' : ""}`
        )
        .join("")}
    </div>
  `;
}

function renderBranchDiagram(diagram) {
  return `
    <div class="diagram-flow">
      <div class="flow-node">${escapeHtml(diagram.top)}</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-row">${diagram.branches
        .map((branch) => `<div class="flow-node">${escapeHtml(branch)}</div>`)
        .join("")}</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-node">${escapeHtml(diagram.merge)}</div>
      <div class="flow-arrow">↓</div>
      <div class="flow-node">${escapeHtml(diagram.end)}</div>
    </div>
  `;
}

function renderDiagram(diagram, questionId) {
  if (!diagram) return "";
  const body = diagram.type === "branch" ? renderBranchDiagram(diagram) : renderLinearDiagram(diagram);
  return `
    <section class="section-block card">
      <h4>${escapeHtml(diagram.title)}</h4>
      <div class="diagram">
        <div class="diagram-toolbar">
          <span class="muted">Mobile tip: use horizontal scroll if needed</span>
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
  out = out.replace(/(".*?"|'.*?')/g, '<span class="tok-string">$1</span>');
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
      <h4>Code example</h4>
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

function difficultyPill(level) {
  const display = level.charAt(0).toUpperCase() + level.slice(1);
  return `<span class="pill">${display}</span>`;
}

function renderHome({ info, categories, questions, tables, charts }, progress, recentQuestions) {
  const done = progress.done;
  const total = progress.total;
  const recent = recentQuestions.length
    ? `<div class="grid">${recentQuestions
        .map(
          (question) => `
            <button class="question-card card related-btn" data-open-question="${question.id}" type="button">
              <h4>${escapeHtml(question.question)}</h4>
              <p class="muted">${escapeHtml(question.categoryName)} · ${escapeHtml(question.difficulty)}</p>
            </button>`
        )
        .join("")}</div>`
    : '<div class="empty-state card">No recently viewed questions yet.</div>';
  return `
    <section class="hero-card card">
      <p class="kicker">${escapeHtml(info.subtitle)}</p>
      <h3>${escapeHtml(info.role)}</h3>
      <p class="muted">${escapeHtml(info.shortDescription)}</p>
      <div class="meta-row">
        <span class="pill">${questions.length} total questions</span>
        <span class="pill">${categories.length} categories</span>
        <span class="pill">${done}/${total} completed</span>
      </div>
      <div class="grid">
        ${renderProgressBar(progress.percent)}
      </div>
      <div class="actions-row">
        <button class="tiny-btn primary" type="button" data-route-go="#/categories">Continue learning</button>
      </div>
    </section>

    ${renderTable(tables.priorityRanking)}
    ${renderChart(charts.priorityChart)}

    <section class="section-block card">
      <h4>Recently viewed</h4>
      ${recent}
    </section>
  `;
}

function renderCategories(categories, questions, completedMap) {
  const cards = categories
    .map((category) => {
      const total = questions.filter((question) => question.categoryId === category.id).length;
      const done = questions.filter(
        (question) => question.categoryId === category.id && completedMap[question.id]
      ).length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      return `
      <article class="category-card card">
        <h4>${escapeHtml(category.name)}</h4>
        <p class="muted">${escapeHtml(category.description)}</p>
        <div class="meta-row">
          <span class="pill">${total} questions</span>
          <span class="pill">${done} completed</span>
        </div>
        ${renderProgressBar(percent)}
        <button class="tiny-btn primary" type="button" data-open-category="${category.id}">Open category</button>
      </article>`;
    })
    .join("");

  return `<section class="grid cols-3">${cards}</section>`;
}

function renderQuestionList(category, questions, state) {
  if (!questions.length) {
    return '<div class="empty-state card">No questions match the current filters.</div>';
  }
  return `
    <section class="hero-card card">
      <h3>${escapeHtml(category.name)}</h3>
      <p class="muted">${escapeHtml(category.description)}</p>
    </section>
    <section class="grid">
      ${questions
        .map((question) => {
          const completed = Boolean(state.completed[question.id]);
          const bookmarked = Boolean(state.bookmarks[question.id]);
          return `
            <article class="question-card card">
              <h4>${escapeHtml(question.question)}</h4>
              <div class="meta-row">
                <span class="pill">${escapeHtml(question.categoryName)}</span>
                ${difficultyPill(question.difficulty)}
                ${completed ? '<span class="pill">Completed</span>' : ""}
                ${bookmarked ? '<span class="pill">Bookmarked</span>' : ""}
              </div>
              <div class="actions-row">
                <button class="tiny-btn primary" type="button" data-open-question="${question.id}">Open</button>
                <button class="tiny-btn" type="button" data-toggle-bookmark="${question.id}">
                  ${bookmarked ? "Remove bookmark" : "Bookmark"}
                </button>
                <button class="tiny-btn success" type="button" data-toggle-complete="${question.id}">
                  ${completed ? "Mark not done" : "Mark completed"}
                </button>
              </div>
            </article>`;
        })
        .join("")}
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
      Keep your answer structured: problem -> diagnosis -> actions -> trade-offs -> monitoring.
    </div>`
      : "";

  return `
    <section class="question-detail">
      <article class="question-head card">
        <div class="meta-row">
          <span class="pill">${escapeHtml(question.categoryName)}</span>
          ${difficultyPill(question.difficulty)}
          <span class="pill">${navInfo.position} of ${navInfo.total}</span>
        </div>
        <h3>${escapeHtml(question.question)}</h3>
        <div class="actions-row">
          <button class="tiny-btn" type="button" data-nav-prev="${question.id}" ${navInfo.hasPrev ? "" : "disabled"}>Previous</button>
          <button class="tiny-btn" type="button" data-nav-next="${question.id}" ${navInfo.hasNext ? "" : "disabled"}>Next</button>
          <button class="tiny-btn" type="button" data-back-to-category="${question.categoryId}">Back to category</button>
          <button class="tiny-btn" type="button" data-toggle-bookmark="${question.id}">
            ${bookmarked ? "Remove bookmark" : "Bookmark"}
          </button>
          <button class="tiny-btn success" type="button" data-toggle-complete="${question.id}">
            ${completed ? "Mark not done" : "Mark completed"}
          </button>
        </div>
      </article>

      <section class="section-block card">
        <h4>Direct answer</h4>
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
        <h4>Related questions</h4>
        ${related}
      </section>
    </section>
  `;
}

function renderBookmarks(bookmarkedQuestions) {
  if (!bookmarkedQuestions.length) {
    return '<div class="empty-state card">No bookmarked questions yet.</div>';
  }
  return `
    <section class="grid">
      ${bookmarkedQuestions
        .map(
          (question) => `
            <article class="question-card card">
              <h4>${escapeHtml(question.question)}</h4>
              <p class="muted">${escapeHtml(question.categoryName)} · ${escapeHtml(question.difficulty)}</p>
              <button class="tiny-btn primary" type="button" data-open-question="${question.id}">Open</button>
            </article>`
        )
        .join("")}
    </section>
  `;
}

function renderProgressPage(progress, categoryRows) {
  return `
    <section class="hero-card card">
      <h3>Preparation progress</h3>
      <p class="muted">${progress.done} out of ${progress.total} questions completed.</p>
      ${renderProgressBar(progress.percent)}
      <p class="muted">${progress.percent}% complete</p>
    </section>
    <section class="grid cols-2">
      ${categoryRows
        .map(
          (row) => `
          <article class="category-card card">
            <h4>${escapeHtml(row.name)}</h4>
            <p class="muted">${row.done}/${row.total} completed</p>
            ${renderProgressBar(row.percent)}
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
        button.textContent = "Copied";
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
      const value = Number(slider.value) / 100;
      canvas.style.transform = `scale(${value})`;
      canvas.style.transformOrigin = "top center";
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
