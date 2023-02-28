export class ErrorUtils {
  /** Appends a causing error to a new error message in a readable format */
  public static chainError(message: string, cause: Error): string {
    if (cause.stack) {
      return (
        `${message}\n\n` +
        '-- CAUSE --\n' +
        `error: ${cause.name}\n` +
        `message: ${cause.message}\n` +
        `stack:\n ${cause.stack}\n` +
        '-- END --\n\n'
      );
    } else {
      return (
        `${message}\n\n` +
        '-- CAUSE --\n' +
        `error: ${cause}\n` +
        '-- END --\n\n'
      );
    }
  }
}
