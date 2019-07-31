/* global Literal BinaryExpr UnaryExpr ParsingError Point BoundStatement Rectangle Circle Ellipse Console For Comparison Assignment Variable TimeStep Color, Text, Polyline, Line, Polygon, PrintStatement, Scope*/
import Scope from './Scope.js';
import * as lib from './Hierarchy.js';
import Lexer from './Lexer.js';

export default function createAST(src) {
    var tokens = new TokenList(Lexer.tokenize(src));
    return parse.call(tokens);
}

function parse (statements) {
    if(this.isAtEnd()){
        return this.ast;
    }else{
        let nextLine = statement();
        if(nextLine) this.ast.push(nextLine);
        parse.call(this);
    }
}

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
    
        if(this.isAtEnd()) throw new ParsingError(this.peek().line, 'End of file reached.');
        if (arguments.length == 0) return null;
    
        if (arguments.includes(current.type) || arguments.includes(current.text)){
            return this.advance();
        }
    
        var message;
    
        switch (arguments[arguments.length - 1]) {
            case 'ID':
                message = 'Expected an identifier.';
                break;
            case 'UNARY':
                message = 'Expected a unary operator.';
                break;
            default:
                message = "Expected \'" + arguments[arguments.length - 1] + '\'';
                break;
        }
    
        throw new ParsingError(current.line, message);
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

function evaluate () {
    try {
        var result = expression();
    } catch (RuntimeError) {
        RuntimeError.printMessage();
    }

    Console.log(result.eval());
}

function expression () {
    return assignment();
}

function grouping () {
    if (this.match('(')) {
        var expr = expression();
        this.consume(')');
        return expr;
    } else {
        throw new ParsingError(this.previous.line, "Expected \')\'");
    }
}

function assignment () {
    var left = comparison();

    while (this.match('=', '|=', '-=', '+=')) {
        var operator = this.previous();

        if (!(left instanceof Variable)) {
            throw new ParsingError(this.previous().line, "An identifier cannot be assigned to an expression.");
        } else {
            var expr;
            if (this.match('SHAPE')) {
                expr = shape(this.previous());
            } else {
                expr = expression();
            }
            return new lib.Assignment(left, operator, expr);
        }

    }
    return left;
}


function comparison () {
    var left = additive();
    while (this.match('!=', '==', '<=', '>=', '>', '<')) {
        var operator = this.previous().text;
        var right = additive();
        left = new lib.Comparison(left, operator, right);
    }
    return left;
}

function additive () {
    var left = multiplicative();
    while (this.match('+', '-')) {
        var operator = this.previous().text;
        var right = multiplicative();
        left = new lib.BinaryExpr(left, operator, right);
    }

    return left;
}

function multiplicative () {
    var left = exponential();
    while (this.match('*', '/', '%')) {
        var operator = this.previous().text;
        var right = exponential();
        left = new lib.BinaryExpr(left, operator, right);
    }

    return left;

}

function exponential () {
    var left = unary();

    while (this.match('^')) {
        var operator = this.previous().text;
        var right = atom();
        left = new lib.BinaryExpr(left, operator, right);
    }

    return left
}

function unary () {
    if (this.match('++', '--')) {
        var operator = this.previous();
        var right;

        right =this.consume('ID');
        return new lib.UnaryExpr(operator, right, this.scope);
    }
    return atom();
}

function atom () {
    var token = this.advance();

    switch (token.type) {
        case 'ID':
            switch (this.peek().text) {
                case '++':
                case '--':
                    return new lib.UnaryExpr(this.advance(), token, this.scope);
                case '.':
                    this.advance();
                    var reference =this.consume('ID', 'ATTRIBUTE');
                    return new lib.Variable(token, reference, this.scope);
                default:
                    return new lib.Variable(token, null, this.scope);
            }

        case 'KEY':
            switch (token.text) {

                case 'rgb':
                    return color();
                case 'sin':
                case 'cos':
                case 'tan':
                    var right = grouping();
                    return new lib.TrigExpression(token, right);
                case 'pi':
                    return new lib.Literal(Math.PI);
                case 'tau':
                    return new lib.Literal(2 * Math.PI);
            }
            break;
        case 'INTEGER':
            return new lib.Literal(parseInt(this.previous().text));
        case 'REAL':
            return new lib.Literal(parseFloat(this.previous().text));
        case 'STRING':
            return new lib.Literal(this.previous().text);
        case 'BOOLEAN':
            return new lib.Literal((this.previous().text == 'true' ? true : false));
        case 'OP':
            switch (token.text) {

                case '(':
                    var inner = expression();
                   this.consume(')');
                    return inner;
                case '!':
                case '++':
                case '--':
                    return new lib.UnaryExpr(token, this.advance(), this.scope);
            }
            break;
        case 'T':
            return new lib.Variable(token, null, this.scope);
        default:
            throw new ParsingError(token.line, "Missing or unrecognizeable expression.");
    }
}

