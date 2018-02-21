import { putIoApi } from './ApiClient';
import { Helper } from '../Helper';
import * as config from '../config.json';
import { _ } from 'underscore';

export const Files = {
    /**
     * Get one or multiple file objects
     * 
     * @param   {Array<number>|number} fileIds - Single or Multiple file id's
     * @returns {Promise<Object>}
     */
    get(fileIds:any): Promise<Object> {
        return putIoApi.batchFileProcessing('get', this.processFileIdArray(fileIds), 'files.get')
        .then(response => {
            // Retrieve Folder content with Files.list()
            if (Object.keys(response.payload).length &&
                response.payload[0]['file_type'] == 'FOLDER') {
                return Files.list(fileIds);
            }
            return response;
        });
    },
    /**
     * Returns list of shared files and share information.
     * 
     * @returns {Promise<Object>}
     */
    shared(): Promise<Object> {
        return putIoApi.get('files.shared');
    },
    /**
     * Returns list of shared files and share information.
     * 
     * @param   {number} fileId - File ID
     * @returns {Promise<Object>}
     */
    sharedWidth(fileId:number): Promise<Object> {
        return putIoApi.get(['files.sharedWith', { fileId: fileId }]);
    },
    /**
     * Sets default video position for a video file
     * 
     * @param   {number} fileId - File ID
     * @param   {number} milliseconds - Time in milliseconds
     * @returns {Promise<Object>}
     */
    setVideoPosition(fileId:number, milliseconds:number): Promise<Object> {
        return putIoApi.post(['files.setVideoPosition', { fileId: fileId }], {
            form: {
                time: milliseconds // milliseconds - 3600000
            }
        });
    },
    /**
     * Delete video position for a video file
     * 
     * @param   {number} fileId - File ID
     * @returns {Promise<Object>}
     */
    deleteVideoPosition(fileId:number): Promise<Object> {
        return putIoApi.post(['files.deleteVideoPosition', { fileId: fileId }]);
    },
    /**
     * Unshares given file from given friends or from everyone
     * 
     * @param   {number} fileId - File ID
     * @param   {Array<number>} shares - Comma separated list of friend ID's or 'everyone'
     * @returns {Promise<Object>}
     */
    unshare(fileId:number, shares:Array<number>|number): Promise<Object> {
        let sharesArgs;
        if (!_.isArray(shares) || _.isUndefined(shares)) {
            sharesArgs = 'everyone';
        }else{
            sharesArgs = Helper.arrayToString(shares);
        }
        return putIoApi.post(['files.unshare', { fileId: fileId }], {
            form: {
                shares: sharesArgs
            }
        });
    },
    /**
     * 
     * @param   {Array<number>|number} fileIds - Single or Array of file ID's
     * @param   {Array<number>|number|string} shares - Comma separated list of friend ID's or 'everyone'
     * @returns {Promise<Object>}
     */
    share(fileIds:Array<number>|number, shares:Array<number>|number): Promise<Object> {
        let sharesArgs;
        if (!_.isArray(shares) || _.isUndefined(shares)) {
            sharesArgs = 'everyone';
        }else{
            sharesArgs = Helper.arrayToString(shares);
        }
        return putIoApi.post('files.share', {
            form: {
                file_ids: Helper.arrayToString(fileIds),
                friends: sharesArgs
            }
        });
    },
    /**
     * Lists available subtitles for user’s preferred language. User must select “Default Subtitle Language” from settings page. See: Account Info
     * 
     * @param   {Array<number>|number} fileIds - 1-n File ID
     * @returns {Promise<Object>}
     */
    subtitles(fileIds:Array<number>|number): Promise<Object> {
        return putIoApi.batchFileProcessing('get', this.processFileIdArray(fileIds), 'files.subtitles');
    },
    /**
     * Sends the contents of the subtitle file. There is a powerful built in key called default. If you use it, putio searches for a subtitle in the following order and returns the first match
     * 
     * @param   {number} fileId - File ID
     * @param   {string} subKey - Subtitle key
     * @param   {string} format - Output format for the given subtitle
     * @returns {Promise<Object>}
     */
    subtitlesDownload(fileId:number, subKey:string, format='srt'): Promise<Object> {
        return putIoApi.get(['files.subtitlesDownload', {
            fileId: fileId,
            subKey: subKey
        }], {
            form: {
                format: format
            }
        });
    },
    /**
     * Serves a HLS playlist for a video file
     * 
     * @param   {number} fileId - File ID
     * @param   {string} subtitleKey - Key for the subtitle
     * @returns {Promise<Object>}
     */
    playlist(fileId:number|string, subtitleKey='all'): Promise<Object> {
        return putIoApi.get(['files.playlist', { fileId: fileId }], {
            form: {
                subtitle_key: subtitleKey
            }
        });
    },
    /**
     * Delete a file or folder (including all files!)
     * 
     * @param   {Array<number>|number} fileIds - 1-n File ID
     * @returns {Promise<Object>}
     */
    delete(fileIds:Array<number>|number): Promise<Object> {
        return putIoApi.post('files.delete', {
            form: {
                file_ids: Helper.arrayToString(fileIds)
            }
        });
    },
    /**
     * Get the entire list of files
     * 
     * @param   {number} parentId - File ID of the parent folder
     * @returns {Promise<Object>}
     */
    list(parentId=0): Promise<Object> {
        return putIoApi.get('files.list', {
            qs: {
                parent_id: parentId
            }
        }).then(res => {
            let returnPayload;
            if (parentId && _.has(res.payload, 'files')) {
                returnPayload = res.payload['files'].map(obj => {
                    if (_.has(obj, 'parent')) {
                        return obj['parent'];
                    }
                    return obj;
                });
            }else if (_.has(res.payload, 'files')) {
                returnPayload = res.payload.files;
            }
            return putIoApi.requestResponseHandler(returnPayload);
        });
    },
    /**
     * File search by title
     * 
     * @param   {number|string} queryString - Search query
     * @param   {number} page - Pagination number for the search result
     * @returns {Promise<Object>}
     */
    search(queryString:number|string, page=1): Promise<Object> {
        if (typeof queryString === 'string') {
            queryString = encodeURIComponent(queryString).trim();
        }
        return putIoApi.get(['files.search', {
            queryString: queryString,
            page: page
          }]);
    },
    /**
     * Create folder
     * 
     * @param   {string} folderName - Name of the folder
     * @param   {number} parentId   - File ID of the parent folder
     * @returns {Promise<Object>}
     */
    createFolder(folderName:string, parentId=0): Promise<Object> {
        return putIoApi.post('files.createFolder', {
            form: {
                parent_id: parentId,
                name:      folderName.replace(/[^\sa-z0-9]/gi,'')
            }
        });
    },
    /**
     * Rename folder
     * 
     * @param   {number} fileId     - File ID 
     * @param   {string} folderName - New name for the folder
     * @returns {Promise<Object>}
     */
    rename(fileId:number, folderName:string): Promise<Object> {
        return putIoApi.post('files.rename', {
            form: {
                file_id: fileId,
                name:    folderName.replace(/[^\sa-z0-9]/gi,'')
            }
        });
    },
    /**
     * Move files from folder to folder
     * 
     * @param {Array<number>|number} fileIds - 1-n File ID
     * @param {number} parentId              - File ID from the parent folder 
     * @returns {Promise<Object>}
     */
    move(fileIds:Array<number>|number, parentId:number): Promise<Object> {
        return putIoApi.post('files.move', {
            form: {
                file_ids:  Helper.arrayToString(fileIds),
                parent_id: parentId
            }
        });
    },
    /**
     * Make MP4 file (stored on the put.io server from theparent folder)
     * 
     * @param   {Array<number>|number} fileIds - 1-n File ID
     * @returns {Promise<Object>}
     */
    makeMp4(fileIds:Array<number>|number): Promise<Object> {
        return putIoApi.batchFileProcessing('post', this.processFileIdArray(fileIds), 'files.mp4');
    },
    /**
     * Get MP4 file
     * 
     * @param   {Array<number>|number} fileIds - 1-n File ID
     * @returns {Promise<Object>}
     */
    getMp4(fileIds:Array<number>|number): Promise<Object> {
        return putIoApi.batchFileProcessing('get', this.processFileIdArray(fileIds), 'files.mp4');
    },
    /**
     * Get public download url
     * 
     * @param   {number} fileId - File ID 
     * @returns {string}
     */
    downloadUrl(fileId:number): string {
        return Helper.strReplace('%(endpoint)s/files/%(fileId)s/download?oauth_token=%(authToken)s', {
            endpoint:  config.api.api_endpoint,
            fileId:    fileId,
            authToken: putIoApi.getOAuthToken()
        });
    },
    /**
     * Get public download urls
     * 
     * @param   {Array<number>} fileIds - 1-n File ID
     * @returns {Array<string>}
     */
    downloadUrls(fileIds:Array<number>): Array<string> {
        return fileIds.map(fileId => {
            return Files.downloadUrl(fileId);
        })
    },
    /**
     * Process File ID Array
     * 
     * @param   {Array<number>|number} fileIds - 1-n File ID
     * @returns {Array<number>}
     */
    processFileIdArray(fileIds:Array<number>|number): Array<number> {
        let fileIdArray = [];
        if (!_.isArray(fileIds) && _.isNumber(fileIds)) {
            fileIdArray.push(fileIds);
        }else if(_.isArray(fileIds)) {
            fileIdArray = fileIds;
        }/*else{
            putIoApi.appErrorHandler(`${fileIds} could not been processed`)
        }*/
        return fileIdArray;
    }
}
