import Gun from 'gun';
import { createServer as createSecureServer, Server as SecureServer } from 'https';

import { Ssl } from '../config/ssl';

export class GunServer
{
  public static readonly PORT: number = 5204;
  private server: SecureServer;
  private port: string | number;
  private app: any;

  constructor()
  {
    this.config();
    this.createServer();
    this.listen();
    this.initGunDB();
    this.initGunClient();
  }

  private config(): void
  {
    this.port = GunServer.PORT;
  }

  private createServer(): void
  {
    this.server = createSecureServer(Ssl.stripHunterOptions());
  }

  private listen(): void
  {
    this.server.listen(this.port, () =>
    {
      console.log('Running gun server on port %s', this.port);
    });
  }

  private initGunDB(): void
  {
    this.app = Gun({web: this.server});
    console.log('app', this.app);
  }

  private initGunClient(): void
  {
    // this.gun = new GunClient();
    // this.gun.opt({
    //   peers: ['https://striphunter.com:' + this.port + '/gun']
    // });
    //
    // console.log('stringify', JSON.stringify(GunDB));
    // console.log('app', JSON.stringify(this.app));
  }

  public getApp(): any
  {
    return this.app;
  }
}

