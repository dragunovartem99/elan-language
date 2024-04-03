import { escapeAngleBrackets } from "../helpers";
import { ParseStatus } from "../parse-status";
import { FixedTextNode } from "./fixed-text-node";

export class SymbolNode extends FixedTextNode {
    constructor(symbol: string) {
        super(symbol);
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            var target = this.fixedText;
            var trimmed = text.trimStart();
            if (trimmed.startsWith(target)) {
                var n = this.numLeadingSpaces(text) + this.fixedText.length;
                this.set(ParseStatus.valid, text.substring(0, n), text.substring(n));
            } else if (target.startsWith(trimmed)) {
                this.set(ParseStatus.incomplete, text, "");
            } else {
                this.set(ParseStatus.invalid, "", text);
            }
        }
    }

    renderAsHtml(): string {
        return escapeAngleBrackets(this.renderAsSource());
    }
}
