import { expect } from 'chai';
import 'mocha';

import { Injectable, ElementRef, ViewContainerRef, Injector } from '@angular/core';
import { AppServiceInfoRegistry, Logger } from '@kephas/core';
import { Notification } from '@kephas/ui';
import { WidgetBase, AngularAppServiceInfoRegistry } from '..';

Logger;
let n: Notification = new Notification();

let registry = AppServiceInfoRegistry.Instance;
let angularRegistry = new AngularAppServiceInfoRegistry(registry);

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
    it('should initialize logger and notification', () => {
        var injector = Injector.create({ providers: angularRegistry.getRootProviders() });
        var viewContainerRef = { injector: injector } as ViewContainerRef;
        var elementRef = { } as ElementRef;
        let widget = new MyWidget(elementRef, viewContainerRef);

        expect(widget.getLogger()).is.not.null;
    });
});
