import { Request, Response } from 'express';
import formidable from 'formidable';

import { Pg } from '../config/pg-client-settings';
import { SQL } from '../utils/sql';
import { Client } from 'pg';
import { DbLogger } from './db-logger';

/**
 * POST /liqpay
 * Liqpay callback data.
 */
export let liqpayCallback = (req: Request, res: Response) =>
{
  const form   = new formidable.IncomingForm();
  const liqpay = new LiqpayCallback();
  const logger = new DbLogger();

  form.parse(req, (err: any, fields: any, files: any) =>
  {
    logger.log(fields);
    liqpay.saveInfo(fields);
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end('success');
  });
};

export class LiqpayCallback
{
  saveInfo(data: any): void
  {
    // const query = SQL`update base.exchange set value = ${exchange} where id = 1`;
    //
    // const client: Client = new Pg().client;
    //
    // client.query(query)
    //   .then((res) =>
    //   {
    //     console.log('success', res);
    //     client.end();
    //   })
    //   .catch(e =>
    //   {
    //     console.log('e', e);
    //     client.end();
    //   });
  }
}