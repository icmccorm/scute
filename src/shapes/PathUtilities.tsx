import { ValueLink, LineMeta, getLinkedValue, ValueMeta, manipulation, Manipulation, manipulate, getLinkedDelta, vecManipulation } from "src/redux/Manipulation";
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
export type Arc = Segment & {center: Array<ValueLink>, degrees: Array<ValueLink>, radius:Array<ValueLink>};
export type BoundingBox = {position:Array<number>, bounds: Array<number>, centroid};

export type PolyPathDefinition = {defn: string, handles: Array<JSX.Element>};

export const generatePath = (links, dispatch, segmentArray: Array<Segment>):PolyPathDefinition => {
	let handles = [];
	let defn = "";
	let prevPoint: Array<number> = [0, 0];
	let angle = 0;

	let maxX = null;
	let minX = null;
	let maxY = null;
	let minY = null;

	if(segmentArray.length == 0 || segmentArray[0].type != SegmentType.SG_JUMP){
		defn += "M 0 0"
	}

	for(let key = 0; key<segmentArray.length; ++key){ 
		let segment = segmentArray[key];
		const link = (vl:ValueLink) => getLinkedValue(links, vl);
		switch(segment.type){
			case SegmentType.SG_JUMP:
				let jump = segment as Jump;

				handles.push(
					<Handle 
						key={key} 
						cx={link(jump.point[0])} 
						cy={link(jump.point[1])} 
						adjust={(dx, dy) => 
							manipVector(dispatch, dx, dy, jump.point
					)}/>
				);
				
				prevPoint = [link(jump.point[0]), link(jump.point[1])];
				defn += "M " + prevPoint[0] + " " + prevPoint[1];
				break;
			
			case SegmentType.SG_TURTLE:
				let turtle = segment as Turtle;
				
				let distance = link(turtle.move);
				angle += link(turtle.turn);

				let cosine = Math.cos(toRadians(angle));
				let sine = Math.sin(toRadians(angle));
				let dx = Math.round(cosine * distance);
				let dy = Math.round(sine * distance);

				prevPoint = [prevPoint[0] + dx, prevPoint[1] + dy];
				defn += "L " + prevPoint[0] + " " + prevPoint[1];
				
				handles.push(
					<Handle 
						key={key} 
						cx={prevPoint[0]} 
						cy={prevPoint[1]} 
						adjust={(dx, dy) => {
							manipTurtle(dispatch, links, dx, dy, turtle)
					}}/>
				);
				
				if(segmentArray[key + 1] && segmentArray[key + 1].type != SegmentType.SG_TURTLE) angle = 0;
				break;

			case SegmentType.SG_VERTEX:
				let vertex = segment as Vertex;
				handles.push(
					<Handle 
						key={key} 
						cx={link(vertex.point[0])} 
						cy={link(vertex.point[1])} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, vertex.point)}
					/>
				);
				prevPoint = [link(vertex.point[0]), link(vertex.point[1])];

				defn += "L " + prevPoint[0] + " " + prevPoint[1];
				break;

			case SegmentType.SG_QBEZIER:
				let quad = segment as Quadratic;
				handles = handles.concat([ 
					<Handle 
						key={key} 
						cx={link(quad.control[0])} 
						cy={link(quad.control[1])} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.control)}
					/>,
					
					<Handle key={key+1}
						cx={link(quad.end[0])}
						cy={link(quad.end[1])} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.end)}
					/>
				]);
				defn += "Q " + link(quad.control[0]) + " " + link(quad.control[1]) + ", " + link(quad.end[0]) + " " + link(quad.end[1]);
				prevPoint = [link(quad.end[0]), link(quad.end[1])];
				break;

			case SegmentType.SG_CBEZIER: {
				let cubic = segment as Cubic;
				handles = handles.concat([
					<Handle key={key} 
						cx={link(cubic.control1[0])} 
						cy={link(cubic.control1[1])} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control1)}
					/>,
					
					<Handle 
						key={segmentArray.length + key + 1} 
						cx={link(cubic.control2[0])} 
						cy={link(cubic.control2[1])} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control2)}
					/>,
					
					<Handle 
						key={segmentArray.length + key + 2} 
						cx={link(cubic.end[0])} 
						cy={link(cubic.end[1])} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.end)}
					/>				
				]);
				let control1 = link(cubic.control1[0]) + " " + link(cubic.control1[1]) + ", ";
				let control2 = link(cubic.control2[0]) + " " + link(cubic.control2[1]) + ", ";
				let end = link(cubic.end[0]) + " " + link(cubic.end[1]);
				defn += "C " + control1 + control2 + end;

				prevPoint = [link(cubic.end[0]), link(cubic.end[1])];

				}	break;
			case SegmentType.SG_ARC: {
				let arc = segment as Arc;
	
				let rx = link(arc.radius[0]);
				let ry = link(arc.radius[1]);
			
				let cx = link(arc.center[0]);
				let cy = link(arc.center[1]);
				
				let degX = link(arc.degrees[0]);
				let degArc = link(arc.degrees[1]);

				let endpoint = arcEndpoint(rx, ry, degX, degArc, cx, cy);

				defn += "A " + rx + " " + ry + " " + degX + " " + 1 + " " + 1 + " " + endpoint[0] + " " + endpoint[1] + " ";

				handles = handles.concat([<Handle key={key} cx={link(arc.center[0])} cy={link(arc.center[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, arc.center)}/>])
				prevPoint = endpoint;

			} break;
		}
		defn += " ";
	}

	return {defn, handles};
}

