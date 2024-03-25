import { ParseStatus } from "../parse-status";
import { AbstractParseNode } from "./abstract-parse-node";
import { ParseNode } from "./parse-node";

export class AbstractSequence extends AbstractParseNode {
    elements: ParseNode[] = [];

    constructor() {
        super();
        this.placeholder = "op";
    }

    parseText(text: string): void {
        var i = 0; //Index
        var remaining = text;
        var worstStatus: ParseStatus = ParseStatus.notParsed;
        while (i < this.elements.length && worstStatus >= ParseStatus.valid) {
            var node = this.elements[i];
            node.parseText(remaining);
            remaining = node.remainingText;
            if (node.status === ParseStatus.empty) {
                worstStatus = worstStatus === ParseStatus.notParsed ? ParseStatus.empty : ParseStatus.incomplete;
            } else {
                worstStatus = node.status < worstStatus ? node.status : worstStatus;
            }
            i++;
        }
        this.status = worstStatus;
        if (worstStatus > ParseStatus.invalid) {
            this.remainingText = remaining;
            this.matchedText = text.substring(0, text.length - this.remainingText.length);
        } else {
            this.remainingText = text;
        }
    }
    renderAsHtml(): string {
        return this.elements.reduce((result, current) => result + current.renderAsHtml(), "");
    }
    renderAsSource(): string {
        return this.elements.reduce((result, current) => result + current.renderAsSource(), "");
    }
}