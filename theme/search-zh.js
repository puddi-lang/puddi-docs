// mdBook's search index tokenizes on whitespace. For queries containing Han
// characters, search the original section text while keeping mdBook's UI.
(() => {
    if (document.documentElement.lang !== "zh-CN") return;

    const searchbox = document.getElementById("mdbook-searchbar");
    const toggle = document.getElementById("mdbook-search-toggle");
    const status = document.getElementById("mdbook-searchresults-header");
    if (!searchbox || !toggle || !status) return;

    searchbox.placeholder = "搜索本书";
    searchbox.setAttribute("aria-label", "搜索本书");
    toggle.title = "搜索本书";
    toggle.setAttribute("aria-label", "切换搜索栏");

    new MutationObserver(() => {
        const match = status.textContent.match(/^(\d+) search results? for |^No search results for /);
        if (match) status.textContent = match[1] ? `找到 ${match[1]} 条结果` : "没有找到结果";
    }).observe(status, { childList: true, characterData: true, subtree: true });

    const index = window.elasticlunr?.Index.prototype;
    if (!index) return;

    const defaultSearch = index.search;
    index.search = function (query, options) {
        if (!/\p{Script=Han}/u.test(query)) return defaultSearch.call(this, query, options);

        const terms = query.trim().toLowerCase().split(/\s+/);
        const matches = [];
        for (const [ref, doc] of Object.entries(this.documentStore.docs)) {
            const title = doc.title.toLowerCase();
            const breadcrumbs = doc.breadcrumbs.toLowerCase();
            const body = doc.body.toLowerCase();
            let score = 0;
            for (const term of terms) {
                const points = title.includes(term) ? 5 : breadcrumbs.includes(term) ? 2 : body.includes(term) ? 1 : 0;
                if (points === 0) {
                    score = 0;
                    break;
                }
                score += points;
            }
            if (score) matches.push({ ref, score, doc });
        }
        return matches.sort((a, b) => b.score - a.score);
    };
})();
