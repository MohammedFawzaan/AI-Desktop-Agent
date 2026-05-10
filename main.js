import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { askGemini } from "./src/llm/llmClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile("index.html");
};

app.whenReady().then(async () => {
    try {
        createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });

        const response = await askGemini(
            "Explain what an AI agent is in 3 lines."
        );

        console.log("\nGemini Response:\n");
        console.log(response);

    } catch (error) {
        console.error("Gemini Error:", error);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});