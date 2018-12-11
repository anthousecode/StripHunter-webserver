import fs from 'fs';
import { join } from 'path';

export class Ssl
{
  public static stripHunterOptions(): any
  {
    return {
      key : fs.readFileSync('/home/admin/conf/web/ssl.striphunter.com.key', 'ascii'),
      cert: fs.readFileSync('//home/admin/conf/web/ssl.striphunter.com.pem', 'ascii')
    };
  }
}