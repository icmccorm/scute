import {Parser} from './Parser';
import * as Tokens from './defs/Tokens';
import * as Expr from "./defs/Expr";
import * as Stmt from "./defs/Stmt";
import { Environment } from './defs/Scope';
import { TokenType } from './defs/TokenTypes';

export class Interpreter implements Expr.Visitor<object>, Stmt.Visitor<void>{
    private script: string;
    private env: Environment;
    private print: Function;

    constructor(script: string, printFunction: Function){
        this.script = script;
        this.env = new Environment(null);
        this.print = printFunction;
    }

    public interpret(){
        let parse = new Parser(this.script);
        const statements: Stmt.Stmt[] = [];

        for(let statement of statements){
            this.executeStmt(statement);
        }
    }

    visitValue(expr: Expr.Value) {
        if(expr.valueToken instanceof Tokens.Literal){
            return expr.valueToken.value;
        }else if(expr.valueToken instanceof Tokens.VarToken){
            return this.env.get(expr.valueToken.id);
        }else{
            throw 1;
        }
    }    

    visitBinary(expr: Expr.Binary) {
        const leftResult = this.executeExpr(expr.lvalue);
        const rightResult = this.executeExpr(expr.rvalue);

        switch(expr.op.type){
            case TokenType.PLUS:
                return leftResult + rightResult;
            case TokenType.MINUS:
                return leftResult - rightResult;
            case TokenType.TIMES:
                return leftResult * rightResult;
            case TokenType.DIVIDE:
                return leftResult / rightResult;
            case TokenType.MODULO:
                return leftResult % rightResult;
            case TokenType.EQUALS:
                return leftResult == rightResult;
            case TokenType.LESS_EQUALS:
                return leftResult <= rightResult;
            case TokenType.GREATER_EQUALS:
                return leftResult >= rightResult;
            case TokenType.LESS:
                return leftResult < rightResult;
            case TokenType.GREATER:
                return leftResult > rightResult;
            default: 
                throw 1;
        }
    }
    visitUnary(expr: Expr.Unary) {
    }
    async visitPrint(stmt: Stmt.Print) {
        const result = this.executeExpr(stmt.value);
        await this.print(result);
    }

    visitAssign(stmt: Stmt.Assign) {
        const rightResult = this.executeExpr(stmt.value);
        this.env.set((stmt.varName as Tokens.VarToken).id, rightResult);
        return true;
    }

    executeStmt(stmt: Stmt.Stmt){
        return stmt.accept(this);
    }

    executeExpr(expr: Expr.Expr){
        return expr.accept(this);
    }
}