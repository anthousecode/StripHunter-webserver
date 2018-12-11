import { readFileSync } from 'fs';
import { join } from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { DbLogger } from './db-logger';
import moment from 'moment';

// const transporter = nodemailer.createTransport({
//   host  : 'striphunter.com',
//   port  : 587,
//   secure: false,
//   logger: true,
//   auth  : {
//     user: 'admin@striphunter.com',
//     pass: 'ezmNZxAUB9'
//   },
//   tls   : {
//     // do not fail on invalid certs
//     rejectUnauthorized: false
//   }
// });

const transporter = nodemailer.createTransport({
  host  : 'striphunter.com', // 'server.domain.com', // 'striphunter.com',
  port  : 587,
  secure: false,
  logger: false,
  auth  : {
    user: 'admin@striphunter.com',
    pass: 'ezmNZxAUB9'
  },
  tls   : {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

export class SendMail
{
  constructor()
  {
  }

  verify(): void
  {
    // verify connection configuration
    transporter.verify(function (error, success)
    {
      if (error)
      {
        console.log(error);
      }
      else
      {
        console.log('Server is ready to take our messages');
      }
    });
  }

  /**
   * Init class methods
   */
  send(data: any): void
  {
    const logger = new DbLogger();

    this.sendEmail(data)
      .then(() =>
      {
        logger.log(moment().format() + ' Send email success to ' + data.email);
        console.log(`Send email success`);
      })
      .catch(error =>
      {
        console.log(`Send mail error: `, error);
        logger.log(error, 'error');
      });
  }

  /**
   * Send email to customer
   *
   * @returns {Promise<any>}
   */
  private sendEmail(data: any): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      const mailPath   = join('dist', 'public', 'mail-templates', 'simple-template.html');
      const html       = readFileSync(mailPath).toString();
      const template   = handlebars.compile(html);
      const htmlToSend = template(data);

      const mailOptions = {
        to     : data.email,
        from   : 'admin@striphunter.com',
        subject: 'Сообщение от Strip Hunter',
        html   : htmlToSend,
        text   : 'Сообщение от Strip Hunter'
      };

      transporter.sendMail(mailOptions, (error) =>
      {
        if (error)
        {
          reject(error);
        }
        else
        {
          resolve();
        }
      });
    });
  }
}