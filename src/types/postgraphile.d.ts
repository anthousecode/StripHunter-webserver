declare module 'postgraphile'
{

  import { Pool, PoolConfig } from 'pg';
  import { IncomingMessage, ServerResponse } from 'http';

  export type mixed = {} | string | number | boolean | undefined | null;

  export interface HttpRequestHandler
  {
    (req: IncomingMessage, res: ServerResponse, next?: (error?: mixed) => void): void;

    (ctx: { req: IncomingMessage, res: ServerResponse }, next: () => void): Promise<void>;
  }

  export type PostGraphQLOptions = {
    classicIds?: boolean,
    dynamicJson?: boolean,
    graphqlRoute?: string,
    graphiqlRoute?: string,
    graphiql?: boolean,
    appendPlugins?: any[],
    pgDefaultRole?: string,
    jwtSecret?: string,
    jwtAudiences?: Array<string>,
    jwtRole?: Array<string>,
    jwtPgTypeIdentifier?: string,
    watchPg?: boolean,
    showErrorStack?: boolean,
    disableQueryLog?: boolean,
    disableDefaultMutations?: boolean,
    enableCors?: boolean,
    exportJsonSchemaPath?: string,
    exportGqlSchemaPath?: string,
    bodySizeLimit?: string,
    pgSettings?: { [key: string]: mixed },
    jwtVerifyOptions?: any
  };

  export function postgraphile(poolOrConfig?: Pool | PoolConfig | string, schema?: string | Array<string>, options?: PostGraphQLOptions): HttpRequestHandler;
  export function postgraphile(poolOrConfig?: Pool | PoolConfig | string, options?: PostGraphQLOptions): HttpRequestHandler;
}

declare module 'postgraphile-core';
