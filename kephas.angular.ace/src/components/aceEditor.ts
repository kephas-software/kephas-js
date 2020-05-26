import { ValueEditorBase } from "@kephas/angular";
import { ViewContainerRef, ElementRef } from '@angular/core'

/**
 * Value editor based on Ace.
 *
 * @export
 * @class AceEditor
 * @extends {(ValueEditor<string | {}>)}
 */
@Component({
    selector: 'scripteditor',
    template: `<div [attr.name]="property" class="form-control scripteditor"></div>`,
    providers: [provideEditor(AceEditor), provideValueAccessor(AceEditor)]
})
export class AceEditor extends ValueEditorBase<string | {}>
{
    /**
     * Creates an instance of AceEditor.
     * 
     * @param {ElementRef} elementRef The element reference.
     * @param {ViewContainerRef} viewContainerRef The view container reference.
     * @memberof AceEditor
     */
    constructor(
        elementRef: ElementRef,
        viewContainerRef: ViewContainerRef,
    ) {
        super(elementRef, viewContainerRef);
    }

}