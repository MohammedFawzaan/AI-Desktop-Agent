export const tools = [
    {
        name: "dummy_tool",
        description: "A dummy test tool",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "Hello There this is a Dummy Tool Call"
                }
            },
            required: ["message"]
        }
    }
];

export async function executeTool(name, args) {
    if (name === "dummy_tool") {
        return {
            success: true,
            result: `Dummy tool executed with message: ${args.message}`
        };
    }

    return {
        success: false,
        results: "unknown tool"
    };
}