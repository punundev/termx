// TermX Documentation & Showcase Interactive Application
// Pure modern Vanilla JS with zero external framework dependencies

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLucide();
  initShortcutsFilter();
  initSidebarToggle();
  initMockTerminal();
  initTerminalContextMenu();
});

// Initialize Lucide Icons
function initLucide() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

// Dark / Light Mode Toggle
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("termx-docs-theme");

  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("termx-docs-theme", isDark ? "dark" : "light");
      initLucide();
    });
  }
}

// Copy to Clipboard with Visual Feedback
window.copyCommand = function (text, buttonElement) {
  if (!text) return;

  const performFeedback = () => {
    if (!buttonElement) return;
    const originalContent = buttonElement.innerHTML;
    buttonElement.innerHTML =
      '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i>';
    initLucide();

    setTimeout(() => {
      buttonElement.innerHTML = originalContent;
      initLucide();
    }, 2000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(performFeedback)
      .catch(() => {
        fallbackCopy(text);
        performFeedback();
      });
  } else {
    fallbackCopy(text);
    performFeedback();
  }
};

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback copy failed", err);
  }
  document.body.removeChild(textArea);
}

// Shortcuts Live Table Filter
function initShortcutsFilter() {
  const input = document.getElementById("shortcutSearch");
  if (!input) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll(".shortcut-row");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
}

// Sidebar Toggle in Mockup
function initSidebarToggle() {
  const toggleBtn = document.getElementById("mockSidebarToggle");
  const sidebar = document.getElementById("mockSidebar");
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = sidebar.classList.toggle("hidden");
    toggleBtn.innerHTML = isHidden
      ? '<i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>'
      : '<i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>';
    initLucide();
  });
}

// Mock Searchbar Toggle
window.toggleMockSearch = function () {
  const searchBar = document.getElementById("mockSearchBar");
  if (!searchBar) return;

  if (searchBar.classList.contains("hidden")) {
    searchBar.classList.remove("hidden");
    searchBar.classList.add("flex");
    const input = searchBar.querySelector("input");
    if (input) input.focus();
  } else {
    searchBar.classList.add("hidden");
    searchBar.classList.remove("flex");
  }
};

// Mock Tab Management
let mockTabCounter = 1;

window.addNewMockTab = function () {
  const tabBar = document.getElementById("mockTabBar");
  if (!tabBar) return;

  mockTabCounter += 1;
  const shells = ["fish", "bash", "zsh"];
  const shellName = shells[mockTabCounter % shells.length];

  // Deactivate existing tabs
  tabBar.querySelectorAll(".mock-tab").forEach((t) => {
    t.classList.remove(
      "active",
      "bg-white",
      "dark:bg-[#1e1e2e]",
      "border-zinc-300",
      "dark:border-white/15",
    );
    t.classList.add("opacity-70", "border-transparent");
    const dot = t.querySelector(".mock-tab-dot");
    if (dot) dot.classList.add("hidden");
  });

  const tab = document.createElement("div");
  tab.className =
    "mock-tab active px-3 h-6 flex items-center gap-1.5 rounded bg-white dark:bg-[#1e1e2e] border border-zinc-300 dark:border-white/15 text-[13px] font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer";
  tab.innerHTML = `
    <i data-lucide="terminal" class="w-3 h-3 text-teal-500"></i>
    <span>${mockTabCounter}. ${shellName}</span>
    <span class="mock-tab-dot w-1.5 h-1.5 rounded-full bg-teal-500 ml-1"></span>
    <button onclick="event.stopPropagation(); closeMockTab(this)" class="opacity-60 hover:opacity-100 ml-1">
      <i data-lucide="x" class="w-3 h-3"></i>
    </button>
  `;

  tab.addEventListener("click", () => {
    tabBar.querySelectorAll(".mock-tab").forEach((t) => {
      t.classList.remove(
        "active",
        "bg-white",
        "dark:bg-[#1e1e2e]",
        "border-zinc-300",
        "dark:border-white/15",
      );
      t.classList.add("opacity-70", "border-transparent");
      const d = t.querySelector(".mock-tab-dot");
      if (d) d.classList.add("hidden");
    });
    tab.classList.add(
      "active",
      "bg-white",
      "dark:bg-[#1e1e2e]",
      "border-zinc-300",
      "dark:border-white/15",
    );
    tab.classList.remove("opacity-70", "border-transparent");
    const dot = tab.querySelector(".mock-tab-dot");
    if (dot) dot.classList.remove("hidden");
  });

  tabBar.appendChild(tab);
  initLucide();
};

