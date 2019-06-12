/* global GlobalScope Map Engine Console*/
import * as err from './Exceptions';
import Interpreter from './InterpreterUtilities';

export class Expression {
   constructor (){

   } 
}

export class Unary extends Expression {
    constructor(op, right, scope){
        this.operator = op;
        this.right = right;
        this.scope = scope;
    }
}

export class UnaryExpr extends Unary {
    constructor(op, a, scope){
        super(op, a, scope);

    }
    eval(){
        var initial = new Variable(this.right, null, this.scope);
        var value;
        switch (this.operator.text) {
            case '--':
                value = new Literal(initial.eval() - 1);

            case '++':
                value = new Literal(initial.eval() + 1);

            case '!':
                value = new Literal(!initial.eval());
            default:
                break;
        }
        this.scope.addVar(this.right, value);
        return value.eval();
    }
}

export class BinaryExpr extends Expression{
    constructor(a, op, b){
        this.left = a;
        this.right = b;
        this.operator = op;
    }
}

export class Arithmetic extends BinaryExpression{
    constructor(a, op, b){
        super(a, op, b);
    }
    eval() {
        switch (this.operator) {
            case '+':
                return this.left.eval() + this.right.eval();
            case '-':
                return this.left.eval() - this.right.eval();
            case '*':
                return this.left.eval() * this.right.eval();
            case '/':
                return this.left.eval() / this.right.eval();
            case '%':
                return this.left.eval() % this.right.eval();
            case '^':
                return Math.pow(this.left.eval(), this.right.eval());
        }
    }
}

export class Comparison extends BinaryExpression {
    constructor(a, op, b){
        super(a, op, b);
    }
    eval(){
        switch (this.operator) {
            case '==':
                return this.left.eval() == this.right.eval();
            case '!=':
                return this.left.eval() != this.right.eval();
            case '>':
                return this.left.eval() > this.right.eval();
            case '<':
                return this.left.eval() < this.right.eval();
            case '<=':
                return this.left.eval() <= this.right.eval();
            case '>=':
                return this.left.eval() >= this.right.eval();
        }
    }
}

export class TrigExpression extends Unary{
    constructor(op, a){
        super(op, a);
    }
    eval() {
        switch (this.operator.text) {
            case 'sin':
                return Math.sin(this.expr.eval());
            case 'cos':
                return Math.cos(this.expr.eval());
            case 'tan':
                return Math.tan(this.expr.eval());
        }
    }
}
export class Point extends Expression {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

export class RGBColor extends Expression {
    constructor(r, g, b){
        this.r = r;
        this.g = g;
        this.b = b;
    }
    eval() {
        var val = "rgb(";
        val += this.r.eval() + ",";
        val += this.g.eval() + ",";
        val += this.b.eval() + ")";
        return val;
    }
}

export class SVG extends Expression{
    constructor () {

    }
}

export class Literal extends Expression{
    constructor (val) {
        this.value = val;
    }
    eval () {
        return this.value;
    }
}

export class Variable extends Expression {
    constructor(id, child, scope){
        this.child = child;
        this.id = id;
        this.scope = scope;
    }
    eval () {
        if(this.child){
            return this.child.eval();
        }else{
            return this.scope.getVar(this.id);
        }
    }
    update (input, eager) {
        if(this.child){
            this.child.update(input, eager);
        }else{
            if (!(input instanceof SVG)) {
                value = (eager ? new Literal(input.eval()) : input);
            }else{
                if(eager) throw new RuntimeError(this.id.line, 'Eager assignment cannot be applied to shapes.');
                value = input;
            }

            this.scope.addVar(this.id, value);
        
        }
    }
}

export class Statement {
    constructor() {

    }
}

export class Assignment extends Statement {
    constructor(id, op, expr){
        this.id = id;
        this.operator = op;
        this.expr = expr;
    }
    eval () {
        switch (this.operator.text) {
            case '=':
                this.id.update(this.expr, true);
                break;
            case '|=':
                this.id.update(this.expr, false);
                break;
            case '+=':
                this.id.update(new Literal(this.id.eval() + this.expr.eval()));
                break;
            case '-=':
                this.id.update(new Literal(this.id.eval() - this.expr.eval()));
                break;
        }
    }
}


export class PrintStatement extends Statement {
    constructor (val) {
        this.value = val;
    }
    eval () {
        if (Array.isArray(this.value)) {
            var s = this.value[0].eval() + "";
            for (var i = 1; i < this.value.length; ++i) {
                s += ", " + this.value[i].eval();
            }
            return s;
    
        } else {
            return this.value.eval();
        }
    }
}

export class DrawStatement extends Statement {
    constructor(shape){
        this.shape = shape;
    }

