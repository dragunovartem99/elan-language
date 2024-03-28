import { AbstractAlternatives } from "./abstract-alternatives";
import { CSV } from "./csv";
import { SymbolNode } from "./symbol-node";
import { Sequence } from "./sequence";
import { TypeWithOptGenerics } from "./type-with-opt-generics";
import { Field } from "../interfaces/field";

export class TypeNode extends AbstractAlternatives {

    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            var single = new TypeWithOptGenerics(this.field);
            var tuple = new Sequence([() => new SymbolNode("(", this.field),() => new CSV(() => new TypeNode(this.field), 2, this.field), () => new SymbolNode(")", this.field) ], this.field);
            this.alternatives.push(single);
            this.alternatives.push(tuple);
            super.parseText(text);
        }
    }
}
