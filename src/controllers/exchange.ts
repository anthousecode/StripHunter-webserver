import request from 'request';
import moment from 'moment';

import { Pg } from '../config/pg-client-settings';
import { SQL } from '../utils/sql';
import { Client } from 'pg';

export class Exchange
{
  /**
   * Get exchange
   */
  getData(): Promise<any>
  {
    const url = 'https://api.privatbank.ua/p24api/exchange_rates?json&date=' + moment().format('DD.MM.YYYY');

    return new Promise((resolve, reject) =>
    {
      request(url, (error, response: any, body) =>
      {
        const info = JSON.parse(body);

        if (info.exchangeRate && info.exchangeRate.length > 0)
        {
          const exchange = info.exchangeRate.find((item: any) => item.currency === 'USD');

          if (exchange !== undefined)
          {
            const value = Math.round(exchange.saleRate * 100) / 100;
            this.saveInfo(value);
          }
        }

        resolve(response);
      });
    });
  }

  /**
   * Save exchange
   *
   * @param exchange
   */
  saveInfo(exchange: number): void
  {
    const query = SQL`update base.exchange set value = ${exchange} where id = 1`;

    const client: Client = new Pg().client;

    client.query(query)
      .then((res) =>
      {
        console.log('success', res);
        client.end();
      })
      .catch(e =>
      {
        console.log('e', e);
        client.end();
      });
  }
}