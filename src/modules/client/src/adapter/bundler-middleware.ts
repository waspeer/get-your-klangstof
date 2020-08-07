import serve from 'koa-static';
import Bundler from 'parcel-bundler';
import { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';

export interface BundlerMiddlewareConfig {
  entryFilePath: string;
  outDir: string;
}

interface Dependencies {
  bundlerMiddlewareConfig: BundlerMiddlewareConfig;
}

export class BundlerMiddleware implements KoaMiddleware {
  private readonly bundler: Bundler;
  private readonly config: BundlerMiddlewareConfig;

  public constructor({ bundlerMiddlewareConfig }: Dependencies) {
    this.config = bundlerMiddlewareConfig;
    this.bundler = new Bundler(this.config.entryFilePath, {
      outDir: this.config.outDir,
    });
  }

  public get() {
    this.bundler.bundle();

    return serve(this.config.outDir);
  }
}
