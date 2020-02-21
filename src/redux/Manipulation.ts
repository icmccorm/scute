import { ActionType, createAction } from "./Actions";

export type ValueMeta = {value: any, inlineOffset: number, length: number};
export type LineMeta = {charIndex: number, values: Array<ValueMeta>};
export type ValueLink = {type: number, status: number, lineIndex: number, inlineIndex};
export type Manipulation = {delta: number, lineIndex: number, inlineIndex}

export enum StatusType{
	CONST = 0,
	COMP,
	OPEN
}

export function getLinkedValue(lines: Array<LineMeta>, link: ValueLink){
	if(link.status == StatusType.COMP){
		return link;
	}else{
		let lineValues = lines[link.lineIndex].values;
		let inline = lineValues[link.inlineIndex];
		return inline;
	}
}

export function manipulation(delta: number, link: ValueLink){
	return createAction(ActionType.MANIPULATION, {
		delta: delta,
		lineIndex: link.lineIndex,
		inlineIndex: link.inlineIndex,
	});
}

export function numberCharLength(value: number){
	let valueConvert = (value == 0 ? 2 : Math.abs(value) + 1);
	let offsets = 0
	if(value % 1 > 0) ++offsets; //account for decimal point char
	if(value < 0) ++offsets;	 //account for negative sign char
	return Math.ceil(Math.log10(valueConvert)) + offsets;
}
