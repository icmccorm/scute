import { EventEmitter } from "events";
import ScuteWorker from 'worker-loader!../scute.worker';

export enum Events{
	REQ_COMPILE = 1,
	FIN_COMPILE,
	PRINT_OUT,
	PRINT_DEBUG,
	PRINT_ERROR
}

enum Commands { 
    OUT = 1,
    DEBUG,
    ERROR,
    RESULT
}

type CommandData = {code: number, payload: any}

export class EventClient{
	emitter: EventEmitter;
	worker: ScuteWorker;
	constructor(){
		this.emitter = new EventEmitter();
		this.worker = new ScuteWorker();
		this.worker.onmessage = this.handleWorkerCommands;
	}

	handleWorkerCommands = async (event) => {
		let command: CommandData = event.data;
		switch(command.code){
			case Commands.OUT:
				this.emit(Events.PRINT_OUT, command.payload);
				break;
			case Commands.ERROR:
				this.emit(Events.PRINT_OUT, command.payload);
				break;
			case Commands.RESULT:
				this.emit(Events.FIN_COMPILE, command.payload);
				break;
			default:
				break;
		}
	}

	async requestFrame(){
		
	}

	async requestCompile(code: string){
		this.worker.postMessage(code);
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