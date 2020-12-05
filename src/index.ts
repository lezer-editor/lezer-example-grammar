import { ASTIterator, ASTIterators, ASTNodeImpl, ASTNodeVisitor, Context, OPTION_JSON_MAPPING, OPTION_ROOT_TAGS, ParserAdapter, ParseResult } from '@lezer-editor/lezer-editor-common';
import { parser } from './grammar/parser';

export default class ParserAdapterImpl implements ParserAdapter {
    getOption(key: string) {
        switch (key) {
            case OPTION_JSON_MAPPING:
                return null;
                
            case OPTION_ROOT_TAGS:
                return ['Script'];
        }
        throw Error("unknown option: " + key);
    }
    
    parse(input: string, context: Context) : ParseResult {
        if (context.mode == 'EVAL') {
            if (context.astIterator) {
                let astList = ASTIterators.toList(context.astIterator);
                return "Eval executed on grammar node: " + (astList.length > 0 && astList[0]);
            }
        } else if (context.mode == 'PARSE') {
            const tree = parser.parse(input, {top: context.grammarTag});

            return {
                traverse(visitor: ASTNodeVisitor) : void{
                    tree.traverse({
                        enter(node, start, end) {
                            visitor.enter(new ASTNodeImpl(node.name, node.start, node.end, null, node.isSkipped, node.isError));
                        },

                        leave(node, start, end) {
                            visitor.leave(new ASTNodeImpl(node.name, node.start, node.end, null, node.isSkipped, node.isError));
                        }
                    });
                }
            } as ASTIterator;
        }
    }
    
}