import { ValueLink, getLinkedValue, manipulation, Manipulation, manipulate, vecManipulation } from "src/redux/Manipulation";
import * as React from "react";
import Handle from "./Handle";

export enum SegmentType {
	SG_JUMP = 0,
	SG_TURTLE,
	SG_VERTEX,
	SG_CBEZIER,
	SG_QBEZIER,
	SG_ARC,
	SG_MIRR,
}

export enum AxisType {
	X = 30,
	Y,
	XY
}

export type Segment = {type: SegmentType}
export type Jump = Segment & {point: ValueLink[]};
export type Turtle = Segment & {move: ValueLink, turn: ValueLink, x:number, y:number, horizontal: number};
export type Vertex = Segment & {point: ValueLink[]};
export type Cubic = Segment & {control1: Array<ValueLink>, control2: Array<ValueLink>, end: Array<ValueLink>};
export type Quadratic = Segment & {control: Array<ValueLink>, end: Array<ValueLink>};
export type Arc = Segment & {center: Array<ValueLink>, degrees: ValueLink, radius:Array<ValueLink>};
export type Mirror = Segment & {axis: AxisType, origin: Array<ValueLink>, index: number};
export type MirrorTag = {index: number, prevPoint: Array<number>};
export type BoundingBox = {position:Array<number>, bounds: Array<number>, centroid};
export type PolyPathDefinition = {defn: string, handles: Array<JSX.Element>};

function peek(array:Array<any>, offset?:number) {
	if(offset && offset <= 0){
		return array[array.length + offset];
	}else{
		return array[array.length - 1];
	}
}

