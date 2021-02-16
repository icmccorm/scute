import {Rect} from "./Rect";
import {Circ} from "./Circ";
import * as React from 'react';
import { PolyShape } from './PolyShape';
import { ValueLink } from "src/redux/Manipulation";
import { Path } from "./Path";
import { Ellipse } from "./Ellipse";
import { Line } from "./Line";
import { getColorFromArray } from "./StyleUtilities";
import { Ungon } from "./Ungon";
import { Shapes } from 'src/lang-c/scute.js';

export type Tag = {
	id: number;
	tag: number;
	attrs: Array<ValueLink>;
	styles: {
		values: object,
		loc: object
	}
	animation: number;
	segments: Array<number>;
}
export type ShapeWrapperProps = {defs: Tag, children?: any}

export type ShapeProps = {defs: Tag, style: React.CSSProperties, children?: any}

export const Shape = ({defs}:ShapeWrapperProps) => {

	const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : "none",
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : "black",
        strokeWidth: defs.styles['strokeWidth'] ? defs.styles['strokeWidth'].value + "px" : "1px",
    }

	switch(defs.tag){
		case Shapes.RECT:
			return(
				<Rect defs={defs} style={styles}></Rect>
			);
		case Shapes.CIRC:
			return(
				<Circ defs={defs} style={styles}></Circ>
			);
		case Shapes.POLYL:
		case Shapes.POLYG:
			return(
				<PolyShape defs={defs} style={styles}></PolyShape>
			);
		case Shapes.UNGON:
			return(
				<Ungon defs={defs} style={styles}></Ungon>
			);
		case Shapes.PATH:
			return(
				<Path defs={defs} style={styles}></Path>
			);
		case Shapes.ELLIP:
			return(
				<Ellipse defs={defs} style={styles}></Ellipse>
			);
		case Shapes.LINE:
			return (
				<Line defs={defs} style={styles}></Line>
			);
		default:
			return null;
	}
};