import { Request, NextFunction } from 'express';
import mcache from 'memory-cache';

export let MemoryCache = (duration: number = null) =>
{
  return (req: Request, res: any, next: NextFunction) =>
  {
    const key        = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody)
    {
      res.send(JSON.parse(cachedBody));
      return;
    }
    else
    {
      res.sendResponse = res.send;
      res.send         = (body: any) =>
      {
        if (duration)
        {
          mcache.put(key, body, duration * 1000);
        }
        else
        {
          mcache.put(key, body);
        }
        res.sendResponse(body);
      };

      next();
    }
  };
};
