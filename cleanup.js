import fs from "fs-extra";
import path from "path";

const cleanupPaths = [
  "./plugins/commands/cache/",
  "./core/var/data/cache/",
];

async function cleanup() {
  try {
    for (const dir of cleanupPaths) {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isFile() && file !== "README.txt") {
          await fs.remove(filePath);
          console.log(`🗑️ Deleted: ${filePath}`);
        }
      }
    }
    console.log("✨ Cleanup completed successfully.");
  } catch (err) {
    console.error("❌ Cleanup failed:", err.message);
  }
}

cleanup();
