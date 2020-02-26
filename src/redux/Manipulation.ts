import { ActionType, createAction } from "./Actions";
import { getRGBA } from "src/shapes/StyleUtilities";

export type ValueMeta = {mouseDelta: number, valueDelta: number, role: RoleType, targetValue: number, inlineOffset: number, length: number};
export type LineMeta = {charIndex: number, values: Array<ValueMeta>};
export type ValueLink = {lineIndex: number, inlineIndex: number, value?: any};
export type Manipulation = {mouseDelta: number, originalValue: number, lineIndex: number, inlineIndex}

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

export function getLinkedValue(lines: Array<LineMeta>, link: ValueLink){
	let value = 0;
	let line:LineMeta = lines[link.lineIndex];
	if(line){
		let meta = line.values[link.inlineIndex];
		if(meta){
			if(meta.mouseDelta != 0){
				switch(meta.role){
					case RoleType.PLUS: {
						let term = link.value - meta.targetValue;
						value = term + (meta.targetValue + meta.mouseDelta);
					} break;
					case RoleType.MINUS: {
						let term = link.value - meta.targetValue;
						value = term + (meta.targetValue + meta.mouseDelta);
					} break;
					case RoleType.TIMES: {
						let factor = link.value / meta.targetValue;						
						value = factor * (meta.targetValue + meta.mouseDelta);
					} break;
					case RoleType.DIVIDE: {
						let quotient = link.value * meta.targetValue;
						value = quotient / (meta.targetValue + meta.mouseDelta);
					} break;
					case RoleType.MODULO:
					default:
						value = link.value + meta.mouseDelta;
				}
				value = link.value + meta.mouseDelta;
			}else{
				value = link.value;
			}
		}
	}
	return value;
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

export function manipulation(mouseDelta: number, link: ValueLink){
	return createAction(ActionType.MANIPULATION, {
		mouseDelta: mouseDelta,
		originalValue: link.value,
		lineIndex: link.lineIndex,
		inlineIndex: link.inlineIndex,
	});
}