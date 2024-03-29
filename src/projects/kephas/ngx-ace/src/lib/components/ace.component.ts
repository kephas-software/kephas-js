import {
    ValueEditorBase, provideWidget, provideValueAccessor
} from '@kephas/ngx-core';
import {
    ViewContainerRef, ElementRef, Component, Input, OnInit,
    AfterViewInit, OnDestroy
} from '@angular/core'

import { Editor, edit } from 'brace';

import 'brace/theme/monokai';

import 'brace/mode/abap';
import 'brace/mode/csharp';
import 'brace/mode/lua';
import 'brace/mode/sh';
import 'brace/mode/sql';
import 'brace/mode/powershell';
import 'brace/mode/text';
import 'brace/mode/json';
import 'brace/mode/python';
import 'brace/mode/markdown';
import 'brace/mode/razor';
import 'brace/mode/xml';
import 'brace/mode/yaml';

/**
 * Value editor based on Ace.
 *
 * @export
 * @class AceComponent
 * @extends {(ValueEditorBase<string | {} | null>)}
 */
@Component({
    selector: 'ace',
    template: `<div class="form-control ace"></div>`,
    providers: [provideWidget(AceComponent), provideValueAccessor(AceComponent)]
})
export class AceComponent extends ValueEditorBase<string | {} | null>
    implements OnInit, AfterViewInit, OnDestroy {
    /**
     * Gets or sets the Ace editor.
     *
     * @type {ace.Editor}
     * @memberof AceComponent
     */
    public editor?: Editor;

    private _theme = 'monokai';
    private _editorType: string = 'json';
    private _valueIsObject = false;
    private _observer?: MutationObserver;

    /**
     * Creates an instance of AceComponent.
     *
     * @param {ElementRef} elementRef The element reference.
     * @param {ViewContainerRef} viewContainerRef The view container reference.
     * @memberof AceComponent
     */
    constructor(
        elementRef: ElementRef,
        viewContainerRef: ViewContainerRef,
    ) {
        super(elementRef, viewContainerRef);
    }

    /**
     * Gets or sets a value indicating
     *
     * @type {(string | string[])}
     * @memberof AceComponent
     */
    @Input()
    public observeVisibilityOf?: string | string[];

    /**
     * Gets or sets the editor type.
     *
     * @type {string}
     * @memberof AceComponent
     */
    @Input()
    get editorType(): string {
        return this._editorType;
    }
    set editorType(value: string) {
        if (this._editorType === value) {
            return;
        }

        this._editorType = value;
        this.setEditorType(value);
    }

    /**
     * Gets or sets the editor options.
     *
     * @memberof AceComponent
     */
    @Input() set options(value: any) {
        if (this.editor) {
            this.editor.setOptions(value || {});
        }
    }
    get options(): any {
        return this.editor && this.editor.getOptions();
    }

    /**
     * Gets or sets the editor theme.
     *
     * @type {string}
     * @memberof AceComponent
     */
    @Input()
    get theme(): string {
        return this._theme;
    }
    set theme(value: string) {
        if (this._theme === value) {
            return;
        }

        this._theme = value;
        this.setEditorTheme(value);
    }

    /**
     * Gets or sets a value indicating whether the bound value is an object or not.
     *
     * @readonly
     * @type {boolean}
     * @memberof AceComponent
     */
    @Input()
    get valueIsObject(): boolean {
        return this._valueIsObject;
    }
    set valueIsObject(value: boolean) {
        this._valueIsObject = value;
    }

    /**
     * A callback method that is invoked immediately after the
     * default change detector has checked the directive's
     * data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     * It is invoked only once when the directive is instantiated.
     *
     * @memberof AceComponent
     */
    public ngOnInit(): void {
        super.ngOnInit();

        const hostElement = (this.elementRef.nativeElement as HTMLElement).children[0] as HTMLElement;

        this.editor = edit(hostElement);
        this.editor.setShowPrintMargin(false);
        this.setEditorTheme(this._theme);
        this.setEditorType(this._editorType);
        this.setEditorReadOnly(this.readonly);
        this.setEditorValue(this.value);
        this.editor.on('change', e => this.onEditorChange(e));
        this.editor.on('paste', e => this.onEditorChange(e));
        this.editor.commands.addCommand({
            name: 'formatDocumentCommand',
            bindKey: { win: 'Ctrl-Shift-F', mac: 'Command-Shift-F' },
            exec: (e: Editor) => {
                this.formatDocument();
            }
        });
    }

    /**
     * A callback method that is invoked immediately after
     * Angular has completed initialization of a component's view.
     * It is invoked only once when the view is instantiated.
     *
     * @memberof AceComponent
     */
    public ngAfterViewInit() {
        super.ngAfterViewInit();
        if (!this.observeVisibilityOf) {
            return;
        }

        this.observeVisibility(this.observeVisibilityOf);
    }

    /**
     * A callback method that performs custom clean-up, invoked immediately
     * after a directive, pipe, or service instance is destroyed.
     *
     * @memberof AceComponent
     */
    public ngOnDestroy() {
        super.ngOnDestroy();

        if (this._observer) {
            this._observer.disconnect();
        }
    }

    /**
     * Observes the visibility of the elements in the query string,
     * and if they are visible, it will trigger an editor resize.
     * This is required to fix a problem in the ACE editor when
     * setValue doesn't work if the editor is hidden.
     *
     * See also https://github.com/ajaxorg/ace/issues/3070.
     * See also https://github.com/Starcounter/Content/commit/91a757d8750523431fc1637fdf57409d0fcb13db.
     *
     * @param {string} queryString
     * @memberof ScriptEditorComponent
     */
    protected observeVisibility(queryStrings: string | string[]): void {
        if (this._observer) {
            this._observer.disconnect();
        }

        if (typeof queryStrings === 'string') {
            queryStrings = [queryStrings];
        }

        this._observer = new MutationObserver(mutations => {
            const changedTargets: Node[] = [];

            mutations.forEach(mutationRecord => {
                if (changedTargets.findIndex(e => e === mutationRecord.target) < 0) {
                    changedTargets.push(mutationRecord.target);
                }
            });

            changedTargets.forEach(t => {
                if (this._isAceVisible(t as Element) && this.editor) {
                    this.editor.resize(true);
                }
            });
        });

        for (const queryString of queryStrings) {
            const query = top!.document.querySelectorAll(queryString);
            for (let i = 0; i < query.length; i++) {
                this._observer.observe(query[i], { attributes: true, attributeFilter: ['style'] });
            }
        }
    }

    /**
     * Formats the JSON document inside the editor.
     *
     * @protected
     * @returns
     * @memberof AceComponent
     */
    protected formatDocument() {
        if (!this.editor) {
            return;
        }

        if (this.editorType.toLowerCase() === 'json') {
            let stringValue = this.editor.getValue();
            try {
                const objectValue = JSON.parse(stringValue);
                stringValue = this._getFormattedJson(objectValue);
                this.editor.setValue(stringValue);
            } catch (error) {
                // too bad we could not format
                this.notification.notifyWarning(error);
            }
        }
    }

    /**
     * Sets the value of the underlying editor.
     *
     * @protected
     * @param {string | {} | null} value
     * @memberof ValueEditorBase
     */
    protected setEditorValue(value: string | {} | null): void {
        if (!this.editor) {
            return;
        }

        let stringValue = '';
        if (typeof value === 'object') {
            this._valueIsObject = true;
            stringValue = this._getFormattedJson(value!);
        } else if (typeof value === 'string') {
            if (value) {
                this._valueIsObject = false;
            }
            stringValue = value;
        } else {
            stringValue = value && value.toString();
        }

        this.editor.setValue(stringValue || '');
        this.editor.clearSelection();
    }

    /**
     * Gets the underlying editor's value.
     *
     * @protected
     * @returns {string | {} | null} The widget value.
     * @memberof ValueEditorBase
     */
    protected getEditorValue(): string | {} | null {
        if (!this.editor) {
            return null;
        }

        const stringValue = this.editor.getValue();
        if (this._valueIsObject) {
            if (!stringValue) {
                return stringValue;
            }

            try {
                const objectValue = JSON.parse(stringValue);
                return objectValue;
            } catch (error) {
                return stringValue;
            }
        }

        return stringValue;
    }

    /**
     * When overridden in a derived class, this method is called when the read only state changes.
     *
     * @protected
     * @param {boolean} oldValue The old value.
     * @param {boolean} newValue The new value.
     *
     * @memberof EditorBase
     */
    protected onReadOnlyChanged(oldValue: boolean, newValue: boolean): void {
        if (this.editor) {
            this.setEditorReadOnly(newValue);
        }
    }

    /**
     * Sets the readonly state of the editor.
     *
     * @protected
     * @param {boolean} value
     * @memberof AceComponent
     */
    protected setEditorReadOnly(value: boolean) {
        if (this.editor) {
            this.editor.setReadOnly(value);
        }
    }

    /**
     * Sets the editor theme.
     *
     * @protected
     * @param {string} theme
     * @memberof AceComponent
     */
    protected setEditorTheme(theme: string): void {
        if (this.editor && theme) {
            this.editor.setTheme(`ace/theme/${theme}`);
        }
    }

    /**
     * Sets the editor type.
     *
     * @protected
     * @param {string} editorType
     * @memberof AceComponent
     */
    protected setEditorType(editorType: string): void {
        if (this.editor && editorType) {
            const mode = this.getEditorMode(editorType);
            this.editor.getSession().setMode(`ace/mode/${mode}`);
            this.editor.$blockScrolling = Infinity;
        }
    }

    /**
     * Gets the editor mode based on the provided editor type.
     *
     * @protected
     * @param {string} editorType The editor type.
     * @returns {string}
     * @memberof AceComponent
     */
    protected getEditorMode(editorType: string): string {
        return editorType;
    }

    /**
     * Updates the underlying editor with the provided value.
     *
     * @protected
     * @param {TValue} value The value to be set in the underlying component.
     * @returns {boolean}
     * @memberof AceComponent
     */
    protected updateEditor(value: string): boolean {
        value = value || '';
        return super.updateEditor(value);
    }

    private _getFormattedJson(obj: {}) {
        return JSON.stringify(obj, null, 4);
    }

    private _isAceVisible(element: Element): boolean {
        const style = window.getComputedStyle(element);
        return !(style.display === 'none')
    }
}
