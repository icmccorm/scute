import {TokenType} from './defs/TokenTypes';
import {Token, Literal, Indent} from './defs/Tokens';

export class Tokenizer {
    private source: string;
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;
    private indent: number = 0;

    constructor(src: string){
        this.source = src;
        //add additional newline to ensure that comments, which are newline-delimited, will be read properly when only a single line is present.
        if(this.source.charAt(this.source.length - 1) !== '\n') this.source += '\n';
    }

    private hasNext (amt: number = 1): boolean {
        if(amt < 1) return false;
        return ( this.current + (amt-1))< this.source.length;
    }

    private next(amt: number = 1): string {
        if(amt < 1 || !this.hasNext(amt)) return null;
        this.current += amt;
        return this.source.substring(this.current - amt, this.current + (amt - 1));
    }

    private peek(amt: number = 1, singular: boolean = false): string {
        if (amt < 1 || !this.hasNext(amt)) return '\0';
        if(!singular) return this.source.substring(this.current, this.current+amt);
        return this.source.charAt(this.current + (amt-1));
    }

    private match(token: string): boolean{
        if (this.peek(token.length) === token) {
            this.current+=token.length;
            return true;
        } else {
            return false;
        }
    }

    private previous(amt: number = 1): string{
        if(amt < 1 || (this.current - (1+amt)) <= 0) return null;
        return this.source.substring(this.current - (1 + amt), this.current);
    }

    private getSelected(startOffset: number = 0, endOffset: number = 0): string{
        return this.source.substring(this.start + startOffset, this.current + endOffset);
    }

    scanTokens(): Token[]{
        let tokens: Token[] = [];
        while(this.hasNext()){
            try{
                const result = this.scanToken();
                    switch(result){
                        case TokenType.REAL:
                        case TokenType.INTEGER:
                        case TokenType.BOOLEAN:
                        case TokenType.ID:
                            tokens.push(new Literal(result, this.line, this.getSelected()));
                            break;
                        case TokenType.STRING:
                            tokens.push(new Literal(result, this.line, this.getSelected(0, -1)));
                        case TokenType.INDENT:
                            tokens.push(new Indent(this.line, this.indent));
                            break;
                        default:
                            tokens.push(new Token(result, this.line));
                            break;

                    }
                
            }catch(e){
                throw e;
            }

        }
        tokens.push(new Token(TokenType.EOF, this.line));
        return tokens;
    }

