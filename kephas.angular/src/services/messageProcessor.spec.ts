import { expect } from 'chai';
import 'mocha';
import { createStubInstance } from 'sinon';

import { MessageProcessor } from '..';
import { HttpClient } from '@angular/common/http';
import { Notification } from '@kephas/ui';
import { Logger, LogLevel } from '@kephas/core';
import { of, throwError } from 'rxjs';


describe('MessageProcessor.process', () => {
    it('should call the proper URL with proper base URL ending', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.post.returns(of({ severity: "Info", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let processor = new MessageProcessor(
            { baseUrl: "https://my.server.com/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        await processor.process({ hi: "there" }).toPromise();

        expect(httpClient.post.callCount).is.equal(1);
        expect(httpClient.post.getCall(0).args[0]).is.equal('https://my.server.com/api/msg/');
        expect(httpClient.post.getCall(0).args[1].hi).is.equal('there');
    });

    it('should call the proper URL without proper base URL ending', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.post.returns(of({ severity: "Info", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let processor = new MessageProcessor(
            { baseUrl: "https://my.server.com" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        await processor.process({ hi: "there" }).toPromise();

        expect(httpClient.post.callCount).is.equal(1);
        expect(httpClient.post.getCall(0).args[0]).is.equal('https://my.server.com/api/msg/');
        expect(httpClient.post.getCall(0).args[1].hi).is.equal('there');
    });

    it('should fail and notify when get fails', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.post.returns(throwError(new Error("Bad request.")));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let processor = new MessageProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        try {
            await processor.process({ hi: "there" }).toPromise();
            throw new Error("BAD");
        }
        catch (error) {
            if (error.message !== "Bad request.") {
                throw error;
            }
        }

        expect(notification.notifyError.callCount).is.equal(1);
        expect(notification.notifyWarning.callCount).is.equal(0);
    });

    it('should fail and notify when server returns error severity', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.post.returns(of({ severity: "Error", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let processor = new MessageProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        try {
            await processor.process({ hi: "there" }).toPromise();
            throw new Error("BAD");
        }
        catch (error) {
            if (error.message === "BAD") {
                throw error;
            }
        }

        expect(notification.notifyError.callCount).is.equal(1);
        expect(notification.notifyWarning.callCount).is.equal(0);
    });

    it('should succeed and notify when server returns warning severity', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.post.returns(of({ severity: "Warning", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let processor = new MessageProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        const result = await processor.process({ hi: "there" }).toPromise();

        expect(result.severity).is.equal(LogLevel.Warning);
        expect(result.message).is.equal("Test");
        expect(notification.notifyWarning.callCount).is.equal(1);
        expect(notification.notifyError.callCount).is.equal(0);
    });

    it('should succeed when server returns response', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.post.returns(of({ severity: "Info", message: "Success!" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let processor = new MessageProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        const result = await processor.process({ hi: "there" }).toPromise();

        expect(result.severity).is.equal(LogLevel.Info);
        expect(result.message).is.equal("Success!");
        expect(notification.notifyWarning.callCount).is.equal(0);
        expect(notification.notifyError.callCount).is.equal(0);
    });
});
