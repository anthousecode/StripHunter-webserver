import { PgListener } from '../apps/database-notify-server';
import { Smsc } from './smsc';
import { SendMail } from './send-mail';

interface Content
{
  table: string;
  id: number;
  type: string;
  row: any;
}

export class PgListenWorker
{
  gun: any;

  constructor()
  {
    // this.gun = GunClient;
  }

  handleMessage(message: Content): void
  {
    console.log('table', message.table);
    switch (message.table)
    {
      case 'notification':
        this.setNotification(message);
        break;

      case 'register_info_helper':
        this.sendRegisterCode(message);
        break;

      default:
        PgListener.emit('pg-listen', message);
        break;
    }
  }

  setNotification(message: Content): void
  {
    const mail = new SendMail();

    if (message.type === 'INSERT')
    {
      // Send mail
      if (!!message.row.email)
      {
        console.log('setNotification, email: ' + message.row.email);
        mail.send({email: message.row.email, content: message.row.content});
      }
      else if (!!message.row.to_admin)
      {
        mail.send({email: 'a@striphunter.com', content: message.row.content});
      }
    }
  }

  sendRegisterCode(message: Content): void
  {
    if (message.type === 'INSERT')
    {
      const sender = new Smsc({
        recipient: message.row.phone,
        text     : `${message.row.code}`
      });

      sender.sendMessage();
    }
  }
}