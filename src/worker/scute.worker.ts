import Scute from 'src/lang-c/scute.js';
import {OutputCommands} from './WorkerCommands';
import {Action, ActionType, createAction} from 'src/redux/Actions';

var scuteModule = require('src/lang-c/scute.wasm');

class ScuteWrapper {
	currentIndex: number;
	compiledPtr: number;
	module: any;
	worker: any;

	constructor(scuteModule: any, worker: any){
		this.compiledPtr = scuteModule._compiledPtr;
		this.module = scuteModule;
		this.worker = worker;
	}

	compileCode(code: string){
		this.module._frames = [];
		this.module._maxFrameIndex = 0;
		this.module._values = [];
		if(this.compiledPtr) this.module._freeCompilationPackage(this.compiledPtr);

		let codePtr = this.stringToCharPtr(code);

		try{
			this.compiledPtr = this.module.ccall('compileCode', 'number', ['number'], [codePtr]);
		}catch(e){
			this.sendCommand(ActionType.PRINT_OUT, "Segmentation fault\nError: " + e.message + "\n");
		}
		this.module._free(codePtr);
		
		this.sendCommand(ActionType.FIN_COMPILE, {maxFrameIndex: this.module._maxFrameIndex, values: this.module._values});
		this.currentIndex = 0;
	}

	runCode(){
		this.module.ccall('runCode', 'number', ['number', 'number'], [this.compiledPtr, this.currentIndex]);
		this.currentIndex = (this.currentIndex + 1) % this.module._maxFrameIndex;
		
		this.sendCommand(ActionType.FIN_FRAME, this.module._currentFrame);
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
	var scute = new ScuteWrapper(em_module, self);
	self.onmessage = event => {
		let message: any[] = event.data;
		switch(message[0]){
			case ActionType.REQ_COMPILE:
				console.log(message[1]);
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