import { APP_CONTENT } from "../data/content.js";
import { loadState, saveState, markRecent, getProgress } from "./state.js";
import { indexQuestions, filterQuestions } from "./search.js";
import {
  renderHome,
  renderCategories,
  renderQuestionList,
  renderQuestionDetail,
  renderBookmarks,
  renderProgressPage,
  wireRichInteractions
} from "./render.js";
import { setupPWAInstall, registerServiceWorker } from "./pwa.js";

const elements = {
  main: document.getElementById("main"),
  title: document.getElementById("screenTitle"),
  subtitle: document.getElementById("screenSubtitle"),
  themeLabel: document.getElementById("themeLabel"),
  themeBtnTop: document.getElementById("themeBtnTop"),
  themeIconTop: document.getElementById("themeIconTop"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  difficultyFilter: document.getElementById("difficultyFilter"),
  openSidebarBtn: document.getElementById("openSidebarBtn"),
  closeSidebarBtn: document.getElementById("closeSidebarBtn"),
  sidebar: document.getElementById("sidebar"),
  scrim: document.getElementById("scrim"),
  installBtnTop: document.getElementById("installBtnTop"),
  installBtnSide: document.getElementById("installBtnSide"),
  themeBtn: document.getElementById("themeBtn"),
  filterToggle: document.getElementById("filterToggle"),
  filterRow: document.getElementById("filterRow")
};

const state = loadState();
const searchIndex = indexQuestions(APP_CONTENT.questions);
const uiFilters = {
  query: "",
  categoryId: "all",
  difficulty: "all"
};

function populateCategorySelect() {
  const options = APP_CONTENT.categories
    .map((category) => `<option value="${category.id}">${category.name}</option>`)
    .join("");
  elements.categoryFilter.innerHTML += options;
}

function closeSidebar() {
  elements.sidebar.classList.remove("open");
  elements.scrim.hidden = true;
  document.body.style.overflow = "";
}

function openSidebar() {
  elements.sidebar.classList.add("open");
  elements.scrim.hidden = false;
  document.body.style.overflow = "hidden";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  state.theme = theme;
  saveState(state);
  if (elements.themeLabel) {
    elements.themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }
  if (elements.themeIconTop) {
    elements.themeIconTop.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

function parseRoute() {
  const hash = (location.hash || "#/home").replace(/^#/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "category" && parts[1]) {
    return { name: "category", id: parts[1] };
  }
  if (parts[0] === "question" && parts[1]) {
    return { name: "question", id: parts[1] };
  }
  if (parts[0] === "bookmarks") {
    return { name: "bookmarks" };
  }
  if (parts[0] === "progress") {
    return { name: "progress" };
  }
  if (parts[0] === "categories") {
    return { name: "categories" };
  }
  return { name: "home" };
}

function getQuestionById(questionId) {
  return APP_CONTENT.questions.find((question) => question.id === questionId);
}

function getCategoryById(categoryId) {
  return APP_CONTENT.categories.find((category) => category.id === categoryId);
}

function filtered(questionList = APP_CONTENT.questions, forcedCategoryId = null) {
  const filters = {
    ...uiFilters,
    categoryId: forcedCategoryId || uiFilters.categoryId
  };
  return filterQuestions(questionList, searchIndex, filters);
}

function getRelated(question) {
  const sameCategory = APP_CONTENT.questions.filter(
    (item) => item.categoryId === question.categoryId && item.id !== question.id
  );
  return sameCategory.slice(0, 5);
}

function render() {
  const route = parseRoute();
  const progress = getProgress(state, APP_CONTENT.questions.length);
  let html = "";
  let title = "Home";
  let subtitle = "GenAI Engineer prep";

  if (route.name === "home") {
    const recentQuestions = state.recent.map(getQuestionById).filter(Boolean);
    const continueQuestion = state.lastQuestionId ? getQuestionById(state.lastQuestionId) : null;
    html = renderHome(APP_CONTENT, progress, recentQuestions, state, continueQuestion);
    title = "Home";
    subtitle = `${progress.done}/${progress.total} questions done`;
  } else if (route.name === "categories") {
    const hasActiveFilters =
      uiFilters.query || uiFilters.difficulty !== "all" || uiFilters.categoryId !== "all";
    if (hasActiveFilters) {
      const matches = filtered();
      html = renderQuestionList(
        {
          name: "Search results",
          description: `${matches.length} questions match your search and filters.`
        },
        matches,
        state
      );
    } else {
      html = renderCategories(APP_CONTENT.categories, APP_CONTENT.questions, state.completed);
    }
    title = "Categories";
    subtitle = `${APP_CONTENT.categories.length} topics · ${APP_CONTENT.questions.length} questions`;
  } else if (route.name === "category") {
    const category = getCategoryById(route.id);
    if (!category) {
      location.hash = "#/categories";
      return;
    }
    const list = APP_CONTENT.questions.filter((question) => question.categoryId === category.id);
    const visible = filtered(list, category.id);
    html = renderQuestionList(category, visible, state);
    title = category.name;
    subtitle = `${visible.length} questions`;
  } else if (route.name === "question") {
    const question = getQuestionById(route.id);
    if (!question) {
      location.hash = "#/home";
      return;
    }
    markRecent(state, question.id);
    saveState(state);
    const allInCategory = APP_CONTENT.questions.filter(
      (item) => item.categoryId === question.categoryId
    );
    const currentIndex = allInCategory.findIndex((item) => item.id === question.id);
    const navInfo = {
      position: currentIndex + 1,
      total: allInCategory.length,
      hasPrev: currentIndex > 0,
      hasNext: currentIndex < allInCategory.length - 1,
      prevId: currentIndex > 0 ? allInCategory[currentIndex - 1].id : null,
      nextId: currentIndex < allInCategory.length - 1 ? allInCategory[currentIndex + 1].id : null
    };
    html = renderQuestionDetail(APP_CONTENT, question, state, getRelated(question), navInfo);
    title = question.categoryName;
    subtitle = `Question ${navInfo.position} of ${navInfo.total}`;
  } else if (route.name === "bookmarks") {
    const bookmarkedQuestions = APP_CONTENT.questions.filter((question) => state.bookmarks[question.id]);
    html = renderBookmarks(filtered(bookmarkedQuestions), state);
    title = "Bookmarks";
    subtitle = `${bookmarkedQuestions.length} saved questions`;
  } else if (route.name === "progress") {
    const rows = APP_CONTENT.categories.map((category) => {
      const categoryQuestions = APP_CONTENT.questions.filter(
        (question) => question.categoryId === category.id
      );
      const done = categoryQuestions.filter((question) => state.completed[question.id]).length;
      const total = categoryQuestions.length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      return { id: category.id, name: category.name, done, total, percent };
    });
    html = renderProgressPage(progress, rows);
    title = "Progress";
    subtitle = `${progress.percent}% complete`;
  }

  elements.main.innerHTML = html;
  elements.title.textContent = title;
  if (elements.subtitle) elements.subtitle.textContent = subtitle;
  elements.main.focus({ preventScroll: true });
  wireRichInteractions(elements.main);
  syncNav(route);
  closeSidebar();
}

function syncNav(route) {
  const normalized = route.name === "category" || route.name === "question" ? "categories" : route.name;
  document.querySelectorAll("[data-route]").forEach((button) => {
    const target = button.getAttribute("data-route").replace("#/", "");
    button.classList.toggle("active", target === normalized);
  });
}

function gotoQuestion(questionId) {
  location.hash = `#/question/${questionId}`;
}

function handleActionClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const routeGo = button.getAttribute("data-route-go");
  if (routeGo) {
    location.hash = routeGo;
    return;
  }

  const openCategoryId = button.getAttribute("data-open-category");
  if (openCategoryId) {
    elements.categoryFilter.value = openCategoryId;
    uiFilters.categoryId = openCategoryId;
    location.hash = `#/category/${openCategoryId}`;
    return;
  }

  const openQuestionId = button.getAttribute("data-open-question");
  if (openQuestionId) {
    gotoQuestion(openQuestionId);
    return;
  }

  const bookmarkId = button.getAttribute("data-toggle-bookmark");
  if (bookmarkId) {
    state.bookmarks[bookmarkId] = !state.bookmarks[bookmarkId];
    saveState(state);
    render();
    return;
  }

  const completeId = button.getAttribute("data-toggle-complete");
  if (completeId) {
    state.completed[completeId] = !state.completed[completeId];
    saveState(state);
    render();
    return;
  }

  const backCategoryId = button.getAttribute("data-back-to-category");
  if (backCategoryId) {
    location.hash = `#/category/${backCategoryId}`;
    return;
  }

  const prev = button.getAttribute("data-nav-prev");
  if (prev) {
    const current = getQuestionById(prev);
    if (!current) return;
    const list = APP_CONTENT.questions.filter((item) => item.categoryId === current.categoryId);
    const idx = list.findIndex((item) => item.id === current.id);
    if (idx > 0) gotoQuestion(list[idx - 1].id);
    return;
  }

  const next = button.getAttribute("data-nav-next");
  if (next) {
    const current = getQuestionById(next);
    if (!current) return;
    const list = APP_CONTENT.questions.filter((item) => item.categoryId === current.categoryId);
    const idx = list.findIndex((item) => item.id === current.id);
    if (idx >= 0 && idx < list.length - 1) gotoQuestion(list[idx + 1].id);
  }
}

function bindGlobalEvents() {
  elements.openSidebarBtn.addEventListener("click", openSidebar);
  elements.closeSidebarBtn.addEventListener("click", closeSidebar);
  elements.scrim.addEventListener("click", closeSidebar);
  elements.themeBtn.addEventListener("click", toggleTheme);
  elements.themeBtnTop.addEventListener("click", toggleTheme);

  elements.searchInput.addEventListener("input", (event) => {
    uiFilters.query = event.target.value;
    render();
  });

  elements.categoryFilter.addEventListener("change", (event) => {
    uiFilters.categoryId = event.target.value;
    if (uiFilters.categoryId === "all") {
      if (parseRoute().name === "category") location.hash = "#/categories";
      else render();
      return;
    }
    location.hash = `#/category/${uiFilters.categoryId}`;
  });

  elements.difficultyFilter.addEventListener("change", (event) => {
    uiFilters.difficulty = event.target.value;
    render();
  });

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = button.getAttribute("data-route");
    });
  });

  elements.main.addEventListener("click", handleActionClick);
  window.addEventListener("hashchange", render);

  elements.filterToggle.addEventListener("click", () => {
    const show = elements.filterRow.hidden;
    elements.filterRow.hidden = !show;
    elements.filterToggle.classList.toggle("active", show);
    elements.filterToggle.setAttribute("aria-expanded", String(show));
  });

  setupChromeAutoHide();
}

// Hide bottom nav + search bar while scrolling down; reveal on scroll up.
function setupChromeAutoHide() {
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (y > lastY + 6 && y > 120) {
      document.body.classList.add("chrome-hidden");
    } else if (y < lastY - 6 || y < 60) {
      document.body.classList.remove("chrome-hidden");
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );

  // Always reveal navigation after a route change.
  window.addEventListener("hashchange", () => {
    document.body.classList.remove("chrome-hidden");
    lastY = 0;
  });
}

function boot() {
  populateCategorySelect();
  setTheme(state.theme);
  bindGlobalEvents();
  setupPWAInstall({
    topButton: elements.installBtnTop,
    sideButton: elements.installBtnSide
  });
  registerServiceWorker();

  if (!location.hash) {
    location.hash = state.lastQuestionId ? `#/question/${state.lastQuestionId}` : "#/home";
  } else {
    render();
  }
}

boot();
