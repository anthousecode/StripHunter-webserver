import { ENV_TYPE } from '../server';

export class MailSmtpSettings {
    private type: string;

    constructor() {
        this.type = ENV_TYPE;
    }

    get data(): any {
        if (this.type === 'dev') {
            return {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'easysolpro@gmail.com',
                    pass: ',F,EIRFGHBT[FKF'
                }
            };
        } else {
            return {
                host: 'smtp.yandex.ru',
                port: 465,
                secure: true,
                auth: {
                    user: 'love@cvety.kz',
                    pass: 'madina999'
                }
            };
        }
    }
}
