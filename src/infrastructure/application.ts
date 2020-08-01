import { CodesDIContainer } from '../modules/codes/src/infrastructure/codes-di-container';
import { AppDiContainer } from './app-di-container';
import type { Server } from './types/server';

export class Application {
  public static modules = [new CodesDIContainer()];
  public static container = new AppDiContainer(Application.modules);

  public static async start() {
    const server = this.container.get<Server>('server');

    await server.start();
  }
}
