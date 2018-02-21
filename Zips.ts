import {
    Files,
    Transfer,
    Friends,
    Extras,
    Account,
    Zips,
    Events,
    putIoApi,
    Helper
} from './put.io-client-v2';

import { expect, should, assert } from 'chai';
import 'mocha';
/*
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
*/

/*
describe('Obtain access code', () => {
    it('resolves', (done) => {
        putIoApi.obtainAccesCode().then( (result) => {
          expect(result).a.string(result);
          done();
        });
      });
});

describe('Obtain access token', () => {
    it('resolves', (done) => {
        putIoApi.obtainAccesCode().then((accessCode) => {
            putIoApi.obtainAccessToken(accessCode).then(accessToken => {
                expect(accessToken).a.string(accessToken);
                done();
            })
          });
      });
});

describe('List files', () => {
    it('resolves', done => {
        Files.list().then(listObject => {
            expect(listObject).same(listObject);
            done();
          });
      });
});

describe('File search', () => {
    it('resolves', done => {
        Files.search('Star Wars').then(listObject => {
            expect(listObject).to.be.a('object');
            expect(listObject).to.have.property('files');
            done();
          });
      });
});

describe('File search', () => {
    it('resolves', done => {
        Files.createFolder('test-1-2-3').then(listObject => {
            expect(listObject).to.be.a('object');
            expect(listObject).to.have.property('status', 'OK');
            done();
          });
      });
});

describe('File search', () => {
    it('resolves', done => {
        Files.rename(525695522,'test-4-5-6').then(listObject => {
            expect(listObject).to.be.a('object');
            expect(listObject).to.have.property('status', 'OK');
            done();
          });
      });
});

describe('File search', () => {
    it('resolves', done => {
        Files.move(525177435, 523912558).then(listObject => {
            expect(listObject).to.be.a('object');
            expect(listObject).to.have.property('status', 'OK');
            done();
          });
      });
});

describe('Download URL', () => {
    it('resolves', done => {
        let downloadUrl = Files.downloadUrl(523620886);
            expect(downloadUrl).to.be.a('string');
            done();
      });
});
*/

describe('Download URL', () => {
    it('resolves', done => {
        let downloadUrl = Files.downloadUrl(523620886);
            expect(downloadUrl).to.be.a('string');
            done();
      });
});
