import { openApplication } from "../tools/osTools.js";
import { searchFiles } from "../tools/fileTools.js";

export const tools = [
    {
        name: "open_application",
        description: "Open any desktop application on the operating system.",
        parameters: {
            type: "object",
            properties: {
                appName: {
                    type: "string",
                    description: "The exact executable name of the application to open (e.g., 'code' for VS Code, 'calc' for Calculator, 'notepad')"
                }
            },
            required: ["appName"]
        }
    },
    {
        name: "search_files",
        description: "Search for files by name or pattern on the user's computer. The directory parameter accepts friendly names like 'desktop', 'documents', 'downloads', 'pictures', 'videos', 'music', 'home' — OR a full absolute path. If the user says 'on my desktop' or 'in downloads', just pass that folder name. Defaults to home directory if not specified.",
        parameters: {
            type: "object",
            properties: {
                pattern: {
                    type: "string",
                    description: "Glob pattern to match files (e.g., '*' for all files, '*.pdf' for PDFs, '**/*.js' for recursive JS files, '*resume*' for files with 'resume' in the name)"
                },
                directory: {
                    type: "string",
                    description: "Where to search. Use simple names: 'desktop', 'documents', 'downloads', 'pictures', 'videos', 'music', 'home'. Or provide a full path like 'C:/Projects'."
                }
            },
            required: ["pattern"]
        }
    }
];

export async function executeTool(name, args) {
    if (name === "open_application") {
        return await openApplication(args.appName);
    }

    if (name === "search_files") {
        return await searchFiles(args.pattern, args.directory);
    }

    return {
        success: false,
        results: "unknown tool"
    };
}
