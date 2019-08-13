import {Token, Literal, Indent} from './Tokens';
import {Scope} from './Scope';
/*the visitor interface allows for a more functional style of representing expressions
 *Inspired by https://craftinginterpreters.com/representing-code.html#implementing-syntax-trees
 */

export interface Visitor<T>{
    visitValue(expr: Value);
    visitBinary(expr: Binary);
    visitUnary(expr: Unary);
}

export abstract class Expr {

    abstract accept<T>(visitor: Visitor<T>);
}

export class Binary extends Expr{
    lvalue: Expr; 
    rvalue: Expr;
    op: Token;

    constructor(lvalue: Expr, rvalue: Expr, op: Token){
        super();
        this.lvalue = lvalue;
        this.rvalue = rvalue;
        this.op = op;
    }

    accept<T>(visitor: Visitor<T>){
        visitor.visitBinary(this);
    }
}

export class Unary extends Expr{
    op: Token;
    cvalue: Token;

    constructor(cvalue: Token, op: Token){
        super();
        this.cvalue = cvalue;
        this.op = op;
    }


    accept<T>(visitor: Visitor<T>){
        visitor.visitUnary(this);
    }
}

export class Value extends Expr{
    valueToken: Token;
    
    constructor(value: Token){
        super();
        this.valueToken = value;
    }

    accept<T>(visitor: Visitor<T>){
        visitor.visitValue(this);
    }
}
