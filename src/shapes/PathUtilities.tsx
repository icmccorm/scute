import { ValueLink, LineMeta, getLinkedValue, ValueMeta, manipulation } from "src/redux/Manipulation";
import * as React from "react";
import Handle from "./Handle";

export enum SegmentType {
	SG_JUMP = 0,
	SG_TURTLE,
	SG_VERTEX,
	SG_CBEZIER,
	SG_QBEZIER,
	SG_ARC,
}

export type Segment = {type: SegmentType}
export type Jump = Segment & {point: ValueLink[]};
export type Turtle = Segment & {move: ValueLink, turn: ValueLink, x:number, y:number};
export type Vertex = Segment & {point: ValueLink[]};
export type Cubic = Segment & {control1: Array<ValueLink>, control2: Array<ValueLink>, end: Array<ValueLink>};
export type Quadratic = Segment & {control: Array<ValueLink>, end: Array<ValueLink>};
export type Arc = Segment & {center: Array<ValueLink>, degrees: ValueLink};

export const generateHandle = (links, dispatch, key: number, segment: Segment) => {
	const link = (vl:ValueLink) => getLinkedValue(links, vl);
	switch(segment.type){
		case SegmentType.SG_JUMP:
			let jump = segment as Jump;
			return [<Handle key={key} cx={link(jump.point[0])} cy={link(jump.point[1])} adjust={(dx, dy) => manipTurtle(dispatch, dx, dy, jump)}/>]
		case SegmentType.SG_TURTLE:
            let turtle = segment as Turtle;
            return [<Handle key={key} cx={turtle.x} cy={turtle.y} adjust={(dx, dy) => manipTurtle(dispatch, dx, dy, turtle)}/>]
		case SegmentType.SG_VERTEX:
            let vertex = segment as Vertex;
            return [<Handle key={key} cx={link(vertex.point[0])} cy={link(vertex.point[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, vertex.point)}/>]
		case SegmentType.SG_QBEZIER:
            let quad = segment as Quadratic;
			return [ 
				<Handle key={key} cx={link(quad.control[0])} cy={link(quad.control[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.control)}/>,
				<Handle key={key+1} cx={link(quad.end[0])} cy={link(quad.end[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.end)}/>
			]
		case SegmentType.SG_CBEZIER:
            let cubic = segment as Cubic;
			return [
				<Handle key={key} cx={link(cubic.control1[0])} cy={link(cubic.control1[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control1)}/>,
				<Handle key={key+1} cx={link(cubic.control2[0])} cy={link(cubic.control2[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control2)}/>,
				<Handle key={key+2} cx={link(cubic.end[0])} cy={link(cubic.end[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.end)}/>
			]
		case SegmentType.SG_ARC:
            let arc = segment as Arc;
            return [<Handle key={key} cx={link(arc.center[0])} cy={link(arc.center[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, arc.center)}/>]
	}
}

export const generateHandles = (links, dispatch, segmentArray: Array<Segment>) => {
	let handles = [];
	let handleIndices = 0;
	for(let i = 0; i<segmentArray.length; ++i){
		let newHandles = generateHandle(links, dispatch, handleIndices, segmentArray[i]);
		handles = handles.concat(newHandles);
		handleIndices += newHandles.length;
	}
	return handles;
}

export const generatePath = (links, segmentArray: Array<Segment>) => {
	let path = "";
	if(segmentArray.length == 0 || segmentArray[0].type != SegmentType.SG_JUMP){
		path += "M 0 0 "
	}
	for(let i = 0; i<segmentArray.length; ++i){
		path += getPathSyntax(links, segmentArray[i]) + " ";
	}
	return path;
}

export const getPathSyntax = (links, segment: Segment) => {
	const link = (vl:ValueLink) => getLinkedValue(links, vl);
	switch(segment.type){
		case SegmentType.SG_JUMP:
			let jump = segment as Jump;
			return "M " + link(jump.point[0]) + " " + link(jump.point[1]);
		case SegmentType.SG_TURTLE:
			let turtle = segment as Turtle;
			return "L " + turtle.x + " " + turtle.y;
		case SegmentType.SG_VERTEX:
			let vertex = segment as Vertex;
			return "L " + link(vertex.point[0]) + " " + link(vertex.point[1]);
		case SegmentType.SG_QBEZIER:
			let quad = segment as Quadratic;
			return "Q " + link(quad.control[0]) + " " + link(quad.control[1]) + ", " + link(quad.end[0]) + " " + link(quad.end[1]);
		case SegmentType.SG_CBEZIER:
			let cubic = segment as Cubic;
			let control1 = link(cubic.control1[0]) + " " + link(cubic.control1[1]) + ", ";
			let control2 = link(cubic.control2[0]) + " " + link(cubic.control2[1]) + ", ";
			let end = link(cubic.end[0]) + " " + link(cubic.end[1]);
			return "C " + control1 + control2 + end;
		case SegmentType.SG_ARC:
			break;
	}
}

export const manipVector = (dispatch, dx: number, dy: number, vector: ValueLink[]) => {
	dispatch(manipulation(dx, vector[0]));
	dispatch(manipulation(dy, vector[1]));
}

export const manipTurtle = (dispatch, dx: number, dy: number, segment: Segment) => {

}