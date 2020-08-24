import { asClass, asFunction, asValue, createContainer } from 'awilix';
import type { AwilixContainer } from 'awilix';
import { GenerateCodesFeature } from '../application/features/commands/generate-codes-feature';
import { RedeemCodeForDownloadTokenFeature } from '../application/features/commands/redeem-code-for-download-token-feature';
import { GetAssetByCodeFeature } from '../application/features/queries/get-asset-by-code-feature';
import { GetAssetByDownloadTokenFeature } from '../application/features/queries/get-asset-by-download-token-feature';
import type { AssetRepository } from '../domain/repositories/asset-repository';
import { CodeRepository } from '../domain/repositories/code-repository';
import { SheetAssetRepository } from './google-sheets/sheet-asset-repository';
import { SheetCodeRepository } from './google-sheets/sheet-code-repository';
import { SheetConfig } from './google-sheets/sheet-repository';
import { DownloadAssetController } from './koa/controllers/download-asset-controller';
import { GenerateCodesController } from './koa/controllers/generate-codes-controller';
import { RedeemCodeController } from './koa/controllers/redeem-code-controller';
import { KoaRouter } from './koa/koa-router';
import type { KoaController } from '~root/infrastructure/koa/koa-controller';
import type { KoaMiddleware } from '~root/infrastructure/koa/types/koa-middleware';
import type { AwilixDIContainer } from '~root/infrastructure/types/awilix-di-container';
import { getEnvironmentVariable } from '~root/lib/helpers/get-environment-variable';

const notImplemented = (name: string) => () => {
  throw new Error(
    `CodesDIContainer: '${name}' is not implemented. Did you forget to implement it in AppDIContainer?`,
  );
};

export class CodesDIContainer implements AwilixDIContainer {
  public readonly container: AwilixContainer;

  public constructor() {
    this.container = createContainer();

    this.container.register({
      /**
       * CONFIG
       */

      assetSheetConfig: asValue<SheetConfig>({
        clientEmail: getEnvironmentVariable('GOOGLE_CLIENT_EMAIL'),
        privateKey: getEnvironmentVariable('GOOGLE_PRIVATE_KEY'),
        sheetId: getEnvironmentVariable('GOOGLE_SHEET_ID'),
        sheetIndex: 1,
      }),

      codeSheetConfig: asValue<SheetConfig>({
        clientEmail: getEnvironmentVariable('GOOGLE_CLIENT_EMAIL'),
        privateKey: getEnvironmentVariable('GOOGLE_PRIVATE_KEY'),
        sheetId: getEnvironmentVariable('GOOGLE_SHEET_ID'),
        sheetIndex: 0,
      }),

      /**
       * GENERAL
       */

      domainEventEmitter: asFunction(notImplemented('logger')),
      logger: asFunction(notImplemented('logger')),

      /**
       * INFRASTRUCTURE
       */

      // KOA
      router: asClass<KoaMiddleware>(KoaRouter),
      downloadAssetController: asClass<KoaController>(DownloadAssetController),
      generateCodesController: asClass<KoaController>(GenerateCodesController),
      redeemCodeController: asClass<KoaController>(RedeemCodeController),

      // REPOSITORIES
      assetRepository: asClass<AssetRepository>(SheetAssetRepository),
      codeRepository: asClass<CodeRepository>(SheetCodeRepository),

      /**
       * APPLICATION
       */

      // FEATURES
      generateCodesFeature: asClass(GenerateCodesFeature),
      getAssetByDownloadTokenFeature: asClass(GetAssetByDownloadTokenFeature),
      getAssetByCodeFeature: asClass(GetAssetByCodeFeature),
      redeemCodeForDownloadTokenFeature: asClass(RedeemCodeForDownloadTokenFeature),

      /**
       * EXPORTS
       */

      middleware: asFunction(({ router }) => [router]),
    });
  }

  public get<T>(name: string): T {
    return this.container.resolve(name);
  }
}
