import { ValueLink, LineMeta, getLinkedValue } from "src/redux/Manipulation";

export enum SegmentType {
	SG_JUMP,
	SG_TURTLE,
	SG_VERTEX,
}

export type Segment = {type: SegmentType, point:Array<number>}
type Turtle = {move: ValueLink, turn: ValueLink} & Segment;
type Jump = {x: ValueLink, y: ValueLink} & Segment;