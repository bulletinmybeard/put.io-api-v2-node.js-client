import { putIoApi } from './ApiClient';
import { Helper } from '../helper';

export const Friends = {
    /**
     * Retrieve a full list of friends
     * 
     * @returns {Promise<Object>}
     */
    list(): Promise<Object> {
        return putIoApi.get('friends.list');
    },
    /** 
     * Retrieve a list of waiting friend requests
     * 
     * @returns {Promise<Object>}
    */
    waitingRequests(): Promise<Object> {
        return putIoApi.get('friends.waitingRequests');
    },
    /** 
     * Sends a friend request
     * 
     * @param   {string} username - Friend's username
     * @returns {Promise<Object>}
    */
    request(username:string): Promise<Object> {
        return putIoApi.post(['friends.request', {
            username: encodeURIComponent(username)
        }]);
    },
    /**
     * Denies a friend request
     * 
     * @param   {string} username - Friend's username
     * @returns {Promise<Object>}
     */
    deny(username:string): Promise<Object> {
        return putIoApi.post(['friends.deny', {
            username: encodeURIComponent(username)
        }]);
    },
    /**
     * Unfriend a user
     * 
     * @param   {string} username - Friend's username
     * @returns {Promise<Object>}
     */
    unfriend(username:string): Promise<Object> {
        return putIoApi.post(['friends.unfriend', {
            username: encodeURIComponent(username)
        }]);
    },
    /**
     * Approves a friend request
     * 
     * @param   {string} username - Friend's username
     * @returns {Promise<Object>}
     */
    approve(username:string): Promise<Object> {
        return putIoApi.post(['friends.approve', {
            username: encodeURIComponent(username)
        }]);
    }
}
