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
import { getColorFromArray } from "./StyleUtilities";

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

export type ShapeProps = {defs: Tag, style: React.CSSProperties, children?: any}

export const Shape = ({defs}:ShapeProps) => {

	const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : "none",
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : "black",
        strokeWidth: defs.styles['strokeWidth'] ? defs.styles['strokeWidth'].value + "px" : "3px",
    }

	switch(defs.tag){
		case ShapeType.SP_RECT:
			return(
				<Rect defs={defs} style={styles}></Rect>
			);
		case ShapeType.SP_CIRC:
			return(
				<Circ defs={defs} style={styles}></Circ>
			);
		case ShapeType.SP_POLYL:
		case ShapeType.SP_POLYG:
			return(
				<PolyShape defs={defs} style={styles}></PolyShape>
			);
		case ShapeType.SP_PATH:
			return(
				<Path defs={defs} style={styles}></Path>
			);
		case ShapeType.SP_ELLIP:
			return(
				<Ellipse defs={defs} style={styles}></Ellipse>
			);
		case ShapeType.SP_LINE:
			return (
				<Line defs={defs} style={styles}></Line>
			);
		case ShapeType.SP_UNGON:
			return null;
		default:
			return null;
	}
};