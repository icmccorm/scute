import { ActionType, createAction, Action } from "./Actions";

export type ValueMeta = {delta: number, valueDelta: number, role: RoleType, targetValue: number, inlineOffset: number, length: number};
export type LineMeta = {charIndex: number, values: Array<ValueMeta>};
export type ValueLink = {lineIndex: number, inlineIndex: number, value?: any};
export type Manipulation = {delta: number, originalValue: number, lineIndex: number, inlineIndex}

export enum StatusType{
	CONST = 0,
	COMP,
	OPEN
}

export enum RoleType {
	PLUS = 0,
	MINUS,
	TIMES,
	DIVIDE,
	MODULO
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

export function getLinkedValue(lines: Array<LineMeta>, link: ValueLink){
	let value = 0;
	let line:LineMeta = lines[link.lineIndex];
	if(link && line){
		let meta = line.values[link.inlineIndex];
		if(meta){
			if(meta.delta != 0){
				switch(meta.role){
					case RoleType.PLUS: {
						let term = link.value - meta.targetValue;
						value = term + (meta.targetValue + meta.delta);
					} break;
					case RoleType.MINUS: {
						let term = link.value - meta.targetValue;
						value = term + (meta.targetValue + meta.delta);
					} break;
					case RoleType.TIMES: {
						let factor = link.value / meta.targetValue;						
						value = factor * (meta.targetValue + meta.delta);
					} break;
					case RoleType.DIVIDE: {
						let quotient = link.value * meta.targetValue;
						value = quotient / (meta.targetValue + meta.delta);
					} break;
					case RoleType.MODULO:
					default:
						value = link.value + meta.delta;
				}
				value = link.value + meta.delta;
			}else{
				value = link.value;
			}
		}
	}
	return value;
}

export function getLinkedVector(lines: Array<LineMeta>, links: Array<ValueLink>){
	return [getLinkedValue(lines, links[0]), getLinkedValue(lines, links[1])];
}
/*
export function getLinkedColor(lines: Array<LineMeta>, color: Array<ValueLink>){
	if(color){
		let rVal = color[0] ? getLinkedValue(lines, color[0]).value: 0;
		let gVal = color[1] ? getLinkedValue(lines, color[1]).value: 0;
		let bVal = color[2] ? getLinkedValue(lines, color[2]).value: 0;
		let aVal = color[3] ? getLinkedValue(lines, color[2]).value: 0;

		return getRGBA(rVal, gVal, bVal, aVal);
	}else{
		return getRGBA(0, 0, 0, 1);
	}
}*/

export function manipulation(delta: number, link: ValueLink){
	return [{
		delta: delta,
		originalValue: link.value,
		lineIndex: link.lineIndex,
		inlineIndex: link.inlineIndex,
	}];
}

export function vecManipulation(dx: number, dy: number, links: Array<ValueLink>){
	return manipulation(dx, links[0]).concat(manipulation(dy, links[1]));
}

export function manipulate(manips: Manipulation[]){
	return createAction(ActionType.MANIPULATION, manips);
}