import { Selectable } from "../interfaces/selectable";
import { ParseStatus } from "../parse-status";
import { Field } from "../interfaces/field";
import { Frame } from "../interfaces/frame";
import { editorEvent } from "../interfaces/editor-event";
import {CodeSource } from "../code-source";
import { escapeAngleBrackets, isCollapsible} from "../helpers";
import { ParseNode } from "../parse-nodes/parse-node";

export abstract class AbstractField implements Selectable, Field {
    public isField: boolean = true;
    private _status: ParseStatus = ParseStatus.invalid; 
    protected text: string = "";
    protected placeholder: string = "";
    protected useHtmlTags: boolean = false;
    protected htmlId: string = "";
    protected selected: boolean = false;
    private focused: boolean = false;
    private _classes = new Array<string>;
    private holder: Frame;
    private _optional: boolean = false;
    protected map: Map<string, Selectable>;
    private status: ParseStatus | undefined;
    private cursorPos: number = 0; //Relative to LH end of text
    protected rootNode?: ParseNode;
    protected completion: string = "";

    constructor(holder: Frame) {
        this.holder = holder;
        var map = holder.getMap();
        this.htmlId = `${this.getIdPrefix()}${map.size}`;
        map.set(this.htmlId, this);
        this.map = map;
    }
    abstract initialiseRoot(): ParseNode ;
    abstract readToDelimeter: (source: CodeSource) => string;

    alertHolderToUpdate():void {
        this.getHolder().fieldUpdated(this);
    }
    
    parseCurrentText() : void {    
        var root = this.initialiseRoot();
        this.parseCompleteTextUsingNode(this.text, root);
    }

    parseFrom(source: CodeSource): void {
        var text = this.readToDelimeter(source); 
        var root = this.initialiseRoot();
        this.parseCompleteTextUsingNode(text, root);
        if (this._status !== ParseStatus.valid) { 
            throw new Error(`Parse error at ${source.getRemainingCode()}`);
        }
    }

     parseCompleteTextUsingNode(text: string, root: ParseNode): void {
        if (text.length === 0) {
            this.setStatus(this.isOptional()? ParseStatus.valid : ParseStatus.incomplete);
        } else {
            root.parseText(text);
            if (root.remainingText.trim().length > 0) {
                this.setStatus(ParseStatus.invalid);
            } else {
                this.setStatus(root.status);
                this.text = root.matchedText + root.remainingText;
            }
        }
    }

    getCompletion(): string {
        return this.rootNode? this.rootNode.getCompletion() : "";
    }

    setOptional(optional: boolean) : void {
        this._optional = optional;
        if (this.text ==='' && optional ) {
            this.status = ParseStatus.valid;
        } else  if (this.text ==='' && !optional ) {
            this.status === ParseStatus.incomplete;
        }
    }

    getOptional(): boolean {
        return this._optional;
    }

    isOptional(): boolean {
        return this._optional;
    }
    processKey(e: editorEvent): void {
        var key = e.key;
        var textLen = this.text.length;
        switch (key) {
            case 'Escape': {this.holder.select(true, false); break;}
            case "Home": {this.cursorPos = 0; break; } 
            case "End": {this.cursorPos = textLen; break;} 
            case "Tab": {this.tabOrEnter(e.modKey.shift); break; } 
            case "Enter": {this.tabOrEnter(e.modKey.shift); break;} 
            case "ArrowLeft": {if (this.cursorPos > 0) { this.cursorPos --; } break; }  
            case "ArrowRight": {if (this.cursorPos < textLen) { this.cursorPos ++; } break; } 
            case "ArrowUp": {this.getHolder().getPreviousFrameInTabOrder().select(true, false); break;} 
            case "ArrowDown": {this.getHolder().getNextFrameInTabOrder().select(true, false); break; } 
            case "Backspace": {
                if (this.cursorPos > 0) {
                    this.text = this.text.slice(0,this.cursorPos - 1) + this.text.slice(this.cursorPos);
                    this.cursorPos --;
                    this.parseCurrentText();
                }
                break;
            } 
            case "Delete": {
                if (this.cursorPos < textLen) {
                    this.text = this.text.slice(0,this.cursorPos) + this.text.slice(this.cursorPos+1);
                    this.parseCurrentText();
                }
                break;
            } 
            default: {
                if(key === "o" && e.modKey.control && isCollapsible(this.holder)) {
                    this.holder.expandCollapse(); 
                } else if ( key === 'O' && e.modKey.control) {
                        this.holder.expandCollapseAll();
                } else if (key?.length === 1) {
                    this.text = this.text.slice(0,this.cursorPos) + key + this.text.slice(this.cursorPos);
                    this.cursorPos ++;
                    this.parseCurrentText();
                }
            }
        }
    }

    private tabOrEnter(back: boolean) {  
        if (back) {
            this.holder.selectFieldBefore(this);
        } else {
            this.holder.selectFieldAfter(this);
        }
    }

    isFocused(): boolean {
        return this.focused;
    }
    getHolder(): Frame  {
        return this.holder;
    }
    getIdPrefix(): string {
        return 'text';
    }
    focus(): void {
        this.focused = true;
    }
    defocus(): void {
        this.focused = false;
    }

    deselectAll() {
        for (const f of this.map.values()) {
            if (f.isSelected()) {
                f.deselect();
            }
        }
    }
    getStatus(): ParseStatus {
        if (!this._status) {
            this.parseCurrentText();
        }
        return this._status;
    }
    protected setStatus(newStatus: ParseStatus) {
        this._status = newStatus;
    }

    select(): void {
        this.deselectAll();
        this.selected = true;
        this.focus();
        this.cursorPos = this.text.length;
    }

    isSelected() : boolean {
        return this.selected === true;
    }

    deselect(): void {
        this.selected = false;
        this.defocus();
    }

    setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder;
    }

    public textAsHtml(): string {
        if (this.selected) {
            return `<input spellcheck="false" data-cursor="${this.cursorPos}" size="${this.charCount()}" style="width: ${this.fieldWidth()}" value="${this.escapeDoubleQuotes(this.text)}">`;
        } else { 
            return this.rootNode ? this.rootNode.renderAsHtml() : escapeAngleBrackets(this.text);
        } 
    }

    public charCount(): number {
        return this.text ?  (this.text.length > 1 ? this.text.length-1 : 1): 1;
    }

    public fieldWidth(): string {
        return this.text.length === 0 ? "2px" : `${this.text.length}ch`;
    }

    private escapeDoubleQuotes(str: string): string {
        return str
            .replace(/"/g, '&quot;');
    }

    public textAsSource() : string {
        return this.text;
    }

    protected setClasses() {
        this._classes = new Array<string>();
        this.pushClass(this.selected, "selected");
        this.pushClass(this.focused, "focused");
        this.pushClass(!this.text, "empty");
        this.pushClass(this.isOptional(), "optional");
        this._classes.push(ParseStatus[this.getStatus()]);
    }

    protected pushClass(flag: boolean, cls: string) {
        if (flag) {
            this._classes.push(cls);
        }
    }

    protected cls(): string {
        this.setClasses();
        return this._classes.join(" ");
    };

    renderAsHtml(): string {
        return `<field id="${this.htmlId}" class="${this.cls()}" tabindex=0><text>${this.textAsHtml()}</text><placeholder>${this.placeholder}</placeholder><completion>${this.getCompletion()}</completion></field>`;
    }

    indent(): string {
        return "";
    }

    renderAsSource(): string {
        return this.textAsSource();
    }

    renderAsObjectCode(): string {
        return this.textAsSource();
    }

    setText(text: string) {
        this.text = text;
    }
}