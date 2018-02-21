const _ = require('underscore');

export const Extras = {
    /**
     * Object filter by key
     * 
     * @param   {Object} resObj - 
     * @returns {Promise<Object>}
     */
    objectFilter(resObj, filterObject={}) {
        return new Promise((resolve, reject) => {
            /**
             * Run filter if the object contains more than 1 item
             */
            if (filterObject instanceof Object && Object.keys(filterObject).length > 1) {
                resolve(_.where(resObj, filterObject));
            }
            resolve(resObj);
        });
    }
}
