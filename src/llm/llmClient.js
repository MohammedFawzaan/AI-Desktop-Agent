import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ quiet: true });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `Your name is Friday.
    You are an AI Desktop Agent running locally on the user's computer.
    
    Current Capabilities:
    - Answer general user questions.
    - Open desktop applications using OS tools.
    - Search for files and folders on the user's computer.
    
    Behavior Rules:
    - Be concise, clear, and helpful.
    - Use tools whenever a real system action is required.
    - Never claim an app or file was opened/found unless the tool succeeds.
    - If a tool fails, explain the reason briefly.
    - Prefer using tools over guessing.
    - Think carefully before selecting a tool.
    
    Tool Usage:
    - Use open_application when the user wants to open software or apps.
    - Use search_files when the user wants to find files, folders, PDFs, code files, documents, images, or resumes.`
});

export async function generateResponse(contents, tools = []) {
    try {
        const result = await model.generateContent({
            contents,
            tools: [
                {
                    functionDeclarations: tools
                }
            ]
        });

        console.log(result.response);

        return result.response;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Something went wrong.";
    }
}