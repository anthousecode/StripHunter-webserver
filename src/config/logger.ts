import * as winston from 'winston';

const timestamp = () => {
  return (new Date()).toISOString();
};

export const LOGGER = new winston.Logger({
  // don't crash on exception
  exitOnError: false,
  transports: [

    // always use the console
    new winston.transports.Console({
      timestamp: timestamp
    }),

    // log everything to the server.log
    new winston.transports.File({
      filename : './dist/server.log',
      name     : 'server.log',
      timestamp: timestamp
    }),

    // log info to the info.log
    new winston.transports.File({
      level: 'info',
      filename : './dist/info.log',
      name     : 'info.log',
      timestamp: timestamp
    }),

    // log errors and exceptions to the error.log
    new winston.transports.File({
      level: 'error',
      filename : './dist/error.log',
      name     : 'error.log',
      timestamp: timestamp
    }),

    // log warn to the warn.log
    new winston.transports.File({
      level: 'warn',
      filename : './dist/warn.log',
      name     : 'warn.log',
      timestamp: timestamp
    })
  ]
});


