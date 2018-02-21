import { putIoApi } from './ApiClient';
import { Helper } from '../Helper';

export const Transfer = {
    /** 
     * Lists active transfers. If transfer is completed, it is removed from the list.
     * 
     * @returns {Promise<Object>}
    */
    list(): Promise<Object> {
        return putIoApi.get('transfers.list');
    },
    /** 
     * Lists active transfers. If transfer is completed, it is removed from the list.
     * 
     * @param   {number} fileId - File id
     * @returns {Promise<Object>}
    */
    get(fileId:number): Promise<Object> {
        return putIoApi.get(['transfers.get', { fileId: fileId}]);
    },
    /**
     * Clean Transfers list
     * 
     * @returns {Promise<Object>}
     */
    clean(): Promise<Object> {
        return putIoApi.post('transfers.clean');
    },
    /**
     * Retry (failed) transfer
     * 
     * @param   {number} fileId - File id
     * @returns {Promise<Object>}
     */
    retry(fileId:number): Promise<Object> {
        return putIoApi.post('transfers.retry', {
            form: {
                id: fileId
            }
        });
    },
    /**
     * Cancel transer
     * 
     * @param   {Array<number>|number} fileIds - Single or multiple file id's
     * @returns {Promise<Object>}
     */
    cancel(fileIds:Array<number>|number): Promise<Object> {
        return putIoApi.post('transfers.cancel', {
            form: {
                transfer_ids: Helper.arrayToString(fileIds)
            }
        });
    },
    /**
     * Add new file to transfer
     * 
     * @param   {string}  sourceUrl - Magnet or Download URL
     * @param   {boolean} extract   - Extract archives after they have been downloaded
     * @param   {number}  parentId  - Parent folder ID
     * @returns {Promise<Object>}
     */
    add(sourceUrl:string, extract=false, parentId=0): Promise<Object> {
        return putIoApi.post('transfers.add', {
            form: {
                url:            sourceUrl,
                save_parent_id: parentId,
                extract:        extract
            }
        });
    }
}
