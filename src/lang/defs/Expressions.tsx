import {Token, Literal, Indent} from './Tokens';

/*the visitor interface allows for a more functional style of representing expressions
 *Inspired by https://craftinginterpreters.com/representing-code.html#implementing-syntax-trees
 */

interface Visitor<T>{
    visitLiteral(expr: Expr);
    visitBinary(expr: Expr);
    visitUnary(expr: Expr);
    visitFunction(expr:Expr);
}

export abstract class Expr {
    abstract accept<T>(visitor: Visitor<T>);
}

export class BinaryExpr extends Expr{
    lvalue: Expr; 
    rvalue: Expr;
    op: Token;

    accept<T>(visitor: Visitor<T>){
        visitor.visitBinary(this);
    }
}

export class UnaryExpr extends Expr{
    op: Token;
    rvalue: Expr;

    accept<T>(visitor: Visitor<T>){
        visitor.visitUnary(this);
    }
}

export class FunctionExpr extends Expr{
    func: Token;
    param: Expr[];

    accept<T>(visitor: Visitor<T>){
        visitor.visitFunction(this);
    }
}