function shape (token) {

    switch (token.text) {
        case 'rect':
            return rectStatement();
        case 'circle':
            return circleStatement();
        case 'ellipse':
            return ellipseStatement();
        case 'text':
            return textStatement();
        case 'line':
            return lineStatement();
        case 'polygon':
            return polyStatement(token.text);
        case 'polyline':
            return polyStatement(token.text);
    }

}

function color () {
   this.consume('(');

    var r = expression();
   this.consume(',');

    var g = expression();
   this.consume(',');

    var b = expression();
   this.consume(')');

    return new lib.Color(r, g, b);

}


function statement () {
        
    var baseline = (this.peek().type == 'INDENT' ? this.advance().num : 0);
    var token = this.peek();
    
    var expr;

    switch (token.type) {

        case 'INTEGER':
            expr = expression();
            return timestep(expr, baseline);

        case 'ID':
            expr = expression();
            if (expr instanceof lib.Assignment || expr instanceof lib.UnaryExpr) {
                return expr;
            } else {
                throw new ParsingError(token.line, "Invalid statement.");
            }

        case 'T':
            if (this.peekNext().type != 'L_LIMIT' && this.peekNext().type != 'R_LIMIT') {
                expr = expression();
                if (expr instanceof lib.Assignment || expr instanceof lib.UnaryExpr) {
                    return expr;
                } else {
                    throw new ParsingError(token.line, "Invalid statement.");
                }
            } else {
                return timestep(this.advance(), baseline);
            }
        case 'KEY':
            this.advance();
            switch (token.text) {
                case 'print':
                    return printStatement();

               /* case 'bounds':
                    return boundStatement();*/

                case 'if':
                    return ifStatement(baseline);

                case 'for':
                    return forStatement(baseline);

                case 'draw':
                    return drawStatement();

                default:
                    throw new ParsingError(token.line, 'Keyword \'' + token.text + '\' must be used within an expression or statement.');

            }

        case 'OP':

            switch (token.text) {
                case '~':
                    this.advance();
                    var statement = statement();
                    statement.setGlobal(true);
                    return statement;
                case '++':
                case '--':
                case '!':
                    return expression();
            }
            break;

        default:
            synchronize();
            break;
    }
}

function synchronize () {
    this.advance();

    while (!this.isAtEnd()) {
        if (this.previous().type == 'NEWLINE' && this.peek().type != 'NEWLINE') {
            return;
        }
        switch (this.previous().type) {
            case 'INTEGER':
            case 'ID':
            case 'T':
            case 'OP':
                return;
        }

        this.advance();
    }
}


function globalStatement () {
    var expr;
    switch (this.peek().type) {
        case 'SHAPE':
            //return new lib.GlobalStatement(this.shape());

        case 'ID':
            expr = expression();
            if (!(expr instanceof lib.Assignment)) throw new ParsingError(this.peek().line, 'Expected an non-unary assignment.');
            return expr;

        case 'ATTRIBUTE':
            var attr = this.advance();
           this.consume('=');
            expr = expression();
            //return new lib.GlobalStyle(attr, expr);

        default:
            throw new ParsingError(this.peek().line, 'Invalid global statement.');

    }
}

function block (baseline, givenScope) {
    var statements = [];
    
    var initialScope = this.scope;
    
    //If a scope has been passed as a parameter, apply it to the inner statements. This allows TimeSteps to control the value of 't', a function which is not needed for any other enclosure.
    
    //A null value must be passed if a scope is not specified.
    this.scope = (givenScope == null ? new Scope() : givenScope);
    this.scope.superScope = initialScope;

    while (!this.isAtEnd()) {
        
        if (this.peek().type == 'INDENT' && this.peek().num > baseline) {
            var temp = statement();

            if(temp != undefined){
                statements.push(temp);
            }

  /*          if (!(temp instanceof lib.Grouping) && !this.match('\\n') && this.peek().type != 'EOF') {
               this.consume(';')
            }*/

        } else {
            break;
        }

    }
    
    //Set the Parser's current scope at the same level as the enclosure.
    this.scope = this.scope.superScope;
    
    return statements;
}

