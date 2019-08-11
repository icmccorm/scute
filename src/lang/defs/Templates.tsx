export abstract class Expr {

    abstract accept<T>(visitor: Visitor<T>);
}

export abstract interface Visitor<T>{

}