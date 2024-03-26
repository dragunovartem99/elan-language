import { ISymbolType } from "./symbol-type";

export class TupleType implements ISymbolType {

    constructor(private ofTypes: ISymbolType[]) {

    }

    get name() {
        return `Tuple <${this.ofTypes.map(t => t.name).join(",")}>`;
    }
}