import { _ } from 'underscore';
import * as config from './config.json';
import { createLocalStorage } from 'localstorage-ponyfill';

const printf       = require('printf'),
      objMerge     = require('object-merge'),
      localStorage = createLocalStorage();

export const Helper = {
    /**
     * Store value in cache with cache key reference
     * 
     * @param {string} cacheKey   - Key to identify thecache content 
     * @param {any}    cacheValue - The informationyou want to store
     */
    cacheStore(cacheKey:string, cacheValue:any): void {
        let storeValue:string;
        if (_.isObject(cacheValue)) {
            storeValue = JSON.stringify(cacheValue);
        }else{
            storeValue = cacheValue;
        }
        localStorage.setItem(cacheKey, storeValue);
    },
    /**
     * Retrieve cached item
     */
    cache(cacheKey:string): any {
        let cacheValue:any = localStorage.getItem(cacheKey),
            returnValue:any;
        if (!_.isNull(cacheValue)) {
            try {
                returnValue = JSON.parse(cacheValue);
            }catch(error) {
                returnValue = cacheValue;
            }
        }else{
            returnValue = cacheKey;
        }
        return returnValue;
    },
    /**
     * Transform an Array of file IDs to a string
     * 
     * Note
     * ----
     * Used for multiple file IDs in API requests 
     */
    arrayToString(arrayObj:Array<number|string>|number|string, delimiter=','): Array<number|string>|number|string {
        if (_.isArray(arrayObj)) {
            return arrayObj.map(value=>value.trim()).join(delimiter);
        }
        return arrayObj;
    },
    /**
     * Wrapper function for text replacements
     */
    strReplace(textString:string, replacementObject:Object): string {
        if (!_.isString(textString) || !_.isObject(replacementObject)) {
            this.appErrorHandler('printf fail', {
                textString: textString,
                replacementObject: replacementObject
            });
        }
        return printf(textString, replacementObject);
    },
    /**
     * Wrapper function to merge two Objects 
     */
    mergeObjects(sourceObject:object, targetObject:object): any {
        if (!_.isObject(sourceObject) || !_.isObject(targetObject)) {
            this.appErrorHandler('objMerge fail', {
                sourceObject: sourceObject,
                targetObject: targetObject
            });
        }
        return objMerge(sourceObject, targetObject);
    },
    /**
     * Reduce the amount of items in a Object by an Array of Object keys
     * 
     * Normal:
     * -------
     * reduceObject({ guitar:'Ibanez', band:'Iron Maiden', song:'Fear Of The Dark' }, ['song'])
     * >>> ({ guitar:'Ibanez', band:'Iron Maiden' }
     * 
     * Inverted:
     * ---------
     * reduceObject({ guitar:'Ibanez', band:'Iron Maiden', song:'Fear Of The Dark' }, ['song'], true)
     * >>> ({ song:'Fear Of The Dark' }
     * 
     */
    reduceObject(sourceObj:Object, keyArray:Array<string>, inverted=false): any {
        if (!_.isObject(sourceObj) || !_.isArray(keyArray)) {
            this.appErrorHandler('reduceObject fail');
        }
        if (inverted) {
            return _.pick(sourceObj, keyArray);    
        }
        return _.omit(sourceObj, keyArray);
    },
    /**
     * Get the apiEndpoint from the config file and replace certain text parts
     * 
     * Example
     * -------
     * Input:  /files/search/%(queryString)s/page/%(page)s
     * Output: /files/search/star%20wars/page/0
     */
    getEndpoint(apiEndpoint:string, textReplacementObject={}): string {
        if (apiEndpoint.indexOf('.') !== -1) {
            const endpoint = apiEndpoint.split('.');
            if (_.has(config.api.endpoints, endpoint[0])) {
                if (_.has(config.api.endpoints[endpoint[0]], endpoint[1])) {
                    return this.strReplace(config.api.endpoints[endpoint[0]][endpoint[1]], textReplacementObject);
                }else{
                    return this.strReplace(config.api.endpoints[endpoint[0]], textReplacementObject);
                }
            }
        }else{
            return this.strReplace(config.api.endpoints[apiEndpoint], textReplacementObject);
        }

        this.appErrorHandler('Endpoint '+apiEndpoint+' not supported');
    },
    /**
     * Simple error handler
     */
    appErrorHandler(error:string, errorObject={}): void {
        throw new Error(error + ': ' + JSON.stringify(errorObject));
    }
}