export const generatePath = (links, dispatch, segmentArray: Array<Segment>):PolyPathDefinition => {
	let handles = [];
	let defn = "";
	let prevPoint: Array<number> = [0, 0];
	let angle = 0;

	let mirrorStack:Array<MirrorTag> = []

	if(segmentArray.length == 0 || segmentArray[0].type != SegmentType.SG_JUMP){
		defn += "M 0 0"
	}

	for(let key = 0; key<segmentArray.length; ++key){ 
		let segment = segmentArray[key];
		const link = (vl:ValueLink) => getLinkedValue(links, vl);
		const linkVec = (vlv:Array<ValueLink>) => [link(vlv[0]), link(vlv[1])];

		switch(segment.type){
			case SegmentType.SG_JUMP: {
				let jump = segment as Jump;
				let jPoint = linkVec(jump.point);
	
				if(peek(mirrorStack)){
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr:Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					jPoint = mirrorCoordinate(mirr.axis, mirrorPoint, jPoint);
				}else{
					handles.push(
						<Handle 
							key={key} 
							cx={jPoint[0]} 
							cy={jPoint[1]} 
							adjust={(dx, dy) => 
								manipVector(dispatch, dx, dy, jump.point
						)}/>
					);
				}

				prevPoint = jPoint;
				defn += "M " + prevPoint[0] + " " + prevPoint[1];
				} break;
			
			case SegmentType.SG_TURTLE: {
				let turtle = segment as Turtle;
				
				let distance = link(turtle.move);

				let cosine = Math.cos(toRadians(angle));
				let sine = Math.sin(toRadians(angle));

				let diff = [Math.round(cosine * distance), Math.round(sine * distance)];

				let topMirror = peek(mirrorStack);
				if(topMirror){
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr:Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					diff = mirrorCoordinate(mirr.axis, mirrorPoint, diff);
				}

				prevPoint = [prevPoint[0] + diff[0], prevPoint[1] + diff[1]];
				defn += "L " + prevPoint[0] + " " + prevPoint[1];
				
				if(!topMirror) handles.push(
					<Handle 
						key={key} 
						cx={prevPoint[0]} 
						cy={prevPoint[1]} 
						adjust={(dx, dy) => {
							manipTurtle(dispatch, links, dx, dy, turtle)
					}}/>
				);
				
				if(segmentArray[key + 1] && segmentArray[key + 1].type != SegmentType.SG_TURTLE) angle = 0;
				} break;

			case SegmentType.SG_VERTEX: {
				let vertex = segment as Vertex;
				let vPoint = linkVec(vertex.point);

				if(peek(mirrorStack)){
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr:Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					vPoint = mirrorCoordinate(mirr.axis, mirrorPoint, vPoint);
				}else{
					handles.push(
						<Handle 
							key={key} 
							cx={vPoint[0]} 
							cy={vPoint[1]} 
							adjust={(dx, dy) => 
								manipVector(dispatch, dx, dy, vertex.point
						)}/>
					);
				}
				prevPoint = vPoint;
				defn += "L " + prevPoint[0] + " " + prevPoint[1];
				} break;

			case SegmentType.SG_QBEZIER: {
				let quad = segment as Quadratic;

				let control = linkVec(quad.control);
				let end = linkVec(quad.end);

				let topMirror = peek(mirrorStack);
				if(topMirror){
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr:Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					control = mirrorCoordinate(mirr.axis, mirrorPoint, control);
					end = mirrorCoordinate(mirr.axis, mirrorPoint, end);
				}

				if(!topMirror) handles = handles.concat([ 
					<Handle 
						key={key} 
						cx={control[0]} 
						cy={control[1]} 
						ex={prevPoint[0]} 
						ey={prevPoint[1]} 
						sx={end[0]}  
						sy={end[1]}  
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.control)}
					/>,
					
					<Handle key={segmentArray.length + key}
						cx={end[0]}  
						cy={end[1]}  
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, quad.end)}
					/>
				]);
				defn += "Q " + control[0] + " " + control[1] + ", " + end[0] + " " + end[1];
				prevPoint = end;
				} break;

			case SegmentType.SG_CBEZIER: {
				let cubic = segment as Cubic;

				let control1 = linkVec(cubic.control1);
				let control2 = linkVec(cubic.control2);
				let end = linkVec(cubic.end);

				let topMirror = peek(mirrorStack);
				if(topMirror){
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr:Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					control1 = mirrorCoordinate(mirr.axis, mirrorPoint, control1);
					control2 = mirrorCoordinate(mirr.axis, mirrorPoint, control2);
					end = mirrorCoordinate(mirr.axis, mirrorPoint, end);
				}

				if(!topMirror) handles = handles.concat([
					<Handle key={key} 
						cx={control1[0]} 
						cy={control1[1]} 
						ex={prevPoint[0]} 
						ey={prevPoint[1]} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control1)}
					/>,
					
					<Handle 
						key={segmentArray.length + key} 
						cx={control2[0]} 
						cy={control2[1]} 
						ex={end[0]} 
						ey={end[1]} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.control2)}
					/>,
					
					<Handle 
						key={segmentArray.length + 2*key} 
						cx={end[0]}  
						cy={end[1]}  
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, cubic.end)}
					/>				
				]);
				let control1Str = control1[0] + " " + control1[1] + ", ";
				let control2Str = control2[0] + " " + control2[1] + ", ";
				let endStr = end[0] + " " + end[1] + ", ";
				defn += "C " + control1Str + control2Str + endStr;

				prevPoint = end;
				}	break;
			case SegmentType.SG_ARC: {
				let arc = segment as Arc;
				let center  = linkVec(arc.center);
				let radius = distance(prevPoint, center);
				let deg = link(arc.degrees);
				let sweepFlag = (deg) > 0;
				let largeArcFlag = Math.abs(deg) > 180;

				let topMirror = peek(mirrorStack);
				if(topMirror){
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr:Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					center = mirrorCoordinate(mirr.axis, mirrorPoint, center);
					deg = -deg;
					sweepFlag = false;
				}

				deg = Math.sign(deg) * (Math.abs(deg) % 360);
				let endpoint = arcEndpoint(radius, deg, prevPoint, center);

				defn += "A " 
					+ radius 
					+ " " 
					+ radius 
					+ " " 
					+ 0 
					+ " "
					+ (largeArcFlag ? 1 : 0)
					+ " " 
					+ (sweepFlag? 1 : 0) 
					+ " " 
					+ endpoint[0] 
					+ " " 
					+ endpoint[1] 
					+ " ";

				if(!topMirror) handles = handles.concat([
					<Handle key={key} 
						cx={center[0]} 
						cy={center[1]} 
						ex={prevPoint[0]} 
						ey={prevPoint[1]} 
						sx={endpoint[0]}  
						sy={endpoint[1]} 
						adjust={(dx, dy) => manipVector(dispatch, dx, dy, arc.center)}
					/>,
					<Handle key={segmentArray.length + key} 
						cx={endpoint[0]} 
						cy={endpoint[1]} 
						adjust={(dx, dy) => {
							let isNegative = deg < 0;
							endpoint = [endpoint[0] + dx, endpoint[1] + dy];
							let isNasty = isInNastyQuadrant(originalPrevPoint, deg, center, endpoint);

							let tanDegreesEnd = toDegrees(Math.atan((endpoint[1] - center[1])/(endpoint[0] - center[0])));

							let tanDegreesStart = toDegrees(Math.atan((originalPrevPoint[1] - center[1])/(originalPrevPoint[0] - center[0])));

							let newDegrees = (tanDegreesEnd - tanDegreesStart);

							if(isNasty){
								newDegrees += 180;
							}

							if(newDegrees < 0 && deg > 0) newDegrees = 360 + newDegrees;
							if(newDegrees > 0 && deg < 0) newDegrees = -360 + newDegrees;

							manip(dispatch, newDegrees - link(arc.degrees), arc.degrees);
						}}
					/>
				]);
				let originalPrevPoint = prevPoint;
				prevPoint = endpoint;
				} break;
			case SegmentType.SG_MIRR:{
				let top:MirrorTag = peek(mirrorStack);
				if(top && top.index != key){					
					mirrorStack.push({index: key, prevPoint: prevPoint});
					prevPoint = top.prevPoint;
				}else if(top){
					mirrorStack.pop();	
				}else{
					mirrorStack.push({index: key, prevPoint: prevPoint});
					prevPoint = [0, 0];
					key = -1;
				}
				}break;
		}
		defn += " ";
	}

	return {defn, handles};
}


