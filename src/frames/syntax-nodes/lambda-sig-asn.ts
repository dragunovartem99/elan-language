import { CompileError } from "../compile-error";
import { AstNode } from "../interfaces/ast-node";
import { ElanSymbol } from "../interfaces/elan-symbol";
import { Frame } from "../interfaces/frame";
import { Scope } from "../interfaces/scope";
import { SymbolType } from "../interfaces/symbol-type";
import { Transforms } from "../interfaces/transforms";
import { isDefinitionStatement } from "../symbols/symbol-helpers";
import { SymbolScope } from "../symbols/symbol-scope";
import { UnknownType } from "../symbols/unknown-type";
import { AbstractAstNode } from "./abstract-ast-node";
import { ParamDefAsn } from "./param-def-asn";

export class LambdaSigAsn extends AbstractAstNode implements Scope, AstNode {
  constructor(
    private readonly parameters: ParamDefAsn[],
    public readonly fieldId: string,
    private readonly scope: Scope,
  ) {
    super();
  }

  symbolMatches(_id: string, _all: boolean): ElanSymbol[] {
    return [];
  }

  getParentScope(): Scope {
    return this.scope;
  }

  aggregateCompileErrors(): CompileError[] {
    let cc: CompileError[] = [];
    for (const i of this.parameters) {
      cc = cc.concat(i.aggregateCompileErrors());
    }
    return this.compileErrors.concat(cc);
  }

  symbolType() {
    return UnknownType.Instance;
  }

  parameterNamesAndTypes(): [string[], SymbolType[]] {
    const names = this.parameters.map((p) => p.id);
    const types = this.parameters.map((p) => p.symbolType());
    return [names, types];
  }

  compile(): string {
    this.compileErrors = [];
    return this.parameters.map((p) => p.compile()).join(", ");
  }

  resolveSymbol(id: string, transforms: Transforms, _scope: Scope): ElanSymbol {
    for (const p of this.parameters) {
      if (p.id.trim() === id) {
        return {
          symbolId: id,
          symbolType: () => p.symbolType(),
          symbolScope: SymbolScope.local,
        };
      }
    }
    const searchScope = isDefinitionStatement(this.scope)
      ? (this.scope as Frame).getParent()
      : this.scope;

    return searchScope.resolveSymbol(id, transforms, this.scope);
  }

  toString() {
    const pp = this.parameters.map((p) => p.toString()).join(", ");

    return `${pp}`;
  }
}
