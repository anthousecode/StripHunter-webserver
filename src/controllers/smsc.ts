import request from 'request';
import { DbLogger } from './db-logger';

export class Smsc
{
  public static pass   = 'b3f760d79967dffc67b59c414248e054';
  public static login  = 'flirtclub';
  public static sender = 'StripHunter';

  private pass: string;
  private login: string;
  private sender: string;
  private recipient: string;
  private text: string;

  constructor(data: any)
  {
    this.recipient = data.recipient; // '+380960829493';
    this.text      = data.text;

    this.config();
  }

  private config(): void
  {
    this.pass   = Smsc.pass;
    this.login  = Smsc.login;
    this.sender = Smsc.sender;
  }

  sendMessage(): void
  {
    const uri = `https://smsc.ru/sys/send.php?login=${this.login}&psw=${this.pass}&phones=${this.recipient}&mes=${this.text}&sender=${this.sender}`;
    request.get(uri, (error, response, body) =>
    {
      const logger = new DbLogger();

      console.log('statusCode:', response && response.statusCode);
      console.log('body', body);

      if (!!error)
      {
        logger.log(error, 'error');
      }
      logger.log(body);
    });
  }
}