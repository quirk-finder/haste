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

const groupColors = [
  "grey",
  "blue",
  "red",
  "yellow",
  "green",
  "pink",
  "purple",
  "cyan",
  "orange",
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("query");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const rawQuery = input.value.trim();

    if (!rawQuery) {
      input.focus();
      return;
    }

    const encodedQuery = encodeURIComponent(rawQuery);
    const groupLabel = rawQuery.slice(0, 2) || rawQuery;

    try {
      const tabs = await Promise.all(
        searchEngines.map((engine, index) =>
          chrome.tabs.create({
            url: engine.buildUrl(encodedQuery),
            active: index === 0,
          })
        )
      );

      const tabIds = tabs
        .map((tab) => tab.id)
        .filter((id) => typeof id === "number");

      if (!tabIds.length) {
        return;
      }

      const groupId = await chrome.tabs.group({ tabIds });
      const windowId = tabs[0]?.windowId;
      let color = groupColors[0];

      if (typeof windowId === "number") {
        const existingGroups = await chrome.tabGroups.query({ windowId });
        const usedColors = new Set(existingGroups.map((group) => group.color));
        const availableColor = groupColors.find((groupColor) => !usedColors.has(groupColor));
        if (availableColor) {
          color = availableColor;
        }
      }

      await chrome.tabGroups.update(groupId, {
        title: groupLabel,
        color,
      });
    } catch (error) {
      console.error("Failed to create grouped tabs", error);
    } finally {
      window.close();
    }
  });
});
