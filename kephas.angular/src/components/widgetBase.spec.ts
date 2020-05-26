import { expect } from 'chai';
import 'mocha';

import { Injectable, ElementRef, ViewContainerRef, Injector, ChangeDetectorRef } from '@angular/core';
import { AppServiceInfoRegistry, Logger, AppServiceInfo, AppServiceLifetime, AppServiceContract, AppService } from '@kephas/core';
import { Notification } from '@kephas/ui';
import { WidgetBase, AngularAppServiceInfoRegistry } from '..';

Logger;
let n: Notification = new Notification();

let registry = AppServiceInfoRegistry.Instance;
let angularRegistry = new AngularAppServiceInfoRegistry(registry);

@AppService()
@AppServiceContract({ contractType: ChangeDetectorRef })
export class TestChangeDetectorRef extends ChangeDetectorRef {
    markForCheck(): void {
        throw new Error("Method not implemented.");
    }
    detach(): void {
        throw new Error("Method not implemented.");
    }
    detectChanges(): void {
        throw new Error("Method not implemented.");
    }
    checkNoChanges(): void {
        throw new Error("Method not implemented.");
    }
    reattach(): void {
        throw new Error("Method not implemented.");
    }
}

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
        var elementRef = {} as ElementRef;
        let widget = new MyWidget(elementRef, viewContainerRef);

        expect(widget.getLogger()).is.not.null;
    });
});
