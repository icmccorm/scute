import {Rect} from "./Rect";
import {Circ} from "./Circ";
import * as React from 'react';
import { Polyline } from './Polyline';
import { Polygon } from './Polygon';
import { Segment } from './PathUtilities';
import { ValueLink } from "src/redux/Manipulation";
import { Path } from "./Path";

enum ShapeType{
	SP_RECT = 68,
	SP_CIRC,
	SP_POLYG,
	SP_POLYL,
	SP_PATH,
	SP_ELLIP,
}

export type Tag = {
	id: number;
	tag: ShapeType;
	attrs: Array<ValueLink>;
	styles: {
		values: object,
		loc: object
	}
	segments: Array<Segment>
}

export type ShapeProps = {defs: Tag, children?: any}

export const Shape = ({defs}:ShapeProps) => {
	switch(defs.tag){
		case ShapeType.SP_RECT:
			return(
				<Rect defs={defs}></Rect>
			);
		case ShapeType.SP_CIRC:
			return(
				<Circ defs={defs}></Circ>
			);
		case ShapeType.SP_POLYL:
			return(
				<Polyline defs={defs}></Polyline>
			);
		case ShapeType.SP_POLYG:
			return(
				<Polygon defs={defs}></Polygon>
			);
		case ShapeType.SP_PATH:
			return(
				<Path defs={defs}></Path>
			);
		default:
			return null;
	}
};