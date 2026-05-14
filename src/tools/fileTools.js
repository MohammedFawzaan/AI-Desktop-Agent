import { glob } from "glob";
import os from "os";
import path from "path";

const KNOWN_DIRECTORIES = {
    "desktop": path.join(os.homedir(), "Desktop"),
    "documents": path.join(os.homedir(), "Documents"),
    "downloads": path.join(os.homedir(), "Downloads"),
    "pictures": path.join(os.homedir(), "Pictures"),
    "videos": path.join(os.homedir(), "Videos"),
    "music": path.join(os.homedir(), "Music"),
    "home": os.homedir(),
};

function resolveDirectory(directory) {
    if (!directory) return os.homedir();

    const key = directory.toLowerCase().trim();
    if (KNOWN_DIRECTORIES[key]) return KNOWN_DIRECTORIES[key];

    return directory;
}

export async function searchFiles(pattern, directory) {
    try {
        const resolvedDir = resolveDirectory(directory);

        const files = await glob(pattern, {
            cwd: resolvedDir,
            absolute: true,
        });

        return {
            success: true,
            result: files.length > 0
                ? `Found ${files.length} file(s) in ${resolvedDir}:\n${files.join("\n")}${files.length > 20 ? `\n...and ${files.length - 20} more` : ""}`
                : `No files matching "${pattern}" found in ${resolvedDir}`,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            result: error.message,
        };
    }
}
