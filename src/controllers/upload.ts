import multer from 'multer';
import { Request, Response } from 'express';
import fs from 'fs';

import formidable from 'formidable';


export const multipartUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback)
    {
      callback(null, './uploads');
    },
    filename   : (req, file, cb) =>
    {
      const dateTimestamp = Date.now();
      cb(null, file.fieldname + '-' + dateTimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
  })
}).single('file');


export let uploadCropped = (req: Request, res: Response) =>
{
  const form   = new formidable.IncomingForm();

  form.parse(req, (err: any, fields: any, files: any) =>
  {
    const file = fields.file;

    if (typeof file === 'string')
    {
      const name       = Date.now() + '.jpg';
      const dirPath    = './uploads/' + name;
      const base64Data = file.replace(/^data:image\/png;base64,/, '');

      fs.writeFile(dirPath, base64Data, 'base64', function (err)
      {
        if (err)
        {
          return console.log(err);
        }

        res.json({'filename': name});
      });
    }
    else
    {
      res.json({'filename': null});
    }
  });
};
