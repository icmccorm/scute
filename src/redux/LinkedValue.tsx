import { ShapeProps } from "src/shapes/Shape";

export type Manipulation = {value: number | string, valueIndex: number, lengthDifference: number}
export type ValueLink = {value: number, valueIndex: number};

export class LinkedValue{
	previous: number;
	current: number;
	valueIndex: number;
	manipulate: Function;

	constructor(obj: ValueLink, manipulate: Function){
		this.current = obj.value;
		this.valueIndex = obj.valueIndex;
		this.previous = null;
		this.manipulate = manipulate;
	}

	diffValue = (newDiff: any) => {
		this.previous = this.current; 
		this.current = this.current + newDiff;
	
		let prevLength = this.previous.toString().length;
		let currLength = this.current.toString().length;

		this.manipulate({
			value: this.current,
			valueIndex: this.valueIndex,
			lengthDifference: currLength - prevLength,
		});
		
		return this;
	}
}