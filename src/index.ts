import { ASTIterator, ASTIteratorImpl, ASTIterators, ASTNode, ASTNodeImpl, ASTNodeVisitor, Context, HydratedASTNode, OPTION_JSON_MAPPING, OPTION_ROOT_TAGS, ParserAdapter, ParseResult } from '@lezer-editor/lezer-editor-common';
import { parser } from './grammar/parser';

export class ParserAdapterImpl implements ParserAdapter {
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

            return new class extends ASTIteratorImpl<ASTNode> {
                traverse(visitor: ASTNodeVisitor<ASTNode>) : void {
                    tree.iterate({
                        enter(node, start, end) {
                            visitor.enter(new ASTNodeImpl({name: node.name, start, end, skip: node.isSkipped, error: node.isError}));
                        },

                        leave(node, start, end) {
                            visitor.leave(new ASTNodeImpl({name: node.name, start, end, skip: node.isSkipped, error: node.isError}));
                        }
                    });
                }
            };
        }
    }
    
}