import { ParseStatus } from "../parse-status";
import { AbstractParseNode } from "./abstract-parse-node";

export class Keyword extends AbstractParseNode {
    keyword: string;
    isKeyword = true;

    constructor(keyword: string) {
        super();
        this.keyword = keyword;
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            var target = this.keyword;
            var trimmed = text.trimStart();
            var lcLetters = trimmed.match(/^[a-z]*/);
            if (lcLetters && lcLetters.length === 1) {
                if (lcLetters[0] === target) {
                    var n = this.numLeadingSpaces(text) + this.keyword.length;
                    this.set(ParseStatus.valid, text.substring(0, n), text.substring(n));
                } else if (target.startsWith(trimmed)) {
                    this.set(ParseStatus.incomplete, text, "");
                } else {
                    this.set(ParseStatus.invalid, "", text);
                }
            }
        }
    }

    renderAsHtml(): string {
        return `<keyword>${this.renderAsSource()}</keyword>`;
    }
    renderAsSource(): string {
        return this.matchedText.trim() + " ";
    }
}
