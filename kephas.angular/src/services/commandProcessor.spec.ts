import { expect } from 'chai';
import 'mocha';
import { createStubInstance } from 'sinon';

import { CommandProcessor } from '..';
import { HttpClient } from '@angular/common/http';
import { Notification } from '@kephas/ui';
import { Logger, LogLevel } from '@kephas/core';
import { of, throwError } from 'rxjs';


describe('CommandProcessor.process', () => {
    it('should call the proper URL with proper base URL ending', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: "Info", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let command = new CommandProcessor(
            { baseUrl: "https://my.server.com/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        await command.process("test", { hi: "there" }).toPromise();

        expect(httpClient.get.callCount).is.equal(1);
        expect(httpClient.get.getCall(0).args[0]).is.equal('https://my.server.com/api/cmd/test/?hi=there');
    });

    it('should call the proper URL without proper base URL ending', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: "Info", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let command = new CommandProcessor(
            { baseUrl: "https://my.server.com" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        await command.process("test", { hi: "there" }).toPromise();

        expect(httpClient.get.callCount).is.equal(1);
        expect(httpClient.get.getCall(0).args[0]).is.equal('https://my.server.com/api/cmd/test/?hi=there');
    });

    it('should fail and notify when get fails', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(throwError(new Error("Bad request.")));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let command = new CommandProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        try {
            await command.process("test", { hi: "there" }).toPromise();
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
        httpClient.get.returns(of({ severity: "Error", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let command = new CommandProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        try {
            await command.process("test", { hi: "there" }).toPromise();
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
        httpClient.get.returns(of({ severity: "Warning", message: "Test" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let command = new CommandProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        const result = await command.process("test", { hi: "there" }).toPromise();

        expect(result.severity).is.equal(LogLevel.Warning);
        expect(result.message).is.equal("Test");
        expect(notification.notifyWarning.callCount).is.equal(1);
        expect(notification.notifyError.callCount).is.equal(0);
    });

    it('should succeed when server returns response', async () => {
        let httpClient = createStubInstance(HttpClient);
        httpClient.get.returns(of({ severity: "Info", message: "Success!" }));

        let notification = createStubInstance(Notification);

        let logger = createStubInstance(Logger);
        let command = new CommandProcessor(
            { baseUrl: "/" },
            <HttpClient><any>httpClient,
            <Notification><any>notification,
            <Logger><any>logger);

        const result = await command.process("test", { hi: "there" }).toPromise();

        expect(result.severity).is.equal(LogLevel.Info);
        expect(result.message).is.equal("Success!");
        expect(notification.notifyWarning.callCount).is.equal(0);
        expect(notification.notifyError.callCount).is.equal(0);
    });
});
