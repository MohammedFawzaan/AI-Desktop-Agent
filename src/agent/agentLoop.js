import { generateResponse } from "../llm/llmClient.js";
import { tools, executeTool } from "../registry/tools.js";

const conversationHistory = [];

export async function runAgent(userMessage) {
    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    let iterations = 0;
    const MAX_ITERATIONS = 5;

    while (iterations < MAX_ITERATIONS) {
        iterations++;

        // Calling llm to decide the tool or generate reponse.
        // send messages + tools to llm.
        const response = await generateResponse(conversationHistory, tools);
        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("No candidates returned from Gemini");
        }
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

                // Execute the Tool
                const toolResult = await executeTool(toolName, toolArgs);
                console.log("Tool Result:", toolResult);

                return {
                    functionResponse: {
                        name: toolName,
                        response: {
                            success: result.success,
                            content: result.result
                        }
                    }
                }
            })
        );

        console.log("\nTool Result:");
        console.log(toolResult);

        // Add Tool Response to history
        conversationHistory.push({
            role: "user",
            parts: toolResults
        });
    }
    const errorMsg = "I was unable to complete the task within the allowed steps. Please try rephrasing your request.";
    conversationHistory.push({ role: "model", parts: [{ text: errorMsg }] });
    return errorMsg;
}
