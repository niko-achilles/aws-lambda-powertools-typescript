import { Logger } from '../Logger';
import { HandlerOptions, LogAttributes } from '../types';
import { LOGGER_KEY } from '@aws-lambda-powertools/commons/lib/middleware';
import type {
  MiddlewareLikeObj,
  MiddyLikeRequest,
} from '@aws-lambda-powertools/commons';

/**
 * A middy middleware that helps emitting CloudWatch EMF metrics in your logs.
 *
 * Using this middleware on your handler function will automatically add context information to logs, as well as optionally log the event and clear attributes set during the invocation.
 *
 * @example
 * ```typescript
 * import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
 * import middy from '@middy/core';
 *
 *
 * const logger = new Logger();
 *
 * const lambdaHandler = async (_event: any, _context: any) => {
 *     logger.info('This is an INFO log with some context');
 * };
 *
 * export const handler = middy(lambdaHandler).use(injectLambdaContext(logger));
 * ```
 *
 * @param target - The Logger instance(s) to use for logging
 * @param options - (_optional_) Options for the middleware
 * @returns - The middy middleware object
 */
const injectLambdaContext = (
  target: Logger | Logger[],
  options?: HandlerOptions
): MiddlewareLikeObj => {
  const loggers = target instanceof Array ? target : [target];
  const persistentAttributes: LogAttributes[] = [];
  const isClearState = options && options.clearState === true;

  /**
   * Set the cleanup function to be called in case other middlewares return early.
   *
   * @param request - The request object
   */
  const setCleanupFunction = (request: MiddyLikeRequest): void => {
    request.internal = {
      ...request.internal,
      [LOGGER_KEY]: injectLambdaContextAfterOrOnError,
    };
  };

  const injectLambdaContextBefore = async (
    request: MiddyLikeRequest
  ): Promise<void> => {
    loggers.forEach((logger: Logger, index: number) => {
      if (isClearState) {
        persistentAttributes[index] = {
          ...logger.getPersistentLogAttributes(),
        };

        setCleanupFunction(request);
      }
      Logger.injectLambdaContextBefore(
        logger,
        request.event,
        request.context,
        options
      );
    });
  };

  const injectLambdaContextAfterOrOnError = async (): Promise<void> => {
    if (isClearState) {
      loggers.forEach((logger: Logger, index: number) => {
        Logger.injectLambdaContextAfterOrOnError(
          logger,
          persistentAttributes[index],
          options
        );
      });
    }
  };

  return {
    before: injectLambdaContextBefore,
    after: injectLambdaContextAfterOrOnError,
    onError: injectLambdaContextAfterOrOnError,
  };
};

export { injectLambdaContext };
