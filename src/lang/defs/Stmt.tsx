import * as Expr from './Expr';
import {Token, Indent, VarToken} from './Tokens';

export interface Visitor<T>{
    visitPrint(stmt: Print);
    visitAssign(stmt: Assign);
}

export abstract class Stmt{
    abstract accept<T>(visitor: Visitor<T>);
}

export class Print extends Stmt{
    value: Expr.Expr;

    constructor(value: Expr.Expr){
        super();
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>){
        visitor.visitPrint(this);
    }
}

export class Assign extends Stmt{
    varName: Token;
    op: Token;
    value: Expr.Expr;

    constructor(varName: Token, op: Token, value: Expr.Expr){
        super();
        this.varName = varName;
        this.op = op;
        this.value = value;
    }

    accept<T>(visitor: Visitor<T>){
        visitor.visitAssign(this);
    }
    
}

