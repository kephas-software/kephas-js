//#region ZoneSetup

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';

//#endregion

//#region Simulate window in node.js

import { JSDOM } from 'jsdom';

const window = (new JSDOM('<!doctype html><html><body></body></html>')).window;
const document = window.document;
let testGlobal: any = global;
testGlobal.window = window;
testGlobal.document = document;
testGlobal.Document = document;
testGlobal.HTMLElement = window.HTMLElement;
testGlobal.XMLHttpRequest = window.XMLHttpRequest;
testGlobal.Node = window.Node;
testGlobal.Event = window.Event;
testGlobal.Element = window.Element;
testGlobal.navigator = window.navigator;
testGlobal.KeyboardEvent = window.KeyboardEvent;

testGlobal.localStorage = {
    store: {},

    getItem: function (key: any) {
        return this.store[key] || null;
    },
    setItem: function (key: any, value: any) {
        this.store[key] = value;
    },
    clear: function () {
        this.store = {};
    }
};

testGlobal.sessionStorage = {
    store: {},

    getItem: function (key: any) {
        return this.store[key] || null;
    },
    setItem: function (key: any, value: any) {
        this.store[key] = value;
    },
    clear: function () {
        this.store = {};
    }
};

// https://github.com/angular/material2/issues/7101
Object.defineProperty(document.body.style, 'transform', { value: () => ({ enumerable: true, configurable: true }) });

//#endregion

import { expect } from 'chai';
import 'mocha';

import { Injectable, ElementRef, ViewContainerRef } from '@angular/core';
import { AppServiceInfoRegistry } from '@kephas/core';
import { WidgetBase, AngularAppServiceInfoRegistry } from '..';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

@Injectable({ providedIn: 'root' })
export class MyWidget extends WidgetBase {
    constructor(
        elementRef: ElementRef,
        viewContainerRef: ViewContainerRef,
    ) {
        super(elementRef, viewContainerRef);
    }

    getLogger() { return this.logger; }
    getNotification() { return this.notification; }
}

describe('WidgetBase.constructor', () => {
    let component: MyWidget;
    let fixture: ComponentFixture<MyWidget>;

    beforeEach(async(() => {
        let angularRegistry = new AngularAppServiceInfoRegistry(AppServiceInfoRegistry.Instance);
        return TestBed.configureTestingModule(
            {
                declarations: [MyWidget],
                providers: angularRegistry.getRootProviders(),
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyWidget);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initialize logger and notification', () => {
        let widget = fixture.componentRef.instance;
        expect(widget.getLogger()).is.not.null;
        expect(widget.getNotification()).is.not.null;
    });
});
