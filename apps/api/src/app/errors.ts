export class ApiUnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiUnauthorizedError';
  }
}
