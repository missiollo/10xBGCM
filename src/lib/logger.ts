export const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.PROD) {
      // TODO: Add production logging service integration
      return;
    }
    console.error(message);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Unknown error:", error);
    }
  },
};
