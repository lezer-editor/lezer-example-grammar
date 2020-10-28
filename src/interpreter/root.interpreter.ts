import { NodeType } from "lezer";
import { IInterpreter } from "@lezer-editor/lezer-editor-common";

export class RootInterpreter implements IInterpreter {

    evaluate(node: NodeType, input: string, args: any[]): any {
        return (context) => {
            return "Eval executed on grammar node " + node.name;
        }
    }
}