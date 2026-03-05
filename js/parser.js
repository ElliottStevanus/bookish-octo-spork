document.addEventListener("DOMContentLoaded", function () {

    // Fetch XML from the same folder as index.html
    fetch("dorian_gray.xml")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dorian_gray.xml: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(str => {

            const parser = new DOMParser();
            const xml = parser.parseFromString(str, "text/xml");

            const paragraphs = xml.getElementsByTagName("paragraph");

            let output = "";

            // Regex patterns for figurative language
            const patterns = [
                /[^.!?]*\b(?:was|were|is|are|seemed|looked|stood|moved|shone|burned|glowed|whispered|cried|laughed)\b[^.!?]*?\blike\s+(?:a|an|the)\s+\w+[^.!?]*[.!?]/gi,
                /\bas\s+\w+\s+as\s+\w+\b/gi,
                /\bas\s+if\s+[^.!?]+/gi
            ];

            // Process each paragraph
            for (let i = 0; i < paragraphs.length; i++) {
                let text = paragraphs[i].textContent;

                patterns.forEach(regex => {
                    text = text.replace(regex, match =>
                        `<span class="figurative-highlight">${match}</span>`
                    );
                });

                output += `<p>${text}</p>`;
            }

            // Inject processed HTML into page
            const container = document.getElementById("novel-text");
            if (container) {
                container.innerHTML = output;
            } else {
                console.error("Container #novel-text not found in HTML.");
            }
        })
        .catch(error => {
            console.error("Error loading XML:", error);
            const container = document.getElementById("novel-text");
            if (container) {
                container.innerHTML = "<p>Failed to load the novel text. Please make sure dorian_gray.xml is in the same folder as index.html.</p>";
            }
        });
});
