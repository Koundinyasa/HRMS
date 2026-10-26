export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback;

  if (typeof error === "string") return error || fallback;
  if (typeof error !== "object") return fallback;

  const errorResponse = error as {
    data?: unknown;
    message?: unknown;
    error?: unknown;
  };

  const { data } = errorResponse;

  if (data && typeof data === "object") {
    const body = data as { message?: unknown; Message?: unknown };
    const message = body.Message ?? body.message;

    if (Array.isArray(message) && message.length > 0) {
      return message.map(String).join(", ");
    }

    if (typeof message === "string" && message) return message;
  }

  if (typeof errorResponse.message === "string" && errorResponse.message) {
    return errorResponse.message;
  }

  if (typeof errorResponse.error === "string" && errorResponse.error) {
    return errorResponse.error;
  }

  return fallback;
}
