import { EventClient } from '../../EventClient';

export class LinkedValue{
	previous: number;
	current: number;
	index: number;
	client: EventClient;

	constructor(obj: any, client: EventClient){
		this.current = obj.value;
		this.index = obj.index;
		this.previous = null;
		this.client = client;
	}

	diffValue = (newVal: any) => {
		this.previous = this.current;
		this.current = this.current + newVal;
		if(this.index > -1)	this.client.emit("manipulation", this);
		return this;
	}
}