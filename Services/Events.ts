import { putIoApi } from './ApiClient';

export const Events = {
    /**
     * List of dashboard events (Includes download and share events)
     * 
     * @returns {Promise<Object>}
    */
    list(): Promise<Object> {
        return putIoApi.get('events.list');
    },
    /**
     * Clear all dashboard events at once
     * 
     * @returns {Promise<Object>}
    */
    delete(): Promise<Object> {
        return putIoApi.post('events.delete');
    }
}