    private scanToken(): TokenType {
        const c = this.next();
        switch (c){
            case '\0':
                return TokenType.EOF;
            case '?':
                return TokenType.QUESTION;
            case ':':
                return TokenType.COLON;
            case '(':
                return TokenType.L_PAREN;
            case ')':
                return TokenType.R_PAREN;
            case '[':
                return TokenType.L_BRACK;
            case ']':
                return TokenType.R_BRACK;
            case '{':
                return TokenType.L_BRACE;
            case '}':
                return TokenType.R_BRACE;
            case ',':
                return TokenType.COMMA;
            case '%':
                return TokenType.MODULO;
            case '.':
                return TokenType.DEREF;
            case '^':
                return TokenType.EXP;
            case '~':
                return TokenType.TILDA;
            case ';':
                return TokenType.SEMI;
            case '*':
                return TokenType.TIMES;
            case '!':
                if(this.match('+')) {
                    return TokenType.BANG_EQUALS
                }
                return TokenType.BANG;
            case '+':
                switch(this.peek()){
                    case '+':
                        this.next();
                        return TokenType.INCREMENT;
                    case '=':
                        this.next();
                        return TokenType.PLUS_EQUALS;
                    default:
                        return TokenType.PLUS;
                }
            case '-':
                if(isDigit(this.peek()) && !isDigit(this.previous())){
                    //negative number
                } else {
                    switch(this.peek()){
                        case '-':
                            this.next();
                            return TokenType.DECREMENT;
                        case '=':
                            this.next();
                            return TokenType.MINUS_EQUALS;
                        default:
                            return TokenType.MINUS;
                    }
                }
            case '<':
                if(this.match('=')){
                    return TokenType.LESS_EQUALS;
                }else{
                    return TokenType.LESS;
                }
            case '>':
                if(this.match('=')){
                    return TokenType.GREATER_EQUALS;
                }else {
                    return TokenType.GREATER;
                }
            case '=':
                if(this.match('=')){
                    return TokenType.EQUALS;
                }else{
                    return TokenType.ASSIGN;
                }
            case '|':
                if(this.match('|')){
                    return TokenType.OR;
                }
                break;
            case '&':
                if(this.match('&')){
                    return TokenType.AND;
                }
                break;
            case '/':
                if(this.match('/')){
                    while(this.peek() !== '\n'){
                        this.next();
                    }
                    this.next();
                    return this.scanToken();
                }else if(this.match('*')){
                    while(this.peek(2) !== '*/'){
                        this.next();
                    }
                    this.next(2);
                    return this.scanToken();
                }else{
                    return TokenType.DIVIDE;
                }
            case '#':
                return TokenType.PREPROCESS;
                //Double or single quotes signify the beginning of a String literal; refer to the string() function.
            case '"':
            case "'":
                const initialLine = this.line;
                this.start = this.current;
                let lookAhead = this.peek();

                while(lookAhead !== c && lookAhead !== '\n' && lookAhead !== '\0'){
                    if(this.peek(2) === "\\" + c){
                        this.next(2)
                    }
                    this.next();
                    lookAhead = this.peek();
                }
                if(lookAhead === c){
                    this.next();
                    return TokenType.STRING;
                }else {
                    throw "Unterminated string starting at line " + initialLine + ".";
                }

                //handle strings;
    
            case '\n':
                //Only significant, non-repeated newlines are added as tokens, which leads to more efficient parsing.
                this.indent = 0;
                this.line++;
                if(this.previous() !== '\n') {
                    
                    return TokenType.NEWLINE;
                }
                return this.scanToken();
            case '\t':
                ++this.indent;
                while(this.hasNext() && (this.peek() === ' ' || this.peek() === '\t')){
                    if(this.next() === '\t') ++this.indent;
                }
                if(this.peek() !== '\n'){
                    return TokenType.INDENT;    
                }
                return this.scanToken();
            
            //Numbers are handled within the default case because regular expressions are used for identification
            default:
                //If the character is a number [0-9], process it as a potential integer or real number using the number() function.
                if (isDigit(c)) {
                    this.start = this.current-1;
                    return this.lexNumber();
                    //If the character is alphabetical, process it as a potential keyword or identifier.
                } else if (isAlpha(c)) {
                    return this.lexIdOrKeyword();
                }
                return this.scanToken();
        }
    }
    lexNumber(numberType: TokenType = TokenType.INTEGER): TokenType{
        if(isDigit(this.peek())){
            this.next();
            this.lexNumber(numberType);
        
        }if(numberType !== TokenType.INTEGER && this.peek() === '.' && isDigit(this.peek(2, true))){
            this.next();
            this.lexNumber(TokenType.REAL);
        }else{
            return numberType;       
        }
    }

    lexIdOrKeyword(): TokenType{
        this.start = this.current - 1;
        while (isAlpha(this.peek())) {
            this.next();
        }
        const idText = this.source.substring(this.start, this.current);
        switch(idText){
            case 'for':
                return TokenType.FOR;
            case 'while':
                return TokenType.WHILE;
            case 'if':
                return TokenType.IF;
            case 'print':
                return TokenType.PRINT;
            case 'draw':
                return TokenType.DRAW;
            case 'pi':
                return TokenType.PI;
            case 'tau':
                return TokenType.TAU;
            case 'e':
                return TokenType.E;
            case 'let':
                return TokenType.LET;
            default:
                return TokenType.ID;
        }
    }
}

export function isDigit(c: string){
    return /[0-9]/.test(c);
}

export function isAlpha(c: string){
    return /[A-Za-z]/.test(c);
}