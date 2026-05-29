import { openApplication, closeApplication } from "../tools/osTools.js";
import { searchFiles, writeFile } from "../tools/fileTools.js";
import { runCommand } from "../tools/terminalTools.js";
import { getSystemInfo, getRunningProcesses } from "../tools/systemTools.js";

export const tools = [
    {
        name: "open_application",
        description: "Open any desktop application on the operating system.",
        parameters: {
            type: "object",
            properties: {
                appName: {
                    type: "string",
                    description: "The executable name of the application to open"
                }
            },
            required: ["appName"]
        }
    },
    {
        name: "close_application",
        description: "Close any desktop application on the operating system.",
        parameters: {
            type: "object",
            properties: {
                appName: {
                    type: "string",
                    description: "The executable name of the application to close"
                }
            },
            required: ["appName"]
        }
    },
    {
        name: "search_files",
        description: "Search for files by name or pattern on the user's computer.",
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
    },
    {
        name: "write_file",
        description: "Create or edit a text file with provided content.",
        parameters: {
            type: "object",
            properties: {
                filePath: {
                    type: "string",
                    description: "Full or relative path of file"
                },
                content: {
                    type: "string",
                    description: "Content to write"
                }
            },
            required: [
                "filePath",
                "content"
            ]
        }
    },
    {
        name: "run_terminal_command",
        description: "Run terminal or shell commands on the operating system and return output.",
        parameters: {
            type: "object",
            properties: {
                command: {
                    type: "string",
                    description: "The terminal command to execute (e.g., 'ls -la', 'npm run dev', 'echo Hello World')"
                }
            },
            required: ["command"]
        }
    },
    {
        name: "get_system_info",
        description: "Returns information about the user's system: OS, username, exact file system paths (home, desktop, documents, downloads, etc.), CPU cores, and memory. Call this first whenever you need to know where files are located or details about the operating system.",
        parameters: {
            type: "object",
            properties: {}
        }
    },
    {
        name: "get_running_processes",
        description: "Returns a list of all currently running processes on the system. Use this when the user asks what is running, wants to find or kill a process, or needs to debug a running application.",
        parameters: {
            type: "object",
            properties: {}
        }
    }
];

export async function executeTool(name, args) {
    if (name === "open_application") {
        if (!args?.appName) return { success: false, result: "Missing required argument: appName" };
        return await openApplication(args.appName);
    }

    if (name === "close_application") {
        if (!args?.appName) return { success: false, result: "Missing required argument: appName" };
        return await closeApplication(args.appName);
    }

    if (name === "search_files") {
        if (!args?.pattern) return { success: false, result: "Missing required argument: pattern" };
        return await searchFiles(args.pattern, args.directory);
    }

    if (name === "write_file") {
        if (!args?.filePath || !args?.content) return { success: false, result: "Missing required arguments: filePath and content" };
        return await writeFile(args.filePath, args.content);
    }

    if (name === "run_terminal_command") {
        if (!args?.command) return { success: false, result: "Missing required arguments: command" };
        return await runCommand(args.command);
    }

    if (name === "get_system_info") {
        return getSystemInfo();
    }

    if (name === "get_running_processes") {
        return getRunningProcesses();
    }

    return {
        success: false,
        result: `Unknown tool: ${name}`
    };
}