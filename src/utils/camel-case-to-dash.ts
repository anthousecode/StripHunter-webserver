import * as _ from 'lodash';

export class CamelCaseToDash
{

  forObject(obj: any): any
  {

    const newObj: any = {};

    if (obj)
    {
      Object.keys(obj).forEach(key =>
      {
        const newKey   = _.snakeCase(key);
        newObj[newKey] = obj[key];
      });
    }

    return newObj;
  }
}
