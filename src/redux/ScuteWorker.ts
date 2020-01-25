import ScuteWorker from 'worker-loader!src/worker/scute.worker';
import {Action, ActionType} from './Actions';
import {scuteStore} from './ScuteStore';

export enum WorkerCommands {
	COMPILE = 0,
	RUN
}

export enum WorkerResponses { 
    OUT = 1,
    DEBUG,
    ERROR,
    COMPILED,
    FRAME
}

export async function requestFrame(){
	ScuteWorkerObject.postMessage([WorkerCommands.RUN]);
}

export async function requestCompile(code: string){
	ScuteWorkerObject.postMessage([WorkerCommands.COMPILE, code]);
}

export type CommandData = {code: any, payload: any}

export const ScuteWorkerObject = new ScuteWorker();

var handleMessage = async (event) => {
	let command: CommandData = event.data;
	switch(command.code){
		case WorkerResponses.OUT:
			scuteStore.dispatch(new Action(ActionType.PRINT_OUT, command.payload));
			break;
		case WorkerResponses.ERROR:
			scuteStore.dispatch(new Action(ActionType.PRINT_ERROR, command.payload));
			break;
		case WorkerResponses.COMPILED:
			scuteStore.dispatch(new Action(ActionType.FIN_COMPILE, command.payload));
			break;
		case WorkerResponses.FRAME:
			scuteStore.dispatch(new Action(ActionType.FRAME, command.payload));
		default:
			break;
	}
}
