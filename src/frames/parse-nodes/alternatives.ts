import { ParseNode } from "./parse-node";
import { AbstractAlternatives } from "./abstract-alternatives";
import { TokenType } from "../helpers";

export class Alternatives extends AbstractAlternatives {
  elementConstructors: (() => ParseNode)[];
  constructor(elementConstructors: (() => ParseNode)[]) {
    super();
    this.elementConstructors = elementConstructors;
  }

  parseText(text: string): void {
    if (text.length > 0) {
      this.elementConstructors.forEach((ec) => {
        this.alternatives.push(ec());
      });
    }
    super.parseText(text);
  }
}
