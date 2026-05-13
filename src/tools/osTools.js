import { exec } from "child_process";
import os from "os";

export async function openApplication(appName) {
    return new Promise((resolve) => {

        let command = "";
        const platform = os.platform();

        // WINDOWS
        if (platform === "win32") {
            // Smart search Start Menu, then fallback to direct start
            command = `powershell -Command "$app = Get-StartApps | Where-Object { $_.Name -replace '[\\s-]', '' -like '*${appName.replace(/[\s-]/g, '')}*' } | Select-Object -First 1; if ($app) { Start-Process explorer.exe shell:AppsFolder\\$($app.AppID) } else { Start-Process '${appName}' }"`;
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