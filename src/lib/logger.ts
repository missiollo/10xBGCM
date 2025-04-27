export const logger = {
  error: (message: string, error?: unknown) => {
    if (import.meta.env.PROD) {
      // TODO: Add production logging service integration
      return;
    }
    console.error(message, error);
  },
};
