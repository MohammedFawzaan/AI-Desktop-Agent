import { openApplication } from "../tools/osTools.js";

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
    }
];

export async function executeTool(name, args) {
    if (name === "open_application") {
        return await openApplication(args.appName);
    }

    return {
        success: false,
        results: "unknown tool"
    };
}