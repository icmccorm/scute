import { ValueLink, getLinkedValue, manipulation, Manipulation, manipulate, vecManipulation, LineMeta } from "src/redux/Manipulation";
import {Segments, Axes} from 'src/lang-c/library-interop';
import { Dispatch } from "redux";

export type Segment = { type: number }
export type Jump = Segment & { point: ValueLink[] };
export type Vertex = Segment & { point: ValueLink[] };
export type Pointable = Jump | Vertex;

export type Turtle = Segment & { move: ValueLink, turn: ValueLink, x: number, y: number, horizontal: number };
export type Cubic = Segment & { control1: Array<ValueLink>, control2: Array<ValueLink>, end: Array<ValueLink> };
export type Quadratic = Segment & { control: Array<ValueLink>, end: Array<ValueLink> };
export type Arc = Segment & { center: Array<ValueLink>, degrees: ValueLink, radius: Array<ValueLink> };
export type Mirror = Segment & { axis: number, origin: Array<ValueLink>, index: number };
export type MirrorTag = { index: number, prevPoint: Array<number> };
export type BoundingBox = { position: Array<number>, bounds: Array<number>, centroid };
export type SegmentsRendered = { defn: string, renders: Array<RenderedSegment> };
export type RenderedSegment = {point: Array<number>, thunk: RenderThunk, segment?: Segment};
export type RenderThunk = (dispatch:Dispatch, dx: number, dy: number, turtleSegment: Segment, links?:Array<LineMeta>) => void;

function peek(array: Array<any>, offset?: number) {
	if (offset && offset <= 0) {
		return array[array.length + offset];
	} else {
		return array[array.length - 1];
	}
}

export const generatePoly = (links:Array<LineMeta>, segmentArray: Array<Segment>): SegmentsRendered => {
	return renderSegments(links, segmentArray, true);
}

export const generatePath = (links:Array<LineMeta>, segmentArray: Array<Segment>): SegmentsRendered => {
	return renderSegments(links, segmentArray, false);
}

