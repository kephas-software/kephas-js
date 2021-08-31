import {
    Input, ElementRef, ViewContainerRef, Component
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { WidgetBase } from './widgetBase';

/**
 * Provides a base implementation for value editors.
 *
 * @export
 * @abstract
 * @class ValueEditorBase
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {ControlValueAccessor}
 * @template TValue The value type.
 */
@Component({
  template: ''
})
export abstract class ValueEditorBase<TValue>
    extends WidgetBase
    implements ControlValueAccessor {

    /**
     * Gets or sets the value description.
     *
     * @type {string}
     * @memberof ValueEditorBase
     */
    public description?: string;

    /**
     * Gets or sets the value prompt.
     *
     * @type {string}
     * @memberof ValueEditorBase
     */
    public prompt?: string;

    /**
     * Gets or sets a value indicating whether the value is changed from the change event.
     *
     * @protected
     * @memberof ValueEditorBase
     */
    protected valueChangeFromEvent = false;

    /**
     * Gets or sets a value indicating whether the value is changed from the value property.
     *
     * @protected
     * @memberof ValueEditorBase
     */
    protected valueChangeFromValue = false;

    private _valueBeforeChange?: TValue;

    /**
     * Creates an instance of ValueEditorBase.
     *
     * @param {ElementRef} elementRef The element reference.
     * @param {ViewContainerRef} viewContainerRef The view container reference.
     * @memberof ValueEditorBase
     */
    constructor(
        elementRef: ElementRef,
        viewContainerRef: ViewContainerRef,
    ) {
        super(elementRef, viewContainerRef);
    }

    /**
     * Gets or sets the value to edit.
     *
     * @type {TValue}
     * @memberOf ValueEditorBase
     */
    @Input()
    get value(): TValue {
        return this.getEditorValue();
    }
    set value(value: TValue) {
        if (this._valueBeforeChange === value) {
            return;
        }

        this.updateEditor(value);
    }

    /**
     * Updates the underlying editor with the provided value.
     *
     * @protected
     * @param {TValue} value
     * @returns {boolean}
     * @memberof ValueEditorBase
     */
    protected updateEditor(value: TValue): boolean {
        if (this.valueChangeFromValue) {
            return false;
        }

        const prevValueChangeFromValue = this.valueChangeFromValue;
        this.valueChangeFromValue = true;

        try {
            const oldValue = this._valueBeforeChange;
            this.onValueChanging(oldValue, value);
            this._valueBeforeChange = value;

            if (!this.valueChangeFromEvent) {
                this.setEditorValue(value);
                value = this.getEditorValue();
            }

            this.onValueChanged(oldValue, value);
        } catch (error) {
            this.logger.error(error, 'Error while updating the editor.');
            throw error;
        } finally {
            this.valueChangeFromValue = prevValueChangeFromValue;
        }

        return true;
    }

    /**
     * Overridable method invoked when the value is about to be changed.
     *
     * @protected
     * @param {(TValue | undefined)} oldValue The old value.
     * @param {(TValue | undefined)} newValue The new value.
     * @memberof ValueEditorBase
     */
    protected onValueChanging(oldValue: TValue | undefined, newValue: TValue | undefined): void {
    }

    /**
     * Overridable method invoked after the value was changed.
     *
     * @protected
     * @param {(TValue | undefined)} oldValue The old value.
     * @param {(TValue | undefined)} newValue The new value.
     * @memberof ValueEditorBase
     */
    protected onValueChanged(oldValue: TValue | undefined, newValue: TValue | undefined): void {
        this._onChange(newValue);
    }

    /**
     * Callback invoked from the change event of the underlying editor.
     *
     * @protected
     * @param {*} e
     * @returns
     * @memberof PropertyEditorComponent
     */
    protected onEditorChange(e: any) {
        if (this.valueChangeFromValue) {
            return;
        }

        const prevValueChangeFromEvent = this.valueChangeFromEvent;
        this.valueChangeFromEvent = true;
        try {
            const newValue = this.getEditorValueOnChange(e);
            this.value = newValue;
        } catch (error) {
            this.notification.notifyError(error);
        } finally {
            this.valueChangeFromEvent = prevValueChangeFromEvent;
        }
    }

    /**
     * Sets the value of the underlying editor.
     *
     * @protected
     * @param {TValue} value The value to be set.
     * @memberof ValueEditorBase
     */
    protected abstract setEditorValue(value: TValue): void;

    /**
     * Gets the underlying editor's value.
     *
     * @protected
     * @returns {TValue} The widget value.
     * @memberof ValueEditorBase
     */
    protected abstract getEditorValue(): TValue;

    /**
     * Gets the underlying editor's value upon change.
     *
     * @protected
     * @param {*} e The change event arguments.
     * @returns {TValue} The widget value.
     * @memberof ValueEditorBase
     */
    protected getEditorValueOnChange(e: any): TValue {
        return this.getEditorValue();
    }


    /**
     * Write a new value to the element.
     *
     * @param {*} obj The new value.
     *
     * @memberOf PropertyEditorComponent
     */
    writeValue(obj: any): void {
        this.value = obj;
    }

    /**
     * Set the function to be called when the control receives a change event.
     *
     * @param {*} fn The callback function.
     *
     * @memberOf PropertyEditorComponent
     */
    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    /**
     * Set the function to be called when the control receives a touch event.
     *
     * @param {*} fn The callback function.
     *
     * @memberOf PropertyEditorComponent
     */
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    /**
     * This function is called when the control status changes to or from "DISABLED".
     * Depending on the value, it will enable or disable the appropriate DOM element.
     *
     * @param {boolean} isDisabled True if the state is disabled.
     *
     * @memberOf PropertyEditorComponent
     */
    setDisabledState(isDisabled: boolean): void {
    }

    private _onChange = (_: any) => {
        // The implementation will get overwritten by Angular in RegisterOnChange.
    };

    private _onTouched = () => {
        // The implementation will get overwritten by Angular in RegisterOnTouched.
    };
}
