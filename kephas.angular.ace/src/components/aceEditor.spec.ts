import { expect } from 'chai';
import 'mocha';

import { AceEditor } from '..';
import { AppService, AppServiceContract, AppServiceInfoRegistry } from '@kephas/core';
import { ChangeDetectorRef, Injector, ViewContainerRef, ElementRef } from '@angular/core';
import { AngularAppServiceInfoRegistry } from '@kephas/angular';


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

describe('AceEditor.constructor', () => {
    it('should initialize logger and notification', () => {
        let angularRegistry = new AngularAppServiceInfoRegistry(AppServiceInfoRegistry.Instance);
        var injector = Injector.create({ providers: angularRegistry.getRootProviders() });
        var viewContainerRef = { injector: injector } as ViewContainerRef;
        var elementRef = {} as ElementRef;
        let widget = new AceEditor(elementRef, viewContainerRef);

        expect(widget.editorType).is.equal('json');
    });
});
