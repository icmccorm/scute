import Scute from '../lang-c/scute.js';
import {ActionType, createAction} from '../redux/Actions';
var scuteModule = require('../lang-c/scute.wasm');

export class ScuteWorkerWrapper {
	currentIndex: number;
	compiledPtr: number;
	module: any;
	worker: any;

	constructor(scuteModule: any, worker: any){
		this.compiledPtr = scuteModule._compiledPtr;
		this.module = scuteModule;
		this.worker = worker;
		this.module["_printFunction"] = worker.postMessage.bind(worker);
	}

	compileCode(code: string){
		this.module["_canvas"] = {};
		this.module["_frames"] = [];
		this.module["_lines"] = [];
		this.module["_maxFrameIndex"] = 0;
		if(this.compiledPtr) this.module._freeCompilationPackage(this.compiledPtr);

		let codePtr = this.stringToCharPtr(code);
		try{
			this.compiledPtr = this.module.ccall('compileCode', 'number', ['number'], [codePtr]);
		}catch(error){
			this.sendCommand(ActionType.PRINT_OUT, "Segmentation fault\nError: " + error.message + "\n");
		}
		this.module._free(codePtr);
		
		this.sendCommand(ActionType.FIN_COMPILE, {maxFrameIndex: this.module._maxFrameIndex});
		this.currentIndex = 0;
	}

	runCode(){
		this.module.ccall('runCode', 'number', ['number', 'number'], [this.compiledPtr, this.currentIndex]);
		this.currentIndex = (this.currentIndex + 1) % this.module._maxFrameIndex;
		
		this.sendCommand(ActionType.FIN_FRAME, {frame: this.module._currentFrame, lines: this.module._lines, canvas: this.module._canvas});
		this.module._currentFrame = [];
	}

	stringToCharPtr(s: string) {
		let charArray:Array<number> = this.module.intArrayFromString(s);
		let charArrayPtr = this.module._malloc(charArray.length);
		this.module.HEAPU8.set(charArray, charArrayPtr);
		return charArrayPtr;
	}
	
	sendCommand(type: ActionType, payload: any) {
		this.worker.postMessage(createAction(type, payload), null, null);
	}
}

Scute({
	locateFile(path) {
	  if(path.endsWith('.wasm')) {
		return scuteModule;
	  }
	  return path;
	},
}).then((em_module) => {
	var scute = new ScuteWorkerWrapper(em_module, self);
	self.onmessage = event => {
		let message: any[] = event.data;
		switch(message[0]){
			case ActionType.REQ_COMPILE:
				scute.compileCode(message[1])
				break;
			case ActionType.REQ_FRAME:
				scute.runCode();
				break;
		}
	}
	em_module.onAbort = () =>{
		scute.sendCommand(ActionType.PRINT_OUT, "Runtime aborted.\n");
	}
});
