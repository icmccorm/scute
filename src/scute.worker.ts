import Scute from './lang-c/scute.js';
import {OutputCommands} from './workers/WorkerCommands';

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
		if(this.compiledPtr) this.module._freeCompilationPackage(this.compiledPtr);

		let codePtr = this.stringToCharPtr(code);
		this.compiledPtr = this.module.ccall('compileCode', 'number', ['number'], [codePtr]);
		this.module._free(codePtr);
		
		this.sendCommand(OutputCommands.COMPILED, this.module._maxFrameIndex);
		this.currentIndex = 0;
	}

	runCode(){
		this.module.ccall('runCode', 'number', ['number', 'number'], [this.compiledPtr, this.currentIndex]);
		this.currentIndex = (this.currentIndex + 1) % this.module._maxFrameIndex;
		
		this.sendCommand(OutputCommands.FRAME, this.module._currentFrame);
		this.module._currentFrame = [];
	}

	stringToCharPtr(s: string) {
		let charArray:Array<number> = this.module.intArrayFromString(s);
		let charArrayPtr = this.module._malloc(charArray.length);
		this.module.HEAPU8.set(charArray, charArrayPtr);
		return charArrayPtr;
	}
	
	sendCommand(cmd: OutputCommands, obj: any) {
		let message = {code: cmd, payload: obj};
		this.worker.postMessage(message, null, null);
	}
}

Scute().then((em_module) => {
	var scute = new ScuteWrapper(em_module, self);
	self.onmessage = event => {
		let message: any[] = event.data;
		switch(message[0]){
			case 0:
				scute.compileCode(message[1])
				break;
			case 1:
				scute.runCode();
				break;
		}
	}
})


