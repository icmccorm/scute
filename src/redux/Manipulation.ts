import { ActionType, createAction, Action } from "./Actions";

export enum RoleType {
	PLUS = 0,
	MINUS,
	TIMES,
	DIVIDE,
	MODULO
}

export type Stage = {role: RoleType, value: number};
export type ValueMeta = {delta: number, stages: Stage[], inlineOffset: number, length: number};
export type LineMeta = {charIndex: number, values: Array<ValueMeta>};
export type ValueLink = {lineIndex: number, inlineIndex: number, value?: any};
export type Manipulation = {delta: number, originalValue: number, lineIndex: number, inlineIndex}

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

export function getLinkedValue(lines: Array<LineMeta>, link: ValueLink){
	let value = 0;
	let line:LineMeta = lines[link.lineIndex];
	if(link && line){
		let meta = line.values[link.inlineIndex];
		if(meta){
			value = link.value + meta.delta;
			//console.log("linked value: " + value);
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
		originalValue: link.value,
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

