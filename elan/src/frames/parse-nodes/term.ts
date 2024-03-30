import { AbstractAlternatives } from "./abstract-alternatives";
import { LitValueNode } from "./lit-value";
import { UnaryExpression } from "./unary-expression";
import { BracketedExpression } from "./bracketed-expression";
import { DottedTerm } from "./dotted-term";
import { NewInstance } from "./new-instance";
import { IndexableTerm } from "./indexable-term";
import { TupleDefNode } from "./tuple-def-node";
import { Lambda } from "./lambda";
import { IfExpr } from "./if-expr";
import { Field } from "../interfaces/field";
import { List } from "./list";
import { ExprNode } from "./expr-node";
import { VarRefNode } from "./var-ref-node";
import { FunctionCallNode } from "./function-call-node";

export class Term extends AbstractAlternatives {
    constructor(field : Field) {
        super(field);
        this.placeholder = "expression";
    }

    parseText(text: string): void {
        //Sub nodes added only when asked to parse
        this.alternatives.push(new LitValueNode(this.field));
        this.alternatives.push(new VarRefNode(this.field));
        this.alternatives.push(new FunctionCallNode(this.field));
        this.alternatives.push(new UnaryExpression(this.field));
        this.alternatives.push(new IndexableTerm(this.field));
        this.alternatives.push(new DottedTerm(this.field));
        this.alternatives.push(new NewInstance(this.field));

        this.alternatives.push(new BracketedExpression(this.field));
        this.alternatives.push(new List(() => new ExprNode(this.field), this.field));
        this.alternatives.push(new TupleDefNode(this.field));
        this.alternatives.push(new Lambda(this.field));
        this.alternatives.push(new IfExpr(this.field));
        super.parseText(text);
    }
}