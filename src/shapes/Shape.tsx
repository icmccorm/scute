import { ValueLink } from 'src/redux/ScuteStore';
import {Rect} from "./Rect";
import {Circ} from "./Circ";
import { render } from 'node-sass';
import * as React from 'react';

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
	attrs: Array<ValueLink>;
	style: {
		values: object,
		loc: object
	}
}

export type ShapeProps = {defs: Tag, children: any}
export type ShapeState = {hovering: boolean, style: object}
export type Props = {defs: Tag}

export const Shape = ({defs}:Props) => {
	switch(defs.tag){
		case ShapeType.SP_RECT:
			return(
				<Rect defs={defs}></Rect>
			);
		case ShapeType.SP_CIRC:
			return(
				<Rect defs={defs}></Rect>
			);
		default:
			return null;
	}
}
