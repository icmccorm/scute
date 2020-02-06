import { ValueLink } from 'src/redux/ScuteStore';
import {Rect} from "./RectHook";
import {Circ} from "./CircHook";

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

export type ShapeProps = {manipulate: Function, defs: Tag, children: any}
export type ShapeState = {hovering: boolean, style: object}
export type Props = {manipulate: Function, defs: Tag, key: number}

export const Shape = (props: ShapeProps) => {
	switch(this.props.defs.tags){
		case ShapeType.SP_RECT:
			return Rect(this.props.defs);
		case ShapeType.SP_CIRC:
			return Circ(this.props.defs);
		default:
			return null;
	}
}
