/**
 * error thrown when required data is missing
 */
export class DomainServiceMissingDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainServiceMissingDataError';
  }
}

/**
 * error thrown when a request failed (post any internal retries)
 */
export class DomainServiceRequestFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainServiceRequestFailedError';
  }
}

export class DomainServiceInvalidSelectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainServiceInvalidSelectionError';
  }
}
