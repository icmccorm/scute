import { ValueLink, LineMeta, getLinkedValue, ValueMeta, manipulation, Manipulation, manipulate, getLinkedDelta } from "src/redux/Manipulation";
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
export type Turtle = Segment & {move: ValueLink, turn: ValueLink, x:number, y:number, horizontal: number};
export type Vertex = Segment & {point: ValueLink[]};
export type Cubic = Segment & {control1: Array<ValueLink>, control2: Array<ValueLink>, end: Array<ValueLink>};
export type Quadratic = Segment & {control: Array<ValueLink>, end: Array<ValueLink>};
export type Arc = Segment & {center: Array<ValueLink>, degrees: ValueLink};

export const generateHandles = (links, dispatch, segmentArray: Array<Segment>) => {
	let handles = [];
	let prevPoint: Array<number> = [0, 0];
	for(let key = 0; key<segmentArray.length; ++key){
		let segment = segmentArray[key];
		const link = (vl:ValueLink) => getLinkedValue(links, vl);
		switch(segment.type){
			case SegmentType.SG_JUMP:
				let jump = segment as Jump;
				handles = handles.concat([<Handle key={key} cx={link(jump.point[0])} cy={link(jump.point[1])} adjust={(dx, dy) => manipTurtle(dispatch, links, 0, 100, segmentArray, key)}/>]);
				prevPoint = [jump.point[0].value, jump.point[1].value];
				break;
			case SegmentType.SG_TURTLE:
				let turtle = segment as Turtle;
				handles = handles.concat([<Handle key={key} cx={turtle.x} cy={turtle.y} adjust={(dx, dy) => manipTurtle(dispatch, links, dx, dy, segmentArray, key)}/>]);
				break;
			case SegmentType.SG_VERTEX:
				let vertex = segment as Vertex;
				handles = handles.concat([<Handle key={key} cx={link(vertex.point[0])} cy={link(vertex.point[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, vertex.point)}/>]);
				prevPoint = [vertex.point[0].value, vertex.point[1].value];
				break;
			case SegmentType.SG_QBEZIER:
				let quad = segment as Quadratic;
				handles = handles.concat([ 
					<Handle key={key} cx={link(quad.control[0])} cy={link(quad.control[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.control)}/>,
					<Handle key={key+1} cx={link(quad.end[0])} cy={link(quad.end[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.end)}/>
				]);
				prevPoint = [quad.end[0].value, quad.end[1].value];
				break;
			case SegmentType.SG_CBEZIER:
				let cubic = segment as Cubic;
				handles = handles.concat([
					<Handle key={key} cx={link(cubic.control1[0])} cy={link(cubic.control1[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control1)}/>,
					<Handle key={segmentArray.length + key + 1} cx={link(cubic.control2[0])} cy={link(cubic.control2[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control2)}/>,
					<Handle key={segmentArray.length + key + 2} cx={link(cubic.end[0])} cy={link(cubic.end[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.end)}/>
				]);
				prevPoint = [cubic.end[0].value, cubic.end[1].value];
				break;
			case SegmentType.SG_ARC:
				let arc = segment as Arc;
				handles = handles.concat([<Handle key={key} cx={link(arc.center[0])} cy={link(arc.center[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, arc.center)}/>])
		}
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


export function generatePolyHandles (links, dispatch, segmentArray: Segment[]) {
	let handles = [];
	const link = (vl:ValueLink) => getLinkedValue(links, vl);
	let prevPoint: Array<number> = [0, 0];
	let angle = 0;
	for(let i = 0; i<segmentArray.length; ++i){
		switch(segmentArray[i].type){
			case SegmentType.SG_JUMP:
			case SegmentType.SG_VERTEX: {
				let segment: Vertex | Jump = segmentArray[i] as (Vertex | Jump);
				handles = handles.concat([<Handle key={i} cx={link(segment.point[0])} cy={link(segment.point[1])} adjust={(dx, dy) => manipTurtle(dispatch, links, dx, dy, segmentArray, i)}/>]);
				prevPoint = [link(segment.point[0]), link(segment.point[1])];
			} break;
			case SegmentType.SG_TURTLE:
				let segment: Turtle = segmentArray[i] as Turtle;
				
				let distance = link(segment.move);
				angle += link(segment.turn);

				let cosine = Math.cos(toRadians(angle));
				let sine = Math.sin(toRadians(angle));
				let dx = Math.round(cosine * distance);
				let dy = Math.round(sine * distance);

				prevPoint = [(prevPoint[0] + dx), (prevPoint[1] + dy)];
				handles = handles.concat([<Handle key={i} cx={prevPoint[0]} cy={prevPoint[1]} adjust={(dx, dy) => manipTurtle(dispatch, links, dx, dy, segmentArray, i)}/>]);
				break;
		}
	}
	return handles;
}

export const generatePoints = (links, segmentArray: Segment[]) => {
	let points = "";
	const link = (vl:ValueLink) => getLinkedValue(links, vl);
	const delta = (vl:ValueLink) => getLinkedDelta(links, vl);

	let prevPoint: Array<number> = [0, 0];
	let angle = 0;
	for(let i = 0; i<segmentArray.length; ++i){
		switch(segmentArray[i].type){
			case SegmentType.SG_JUMP:
			case SegmentType.SG_VERTEX: {
				let segment: Vertex | Jump = segmentArray[i] as (Vertex | Jump);
				points += link(segment.point[0]) + "," + link(segment.point[1]) + " ";
				prevPoint = [link(segment.point[0]), link(segment.point[1])];
			} break;
			case SegmentType.SG_TURTLE: {
				let segment: Turtle = segmentArray[i] as Turtle;
				
				let distance = link(segment.move)
				angle += link(segment.turn)

				let cosine = Math.cos(toRadians(angle));
				let sine = Math.sin(toRadians(angle));
				let dx = (cosine * distance);
				let dy = (sine * distance);

				points += (prevPoint[0] + dx) + "," + (prevPoint[1] + dy) + " ";	
				prevPoint = [(prevPoint[0] + dx), (prevPoint[1] + dy)];
			} break;
		}
	}
	return points;
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
	dispatch(manipulate([manipulation(dx, vector[0]), manipulation(dy, vector[1])]));
}


//TODO: Add method for finding angle relative to the horizontal. Compile time?
export const manipTurtle = (dispatch, links, dx: number, dy: number, segments: Segment[], index: number,) => {
	let currentSegment = segments[index];
	let previousSegment = segments[index-1];
	let nextSegment = segments[index + 1];

	const link = (vl:ValueLink) => getLinkedValue(links, vl);
	const delta = (vl: ValueLink) => getLinkedDelta(links, vl);

	let manipulations: Array<Manipulation> = [];

	if(currentSegment.type == SegmentType.SG_TURTLE){
		let turtle = currentSegment as Turtle;

		let move = link(turtle.move);
		let turn = link(turtle.turn);

		let xNought = Math.cos(turn) * move;
		let yNought = Math.sin(turn) * move; 

		let xNoughtManip = xNought + dx;
		let yNoughtManip = xNought + dy;

		let moveManip = distance(xNought, yNought, xNoughtManip, yNoughtManip);
		let angleManip = Math.acos(xNoughtManip/moveManip);

		manipulations.push((manipulation(moveManip - move, turtle.move)));
		manipulations.push((manipulation(angleManip - turn, turtle.turn)));

		if(nextSegment && nextSegment.type == SegmentType.SG_TURTLE){
			let turtle = nextSegment as Turtle;

			let move = link(turtle.move);
			let turn = link(turtle.turn);

			let xEnd = (Math.cos(turn)*move);
			let yEnd = (Math.sin(turn)*move);

			moveManip = (distance(dx, dy, xEnd, yEnd));
			angleManip = (Math.acos((xEnd - dx)/moveManip));

			manipulations.push(manipulation(moveManip - move, turtle.move));
			manipulations.push(manipulation(angleManip - turn, turtle.turn));
		}

	}else{			
		let handle: Jump = currentSegment as Jump;
		manipulations.push(manipulation(dx, handle.point[0]));
		manipulations.push(manipulation(dy, handle.point[1]));
	
		if(currentSegment.type == SegmentType.SG_VERTEX || currentSegment.type == SegmentType.SG_JUMP){

			if(nextSegment && nextSegment.type == SegmentType.SG_TURTLE){
				let turtle: Turtle = nextSegment as Turtle;
				
				let move = link(turtle.move);
				let turn = link(turtle.turn);

				let originTurn = turtle.turn ? turtle.turn.value : 0;
				let originMove = turtle.move ? turtle.move.value : 0;
				
				let xNought = Math.cos(toRadians(originTurn))*originMove;
		 		let yNought = Math.sin(toRadians(originTurn))*originMove;

				let opposite = yNought - (dy + delta(handle.point[1]));
				let adjacent = xNought - (dx + delta(handle.point[0]));

				let angleOffset = (adjacent > 0) ? 0 : 180;

				let moveManip = distance(dx + delta(handle.point[0]), dy + delta(handle.point[1]), xNought, yNought);

				let angleManip = (adjacent != 0 ? angleOffset + toDegrees(Math.atan(opposite / adjacent)) : 90 * Math.sin(opposite));

				if(turtle.move) manipulations.push(manipulation(moveManip - move, turtle.move));
				if(turtle.turn) manipulations.push(manipulation(angleManip - turn, turtle.turn));

				if(segments[index + 2] && segments[index + 2].type == SegmentType.SG_TURTLE){
					let nextTurtle: Turtle = segments[index + 2] as Turtle;
					if(nextTurtle.turn){
						if(turtle.turn) manipulations.push(manipulation(-(angleManip - turn), nextTurtle.turn));
					}
				}
			}
		}
		dispatch(manipulate(manipulations));
	}
}

function distance(x1, y1, x2, y2){
	let xDiff = x2 - x1;
	let yDiff = y2 - y1;
	return (Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)));
}

function toRadians(deg: number){
	return (deg * (Math.PI / 180));
}

function toDegrees(rad: number){
	return (rad * (180 / Math.PI));
}