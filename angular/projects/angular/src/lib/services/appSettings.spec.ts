//#region Simulate window in node.js

import { JSDOM } from 'jsdom';

const window = (new JSDOM(
    '<!doctype html><html><body></body></html>',
    { url: 'https://my.server.com/'})).window;
const document = window.document;
let testGlobal: any = global;
testGlobal.window = window;
testGlobal.document = document;
testGlobal.Document = document;

//#endregion

import { expect, use } from 'chai';
import 'mocha';

import { AppSettings } from '../../public-api';

describe('AppSettings.baseUrl', () => {
    it('should fail and notify when server returns error severity', async () => {
        let appSettings = new AppSettings();

        expect(appSettings.baseUrl).to.equal("https://my.server.com/");
    });
});
