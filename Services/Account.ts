import { putIoApi } from './ApiClient';
import { Helper } from '../Helper';

const _ = require('underscore');

export const Account = {
    /**
     * Account information
     * 
     * @returns {Promise<Object>}
     */
    info(): Promise<Object> {
        return putIoApi.get('account.info');
    },
    /**
     * Account settings
     * 
     * @returns {Promise<Object>}
     */
    settings(): Promise<Object> {
        return putIoApi.get('account.settings');
    },
    /**
     * Update account settings
     * 
     * @param   {Object<Array<string>|string|boolean>} settingsObject
     * @returns {Promise<Object>}
     */
    settingsUpdate(settingsObject?): Promise<Object> {
        let formObject = {};
        /**
         * File ID for default location. 0 is the root folder
         */
        if (_.has(settingsObject, 'default_download_folder') && _.isNumber(settingsObject.default_download_folder)) {
            formObject['default_download_folder'] = settingsObject.default_download_folder;
        }
        /**
         * Toggle your visibility for the Put.io network
         */
        if (_.has(settingsObject, 'is_invisible') && _.isBoolean(settingsObject.is_invisible)) {
            formObject['is_invisible'] = settingsObject.is_invisible;
        }
        /**
         * String of comma separated ISO639-2 codes (e.g., 'eng,ger') (max. 2)
         */
        if (_.has(settingsObject, 'subtitle_languages') && (_.isArray(settingsObject.subtitle_languages))) {
            /**
             * Splice Fix: reduce the items of the given array to 2 items!
             */
            formObject['subtitle_languages'] = Helper.arrayToString(settingsObject.subtitle_languages.splice(0,2));
        }
        return putIoApi.post('account.settings', { form: formObject });
    }
}
