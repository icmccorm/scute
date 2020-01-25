import { EventEmitter } from "events";
import {InputCommands, OutputCommands, CommandData} from '../worker/WorkerCommands';
import {ScuteWorkerObject} from 'src/redux/ScuteWorker';

export enum Events{
	REQ_COMPILE = 1,
	FIN_COMPILE,
	PRINT_OUT,
	PRINT_DEBUG,
	PRINT_ERROR,
	FRAME,
	MANIPULATION,
	SHIFT,
}

export class EventClient{
	emitter: EventEmitter;
	worker: any;
	maxIndex: number;

	constructor(){
		this.emitter = new EventEmitter();
		this.worker = ScuteWorkerObject;
		this.worker.onmessage = this.handleWorkerCommands;
	}

	handleWorkerCommands = async (event) => {
		let command: CommandData = event.data;
		switch(command.code){
			case OutputCommands.OUT:
				this.emit(Events.PRINT_OUT, command.payload);
				break;
			case OutputCommands.ERROR:
				this.emit(Events.PRINT_OUT, command.payload);
				break;
			case OutputCommands.COMPILED:
				this.maxIndex = command.payload;
				this.emit(Events.FIN_COMPILE, command.payload);
				break;
			case OutputCommands.FRAME:
				this.emit(Events.FRAME, command.payload);
			default:
				break;
		}
	}

	async requestFrame(){
		this.worker.postMessage([InputCommands.RUN]);
	}

	async requestCompile(code: string){
		this.emit(Events.REQ_COMPILE, null, false);
		this.worker.postMessage([InputCommands.COMPILE, code]);
	}

	on(eventName, listener){
		this.emitter.on(eventName, listener);
	}

	emit(event, payload, error=false){
		this.emitter.emit(event, payload, error);
	}
	removeEventListener(eventName, listener){
		this.emitter.removeListener(eventName, listener);
	}
}