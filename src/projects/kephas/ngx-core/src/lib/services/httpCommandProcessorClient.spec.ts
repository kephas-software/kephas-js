import { expect } from 'chai';
import 'mocha';
import { createStubInstance } from 'sinon';

import { HttpCommandProcessorClient } from '../../public-api';
import { HttpClient } from '@angular/common/http';
import { NotificationService as Notification } from '@kephas/ui';
import { Logger, LogLevel } from '@kephas/core';
import { of, throwError } from 'rxjs';


describe('CommandProcessor.process', () => {
    it('should call the proper URL with proper base URL ending', async () => {
        const httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: 'Info', message: 'Test' }));

        const notification = createStubInstance(Notification);

        const logger = createStubInstance(Logger);
        const command = new HttpCommandProcessorClient(
            { baseUrl: 'https://my.server.com/', baseApiUrl: 'https://my.server.com/api/' },
            httpClient as any as HttpClient,
            notification as any as Notification,
            logger as any as Logger);

        await command.process('test', { hi: 'there' }).toPromise();

        expect(httpClient.get.callCount).is.equal(1);
        expect(httpClient.get.getCall(0).args[0]).is.equal('https://my.server.com/api/cmd/test/?hi=there');
    });

    it('should call the proper URL without proper base URL ending', async () => {
        const httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: 'Info', message: 'Test' }));

        const notification = createStubInstance(Notification);

        const logger = createStubInstance(Logger);
        const command = new HttpCommandProcessorClient(
            { baseUrl: 'https://my.server.com', baseApiUrl: 'https://my.server.com/api/' },
            httpClient as any as HttpClient,
            notification as any as Notification,
            logger as any as Logger);

        await command.process('test', { hi: 'there' }).toPromise();

        expect(httpClient.get.callCount).is.equal(1);
        expect(httpClient.get.getCall(0).args[0]).is.equal('https://my.server.com/api/cmd/test/?hi=there');
    });

    it('should fail and notify when get fails', async () => {
        const httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(throwError(new Error('Bad request.')));

        const notification = createStubInstance(Notification);

        const logger = createStubInstance(Logger);
        const command = new HttpCommandProcessorClient(
            { baseUrl: '/', baseApiUrl: '/api/' },
            httpClient as any as HttpClient,
            notification as any as Notification,
            logger as any as Logger);

        try {
            await command.process('test', { hi: 'there' }).toPromise();
            throw new Error('BAD');
        }
        catch (error) {
            if (error.message !== 'Bad request.') {
                throw error;
            }
        }

        expect(notification.notifyError.callCount).is.equal(1);
        expect(notification.notifyWarning.callCount).is.equal(0);
    });

    it('should fail and notify when server returns error severity', async () => {
        const httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: 'Error', message: 'Test' }));

        const notification = createStubInstance(Notification);

        const logger = createStubInstance(Logger);
        const command = new HttpCommandProcessorClient(
            { baseUrl: '/', baseApiUrl: '/api/' },
            httpClient as any as HttpClient,
            notification as any as Notification,
            logger as any as Logger);

        try {
            await command.process('test', { hi: 'there' }).toPromise();
            throw new Error('BAD');
        }
        catch (error) {
            if (error.message === 'BAD') {
                throw error;
            }
        }

        expect(notification.notifyError.callCount).is.equal(1);
        expect(notification.notifyWarning.callCount).is.equal(0);
    });

    it('should succeed and notify when server returns warning severity', async () => {
        const httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: 'Warning', message: 'Test' }));

        const notification = createStubInstance(Notification);

        const logger = createStubInstance(Logger);
        const command = new HttpCommandProcessorClient(
            { baseUrl: '/', baseApiUrl: '/api/' },
            httpClient as any as HttpClient,
            notification as any as Notification,
            logger as any as Logger);

        const result = await command.process('test', { hi: 'there' }).toPromise();

        expect(result.severity).is.equal(LogLevel.Warning);
        expect(result.message).is.equal('Test');
        expect(notification.notifyWarning.callCount).is.equal(1);
        expect(notification.notifyError.callCount).is.equal(0);
    });

    it('should succeed when server returns response', async () => {
        const httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: 'Info', message: 'Success!' }));

        const notification = createStubInstance(Notification);

        const logger = createStubInstance(Logger);
        const command = new HttpCommandProcessorClient(
            { baseUrl: '/', baseApiUrl: '/api/' },
            httpClient as any as HttpClient,
            notification as any as Notification,
            logger as any as Logger);

        const result = await command.process('test', { hi: 'there' }).toPromise();

        expect(result.severity).is.equal(LogLevel.Info);
        expect(result.message).is.equal('Success!');
        expect(notification.notifyWarning.callCount).is.equal(0);
        expect(notification.notifyError.callCount).is.equal(0);
    });
});
