function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  localStorage.setItem('salah_theme', theme);
  updateThemeToggleIcon(theme);
}

function getSavedTheme() {
  return localStorage.getItem('salah_theme');
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
}

function updateThemeToggleIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.innerText = theme === 'dark' ? '🌙' : '☀️';
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

document.addEventListener('DOMContentLoaded', function() {
  const saved = getSavedTheme();
  let mode = 'light';
  if (saved === 'dark') mode = 'dark';
  setTheme(mode);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
});