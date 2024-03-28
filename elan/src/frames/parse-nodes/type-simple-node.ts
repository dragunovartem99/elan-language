import { ClassType } from "../../symbols/class-type";
import { Field } from "../interfaces/field";
import { RegExMatchNode } from "./regex-match-node";

export class TypeSimpleNode extends RegExMatchNode {

    constructor(field : Field) {
        super(/^\s*[A-Z]\w*/, field);
    }
    renderAsHtml(): string {
        return `<type>${this.renderAsSource()}</type>`;
    }

    get symbolType() {
        return new ClassType(this.matchedText);
    }
}

