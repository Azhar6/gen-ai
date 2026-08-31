const STORAGE_KEY = "genai-interview-prep-v2";

const DEFAULT_STATE = {
  completed: {},
  bookmarks: {},
  recent: [],
  theme: "light",
  lastQuestionId: null
};

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      completed: parsed.completed || {},
      bookmarks: parsed.bookmarks || {},
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      theme: parsed.theme === "dark" ? "dark" : "light",
      lastQuestionId: parsed.lastQuestionId || null
    };
  } catch (_) {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function markRecent(state, questionId) {
  state.recent = [questionId, ...state.recent.filter((id) => id !== questionId)].slice(0, 8);
  state.lastQuestionId = questionId;
}

function getProgress(state, total) {
  const done = Object.values(state.completed).filter(Boolean).length;
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0
  };
}

export { loadState, saveState, markRecent, getProgress };