export function generatePoly(links, dispatch, segmentArray: Segment[]):PolyPathDefinition {
	const link = (vl:ValueLink) => getLinkedValue(links, vl);
	let prevPoint: Array<number> = [0, 0];

	let handles = [];
	let defn = "";
	let maxX = null;
	let minX = null;
	let maxY = null;
	let minY = null;

	let angle = 0;
	for(let i = 0; i<segmentArray.length; ++i){
		switch(segmentArray[i].type){
			case SegmentType.SG_JUMP:
			case SegmentType.SG_VERTEX: {
				let segment: Vertex | Jump = segmentArray[i] as (Vertex | Jump);

				defn += link(segment.point[0]) + "," + link(segment.point[1]) + " ";
				handles = handles.concat([<Handle key={i} cx={link(segment.point[0])} cy={link(segment.point[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, segment.point)}/>]);
				
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
				handles = handles.concat([<Handle key={i} cx={prevPoint[0]} cy={prevPoint[1]} adjust={(dx, dy) => manipTurtle(dispatch, links, dx, dy, segment)}/>]);
				defn += prevPoint[0] + "," + prevPoint[1] + " ";	
				break;
		}
	}

	return {defn, handles};
}

export const manipVector = (dispatch, dx: number, dy: number, vector: ValueLink[]) => {	
	dispatch(manipulate(vecManipulation(dx, dy, vector)));
}

export const manipTurtle = (dispatch, links, dx: number, dy: number, turtleSegment: Segment) => {
	const link = (vl:ValueLink) => getLinkedValue(links, vl);

	let manipulations: Array<Manipulation> = [];

	let turtle = turtleSegment as Turtle;

	let move = link(turtle.move);
	let turn = link(turtle.turn) + turtle.horizontal;

	let xNought = Math.cos(toRadians(turn)) * move;
	let yNought = Math.sin(toRadians(turn)) * move; 

	let xNoughtManip = xNought + dx;
	let yNoughtManip = yNought + dy;
	
	let manipDistance = Math.sqrt(Math.pow(xNoughtManip, 2) + Math.pow(yNoughtManip, 2));
	let angleManip = toDegrees(Math.atan((yNoughtManip)/(xNoughtManip)));
	
	if(xNoughtManip < 0){
		if(yNoughtManip > 0){
			angleManip = 180 + angleManip;
		}else{
			angleManip = -180 + angleManip;
		}
	} 
	manipulations.push((manipulation(manipDistance - move, turtle.move)));
	manipulations.push((manipulation(angleManip - turn, turtle.turn)));
	dispatch(manipulate(manipulations));
}

function toRadians(deg: number){
	return (deg * (Math.PI / 180));
}

function toDegrees(rad: number){
	return (rad * (180 / Math.PI));
}

function arcEndpoint(rx, ry, degX, degArc, cx, cy):number[]{
	let end = [];
	let xCosine = Math.cos(toRadians(degX));
	let xSine = Math.sin(toRadians(degX));

	let arcCosine = Math.cos(toRadians(degArc));
	let arcSine = Math.sin(toRadians(degArc));

	let centerOffsetX = xCosine * (rx * arcCosine) - xSine * (ry * arcSine);
	let centerOffsetY = xSine * (rx * arcCosine) + xCosine * (ry * arcSine);

	return [centerOffsetX + cx, centerOffsetY + cy];
}