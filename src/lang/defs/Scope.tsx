import {Expr, Binary, Unary} from './Expr';
import {Var} from './Tokens';

export class Scope {
    superScope: Scope;
    vars: Map<string, Expr>

    constructor(superScope) {
        this.superScope = superScope;
        this.vars = new Map();
    }

    addVar (name: string, value: Expr) {
        this.vars.set(name, value);
    }

    getVar (varToken: Var): Expr {
        const name = varToken.id;
        const test = this.vars.get(name);
        if (test) {
            return test;
        } else {
            
            let holder = this.superScope;
            
            while(holder != null){
                
                let test = holder.vars.get(name);
                
                if(test != undefined){
                    return test;
                
                }else{
                    holder = holder.superScope;
                }    
            }
            
            throw varToken.line + ":\'" + name + "\' is undefined or out of scope.";
        
        }
    }

    checkVar (varToken: Var): boolean {
        try{
            this.getVar(varToken);
        
        }catch(e){
            return false;
        }
        
        return true;
    }
}