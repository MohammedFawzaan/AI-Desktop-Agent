import { generateResponse } from "../llm/llmClient.js";
import { tools, executeTool } from "../tools/registry.js";

export async function runAgent(userMessage) {
    const messages = [
        {
            role: "user",
            parts: [
                {
                    text: userMessage
                }
            ]
        }
    ]

    let iterations = 0;
    const MAX_ITERATIONS = 5;

    while (iterations < MAX_ITERATIONS) {
        iterations++;

        // Calling llm to decide the tool or generate reponse.
        // send messages + tools to llm.
        const response = await generateResponse(messages, tools);
        if (!response.candidates) {
            throw new Error("No candidates returned from Gemini");
        }
        const candidate = response.candidates[0];
        const parts = candidate.content.parts;

        const functionCallPart = parts.find(part => part.functionCall);

        // Final text response.
        if (!functionCallPart) {
            const text = parts
                .map(part => part.text || "")
                .join("");

            return text;
        }

        // Tool Call
        const toolName = functionCallPart.functionCall.name;
        const toolArgs = functionCallPart.functionCall.args;

        console.log("\nTool Called:");
        console.log(toolName);

        console.log("\nArguments:");
        console.log(toolArgs);

        // Execute the Tool
        const toolResult = await executeTool(toolName, toolArgs);

        console.log("\nTool Result:");
        console.log(toolResult);

        // Add Model Tool Call to history
        messages.push({
            role: "model",
            parts: candidate.content.parts
        });

        // Add Tool Response to history
        messages.push({
            role: "user",
            parts: [
                {
                    functionResponse: {
                        name: toolName,
                        response: {
                            content: toolResult.result
                        }
                    }
                }
            ]
        });
    }
    return "Max Iterations reached";
}
