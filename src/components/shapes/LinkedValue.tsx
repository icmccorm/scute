import { EventClient } from '../../EventClient';

type ShiftCommand = {line:number, diff: number, index: number};

export class LinkedValue{
	previous: number;
	current: number;
	index: number;
	line: number;
	client: EventClient;

	constructor(obj: any, client: EventClient){
		this.current = obj.value;
		this.line = obj.line;
		this.index = obj.index;
		this.previous = null;
		this.client = client;
		this.client.on("shift", (data: ShiftCommand) => {
			if(data.line == this.line && this.index > data.index){
				this.index += (data.diff);
			}
		})
	}

	diffValue = (newVal: any) => {
		this.previous = this.current;
		this.current = this.current + newVal;
	
		let prevLength = this.previous.toString().length;
		let currLength = this.current.toString().length;

		if(currLength != prevLength) this.client.emit("shift", {line: this.line, index: this.index, diff: currLength - prevLength});
			
		if(this.index > -1)	this.client.emit("manipulation", this);
		return this;
	}
}