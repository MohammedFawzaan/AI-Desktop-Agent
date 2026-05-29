import { generateResponse } from "../llm/llmClient.js";
import { tools, executeTool } from "../registry/tools.js";

const conversationHistory = [];
const MAX_HISTORY_SIZE = 40;

export async function runAgent(userMessage) {
    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    let iterations = 0;
    const MAX_ITERATIONS = 10;

    while (iterations < MAX_ITERATIONS) {
        iterations++;

        const response = await generateResponse(conversationHistory, tools);

        if (response.error)
            throw new Error(response.error);

        if (!response.candidates || response.candidates.length === 0)
            throw new Error("No candidates returned from Gemini");

        const candidate = response.candidates[0];
        const parts = candidate.content.parts;

        const functionCallParts = parts.filter(part => part.functionCall);

        // Final text response.
        if (functionCallParts.length === 0) {
            const text = parts
                .map(part => part.text || "")
                .join("");

            conversationHistory.push({
                role: "model",
                parts: [{ text: text }]
            });

            trimHistory();
            return text;
        }

        // Add Model Tool Call to history
        conversationHistory.push({
            role: "model",
            parts: candidate.content.parts
        });

        const toolResults = await Promise.all(
            functionCallParts.map(async (part) => {
                const toolName = part.functionCall.name;
                const toolArgs = part.functionCall.args;

                console.log(`\nTool Called: ${toolName}`);
                console.log("Arguments:", toolArgs);

                const toolResult = await executeTool(toolName, toolArgs);
                console.log("Tool Result:", toolResult);

                return {
                    functionResponse: {
                        name: toolName,
                        response: {
                            success: toolResult.success,
                            content: toolResult.result
                        }
                    }
                };
            })
        );

        console.log("\nTool Results:", toolResults);

        // Add Tool Response to history
        conversationHistory.push({
            role: "user",
            parts: toolResults
        });
    }

    const errorMsg = "I was unable to complete the task within the allowed steps. Please try rephrasing your request.";
    conversationHistory.push({ role: "model", parts: [{ text: errorMsg }] });
    trimHistory();
    return errorMsg;
}

function trimHistory() {
    if (conversationHistory.length > MAX_HISTORY_SIZE) {
        conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY_SIZE);
    }
}
