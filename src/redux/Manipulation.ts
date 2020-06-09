import { ActionType, createAction, Action } from "./Actions";
export enum RoleType {
	PLUS = 0,
	MINUS,
	TIMES,
	DIVIDE,
	MODULO
}

export type Stage = {role: RoleType, value: number};
export type ValueMeta = {delta: number, prevDelta: number, origin: number, op:RoleType, inlineOffset: number, length: number};
export type LineMeta = {charIndex: number, values: Array<ValueMeta>};
export type ValueLink = {lineIndex: number, inlineIndex: number, value?: any};
export type Manipulation = {delta: number, finalValue: number, lineIndex: number, inlineIndex}

export type Canvas = {origin:Array<ValueLink>, size:Array<ValueLink>};

export enum StatusType{
	CONST = 0,
	COMP,
	OPEN
}

export function getLinkedDelta(lines: Array<LineMeta>, link: ValueLink){
	let delta = 0;
	let line:LineMeta = lines[link.lineIndex];
	if(link && line){
		let meta = line.values[link.inlineIndex];
		if(meta){
			delta = meta.delta;
		}
	}
	return delta;
}

export function linkCanvas(lines: Array<LineMeta>, canvas: Canvas){
	if(canvas){
		return {
			size: getLinkedVector(lines, canvas.size),
			origin: getLinkedVector(lines, canvas.origin)
		}
	}else{
		return {
			size: [500, 500],
			origin: [0, 0]
		}
	}
}

export function getLinkedValue(lines: Array<LineMeta>, link: ValueLink){
	let value = 0;
	if(link){
		value = link.value;
		if(link.lineIndex >= 0){
			let line:LineMeta = lines[link.lineIndex];
			if(line){
				let meta = line.values[link.inlineIndex];
				if(meta){
					return meta.delta + link.value;
					/*
					let originalValue = link.value + meta.prevDelta;
					let goalValue = meta.delta + link.value;
					let origin = meta.origin;
					switch(meta.op){
						case RoleType.TIMES:{
							let factor =  originalValue / origin;
							value = (origin) * factor;
						} break;
						case RoleType.DIVIDE: {
							let divisor = originalValue * origin;
							value = goalValue / divisor;
						} break;
						case RoleType.MINUS:{
							let term = originalValue + origin;
							value = goalValue + term;
						}break;				
						case RoleType.PLUS:{
							let term = originalValue - origin;
							value = goalValue - term;
						}break;
					}*/
				}
			}
		}
	}
	return value;
}

export function getLinkedVector(lines: Array<LineMeta>, links: Array<ValueLink>){
	return [getLinkedValue(lines, links[0]), getLinkedValue(lines, links[1])];
}

export function manipulation(delta: number, link: ValueLink){
	return {
		delta: delta,
		finalValue: link.value,
		lineIndex: link.lineIndex,
		inlineIndex: link.inlineIndex,
	};	
}

export function vecManipulation(dx: number, dy: number, links: Array<ValueLink>){
	return [manipulation(dx, links[0]), (manipulation(dy, links[1]))];
}

export function manipulate(manips: Manipulation[] | Manipulation){
	return createAction(ActionType.MANIPULATION, [].concat(manips));
}

