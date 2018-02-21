import * as config from '../config.json';
import { Helper } from '../Helper';
import { _ } from 'underscore';

const request = require('request');
      
// Fix for "UNABLE_TO_VERIFY_LEAF_SIGNATURE" error
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export const putIoApi = new class putIoApiClient {
    
    refreshedToken:boolean = false; 

    constructor() {}
    
    /**
     * Refresh OAuth token and store the token for further API requests
     * 
     * @returns {Promise<string>}
     */
    async refreshOAuthToken(): Promise<string> {
        return await putIoApi.obtainAccessToken().then(OAuthToken => {
            if (_.isNull(OAuthToken)) {
                putIoApi.appErrorHandler(`Access Token Error`);
            }
            Helper.cacheStore(config.app.cacheKeys.OAuthToken, OAuthToken);
            return OAuthToken;
        });
    }
    /**
     * Get oAuth token
     * 
     * @returns {string}
     */
    getOAuthToken(): string {
        /**
         * Lookup the oAuth token in your config file first
         */
        if (config.api.credentials.auth_token) {
            return config.api.credentials.auth_token;
        }else{
            /**
             * Lookup the oAuth token in your localstorage
             */
            const oAuthToken = Helper.cache(config.app.cacheKeys.OAuthToken);
            if (_.isNull(oAuthToken)) {
                /**
                 * Refresh oAuth token via API
                 */
                putIoApi.refreshOAuthToken();
                return Helper.cache(config.app.cacheKeys.OAuthToken);
            }else{
                return oAuthToken;
            }
        }
    }
    /**
     * Obtain oAuth token
     * 
     * @returns {Promise<string>}
     */
    obtainAccessToken(): Promise<string> {
        return this.post('authenticate').then(res => {
            try {
                /**
                 * Extract the oAuth token from response headers
                 */
                return /=(.*)/i.exec(res.payload.headers.location)[1] || null;
            } catch(error) {
                putIoApi.appErrorHandler(error);
            }
        });
    }
    /**
     * Build JSON object forAPI requests
     * 
     * @param   {Object<number|string|Object>} fileIds - 1-n File ID
     * @returns {Array<number>}
     */
    buildRequestOptionsObject(dataObject:Object, method:string, endpoint:string) {
        /**
         * Build default request Object
         */
        const requestObject = Helper.mergeObjects({
                method: method.toUpperCase(),
                uri:    config.api.api_endpoint + endpoint
        }, Helper.mergeObjects(config.api.requestDefaultOptions, dataObject));

        if (endpoint == '/oauth2/authenticate') {
            return Helper.mergeObjects(requestObject, {
                form: {
                    name:     config.credentials.name,
                    password: config.credentials.password
                },
                qs: {
                    redirect_uri:  config.api.redirect_uri,
                    response_type: 'token',
                    client_id:     config.api.credentials.client_id
                }
            });
        }else{
            /**
             * Append the OAuth token to all requests except for the authentication
             */
            return Helper.mergeObjects(requestObject, {
                qs: {
                    oauth_token: this.getOAuthToken()
                }
            });
        }
    }
    /**
     * API request
     * 
     * @param   {string} method     - Request method (GET|POST)  
     * @param   {Array<string|object>|string} endpoint   - API endpoint path
     * @param   {object} dataObject - Request option object
     * @returns {Promise<Object>}
     */
    async request(method:string, endpoint:Array<string|object>|string, dataObject={}): any {
        let endpointPath;
        if (_.isArray(endpoint)) {
            if (endpoint.length == 2) {
                endpointPath = Helper.getEndpoint(endpoint[0], endpoint[1]);
            }else{
                endpointPath = Helper.getEndpoint(endpoint[0]);
            }
        }else{
            endpointPath = Helper.getEndpoint(endpoint);
        }
        return await new Promise((resolve, reject) => {
            const requestOptions = this.buildRequestOptionsObject(dataObject, method, endpointPath);
            //console.log('requestOptions', requestOptions);
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                switch(response.statusCode) {
                    case 401:
                        /**
                         * Obtain OAuth token and run the request method with the original arguments
                         */
                        if (this.refreshedToken) {
                            /**
                             * Hotfix to prevent an infinite request loop caused by the false response of an invalid oAuth token
                             */
                            this.appErrorHandler('Token refresh error');
                        }
                        /**
                         * Refresh OAuth token
                         */
                        putIoApi.refreshOAuthToken().then(() => {
                            this.refreshedToken = true;
                            putIoApi.request(method, endpoint, dataObject).then(res => {
                                resolve(res);
                            });
                        });
                    break;
                    case 302:
                    case 200:
                        /**
                         * Everything okay. If authentication endpoint, return the full response instead of body 
                         */
                        resolve(putIoApi.requestResponseHandler(endpointPath==config.api.endpoints.authenticate?response:body));
                    default:
                        if (_.has(body, 'status')) {
                            reject({
                                statusCode: response.statusCode,
                                message:    body.error_message
                            });
                        }else{
                            resolve(putIoApi.requestResponseHandler(body));
                        }
                    break;
                }
            })
        }).catch(this.requestErrorHandler);
    }
    /**
     * Multi Promise request handler for files
     * 
     * @param   {Array<number>} fileIdArray - Array of file id's
     * @returns {Promise<Object>}
     */
    async batchFileProcessing(method:string, fileIds:Array<number>, endpoint:string, requestObject={}) {
        return await Promise.all(
            await fileIds.map(
                async fileId => {
                    return await putIoApi[method]([endpoint, { fileId: fileId }], requestObject);
                }
            ))
            .then(resList => {
                return putIoApi.requestResponseHandler(resList.map(fileObject => {
                    if (_.has(fileObject.payload, 'file')) {
                        return fileObject.payload['file'];
                    }
                    return fileObject.payload;
                }));
            });
    }
    /**
     * GET for request endpoint
     * 
     * @param   {Array<string|object>|string} endpoint   - API endpoint path 
     * @param   {object} dataObject - Request option object
     * @returns {Promise<Object>}
     */
    get(endpoint:Array<string|object>|string, dataObject?) {
        return this.request('GET', endpoint, dataObject);
    }
    /**
     * POST for request endpoint
     * 
     * @param   {Array<string|object>|string} endpoint   - API endpoint path 
     * @param   {object} dataObject - Request option object
     * @returns {Promise<Object>}
     */
    post(endpoint:Array<string|object>|string, dataObject?) {
        return this.request('POST', endpoint, dataObject);
    }
    /**
     * Request response handler 
     * 
     * @param   {object|string} payload - Response payload
     * @param   {object|string} payload - OPtional message
     * @returns {any}
     */
    requestResponseHandler(payload:object|string, message?): any {
        if (_.isNull(payload)) {
            return putIoApi.requestErrorHandler('Response Error');
        }
        // We don't need the status twice in our response
        if (_.has(payload, 'status')) {
            delete (payload['status']);
        }
        return {
            status:  'OK',
            payload: payload,
            message: _.isUndefined(message)?'':message
        }
    }
    /**
     * Request error handler 
     * 
     * @param   {object|string} error - Error message 
     * @returns {any}
     */
    requestErrorHandler(error:object|string): any {
        return {
            status: 'ERROR',
            error:  _.isObject(error)?JSON.stringify(error):error
        }
    }
    /**
     * App error handler
     * 
     * @param   {string} error - Error message 
     * @returns {void}
     */
    appErrorHandler(error:string): void {
        throw new Error(error);
    }
}
