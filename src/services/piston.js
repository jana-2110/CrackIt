/**
 * Service to execute code via Piston API
 * API Docs: https://emkc.org/api/v2/piston
 */

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

const LANGUAGE_MAP = {
    python: { language: "python", version: "3.10.0" },
    c: { language: "c", version: "10.2.0" },
    cpp: { language: "cpp", version: "10.2.0" },
    java: { language: "java", version: "15.0.2" },
    assembly: { language: "nasm", version: "2.15.5" }
};

export const executeCode = async (language, sourceCode, stdin = "") => {
    const config = LANGUAGE_MAP[language];

    if (!config) {
        throw new Error(`Execution for ${language} is not supported directly.`);
    }

    try {
        const response = await fetch(PISTON_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: config.language,
                version: config.version,
                files: [
                    {
                        content: sourceCode
                    }
                ],
                stdin: stdin
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Piston API Error:", error);
        throw error;
    }
};
