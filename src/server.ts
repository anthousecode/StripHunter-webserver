import { MainServer } from './apps/main-server';
import { SocketServer } from './apps/socket-server';
import { DatabaseNotifyServer } from './apps/database-notify-server';
import { GunServer } from './apps/gun-server';
import { ScheduleServer } from './apps/schedule-server';
import { SendMail } from './controllers/send-mail';

export let ENV_TYPE = 'prod'; // dev or prod

/**
 * Main server express
 */
const StripDbGQL = new MainServer().getApp();
export { StripDbGQL };

/**
 * WebSocket server
 */
const SocketApp = new SocketServer().getApp();
export { SocketApp };

/**
 * Stock db triggers listen.
 */
const StockListen = new DatabaseNotifyServer().getApp();
export { StockListen };

const ScheduleApp = new ScheduleServer().getApp();
export { ScheduleApp };

/**
 * Create gun server
 */
// const GunApp = new GunServer().getApp();
// export { GunApp };