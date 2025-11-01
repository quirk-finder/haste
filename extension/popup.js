const searchEngines = [
  {
    name: "Google",
    buildUrl: (query) => `https://www.google.com/search?q=${query}`,
  },
  {
    name: "Gibiru",
    buildUrl: (query) => `https://gibiru.com/results.html?q=${query}`,
  },
  {
    name: "Bing",
    buildUrl: (query) => `https://www.bing.com/search?q=${query}`,
  },
  {
    name: "DuckDuckGo",
    buildUrl: (query) => `https://duckduckgo.com/?q=${query}`,
  },
  {
    name: "Mojeek",
    buildUrl: (query) => `https://www.mojeek.com/search?q=${query}`,
  },
  {
    name: "Yandex",
    buildUrl: (query) => `https://yandex.com/search/?text=${query}`,
  },
  {
    name: "Brave",
    buildUrl: (query) => `https://search.brave.com/search?q=${query}`,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("query");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const rawQuery = input.value.trim();

    if (!rawQuery) {
      input.focus();
      return;
    }

    const encodedQuery = encodeURIComponent(rawQuery);

    searchEngines.forEach((engine, index) => {
      chrome.tabs.create({
        url: engine.buildUrl(encodedQuery),
        active: index === 0,
      });
    });

    window.close();
  });
});
