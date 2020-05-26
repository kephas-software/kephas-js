import {
    ElementRef, ViewContainerRef, ChangeDetectorRef,
    Input, SimpleChanges,
    OnInit, OnChanges, AfterViewInit,
    Type, Provider, forwardRef, QueryList, ViewChildren, OnDestroy
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Logger } from "@kephas/core";
import { Notification } from "@kephas/ui";

/**
 * This function provides the component as a WidgetBase,
 * to be able to import it over this base class instead of over its own class.
 *
 * For example, use it as @ViewChild(WidgetBase) or @ViewChildren(WidgetBase).
 *
 * @export
 * @param {Type<any>} componentType The component type.
 * @returns {Provider} The provider.
 */
export function provideWidget(componentType: Type<any>): Provider {
    return {
        provide: WidgetBase,
        useExisting: forwardRef(() => componentType)
    };
}

/**
 * This function provides the component as a NG_VALUE_ACCESSOR.
 * Thus, it is possible to bind it like this:
 * <my-component [(ngModel)]="boundProperty"></my-component>
 *
 * @export
 * @param {Type<any>} componentType The component type.
 * @returns {Provider} The provider.
 */
export function provideValueAccessor(componentType: Type<any>): Provider {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => componentType),
        multi: true
    };
}

/**
 * Provides base functionality for a widget.
 *
 * @export
 * @class WidgetBase
 */
export abstract class WidgetBase implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    /**
     * Gets the logger.
     *
     * @protected
     * @type {Logger}
     * @memberof ValueEditorBase
     */
    protected readonly logger: Logger;

    /**
     * Gets the notification service.
     *
     * @protected
     * @type {Notification}
     * @memberof ValueEditorBase
     */
    protected readonly notification: Notification;

    /**
     * Gets the change detector service.
     *
     * @protected
     * @type {ChangeDetectorRef}
     * @memberof ValueEditorBase
     */
    protected readonly changeDetector: ChangeDetectorRef;

    private _isVisible = true;
    private _readonly = false;
    private _childEditors?: QueryList<WidgetBase>;

    /**
     * Creates an instance of WidgetBase.
     * @param {ElementRef} elementRef The element reference.
     * @param {ViewContainerRef} viewContainerRef The view container reference.
     * @memberof WidgetBase
     */
    constructor(
        public readonly elementRef: ElementRef,
        public readonly viewContainerRef: ViewContainerRef,
    ) {
        const injector = viewContainerRef.injector;
        this.logger = injector.get(Logger);
        this.notification = injector.get(Notification);
        this.changeDetector = injector.get(ChangeDetectorRef);
    }

    /**
     * Gets or sets the child editors query.
     * 
     * @readonly
     * @type {QueryList<EditorBase<any>>}
     * @memberof EditorBase
     */
    @ViewChildren(WidgetBase)
    get childWidgets(): QueryList<WidgetBase> {
        return this._childEditors!;
    }
    set childWidgets(value: QueryList<WidgetBase>) {
        if (this._childEditors === value) {
            return;
        }

        const oldValue = this._childEditors;
        this._childEditors = value;
        this.onChildWidgetsChanged(oldValue, value);
    }

    /**
     * Gets or sets a value indicating whether the widget is visible.
     *
     * @readonly
     * @type {boolean}
     * @memberof WidgetBase
     */
    @Input()
    get isVisible(): boolean {
        return this._isVisible;
    }
    set isVisible(value: boolean) {
        if (this._isVisible === value) {
            return;
        }

        this._isVisible = value;
    }

    /**
     * Gets or sets a value indicating whether the editor allows edits or not.
     * 
     * @readonly
     * @type {boolean}
     * @memberof EditorBase
     */
    @Input()
    get readonly(): boolean {
        return this._readonly;
    }
    set readonly(value: boolean) {
        if (this._readonly === value) {
            return;
        }

        const oldValue = this._readonly;
        this._readonly = value;
        this.onReadOnlyChanged(oldValue, value);
    }

    /**
     * A callback method that is invoked immediately after the
     * default change detector has checked the directive's
     * data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     * It is invoked only once when the directive is instantiated.
     *
     * @memberof WidgetBase
     */
    ngOnInit(): void {
    }

    /**
     * A callback method that is invoked immediately after
     * Angular has completed initialization of a component's view.
     * It is invoked only once when the view is instantiated.
     *
     * @memberof WidgetBase
     */
    ngAfterViewInit(): void {
    }

    /**
     * A callback method that is invoked immediately after the
     * default change detector has checked data-bound properties
     * if at least one has changed, and before the view and content
     * children are checked.
     * 
     * @param changes The changed properties.
     * @memberof WidgetBase
     */
    ngOnChanges(changes: SimpleChanges): void {
    }

    /**
     * A callback method that performs custom clean-up, invoked immediately
     * after a directive, pipe, or service instance is destroyed.
     */
    ngOnDestroy(): void {
    }

    /**
     * When overridden in a derived class, this method is called when the read only state changes.
     * 
     * @protected
     * @param {boolean} oldValue The old value.
     * @param {boolean} newValue The new value.
     * 
     * @memberof WidgetBase
     */
    protected onReadOnlyChanged(oldValue: boolean, newValue: boolean): void {
    }

    /**
     * When overridden in a derived class, this method is called when the child widgets query changed.
     * 
     * @protected
     * @param {QueryList<EditorBase<any>>} oldValue The old query.
     * @param {QueryList<EditorBase<any>>} newValue The new query.
     * 
     * @memberof EditorBase
     */
    protected onChildWidgetsChanged(oldValue?: QueryList<WidgetBase>, newValue?: QueryList<WidgetBase>): void {
    }
}