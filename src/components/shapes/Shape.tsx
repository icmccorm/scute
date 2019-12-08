import * as React from 'react';
import Rect from "./Rect";
import Circ from "./Circ";
import { EventClient } from 'src/EventClient';

enum ShapeType{
	SP_RECT = 53,
	SP_CIRC,
	SP_LINE,
	SP_POLYL,
	SP_POLYG,
}

class sTag {
	id: number;
	tag: ShapeType;
	attrs: object;
	styles: object;
}

export type Tag = sTag & object;
export type Props = {defs: any, key: number, client: EventClient}
export class Shape extends React.Component<any, any>{
	readonly props: Props;

	constructor(props){
		super(props);
	}
	render(){

		switch(this.props.defs.tag){
			case ShapeType.SP_RECT:
				return (<Rect client={this.props.client} attrs={this.props.defs.attrs}></Rect>);
			case ShapeType.SP_CIRC:
				return (<Circ client={this.props.client} attrs={this.props.defs.attrs}></Circ>);
			default:
				break;
		}

	}
}
