import * as React from 'react';

enum ShapeType{
	SP_RECT = 1,
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

export type Props = {tag: Tag}

export class Shape extends React.Component<any, any>{
	readonly props: Props;

	constructor(props){
		super(props);
	}
	render(){
		return React.createElement(typeToTag(this.props.tag.tag), this.props.tag.attrs, null);
	}
}

function typeToTag(sp:ShapeType):string{
	switch(sp){
		case ShapeType.SP_RECT:
			return 'rect';
		case ShapeType.SP_CIRC:
			return 'circle';
		case ShapeType.SP_LINE:
			return 'line';
		case ShapeType.SP_POLYG:
			return 'polygon';
		case ShapeType.SP_POLYL:
			return 'polyline';
		default:
			return;
	}
}
