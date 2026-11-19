// Syntax highlighting for Puddi code blocks. mdBook's bundled highlight.js
// does not know the language, so book.js leaves these blocks plain; this
// registers a grammar and highlights them again.
(function () {
    if (typeof hljs === "undefined") return;

    hljs.registerLanguage("puddi", function (hljs) {
        var KEYWORDS = {
            keyword:
                "as async await break const continue dyn else enum export fn for if impl import " +
                "in let loop match pub return self Self struct test trait type var while",
            literal: "true false None Some Ok Err",
            built_in:
                "Bool Int Float I8 I16 I32 I64 U8 U16 U32 U64 F32 F64 Char Str List Map Set " +
                "ListView MapView SetView Option Result AnyErr StrBuilder Never " +
                "Eq Ord Hash Show From Error Transfer Add Sub Mul Div Rem Neg Not Index Iterable Iterator " +
                "print eprint panic assert assert_eq assert_ne same todo task"
        };
        var INTERPOLATION = {
            className: "subst",
            begin: /\{/,
            end: /\}/,
            keywords: KEYWORDS
        };
        var STRING = {
            className: "string",
            begin: '"',
            end: '"',
            contains: [{ begin: /\\./ }, INTERPOLATION]
        };
        return {
            name: "Puddi",
            aliases: ["pud"],
            keywords: KEYWORDS,
            contains: [
                hljs.C_LINE_COMMENT_MODE,
                hljs.COMMENT(/\/\*/, /\*\//, { contains: ["self"] }),
                STRING,
                { className: "string", begin: /'(\\(u\{[0-9a-fA-F]+\}|.)|[^\\'])'/ },
                {
                    className: "number",
                    begin: /\b(0x[0-9a-fA-F_]+|0b[01_]+|0o[0-7_]+|[0-9][0-9_]*(\.[0-9_]+)?([eE][+-]?[0-9_]+)?)/,
                    relevance: 0
                },
                { className: "meta", begin: /@[a-z_]+/ },
                {
                    className: "function",
                    beginKeywords: "fn",
                    end: /[(<]/,
                    excludeEnd: true,
                    contains: [hljs.UNDERSCORE_TITLE_MODE]
                },
                {
                    className: "class",
                    beginKeywords: "struct enum trait type",
                    end: /[{<=]/,
                    excludeEnd: true,
                    contains: [hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { endsParent: true })]
                },
                { className: "type", begin: /\b[A-Z][A-Za-z0-9]*\b/, relevance: 0 }
            ]
        };
    });

    function highlight() {
        document.querySelectorAll("code.language-puddi").forEach(function (block) {
            block.textContent = block.textContent;
            hljs.highlightBlock(block);
            block.classList.add("hljs");
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", highlight);
    } else {
        highlight();
    }
})();
