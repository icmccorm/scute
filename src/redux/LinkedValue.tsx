export type Manipulation = {value: number | string, lineIndex: number, inlineIndex, lengthDifference: number}
export type ValueLink = {type: number, lineIndex: number, inlineIndex};

export class LinkedValue{
	previous: number;
	current: number;
	link: ValueLink;
	manipulate: Function;

	constructor(obj: ValueLink, manipulate: Function){
		this.current = 0;
		this.previous = null;
		this.link = obj;
		this.manipulate = manipulate;
	}

	diffValue = (newDiff: any) => {
		if(newDiff != 0){
			this.previous = this.current; 
			this.current = this.current + newDiff;
	
			let lengthDifference = this.current.toString().length - this.previous.toString().length;
	
			this.manipulate({
				value: this.current,
				lineIndex: this.link.lineIndex,
				inlineIndex: this.link.inlineIndex,
				lengthDifference: lengthDifference
			});
		}
		return this;
	}
}