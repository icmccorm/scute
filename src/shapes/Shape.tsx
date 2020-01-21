import * as React from 'react';
import Rect from "./Rect";
import Circ from "./Circ";
import { EventClient } from 'src/events/EventClient';

enum ShapeType{
	SP_RECT = 62,
	SP_CIRC,
	SP_LINE,
	SP_POLYL,
	SP_POLYG,
}

export type Tag = {
	id: number;
	tag: ShapeType;
	attrs: object;
	style: {
		values: object,
		loc: object
	}
}

export type ShapeProps = {defs: Tag, client: EventClient, children: any}
export type ShapeState = {hovering: boolean, style: object}

export type Props = {defs: Tag, key: number, client: EventClient}

export class Shape extends React.Component<Props, any>{
	readonly props: Props;
	
	constructor(props){
		super(props);
	}

	render(){
		switch(this.props.defs.tag){
			case ShapeType.SP_RECT:
				return (<Rect 
							client={this.props.client} 
							defs={this.props.defs}>
						</Rect>);
			case ShapeType.SP_CIRC:
				return (<Circ 
							client={this.props.client}
							defs={this.props.defs}>
						</Circ>);
			default:
				return null;
		}
	}
}