export function isInNastyQuadrant(startOfArc, signOfDegrees, center, endPoint){
	//is in left quadrant
	if(startOfArc[0] < center[0]){
		return endPoint[0] > center[0];	
		
	//is in right quadrant
	}else{
		return endPoint[0] < center[0];
	}
}


export function wraparound(low, high, val){
	if(val < low){
		return high + (val % low);
	}else if (val > high){
		return low + (val % high);
	}
	return val;
}

export function distance(pt1: Array<number>, pt2: Array<number>): number{
	return Math.sqrt(Math.pow((pt2[0] - pt1[0]), 2) + Math.pow((pt2[1] - pt1[1]), 2));
}

export function generatePoly(links, dispatch, segmentArray: Segment[]):PolyPathDefinition {
	const link = (vl:ValueLink) => getLinkedValue(links, vl);

	let prevPoint: Array<number> = [0, 0];
	let handles = [];
	let defn = "";
	let angle = 0;
	let mirrorStack:Array<MirrorTag> = []

	for(let key = 0; key<segmentArray.length; ++key){
		switch(segmentArray[key].type){
			case SegmentType.SG_JUMP:
			case SegmentType.SG_VERTEX: {
				let segment: Vertex | Jump = segmentArray[key] as (Vertex | Jump);

				defn += link(segment.point[0]) + "," + link(segment.point[1]) + " ";
				handles = handles.concat([<Handle key={key} cx={link(segment.point[0])} cy={link(segment.point[1])} adjust={(dx, dy) => manipVector(dispatch, dx, dy, segment.point)}/>]);
				
				prevPoint = [link(segment.point[0]), link(segment.point[1])];
			} break;
			case SegmentType.SG_TURTLE: {
				let segment: Turtle = segmentArray[key] as Turtle;
				
				let distance = link(segment.move);
				angle += link(segment.turn);

				let cosine = Math.cos(toRadians(angle));
				let sine = Math.sin(toRadians(angle));
				let dx = Math.round(cosine * distance);
				let dy = Math.round(sine * distance);

				prevPoint = [(prevPoint[0] + dx), (prevPoint[1] + dy)];
				handles = handles.concat([<Handle key={key} cx={prevPoint[0]} cy={prevPoint[1]} adjust={(dx, dy) => manipTurtle(dispatch, links, dx, dy, segment)}/>]);
				defn += prevPoint[0] + "," + prevPoint[1] + " ";	
				} break;
			case SegmentType.SG_MIRR:{
				let top:MirrorTag = peek(mirrorStack);
				if(top && top.index != key){					
					mirrorStack.push({index: key, prevPoint: prevPoint});
					prevPoint = top.prevPoint;
				}else if(top){
					mirrorStack.pop();	
				}else{
					mirrorStack.push({index: key, prevPoint: prevPoint});
					prevPoint = [0, 0];
					key = -1;
				}
				} break;
		}
	}
	return {defn, handles};
}

