import {Rect} from "./Rect";
import {Circ} from "./Circ";
import * as React from 'react';
import { PolyShape } from './PolyShape';
import { Segment } from './PathUtilities';
import { ValueLink } from "src/redux/Manipulation";
import { Path } from "./Path";
import { ProgressPlugin } from "webpack";
import { Ellipse } from "./Ellipse";
import { Line } from "./Line";

export enum ShapeType{
	SP_RECT = 68,
	SP_CIRC,
	SP_POLYG,
	SP_POLYL,
	SP_PATH,
	SP_ELLIP,
	SP_LINE,
	SP_UNGON,
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
		case ShapeType.SP_POLYG:
			return(
				<PolyShape defs={defs}></PolyShape>
			);
		case ShapeType.SP_PATH:
			return(
				<Path defs={defs}></Path>
			);
		case ShapeType.SP_ELLIP:
			return(
				<Ellipse defs={defs}></Ellipse>
			);
		case ShapeType.SP_LINE:
			return (
				<Line defs={defs}></Line>
			);
		case ShapeType.SP_UNGON:
			return null;
		default:
			return null;
	}
};