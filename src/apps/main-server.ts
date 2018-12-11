import { createServer as createSecureServer, Server as SecureServer } from 'https';
import { Server } from 'http';
import express from 'express';
import { postgraphile } from 'postgraphile';
import GraphileBuildPgContribConnectionFilter from 'postgraphile-plugin-connection-filter';
import { Ssl } from '../config/ssl';
import { Pg } from '../config/pg-client-settings';
import { Response, Request } from 'express';
import fs from 'fs';
import compression from 'compression';
import cors from 'cors';

import { MemoryCache } from '../utils/cache';
import { OriginalImage, ResizeImages } from '../controllers/resize-images';
import { multipartUpload, uploadCropped } from '../controllers/upload';
import { getLiqpayData } from '../controllers/liqpay';
import { liqpayCallback } from '../controllers/liqpay-callback';

const corsOptions = {
  origin              : '*',
  optionsSuccessStatus: 200
};

export class MainServer
{
  public static readonly PORT: number = 5200;
  private app: express.Application;
  private server: Server | SecureServer;
  private port: string | number;

  constructor()
  {
    this.createApp();
    this.enableCors();
    this.enableSchemaRoute();
    this.sharpResize();
    this.liqpayData();
    this.liqpayCallback();
    this.saveFiles();
    this.saveCroppedFile();
    this.config();
    this.createServer();
    this.listen();
  }

  private createApp(): void
  {
    this.app = express();
    this.app.use(compression());

    this.app.use(
      postgraphile(Pg.stripDbConfigString(), 'base', {
        graphiql            : true,
        appendPlugins       : [GraphileBuildPgContribConnectionFilter],
        pgDefaultRole       : 'base_anonymous',
        enableCors          : true,
        jwtSecret           : 'keyboard_kitten',
        jwtPgTypeIdentifier : 'base.jwt_token',
        exportJsonSchemaPath: 'graphile-schema.json',
        disableQueryLog     : true,
        dynamicJson         : true,
        jwtVerifyOptions    : {
          // maxAge: '90d'
          ignoreExpiration: true,
        }
      })
    );
  }

  private saveCroppedFile(): void
  {
    this.app.post('/image-crop', uploadCropped);
  }

  private saveFiles(): void
  {
    this.app.post('/upload', multipartUpload, (req, resp) =>
    {
      console.log(req.file.filename);
      resp.json({filename: req.file.filename});
    });
  }

  private sharpResize(): void
  {
    this.app.get('/images/:width/:height/:fileName', ResizeImages);
    this.app.get('/images/:fileName', OriginalImage);
  }

  liqpayData(): void
  {
    this.app.get('/liqpay/:version/:amount/:currency/:description/:action/:order_id', getLiqpayData);
  }

  liqpayCallback(): void
  {
    this.app.post('/liqpay-callback', liqpayCallback);
  }

  private enableSchemaRoute(): void
  {
    this.app.use((req: any, res: any, next: any) =>
    {
      req.connection.setNoDelay(true);
      next();
    });

    this.app.get('/graphile-schema', MemoryCache(), getSchema);
  }

  private enableCors(): void
  {
    this.app.use(cors(corsOptions));
  }

  private createServer(): void
  {
    this.server = createSecureServer(Ssl.stripHunterOptions(), this.app);
  }

  private config(): void
  {
    this.port = MainServer.PORT;
  }

  private listen(): void
  {
    this.server.listen(this.port, () =>
    {
      console.log('Running graphile stock-db server on port %s', this.port);
    });
  }

  public getApp(): express.Application
  {
    return this.app;
  }
}

/**
 * Get schema
 *
 * @param req
 * @param res
 */
function getSchema(req: Request, res: Response)
{
  // Read schema from the local file
  const rawSchema = JSON.parse(fs.readFileSync('graphile-schema.json', 'utf8'));

  // Get configs with plural names
  const queryObj = rawSchema.data.__schema.types.find((type: any) => type.name === 'Query');
  const queries  = queryObj.fields.filter((field: any) => field.name.startsWith('all'));

  // Transform schema
  const schema = rawSchema.data.__schema.types
    .filter((type: any) =>
    {
      return type.fields && type.kind === 'OBJECT' && type.fields[0].name === 'nodeId';
    })
    .map((type: any) =>
    {
      const pluralQueryName = queries.find((item: any) => item.description.includes(`\`${type.name}\``)).name;
      const pluralName      = pluralQueryName.substr(3);
      const fields          = getFields(type.fields);

      return {
        name: type.name,
        pluralName,
        fields
      };
    });

  return res.send(schema);
}

/**
 * Get entity fields
 *
 * @param fields
 */
function getFields(fields: any[]): any
{
  return fields
    .filter((field: any) =>
    {
      if (field.args && field.args.length > 0)
      {
        return false;
      }
      return !(field.type.ofType && field.type.ofType.name.endsWith('Connection'));
    })
    .reduce((_fields: any, field: any) =>
    {
      let type;

      switch (field.type.kind)
      {
        case 'LIST':
          type = field.type.ofType.name + '[]';
          break;

        case 'OBJECT':
          type = {
            kind: 'OBJECT',
            name: field.type.name
          };
          break;

        default:
          type = !!field.type.ofType ? field.type.ofType.name : field.type.name;
          break;
      }

      return {
        ..._fields,
        [field.name]: type
      };
    }, {});
}