export const manipVector = (dispatch, dx: number, dy: number, vector: ValueLink[]) => {	
	dispatch(manipulate(vecManipulation(dx, dy, vector)));
}
export const manip = (dispatch, diff: number, link: ValueLink) => {	
	dispatch(manipulate(manipulation(diff, link)));
}

export const manipTurtle = (dispatch, links, dx: number, dy: number, turtleSegment: Segment) => {
	const link = (vl:ValueLink) => getLinkedValue(links, vl);

	let manipulations: Array<Manipulation> = [];

	let turtle = turtleSegment as Turtle;

	let move = link(turtle.move);
	let turn = link(turtle.turn);

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

function toRadians(deg: number): number{
	return (deg * (Math.PI / 180));
}

function toDegrees(rad: number): number{
	return (rad * (180 / Math.PI));
}

function arcEndpoint(rad:number, deg:number, start: Array<number>, center:Array<number>): number[]{
	let sin = Math.sin;
	let cos = Math.cos;

	let bCosine = (start[0] - center[0])/rad;
	let bSine = (start[1] - center[1])/rad;
	let aCosine = cos(toRadians(deg));
	let aSine = sin(toRadians(deg));

	//cos(B-A)
	let dx = rad*(aCosine*bCosine - aSine*bSine);

	//sin(B-A)
	let dy = rad*(bSine*aCosine + bCosine*aSine);

	return [center[0] + dx, center[1] + dy];
}


export function arcDegrees(rad:number, start: Array<number>, center:Array<number>, endPoint: Array<number>){
	let dx = (endPoint[0] - center[0])/rad;
	let dy = (endPoint[1] - center[1])/rad;

	let bCosine = (start[0] - center[0])/rad;
	let bSine = (start[1] - center[1])/rad;
	let angleB = toDegrees(Math.atan(bSine/bCosine));
	
	let angleDiff = toDegrees(Math.atan(dy/dx));
	let angleA = angleB - angleDiff;
	return angleA;
}

function mirrorCoordinate(mirrorAxis: AxisType, mirrorPoint: Array<number>, point: Array<number>): Array<number>{
	switch(mirrorAxis){
		case AxisType.X:
			return [
				mirrorValue(mirrorPoint[0], point[0]),
				point[1]
			];		
		case AxisType.Y:
			return [
				point[0],
				mirrorValue(mirrorPoint[1], point[1])
			];		
		case AxisType.XY:
			return [
				mirrorValue(mirrorPoint[0], point[0]),
				mirrorValue(mirrorPoint[1], point[1])
			];
		default:
			throw Error("Invalid mirroring axis!");
	}

}

function mirrorValue(mirrorValue: number, value: number): number{	
	let distanceFromAxis = value - mirrorValue;
	return mirrorValue - distanceFromAxis;
}
