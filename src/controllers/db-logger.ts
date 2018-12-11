import { Pg } from '../config/pg-client-settings';
import { SQL } from '../utils/sql';
import { Client } from 'pg';

export class DbLogger
{
  log(data: any, type?: string): void
  {
    type = type || 'info';
    if (typeof data === 'object')
    {
      data = JSON.stringify(data);
    }
    else
    {
      data = `${data}`;
    }

    const query = SQL`insert into base.log (message, type) values (${data}, ${type})`;

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