window.closeMockTab = function (btn) {
  const tab = btn.closest(".mock-tab");
  const tabBar = document.getElementById("mockTabBar");
  if (!tab || !tabBar) return;

  const allTabs = Array.from(tabBar.querySelectorAll(".mock-tab"));
  if (allTabs.length <= 1) {
    showToast("Cannot close the last open tab in TermX.");
    return;
  }

  const wasActive = tab.classList.contains("active");
  tab.remove();

  if (wasActive) {
    const remainingTabs = tabBar.querySelectorAll(".mock-tab");
    if (remainingTabs.length > 0) {
      const nextTab = remainingTabs[remainingTabs.length - 1];
      nextTab.classList.add(
        "active",
        "bg-white",
        "dark:bg-[#1e1e2e]",
        "border-zinc-300",
        "dark:border-white/15",
      );
      nextTab.classList.remove("opacity-70", "border-transparent");
      const dot = nextTab.querySelector(".mock-tab-dot");
      if (dot) dot.classList.remove("hidden");
    }
  }
};

window.openMockPrefs = function () {
  showToast(
    "TermX Preferences: Press Ctrl+, or select Preferences in menu to customize fonts, colors, and keybindings.",
  );
};

// Toast notification
function showToast(message) {
  const existing = document.getElementById("termxToast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "termxToast";
  toast.className =
    "fixed bottom-4 right-4 z-50 px-3.5 py-2.5 rounded-lg bg-zinc-900 text-zinc-100 border border-zinc-700 text-xs shadow-lg flex items-center gap-2 max-w-sm animate-fade-in";
  toast.innerHTML = `
    <i data-lucide="info" class="w-4 h-4 text-teal-400 shrink-0"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);
  initLucide();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 300ms ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Built-in Theme Palettes for Preview Simulation
const THEMES = {
  "kitty-dark": {
    bg: "#181825",
    fg: "#cdd6f4",
    prompt: "#a6e3a1",
    accent: "#89b4fa",
    sidebarBg: "#13131e",
    headerBg: "#181825",
  },
  nord: {
    bg: "#2e3440",
    fg: "#d8dee9",
    prompt: "#a3be8c",
    accent: "#88c0d0",
    sidebarBg: "#272c36",
    headerBg: "#2e3440",
  },
  dracula: {
    bg: "#282a36",
    fg: "#f8f8f2",
    prompt: "#50fa7b",
    accent: "#bd93f9",
    sidebarBg: "#22242e",
    headerBg: "#282a36",
  },
  "catppuccin-mocha": {
    bg: "#1e1e2e",
    fg: "#cdd6f4",
    prompt: "#a6e3a1",
    accent: "#f38ba8",
    sidebarBg: "#191927",
    headerBg: "#1e1e2e",
  },
  "gruvbox-dark": {
    bg: "#282828",
    fg: "#ebdbb2",
    prompt: "#b8bb26",
    accent: "#fabd2f",
    sidebarBg: "#222222",
    headerBg: "#282828",
  },
  "solarized-dark": {
    bg: "#002b36",
    fg: "#839496",
    prompt: "#859900",
    accent: "#268bd2",
    sidebarBg: "#00222b",
    headerBg: "#002b36",
  },
  "solarized-light": {
    bg: "#fdf6e3",
    fg: "#657b83",
    prompt: "#859900",
    accent: "#2aa198",
    sidebarBg: "#eee8d5",
    headerBg: "#eee8d5",
  },
  "clean-light": {
    bg: "#fafafa",
    fg: "#27272a",
    prompt: "#16a34a",
    accent: "#2563eb",
    sidebarBg: "#f0f0f0",
    headerBg: "#f4f4f5",
  },
  "tokyo-night": {
    bg: "#1a1b26",
    fg: "#c0caf5",
    prompt: "#9ece6a",
    accent: "#7aa2f7",
    sidebarBg: "#16161e",
    headerBg: "#1a1b26",
  },
  "one-dark": {
    bg: "#282c34",
    fg: "#abb2bf",
    prompt: "#98c379",
    accent: "#61afef",
    sidebarBg: "#21252b",
    headerBg: "#282c34",
  },
  "rose-pine": {
    bg: "#191724",
    fg: "#e0def4",
    prompt: "#ebbcba",
    accent: "#9ccfd8",
    sidebarBg: "#15131f",
    headerBg: "#191724",
  },
  "monokai-pro": {
    bg: "#2d2a2e",
    fg: "#fcfcfa",
    prompt: "#a9dc76",
    accent: "#78dce8",
    sidebarBg: "#221f22",
    headerBg: "#2d2a2e",
  },
};

window.previewTheme = function (themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) return;

  // Highlight selected theme card in gallery
  const cards = document.querySelectorAll(".theme-card");
  cards.forEach((card) => {
    if (card.getAttribute("onclick")?.includes(themeKey)) {
      card.classList.add("border-teal-500", "ring-1", "ring-teal-500");
      card.classList.remove("border-zinc-200", "dark:border-zinc-800");
    } else {
      card.classList.remove("border-teal-500", "ring-1", "ring-teal-500");
      card.classList.add("border-zinc-200", "dark:border-zinc-800");
    }
  });

  // Apply colors to mock terminal console
  const consoleEl = document.getElementById("mockTerminalConsole");
  if (consoleEl) {
    consoleEl.style.backgroundColor = theme.bg;
    consoleEl.style.color = theme.fg;
  }

  // Apply dynamic color to mock sidebar
  const sidebarEl = document.getElementById("mockSidebar");
  if (sidebarEl) {
    sidebarEl.style.backgroundColor = theme.sidebarBg || theme.bg;
  }

  // Apply dynamic color to mock header
  const headerEl = document.getElementById("mockHeader");
  if (headerEl) {
    headerEl.style.backgroundColor = theme.headerBg || theme.bg;
  }

  // Also style prompt tags
  const promptUser = document.querySelector(
    "#mockTerminalForm span:first-child",
  );
  const promptArrow = document.querySelector(
    "#mockTerminalForm span:nth-child(2)",
  );
  if (promptUser) promptUser.style.color = theme.prompt;
  if (promptArrow) promptArrow.style.color = theme.accent;

  showToast(`Switched terminal preview theme to "${themeKey}"`);
};

// Mock Terminal Logic
function initMockTerminal() {
  const form = document.getElementById("mockTerminalForm");
  const input = document.getElementById("mockTerminalInput");
  if (!form || !input) return;

  input.focus();
}

window.handleMockSubmit = function (event) {
  event.preventDefault();
  const input = document.getElementById("mockTerminalInput");
  const history = document.getElementById("mockTerminalHistory");
  const consoleBox = document.getElementById("mockTerminalConsole");
  if (!input || !history) return;

  const cmd = input.value.trim();
  if (!cmd) return;

  // Add command entry
  const entry = document.createElement("div");
  entry.className = "space-y-1 text-xs";
  entry.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-emerald-400">⚡phanun</span>
      <span class="text-teal-400">❯❯</span>
      <span class="text-zinc-100 font-bold">${escapeHtml(cmd)}</span>
    </div>
  `;

  // Process command
  const response = document.createElement("div");
  response.className = "text-zinc-400 pl-4 py-0.5 leading-relaxed";

  const lower = cmd.toLowerCase();
  const parts = cmd.split(" ");
  const mainCmd = parts[0].toLowerCase();

  switch (mainCmd) {
    case "help":
      response.innerHTML = `
        <div class="text-teal-400 font-semibold mb-1">Available TermX Simulator Commands:</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
          <div><span class="text-teal-300 font-bold">help</span> — Show command manual</div>
          <div><span class="text-teal-300 font-bold">specs</span> — Display hardware &amp; build specs</div>
          <div><span class="text-teal-300 font-bold">neofetch</span> — Print TermX system banner</div>
          <div><span class="text-teal-300 font-bold">themes</span> — List all 12 built-in themes</div>
          <div><span class="text-teal-300 font-bold">theme &lt;name&gt;</span> — Change current theme</div>
          <div><span class="text-teal-300 font-bold">clear</span> — Wipe terminal output</div>
          <div><span class="text-teal-300 font-bold">version</span> — Show TermX release info</div>
          <div><span class="text-teal-300 font-bold">echo &lt;text&gt;</span> — Print arguments to screen</div>
          <div><span class="text-teal-300 font-bold">date</span> — Display current timestamp</div>
        </div>
      `;
      break;

    case "specs":
    case "neofetch":
      response.innerHTML = `
        <div class="text-teal-400 font-bold">TermX System Specifications</div>
        <pre class="text-[11px] font-mono text-zinc-300 leading-tight mt-1">
  <span class="text-teal-400">OS:</span> Linux x86_64
  <span class="text-teal-400">Host:</span> Nexus Terminal (TermX) v0.1.11
  <span class="text-teal-400">Runtime:</span> Go 1.24+ (CGo / GTK4 / VTE)
  <span class="text-teal-400">Toolkit:</span> GTK4 (4.12+) &amp; Libadwaita (1.4+)
  <span class="text-teal-400">Terminal Core:</span> VTE (vte4 0.74+) with 24-bit TrueColor
  <span class="text-teal-400">Shell:</span> /usr/bin/fish (Bash fallback)
  <span class="text-teal-400">UI Font:</span> Poppins (30px standard height)
  <span class="text-teal-400">Terminal Font:</span> JetBrains Mono 11.0pt
  <span class="text-teal-400">Packages:</span> .deb, .rpm, .AppImage (make build)
  <span class="text-teal-400">Memory Footprint:</span> ~14 MB RSS (Ultra-Lightweight)
        </pre>
      `;
      break;

    case "themes":
      response.innerHTML = `
        <div class="text-teal-400 font-semibold mb-1">Built-in Themes:</div>
        <p class="text-zinc-300 text-[11px]">kitty-dark, nord, dracula, catppuccin-mocha, gruvbox-dark, solarized-dark, solarized-light, clean-light, tokyo-night, one-dark, rose-pine, monokai-pro</p>
        <p class="text-zinc-500 text-[10px] mt-1">Usage: <code class="text-teal-400">theme nord</code> or click any card in the themes gallery below.</p>
      `;
      break;

    case "theme":
      if (parts[1] && THEMES[parts[1].toLowerCase()]) {
        previewTheme(parts[1].toLowerCase());
        response.innerHTML = `<span class="text-emerald-400">Applied theme:</span> ${parts[1].toLowerCase()}`;
      } else {
        response.innerHTML = `<span class="text-red-400">Unknown theme.</span> Run <code class="text-teal-400">themes</code> to see options.`;
      }
      break;

    case "clear":
      history.innerHTML = "";
      input.value = "";
      return;

    case "version":
      response.innerHTML = `<span>TermX (Nexus Terminal) 0.1.11 (x86_64-linux, go1.24+)</span>`;
      break;

    case "date":
      response.innerHTML = `<span>${new Date().toUTCString()}</span>`;
      break;

    case "echo":
      response.innerHTML = `<span>${escapeHtml(parts.slice(1).join(" "))}</span>`;
      break;

    default:
      response.innerHTML = `<span class="text-amber-400">command not found:</span> ${escapeHtml(cmd)}. Type <span class="text-teal-400 font-semibold">help</span> for simulator commands.`;
      break;
  }

  entry.appendChild(response);
  history.appendChild(entry);
  input.value = "";

  if (consoleBox) {
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Right Click Context Menu on Mock Terminal
function initTerminalContextMenu() {
  const terminal = document.getElementById("mockTerminalConsole");
  const menu = document.getElementById("mockContextMenu");
  if (!terminal || !menu) return;

  terminal.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.classList.remove("hidden");
    initLucide();
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });
}

window.handleContextAction = function (action) {
  const menu = document.getElementById("mockContextMenu");
  if (menu) menu.classList.add("hidden");
  const input = document.getElementById("mockTerminalInput");

  if (action === "copy") {
    const sel = window.getSelection().toString();
    if (sel && navigator.clipboard) {
      navigator.clipboard.writeText(sel).catch(() => {});
    }
  } else if (action === "paste") {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard
        .readText()
        .then((text) => {
          if (input && text) {
            input.value += text;
            input.focus();
          }
        })
        .catch(() => {});
    }
  } else if (action === "selectall") {
    const consoleEl = document.getElementById("mockTerminalConsole");
    if (consoleEl) {
      const range = document.createRange();
      range.selectNodeContents(consoleEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};
