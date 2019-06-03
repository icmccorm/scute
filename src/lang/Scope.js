/*global Literal Map RuntimeError*/

class Scope {
    constructor(superScope) {
        this.superScope = superScope;
        this.vars = new Map();
    }

    addVar (name, value) {
        this.vars.set(name.text, value);
    }

    getVar (token) {
        var test = this.vars.get(token.text);
        if (test != undefined) {
            return test;
        } else {
            
            var holder = this.superScope;
            
            while(holder != null){
                
                test = holder.vars.get(token.text);
                
                if(test != undefined){
                    return test;
                
                }else{
                    holder = holder.superScope;
                }    
            }
            
            throw new RuntimeError(token.line, "\'" + token.text + "\' is undefined or out of scope.");
        
        }
    }

    checkVar (token) {
        try{
            this.getVar(token);
        
        }catch(e){
            return false;
        }
        
        return true;
    }
}

export default Scope;