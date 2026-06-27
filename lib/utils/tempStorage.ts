import path from "path";
import os from "os";
import fs from "fs/promises";

/**
 * Returns the absolute temporary file path for a given lesson and image.
 */
export function getTempImagePath(lessonId: string, imageId: string, ext: string = "png"): string {
  return path.join(os.tmpdir(), "math-pace", lessonId, `${imageId}.${ext}`);
}

/**
 * Extracts base64 payload and saves it to the temporary directory.
 */
export async function saveTempImage(lessonId: string, imageId: string, base64Image: string): Promise<string> {
  const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let ext = "png";
  let buffer: Buffer;
  
  if (matches && matches.length === 3) {
    ext = matches[1].split('/')[1];
    buffer = Buffer.from(matches[2], 'base64');
  } else {
    buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  }

  const filePath = getTempImagePath(lessonId, imageId, ext);
  const dirPath = path.dirname(filePath);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return filePath;
}

/**
 * Cleans up the temporary folder for a given lesson.
 * Commented out by default to retain files in serverless environment per user request.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function cleanupTempFolder(lessonId: string): Promise<void> {
  /*
  try {
    const dirPath = path.join(os.tmpdir(), "math-pace", lessonId);
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    console.error("Failed to cleanup temp folder for lesson:", lessonId, error);
  }
  */
}