const renderSegments = (links, segmentArray: Array<Segment>, isPoly): SegmentsRendered => {
	let defn = "";
	let renders:Array<RenderedSegment> = [];

	let prevPoint: Array<number> = [0, 0];
	let angle = 0;

	let mirrorStack: Array<MirrorTag> = []


	if (!isPoly || segmentArray.length == 0 || segmentArray[0].type != Segments.JUMP) {
		defn += "M 0 0"
	}

	for (let key = 0; key < segmentArray.length; ++key) {
		let segment = segmentArray[key];
		const link = (vl: ValueLink) => getLinkedValue(links, vl);
		const linkVec = (vlv: Array<ValueLink>) => [link(vlv[0]), link(vlv[1])];

		switch (segment.type) {
			case Segments.JUMP: {
				let jump = segment as Jump;
				let jPoint = linkVec(jump.point);

				if (peek(mirrorStack)) {
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr: Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					jPoint = mirrorCoordinate(mirr.axis, mirrorPoint, jPoint);
				}

				prevPoint = jPoint;
				if (isPoly) {
					defn += prevPoint[0] + "," + prevPoint[1];
				} else {
					defn += "M " + prevPoint[0] + " " + prevPoint[1];
				}
			} break;

			case Segments.TURTLE: {
				let segment: Turtle = segmentArray[key] as Turtle;
				segment.horizontal = angle;

				let distance = link(segment.move);
				angle += link(segment.turn);
				angle = wraparound(-360, 360, angle);

				let cosine = Math.cos(toRadians(angle));
				let sine = Math.sin(toRadians(angle));
				let diff = [Math.round(cosine * distance), Math.round(sine * distance)];

				let topMirror = peek(mirrorStack);
				if (topMirror) {
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr: Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					diff = mirrorCoordinate(mirr.axis, mirrorPoint, diff);
				}

				prevPoint = [prevPoint[0] + diff[0], prevPoint[1] + diff[1]];
				if (isPoly) {
					defn += prevPoint[0] + "," + prevPoint[1];
				} else {
					defn += "L " + prevPoint[0] + " " + prevPoint[1];
				}
				if (!topMirror) renders.push({point: prevPoint, thunk: manipTurtle});

				if (segmentArray[key + 1] && segmentArray[key + 1].type != Segments.TURTLE) angle = 0;
			} break;

			case Segments.VERTEX: {
				let vertex = segment as Vertex;
				let vPoint = linkVec(vertex.point);

				if (peek(mirrorStack)) {
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr: Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					vPoint = mirrorCoordinate(mirr.axis, mirrorPoint, vPoint);
				}

				prevPoint = vPoint;

				if (isPoly) {
					defn += prevPoint[0] + "," + prevPoint[1];
				} else {
					defn += "L " + prevPoint[0] + " " + prevPoint[1];
				}
			} break;

			case Segments.QBEZIER: {
				let quad = segment as Quadratic;

				let control = linkVec(quad.control);
				let end = linkVec(quad.end);

				let topMirror = peek(mirrorStack);
				if (topMirror) {
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr: Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					control = mirrorCoordinate(mirr.axis, mirrorPoint, control);
					end = mirrorCoordinate(mirr.axis, mirrorPoint, end);
				}

				defn += "Q " + control[0] + " " + control[1] + ", " + end[0] + " " + end[1];
				prevPoint = end;
			} break;

			case Segments.CBEZIER: {
				let cubic = segment as Cubic;

				let control1 = linkVec(cubic.control1);
				let control2 = linkVec(cubic.control2);
				let end = linkVec(cubic.end);

				let topMirror = peek(mirrorStack);
				if (topMirror) {
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr: Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					control1 = mirrorCoordinate(mirr.axis, mirrorPoint, control1);
					control2 = mirrorCoordinate(mirr.axis, mirrorPoint, control2);
					end = mirrorCoordinate(mirr.axis, mirrorPoint, end);
				}

				let control1Str = control1[0] + " " + control1[1] + ", ";
				let control2Str = control2[0] + " " + control2[1] + ", ";
				let endStr = end[0] + " " + end[1] + ", ";
				defn += "C " + control1Str + control2Str + endStr;

				prevPoint = end;
			} break;
			case Segments.ARC: {
				let arcSegment = segment as Arc;
				let center = linkVec(arcSegment.center);
				let radius = distance(prevPoint, center);
				let deg = link(arcSegment.degrees);
				let sweepFlag = (deg) > 0;
				let largeArcFlag = Math.abs(deg) > 180;

				let topMirror = peek(mirrorStack);
				if (topMirror) {
					let tag = peek(mirrorStack) as MirrorTag;
					let mirr: Mirror = segmentArray[tag.index] as Mirror;
					let mirrorPoint = linkVec(mirr.origin);
					center = mirrorCoordinate(mirr.axis, mirrorPoint, center);
					radius = distance(prevPoint, center);
					deg = -deg;
					sweepFlag = false;
				}

				deg = Math.sign(deg) * (Math.abs(deg) % 360);
				let endpoint = arcEndpoint(radius, deg, prevPoint, center);

				defn += arc(radius, radius, false, largeArcFlag, sweepFlag, endpoint);

				defn += "A "
					+ radius
					+ " "
					+ radius
					+ " "
					+ 0
					+ " "
					+ (largeArcFlag ? 1 : 0)
					+ " "
					+ (sweepFlag ? 1 : 0)
					+ " "
					+ endpoint[0]
					+ " "
					+ endpoint[1]
					+ " ";


				let originalPrevPoint = prevPoint;

				const manipulateArc = (dispatch, dx, dy, segment:Segment, links: Array<LineMeta>) => {
					endpoint = [endpoint[0] + dx, endpoint[1] + dy];
					let isNasty = isInNastyQuadrant(originalPrevPoint, center, endpoint);

					let tanDegreesEnd = toDegrees(Math.atan((endpoint[1] - center[1]) / (endpoint[0] - center[0])));

					let tanDegreesStart = toDegrees(Math.atan((originalPrevPoint[1] - center[1]) / (originalPrevPoint[0] - center[0])));

					let newDegrees = (tanDegreesEnd - tanDegreesStart);

					if (isNasty) {
						newDegrees += 180;
					}

					if (newDegrees < 0 && deg > 0) newDegrees = 360 + newDegrees;
					if (newDegrees > 0 && deg < 0) newDegrees = -360 + newDegrees;

					manip(dispatch, newDegrees - link(arcSegment.degrees), arcSegment.degrees);
				}
				
				if (!topMirror) renders.push({point: endpoint, thunk: manipulateArc});

				prevPoint = endpoint;
			} break;
			case Segments.MIRR: {
				let top: MirrorTag = peek(mirrorStack);
				if (top && top.index != key) {
					mirrorStack.push({ index: key, prevPoint: prevPoint });
					prevPoint = top.prevPoint;
				} else if (top) {
					mirrorStack.pop();
				} else {
					mirrorStack.push({ index: key, prevPoint: prevPoint });
					prevPoint = [0, 0];
					key = -1;
				}
				if (!isPoly) defn += "Z";
			} break;
		}
		defn += " ";
	}
	if (!isPoly) defn += "Z";
	return { defn, renders };
}


