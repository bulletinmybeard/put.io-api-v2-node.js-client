import { putIoApi } from './ApiClient';
import { Helper } from '../Helper';

export const Zips = {
    /**
     * Lists created zip files
     * 
     * @returns {Promise<Object>}
     */
    list(): Promise<Object> {
        return putIoApi.get('zips.list');
    },
    /**
     * Create zip file
     * 
     * @param   {Array<number>|number} fileIds - Single or multiple fileId/s
     * @returns {Promise<Object>}
     */
    create(fileIds:Array<number>|number): Promise<Object> {
        return putIoApi.post('zips.create', {
            form: {
                file_ids: Helper.arrayToString(fileIds)
            }
        });
    },
    /**
     * Gives detailed information about the give zip file id
     * 
     * @param   {number} zipId - ID of the ZIP file
     * @returns {Promise<Object>}
     */
    get(zipId:number): Promise<Object> {
        return putIoApi.get(['zips.get', { zipId: zipId }]);
    }
}
