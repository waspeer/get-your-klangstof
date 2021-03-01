import type { Context } from 'koa';

type ControllerWithErrorHandler = KoaController & { handleError(error: Error, ctx: Context): void };

export abstract class KoaController {
  public abstract execute(ctx: Context): Promise<void>;

  static badRequest(ctx: Context, error: Error) {
    ctx.throw(400, error);
  }

  static created(ctx: Context) {
    ctx.status = 201;
  }

  static forbidden(ctx: Context, error: Error) {
    ctx.throw(403, error);
  }

  static notFound(ctx: Context, error: Error) {
    ctx.throw(404, error);
  }
}

/**
 * Utility decorator to delegate thrown errors to a handleError method
 */
export function DelegateError(
  target: ControllerWithErrorHandler,
  _propertyKey: 'execute',
  descriptor: PropertyDescriptor,
) {
  const controllerImplementation = descriptor.value;

  // eslint-disable-next-line no-param-reassign
  descriptor.value = async function resolveWithErrorHandling(ctx: Context) {
    try {
      return await controllerImplementation.call(this, ctx);
    } catch (error) {
      return target.handleError.call(this, error, ctx);
    }
  };
}