export function isInNastyQuadrant(startOfArc, center, endPoint) {
	//is in left quadrant
	if (startOfArc[0] < center[0]) {
		return endPoint[0] > center[0];

		//is in right quadrant
	} else {
		return endPoint[0] < center[0];
	}
}

export function wraparound(low, high, val) {
	if (val < low) {
		return high + (val % low);
	} else if (val > high) {
		return low + (val % high);
	}
	return val;
}

export function distance(pt1: Array<number>, pt2: Array<number>): number {
	return Math.sqrt(Math.pow((pt2[0] - pt1[0]), 2) + Math.pow((pt2[1] - pt1[1]), 2));
}

export function interpolate(pt1: Array<number>, pt2: Array<number>, frac: number) {
	return [pt1[0] + (pt2[0] - pt1[0]) * frac, pt1[1] + (pt2[1] - pt1[1]) * frac]
}

export function midpoint(pt1: Array<number>, pt2: Array<number>, frac: number) {
	return interpolate(pt1, pt2, 1 / 2);
}

export function quadpoints(pt1: Array<number>, pt2: Array<number>) {
	return [interpolate(pt1, pt2, 1 / 4), interpolate(pt1, pt2, 3 / 4)];
}

function line(point: Array<number>) {
	return "L"
		+ point[0]
		+ " "
		+ point[1]
		+ " ";
}

function move(point: Array<number>) {
	return "M"
		+ point[0]
		+ " "
		+ point[1]
		+ " ";
}

function quad(control: Array<number>, qEnd: Array<number>) {
	return "Q"
		+ " "
		+ control[0]
		+ " "
		+ control[1]
		+ ","
		+ qEnd[0]
		+ " "
		+ qEnd[1]
		+ " ";
}

function arc(rx: number, ry: number, xAxisRotation: boolean, largeArc: boolean, sweep: boolean, endpoint: Array<number>): string {
	return "A "
		+ rx
		+ " "
		+ ry
		+ " "
		+ (xAxisRotation ? 1 : 0)
		+ " "
		+ (largeArc ? 1 : 0)
		+ " "
		+ (sweep ? 1 : 0)
		+ " "
		+ endpoint[0]
		+ " "
		+ endpoint[1]
		+ " ";
}

function ungonStep(qStart: Array<number>, control: Array<number>, qEnd: Array<number>): String {
	return line(qStart) + quad(control, qEnd);
}

