import * as Expr from './Expr';
import {VarToken} from './Tokens';

export class Environment {
    enclosing: Environment;
    vars: Map<string, string | number | Expr.Value>

    constructor(enclosing) {
        this.enclosing = enclosing;
        this.vars = new Map();
    }

    set (name: string, value: string | number | Expr.Value) {
        this.vars.set(name, value);
    }

    get(varName: string): string | number | Expr.Value{
        const test = this.vars.get(varName);
        if(test){
            return test;
        }else if(this.enclosing){
            return this.enclosing.get(varName);
        }else{
            throw 1;
        }
    }
}