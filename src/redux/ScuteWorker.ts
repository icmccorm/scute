import ScuteWorker from 'worker-loader!src/worker/scute.worker';
import {Action, ActionType} from './Actions';
import {scuteStore} from './ScuteStore';

var ScuteWorkerObject = new ScuteWorker();

ScuteWorkerObject.onmessage = async (event) => {
	let action: Action = event.data;
	scuteStore.dispatch(action);
}

export function requestFrame(){
	ScuteWorkerObject.postMessage([ActionType.REQ_FRAME]);
}

export function requestCompile(code: string){
	ScuteWorkerObject.postMessage([ActionType.REQ_COMPILE, code]);
}

export function reloadRuntime(){
	ScuteWorkerObject.terminate();
	ScuteWorkerObject = new ScuteWorker();
	ScuteWorkerObject.onmessage = async (event) => {
		let action: Action = event.data;
		scuteStore.dispatch(action);
	}
}