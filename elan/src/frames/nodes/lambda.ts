import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { CSV } from "./csv";
import { Keyword } from "./keyword";
import { IdentifierNode } from "./identifier-node";
import { ExprNode } from "./expr-node";

export class Lambda extends AbstractSequence {
    constructor() {
        super();
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Keyword(`lambda`));
            this.elements.push(new CSV(() => new IdentifierNode(),1));
            this.elements.push(new Symbol(`->`));
            this.elements.push(new ExprNode());
            super.parseText(text);
        }
    }
    renderAsHtml(): string {
        throw new Error("Method not implemented.");
    }

    renderAsSource(): string {
        return `lambda ${this.elements[1].renderAsSource()} -> ${this.elements[3].renderAsSource()}`;
    }
}