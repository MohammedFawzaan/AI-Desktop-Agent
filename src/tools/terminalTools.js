import { exec } from "child_process";

export async function runCommand(command) {
    return new Promise((resolve) => {
        exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    success: false,
                    result: error.message
                });
                return;
            }

            resolve({
                success: true,
                result: stdout || stderr || "Command executed!"
            });
        });
    });
}