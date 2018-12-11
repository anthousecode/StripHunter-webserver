import { Request, Response } from 'express';
import request from 'request';
import crypto from 'crypto';

/**
 * GET /liqpay
 * Get Liqpay payment data.
 */
export let getLiqpayData = (req: Request, res: Response) =>
{
  const liqpay = new Liqpay();
  let object;

  try
  {
    object = liqpay.cnb_object(req.params);
  }
  catch (e)
  {
    object = {data: null, signature: null, error: e};
  }
  finally
  {
    res.send(object);
  }
};

export class Liqpay
{
  host: string;
  public_key: string;
  private_key: string;


  constructor()
  {
    this.host        = 'https://www.liqpay.ua/api/';
    this.public_key  = 'i42351445415';
    this.private_key = 'hYcdX839wuexveeK4lNMukqnnGcjZczU7nvvQ72C';
  }

  /**
   * Call API
   *
   * @param path
   * @param params
   * @param callback
   * @param callbackerr
   */
  api(path: string, params: any, callback: any, callbackerr: any): any
  {

    if (!params.version)
    {
      throw new Error('version is null');
    }

    params.public_key = this.public_key;
    const data        = new Buffer(JSON.stringify(params)).toString('base64');
    const signature   = this.str_to_sign(this.private_key + data + this.private_key);

    request.post(this.host + path, {form: {data: data, signature: signature}}, function (error, response, body)
      {
        if (!error && response.statusCode == 200)
        {
          callback(JSON.parse(body));
        }
        else
        {
          callbackerr(error, response);
        }
      }
    );
  }

  /**
   * cnb_form
   *
   * @param params
   */
  cnb_form(params: any): string
  {

    let language = 'ru';
    if (params.language)
    {
      language = params.language;
    }

    params          = this.cnb_params(params);
    const data      = new Buffer(JSON.stringify(params)).toString('base64');
    const signature = this.str_to_sign(this.private_key + data + this.private_key);

    return '<form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">' +
      '<input type="hidden" name="data" value="' + data + '" />' +
      '<input type="hidden" name="signature" value="' + signature + '" />' +
      '<input type="image" src="//static.liqpay.ua/buttons/p1' + language + '.radius.png" name="btn_text" />' +
      '</form>';

  }

  /**
   * cnb_signature
   * @param params
   */
  cnb_signature(params: any): string
  {

    params     = this.cnb_params(params);
    const data = new Buffer(JSON.stringify(params)).toString('base64');
    return this.str_to_sign(this.private_key + data + this.private_key);

  }

  /**
   * cnb_params
   *
   * @param params
   */
  cnb_params(params: any): any
  {

    params.public_key = this.public_key;

    if (!params.version)
    {
      throw new Error('version is null');
    }
    if (!params.amount)
    {
      throw new Error('amount is null');
    }
    if (!params.currency)
    {
      throw new Error('currency is null');
    }
    if (!params.description)
    {
      throw new Error('description is null');
    }

    return params;

  }

  /**
   * str_to_sign
   *
   * @param str
   */
  str_to_sign(str: string): string
  {
    const sha1 = crypto.createHash('sha1');
    sha1.update(str);
    return sha1.digest('base64');
  }

  /**
   * Return Form Object
   */
  cnb_object(params: any): any
  {

    let language = 'ru';
    if (params.language)
    {
      language = params.language;
    }

    params          = this.cnb_params(params);
    const data      = new Buffer(JSON.stringify(params)).toString('base64');
    const signature = this.str_to_sign(this.private_key + data + this.private_key);

    return {data: data, signature: signature};
  }
}