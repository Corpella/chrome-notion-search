import ExtensibleCustomError from 'extensible-custom-error';

export default class CustomError extends ExtensibleCustomError {
  constructor(message?: string, options?: { cause: unknown }) {
    if (message === undefined) {
      super();
    } else {
      let msg = message;
      if (options) {
        msg += msg.endsWith('.') ? ' ' : '. ';

        if (options.cause instanceof Error) {
          msg += options.cause.message;
        } else {
          msg += JSON.stringify(options.cause);
        }
      }
      super(msg);
    }
  }
}
