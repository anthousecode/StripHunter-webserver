import * as schedule from 'node-schedule';
import { ENV_TYPE } from '../server';
import { Exchange } from '../controllers/exchange';

export class ScheduleServer
{
  private app: any;

  constructor()
  {
    this.createApp();
    this.scheduleJob();
  }

  private createApp(): void
  {
    this.app = schedule;
  }

  private scheduleJob(): void
  {
    // Run processes every 1 minute
    // this.app.scheduleJob('*/1 * * * *', () =>
    // {
    // });

    // Run processes every day at 12 hour
    this.app.scheduleJob('0 12 * * *', () =>
    {
      new Exchange().getData();
    });
  }

  public getApp(): any
  {
    return this.app;
  }
}