function methodCall (char) {
    var args = [];

   this.consume('(');

    args.push(expression());

    while (this.match(char)) {
        args.push(expression());
    }

   this.consume(')');

    return args;

}

function printStatement () {
    var value = methodCall(',');

    return new lib.PrintStatement(value);
}

function drawStatement () {
    var element;

    if (this.peek().type == 'SHAPE') {
        element = shape(this.advance());

    } else if (this.peek().type == 'ID') {
        element = new lib.Variable(this.advance(), null, this.scope);

    } else {
        throw new ParsingError(this.peek().line, "Expected a valid shape reference or declaration.");
    }

    return new lib.DrawStatement(element);
}

function ifStatement (baseline) {
   this.consume('(');

    var expr = expression();
    if (!(expr instanceof lib.Comparison || expr instanceof lib.Literal)) {
        throw new ParsingError(this.peek().line, "Expected a boolean expression.");
    }

   this.consume(')')
   this.consume('\\n');
    
    //If statements do not need special access to their inner scope, so null is passed as the second argument
    var statements = block(baseline, null);

    return new lib.If(expr, statements);
}

function forStatement (baseline) {
    var args = methodCall(';');

    if (!(args[0] instanceof lib.Assignment || args[0] instanceof lib.Variable)) {
        throw new ParsingError(this.peek().line, "Expected a declaration or assignment.");
    }

    if (!(args[1] instanceof lib.Comparison)) {
        throw new ParsingError(this.peek().line, "Expected a comparison.");
    }

    if (!(args[2] instanceof lib.UnaryExpr || args[2] instanceof Assignment)) {
        throw new ParsingError(this.peek().line, "Expected an update.");
    }

   this.consume('\\n');
    
    //For statements do not need special access to their inner scope, so null is passed as the second argument
    var statements = block(baseline, null);

    return new lib.For(args, statements);
}

function timestep (left, baseline) {
    var operator =this.consume('<-', '->');
    
    var upper;
    var lower;

    if (left instanceof lib.Literal) {
       this.consume('T');
        switch (operator.text) {
            case '<-':
                upper = left;
                if (this.peek().text == operator.text) {
                    this.advance();
                    lower = expression();
                } else {
                    lower = undefined;
                }
                break;
            case '->':
                lower = left;
                if (this.peek().text == operator.text) {
                    this.advance();
                    upper = expression();
                } else {
                    upper = undefined;
                }
                break;
        }
    } else if (left.type == 'T') {
        var expr = expression();
        switch (operator.text) {
            case '<-':
                lower = expr;
                upper = undefined;
                break;
            case '->':
                upper = expr;
                lower = undefined;
                break;
        }

    }
    //TimeSteps need special access to their inner scope in order to control the value of 't'. Thus, a scope is passed as the second argument.
    var innerScope = new Scope();
    
   this.consume('\\n');
    var statements = block(baseline, innerScope);

    return new lib.TimeStep(lower, upper, statements, innerScope);

}

function rectStatement () {

    var args = methodCall(',');

    if (args.length != 4) throw new ParsingError(this.previous().line, 'Excessive or missing arguments.');

    return new lib.Rectangle(args);

}

function circleStatement () {

    var args = methodCall(',');

    if (args.length != 3) throw new ParsingError(this.previous().line, 'Excessive or missing arguments.');

    return new lib.Circle(args);

}

function ellipseStatement () {

    var args = methodCall(',');

    if (args.length != 4) throw new ParsingError(this.previous().line, 'Excessive or missing arguments.');

    return new lib.Ellipse(args);

}

function textStatement () {

    var args = methodCall(',');

    if (args.length < 2 || args.length > 3) throw new ParsingError(this.previous().line, 'Excessive or missing arguments.');

    return new Text(args);
}

function polyStatement (polyType) {
    var points = [];

    for (var i = 0; i <= 2; ++i) {
        points.push(point());
    }

    while (this.peek().type != "INTEGER") {
        points.push(point());
    }

    switch (polyType) {
        case 'polyline':
            return new Polyline(points);
        case 'polygon':
            return new Polygon(points);
    }
}

function lineStatement () {
    var point1 = point();
    var point2 = point();

    return new Line(point1, point2);
}