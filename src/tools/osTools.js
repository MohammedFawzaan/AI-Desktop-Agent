import { exec } from "child_process";
import os from "os";

export async function openApplication(appName) {
    return new Promise((resolve) => {

        let command = "";
        const platform = os.platform();

        // WINDOWS
        if (platform === "win32") {
            command = `start "" "${appName}"`;
        }
        // MACOS
        else if (platform === "darwin") {
            command = `open -a "${appName}"`;
        }
        // LINUX
        else {
            command = `"${appName}" &`;
        }

        exec(command, (error) => {
            if (error) {
                resolve({
                    success: false,
                    result: error.message
                });
                return;
            }

            resolve({
                success: true,
                result: `${appName} open successfully`
            });
        });
    });
}