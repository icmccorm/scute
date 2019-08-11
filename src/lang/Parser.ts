import {Tokenizer} from './Lexer';
import {Token, Indent, Literal} from './defs/Tokens';
import {TokenType} from './defs/TokenTypes';

import * as Expr from './defs/Expr';
import * as Stmt from './defs/Stmt';

export class Parser {
    private tokens: Token[];
    private current: number = 0;

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

    private consume(...types:any){
        if(this.isAtEnd()) return null;
        if(types.length){
            if(types.includes(this.peek().type)) {
                this.advance();
            } else {
                throw 1;
            }
        }else{
            this.advance();
        }
    }

    private match(...types:TokenType[]): Boolean {
        if(this.check(types)) {
            this.consume();
            return true;
        }else{
            return false;
        }
    }

    private check (types:TokenType[]): Boolean {
        if(this.isAtEnd()) return false;
        const current = this.peek().type;
        return types.includes(current);
    }

    createAST(): Stmt.Stmt[]{
        let result = [];
        let trial = this.tokens;

        while(!this.isAtEnd()){
            try{
                const staging = this.statement();
                if(staging) result.push(staging);
                this.consume(TokenType.NEWLINE);
            }catch(e){
                this.sync();
            }
        }

        return result;
    }

    private sync(){
        while(!this.isAtEnd() && this.peek().type != TokenType.NEWLINE){
            this.consume();
        }
        this.consume();
    }


    private statement(){
        const t = this.advance();
        switch(t.type){

            case TokenType.PRINT:
                return this.printStatement()
            case TokenType.LET:
                return this.assignStatement();
            default:
                this.sync();
        }
    }

    private printStatement(): Stmt.Print{
        if(this.match(TokenType.L_PAREN)){
            const value = this.expression();
            this.consume(TokenType.R_PAREN);
            return new Stmt.Print(value);
        }else{
            throw 1;
        }
    }

    private assignStatement(){
        const varName = this.advance();
        if(varName.type != TokenType.ID) throw 1;
        if(this.match(
            TokenType.ASSIGN,
        )){
            const op = this.previous();
            const value = this.expression();

            return new Stmt.Assign(varName, op, value);
        }else{
            throw 1;
        }
    }

    private expression(): Expr.Expr{
        return this.assignment();
    }

    private assignment(): Expr.Expr{
        let left = this.comparison();
        while(this.match(
            TokenType.ASSIGN,
            TokenType.MINUS_EQUALS,
            TokenType.PLUS_EQUALS
        )){
            const op = this.previous();
            const value = this.expression();
            return new Expr.Binary(left, value, op);
        }
        return left;
    }

    private comparison () {
        let left = this.additive();
        while (this.match(
            TokenType.EQUALS,
            TokenType.BANG_EQUALS,
            TokenType.LESS_EQUALS,
            TokenType.GREATER_EQUALS,
            TokenType.LESS,
            TokenType.GREATER
        )) {

            const operator = this.previous();
            const right = this.additive();
            left = new Expr.Binary(left, right, operator);
        }
        return left;
    }

    private additive () {
        let left = this.multiplicative();
        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.multiplicative();
            left = new Expr.Binary(left, right, operator);
        }

        return left;
    }

    private multiplicative () {
        let left = this.exponential();
        while (this.match(TokenType.TIMES, TokenType.DIVIDE, TokenType.MODULO)) {
            const operator = this.previous();
            const right = this.exponential();
            left = new Expr.Binary(left, right, operator);
        }

        return left;

    }

    private exponential () {
        let left = this.unary();

        while (this.match(TokenType.EXP)) {
            const operator = this.previous();
            const right = this.atom();
            left = new Expr.Binary(left, right, operator);
        }

        return left;
    }

    private unary () {
        if (this.match(TokenType.INCREMENT, TokenType.DECREMENT)) {
            const operator = this.previous();
            const right = this.consume(TokenType.ID);
            return new Expr.Unary(right, operator);
        }
        return this.atom();
    }

    private atom () {
        const token = this.advance();

        switch (token.type) {
            case TokenType.ID:
                switch (this.peek().type) {
                    case TokenType.INCREMENT:
                    case TokenType.DECREMENT:
                        return new Expr.Unary(token, this.advance());
                    default:
                        return new Expr.Value(token);
                }
            case TokenType.PI:
            case TokenType.E:
            case TokenType.TAU:
                return new Expr.Value(token);
            case TokenType.INTEGER:
            case TokenType.REAL:
            case TokenType.STRING:
            case TokenType.BOOLEAN:
                return new Expr.Value(token);
            case TokenType.L_PAREN:
                const inner = this.expression();
                this.consume(')');
                return inner;
            case TokenType.BANG:
            case TokenType.INCREMENT:
            case TokenType.DECREMENT:
                return new Expr.Unary(token, this.advance());
            default:
                throw "Missing or unrecognizeable expression.";
        }
    }
}