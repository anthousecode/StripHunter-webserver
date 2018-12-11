import * as _ from 'lodash';

export class ToCamelCase {

    forObject(obj: any): any {

        const newObj: any = {};

        if (obj) {
            Object.keys(obj).forEach(key => {
                const newKey = _.camelCase(key);
                newObj[newKey] = obj[key];
            });
        }

        return newObj;
    }
}