export function generateChaikinized(links, dispatch, segmentArray: Segment[], closed: boolean) {
	const link = (vl: ValueLink) => getLinkedValue(links, vl);

	let corner: Array<Array<number>> = [];
	let prevPoint: Array<number> = corner.length > 0 ? corner[corner.length - 1] : [0, 0];

	let renders:Array<RenderedSegment> = [];
	let defn = move([0, 0]);
	let angle = 0;
	let mirrorStack: Array<MirrorTag> = [];

	let firstJumpingPoint = null;
	let firstPoint = null;
	let firstManipFunction = null;

	let manipFunctions: Array<{segment: Segment, thunk: RenderThunk}> = [];

	for (let key = 0; key < segmentArray.length; ++key) {
		switch (segmentArray[key].type) {
			case Segments.JUMP:
			case Segments.VERTEX: {
				let jSegment: Vertex | Jump = segmentArray[key] as (Vertex | Jump);
				manipFunctions.push({segment: jSegment, thunk: manipPointable});
				prevPoint = [link(jSegment.point[0]), link(jSegment.point[1])];
			} break;
			case Segments.TURTLE: {
				let tSegment: Turtle = segmentArray[key] as Turtle;
				tSegment.horizontal = angle;

				let distance = link(tSegment.move);
				angle += link(tSegment.turn);
				angle = wraparound(-360, 360, angle);

				let cosine = Math.cos(toRadians(angle));
				let sine = Math.sin(toRadians(angle));
				let dx = Math.round(cosine * distance);
				let dy = Math.round(sine * distance);

				manipFunctions.push({segment: tSegment, thunk: manipTurtle});
				prevPoint = [(prevPoint[0] + dx), (prevPoint[1] + dy)];
			} break;
			case Segments.MIRR: {
				let top: MirrorTag = peek(mirrorStack);
				if (top) {
					if (top.index != key) {
						prevPoint = top.prevPoint;
						mirrorStack.push({ index: key, prevPoint: prevPoint });
						defn += "Z ";
					} else {
						mirrorStack.pop();
					}
				} else {
					prevPoint = [0, 0];
					key = -1;
					mirrorStack.push({ index: key, prevPoint: prevPoint });
					defn += "Z ";
				}
			} break;
		}
		if (!firstPoint) firstPoint = prevPoint;
		if (!firstManipFunction) firstManipFunction = manipFunctions.shift();
		corner.push(prevPoint);

		if (corner.length >= 3) {
			if (!firstJumpingPoint) {
				firstJumpingPoint = interpolate(corner[0], corner[1], 1 / 4);
				defn = move(firstJumpingPoint);
			}
			let qStart = interpolate(corner[0], corner[1], 3 / 4);
			let control = corner[1];
			let qEnd = interpolate(corner[1], corner[2], 1 / 4);

			renders.push(Object.assign({point: control}, manipFunctions.shift()));

			defn += ungonStep(qStart, control, qEnd);
			corner.shift();
		}
	}

	if (firstJumpingPoint) {
		let qStart = interpolate(corner[0], corner[1], 3 / 4);
		let control = corner[1];
		let qEnd = firstJumpingPoint;

		defn += ungonStep(qStart, control, qEnd);

		renders.push(Object.assign({point: control}, manipFunctions.shift()));
	}
	defn += "Z";
	return { defn, renders };
}

export const manipVector = (dispatch:Dispatch, dx: number, dy: number, vector: ValueLink[]) => {
	dispatch(manipulate(vecManipulation(dx, dy, vector)));
}

export const manipPointable = (dispatch:Dispatch, dx: number, dy: number, segment: Pointable) => {
	dispatch(manipulate(vecManipulation(dx, dy, segment.point)))
}

export const manip = (dispatch, diff: number, link: ValueLink) => {
	dispatch(manipulate(manipulation(diff, link)));
}

