import sharp from 'sharp';
import { Response, Request } from 'express';
import { join } from 'path';

/**
 * Get image
 */
export let OriginalImage = (req: Request, res: Response) =>
{
  const reqFile = req.params.fileName;

  // Is this an image request?
  if (!hasAllowedExtension(reqFile, ['.png', '.jpg', '.JPG', '.jpeg', '.JPEG']))
  {
    return404(res, 'request did not have allowed extension', 200, 200);
    return;
  }

  const filePath = join('uploads', reqFile);

  sharp(filePath)
    .toFormat('jpeg')
    .toBuffer(function (err: Error, outputBuffer: any)
    {
      if (err)
      {
        return404(res, 'not valid image', 200, 200);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Cache-Control', 'public, max-age=31556952000');
      res.setHeader('Expires', new Date(Date.now() + 31556952000).toUTCString());
      res.setHeader('Content-Type', 'image/jpeg');
      res.end(outputBuffer, 'binary');
    });
};

/**
 * Get image
 */
export let ResizeImages = (req: Request, res: Response) =>
{
  const reqFile     = req.params.fileName;
  const widthValue  = parseInt(req.params.width, 10);
  const heightValue = parseInt(req.params.height, 10);

  // Is this an image request?
  if (!hasAllowedExtension(reqFile, ['.png', '.jpg', '.JPG', '.jpeg', '.JPEG']))
  {
    return404(res, 'request did not have allowed extension', widthValue, heightValue);
    return;
  }

  const filePath = join('uploads', reqFile);

  sharp(filePath)
    .resize(widthValue, heightValue)
    .crop(sharp.strategy.entropy)
    .toFormat('jpeg')
    .toBuffer(function (err: Error, outputBuffer: any)
    {
      if (err)
      {
        return404(res, 'not valid image', widthValue, heightValue);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Cache-Control', 'public, max-age=31556952000');
      res.setHeader('Expires', new Date(Date.now() + 31556952000).toUTCString());
      res.setHeader('Content-Type', 'image/jpeg');
      res.end(outputBuffer, 'binary');
    });
};

/**
 * Image not exist
 */
function return404(res: Response, e: string, widthValue: number, heightValue: number): void
{
  const emptyImagePath = join('uploads', 'file-1536838758594.png');

  sharp(emptyImagePath)
    .resize(widthValue, heightValue)
    .crop(sharp.strategy.entropy)
    .toBuffer(function (err: Error, outputBuffer: any)
    {
      if (err)
      {
        throw err;
      }
      res.statusCode = 200;
      res.setHeader('Cache-Control', 'public, max-age=31556952000');
      res.setHeader('Expires', new Date(Date.now() + 31556952000).toUTCString());
      res.setHeader('Content-Type', 'image/png');
      res.end(outputBuffer, 'binary');
    });
}

/**
 * Check allowed image extensions
 */
function hasAllowedExtension(file: string, exts: string[]): boolean
{
  return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(file);
}
