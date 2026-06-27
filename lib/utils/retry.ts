/**
 * Executes a promise-returning function with a specified number of retries.
 * 
 * @param fn The function to execute.
 * @param retries The number of times to retry before failing. Default is 1.
 * @param delayMs The delay in milliseconds between retries. Default is 1000.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 1, delayMs = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Function failed. Retrying... (${retries} retries left). Error:`, error);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return withRetry(fn, retries - 1, delayMs);
    }
    throw error;
  }
}