    eval() {
        this.shape.eval();
    }
}

export class Collection {
    constructor(statements){
        this.statements = statements;
    }
    evalInner () {
        for(let i = 0; i < this.statements.length; ++i){
            this.statements[i].eval();
        }
    }
}

export class If extends Collection {
    constructor(expr, statements) {
        super(statements);
        this.expr = expr
    }
    eval () {
        if(this.expr.eval()){
            this.evalInner();
        }
    }
}

export class For extends Collection {
    constructor(args, statements){
        super(statements);
        this.declare = args[0];
        this.compare = args[1];
        this.increment = args[2];
    }
    eval () {
        this.declare.eval();
        while(this.compare.eval()){
            this.evalInner();
            this.increment.eval();
        }
    }
}


/*
export function Item() {
    this.global = false;
}
Item.prototype.constructor = Item;
Item.prototype.setGlobal = function (val) {
    this.global = val;
}

export function TimeStep(start, end, statements, scope) {
    Grouping.call(this, statements);
    this.global = true;
    this.scope = scope;

    if (start instanceof Literal) {
        this.start = start.eval();
    }

    if (end instanceof Literal) {
        this.end = end.eval();
    } else {
        this.end = 1000;
    }

    this.statements = statements;
    this.frames = [];
}


TimeStep.prototype = Object.create(Grouping.prototype);
TimeStep.prototype.constructor = TimeStep;
TimeStep.prototype.eval = function () {
    if (this.check(Interpreter.current.index)) {

        this.step();

        for (var i = 0; i < this.statements.length; ++i) {
            this.statements[i].eval();
        }
    }
}
TimeStep.prototype.step = function () {
    this.scope.vars.set('t', new Literal((Interpreter.current.index - this.start) / (this.end - this.start)));
}

TimeStep.prototype.check = function (index) {
    if (this.start == undefined) {
        return index <= this.end;
    } else if (this.end == undefined) {
        return index >= this.start;
    } else {
        return index >= this.start && index <= this.end;
    }
}


export function Shape() {
    Statement.call(this);
    this.attrs = {};
}
Shape.prototype = Object.create(Statement.prototype);
Shape.prototype.constructor = Shape;
Shape.prototype.getAttributes = function() {
    var finals = {};
    for(var prop in this.attrs){
        finals[prop] = this.attrs[prop].eval();
    }
    return finals;
}

export function Rectangle(args) {
    Shape.call(this);
    this.attrs.x = args[0];
    this.attrs.y = args[1];
    this.attrs.height = args[2];
    this.attrs.width = args[3];
}
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.eval = function () {
    Interpreter.add('rect', null, this.getAttributes());
};

export function Circle(args) {
    Shape.call(this);
    this.attrs.cx = args[0];
    this.attrs.cy = args[1];
    this.attrs.r = args[2];
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.eval = function () {
    Interpreter.add('circle', null, this.getAttributes());
};

export function Ellipse(args) {
    Shape.call(this);
    this.attrs.cx = args[0];
    this.attrs.cy = args[1];
    this.attrs.rx = args[2];
    this.attrs.ry = args[3];
}
Ellipse.prototype = Object.create(Shape.prototype);
Ellipse.prototype.constructor = Ellipse;
Ellipse.prototype.eval = function () {
    Interpreter.add('ellipse', null, this.getAttributes());
}

export function Text(args) {
    Shape.call(this);
    this.attrs.x = args[0];
    this.attrs.y = args[1];
    this.value = args[2];
}
Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;
Text.prototype.eval = function () {
    Interpreter.add('text', this.getString(), this.getAttributes());
};
Text.prototype.getString = function () {
    return (this.value != undefined ? this.value.eval() : null);
};

export function Polyline(coords) {
    Shape.call(this);
    this.coordList = coords;
}
Polyline.prototype = Object.create(Shape.prototype);
Polyline.prototype.constructor = Polyline;
Polyline.prototype.eval = function () {
    var attr = {
        points: "",
    }
    for (var i = 0; i < this.coordList.length; i++) {
        var point = this.coordList[i];
        attr.points += point.x.eval() + "," + point.y.eval() + " ";
    }
    Interpreter.add('polyline', null, attr);

};

export function Polygon(coords) {
    Shape.call(this);
    this.coordList = coords;
}
Polygon.prototype = Object.create(Shape.prototype);
Polygon.prototype.constructor = Polygon;
Polygon.prototype.eval = function () {
    var attr = {
        points: "",
    }

    for (var i = 0; i < this.coordList.length; i++) {
        var point = this.coordList[i];
        attr.points += point.x.eval() + "," + point.y.eval() + " ";
    }
    Interpreter.add('polygon', null, attr);
}

export function Line(coordOne, coordTwo) {
    Shape.call(this);
    this.attrs.x1 = coordOne.x;
    this.attrs.y1 = coordOne.y;
    this.attrs.x2 = coordTwo.x;
    this.attrs.y2 = coordTwo.y;

}
Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;
Line.prototype.eval = function () {
    Interpreter.add('line', null, this.getAttributes());
};
*/