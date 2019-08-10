import {Tokenizer} from './Lexer';
import {Token, Indent, Literal} from './defs/Tokens';
import {TokenType} from './defs/TokenTypes';

import {Expr, BinaryExpr, UnaryExpr, FunctionExpr} from './defs/Expressions';
import {Scope} from './defs/Scope';

export class Parser {
    tokens: Token[];
    current: number = 0;
    scope: Scope;
    ast: Expr[];

    constructor(src: string){
        let lexer = new Tokenizer(src);
        this.tokens = lexer.scanTokens();
    }

    private peek(amt: number = 1): Token{
        if(amt < 1 || amt > (this.tokens.length - this.current)) return null;
        return this.tokens[this.current + (amt-1)];
    }

    private isAtEnd(): boolean{
        return this.peek().type == TokenType.EOF;
    }

    private previous(amt: number = 1): Token{
        if(amt < 1  || this.current - amt < 0 /*|| this.current-1 > this.tokens.length*/){
            return null;
        }
        return this.tokens[this.current-amt];
    }

    private advance(): Token{
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private consume(){
        if(this.isAtEnd()) return null;
        this.advance();
    }

    private match(...types:any): Boolean {
        if(this.isAtEnd()) return false;
        const current = this.peek();
        if(types.includes(current)){
            this.consume();
        }
    }

    private check (...types:any): Boolean {
        if(this.isAtEnd()) return false;
        const current = this.peek();
        return types.includes(current);
    }

    
}