export const manipTurtle = (dispatch:Dispatch, dx: number, dy: number, turtleSegment: Segment, links:Array<LineMeta>) => {
	const link = (vl: ValueLink) => getLinkedValue(links, vl);

	let manipulations: Array<Manipulation> = [];

	let turtle = turtleSegment as Turtle;

	let move = link(turtle.move);
	let turn = link(turtle.turn) + turtle.horizontal;

	let xNought = Math.cos(toRadians(turn)) * move;
	let yNought = Math.sin(toRadians(turn)) * move;

	let xNoughtManip = xNought + dx;
	let yNoughtManip = yNought + dy;

	let manipDistance = Math.sqrt(Math.pow(xNoughtManip, 2) + Math.pow(yNoughtManip, 2));
	let angleManip = toDegrees(Math.atan((yNoughtManip) / (xNoughtManip)));

	if (xNoughtManip < 0) {
		if (yNoughtManip > 0) {
			angleManip = -180 + angleManip;
		} else {
			angleManip = 180 + angleManip;
		}
	}

	let newDegrees = wraparound(-360, 360, angleManip - turtle.horizontal);
	manipulations.push((manipulation(manipDistance - move, turtle.move)));
	manipulations.push(manipulation(newDegrees - link(turtle.turn), turtle.turn));
	dispatch(manipulate(manipulations));
}

export const manipTurtleDistance = (dispatch:Dispatch, dx: number, dy: number, turtleSegment: Segment, links:Array<LineMeta>) => {
	const link = (vl: ValueLink) => getLinkedValue(links, vl);

	let turtle = turtleSegment as Turtle;
	let angle = link(turtle.turn);

	let delta = Math.sin(angle) * dy + Math.cos(angle) * dx;
	dispatch(manipulate(manipulation(delta, turtle.move)));
}


function toRadians(deg: number): number {
	return (deg * (Math.PI / 180));
}

function toDegrees(rad: number): number {
	return (rad * (180 / Math.PI));
}

function arcEndpoint(rad: number, deg: number, start: Array<number>, center: Array<number>): number[] {
	let sin = Math.sin;
	let cos = Math.cos;

	let bCosine = (start[0] - center[0]) / rad;
	let bSine = (start[1] - center[1]) / rad;
	let aCosine = cos(toRadians(deg));
	let aSine = sin(toRadians(deg));

	//cos(B-A)
	let dx = rad * (aCosine * bCosine - aSine * bSine);

	//sin(B-A)
	let dy = rad * (bSine * aCosine + bCosine * aSine);

	return [center[0] + dx, center[1] + dy];
}


export function arcDegrees(rad: number, start: Array<number>, center: Array<number>, endPoint: Array<number>) {
	let dx = (endPoint[0] - center[0]) / rad;
	let dy = (endPoint[1] - center[1]) / rad;

	let bCosine = (start[0] - center[0]) / rad;
	let bSine = (start[1] - center[1]) / rad;
	let angleB = toDegrees(Math.atan(bSine / bCosine));

	let angleDiff = toDegrees(Math.atan(dy / dx));
	let angleA = angleB - angleDiff;
	return angleA;
}

function mirrorCoordinate(mirrorAxis: number, mirrorPoint: Array<number>, point: Array<number>): Array<number> {
	switch (mirrorAxis) {
		case Axes.X:
			return [
				mirrorValue(mirrorPoint[0], point[0]),
				point[1]
			];
		case Axes.Y:
			return [
				point[0],
				mirrorValue(mirrorPoint[1], point[1])
			];
		case Axes.XY:
			return [
				mirrorValue(mirrorPoint[0], point[0]),
				mirrorValue(mirrorPoint[1], point[1])
			];
		default:
			throw Error("Invalid mirroring axis!");
	}

}

function mirrorValue(mirrorValue: number, value: number): number {
	let distanceFromAxis = value - mirrorValue;
	return mirrorValue - distanceFromAxis;
}

