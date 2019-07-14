import Lexer from './Lexer';
import { Scope } from './defs/Scope';

export default function createAST(src) {
    var tokens = new TokenList(Lexer.tokenize(src));
  //  return parse.call(tokens);
}
/*
function parse (statements) {
    if(this.isAtEnd()){
        return this.ast;
    }else{
        let nextLine = statement();
        if(nextLine) this.ast.push(nextLine);
        parse.call(this);
    }
}
*/
class TokenList {
    constructor(tokens){
        this.tokens = tokens;
        this.ast = [];
        this.current = 0;
        this.scope = new Scope(null);
    }
    isAtEnd () {
        return this.peek().type == 'EOF';
    }
    previous() {
        if (this.current - 1 < 0 || this.current - 1 >= this.tokens.length) {
            return null;
        }
        return this.tokens[this.current - 1];
    }
    has (item) {
        return item == this.tokens[this.current].text;
    }
    peek () {
        return this.tokens[this.current];
    }
    peekNext () {
        if (this.current + 1 >= this.tokens.length) return undefined;
        return this.tokens[this.current + 1];
    }
    advance () {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }
    check (id) {
        if (this.isAtEnd()) return false;
        return (this.peek().type == id) || (this.peek().text == id);
    }
    consume () {
        let current = this.peek();
    
        if(this.isAtEnd()) throw 1;//new ParsingError(this.peek().line, 'End of file reached.');
        if (arguments.length == 0) return null;
    
        if (arguments.includes(current.type) || arguments.includes(current.text)){
            return this.advance();
        }

        throw 1;
    }
    match () {
        let current = this.peek();
        if (arguments.length == 0) return false;
    
        if (arguments.includes(current.id) || arguments.includes(current.text)){
            this.advance();
            return true;
        }
        
        return false;
    }
}