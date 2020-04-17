
export class ScuteTestWrapper {
	currentIndex: number;
	compiledPtr: number;
	module: any;

	constructor(scuteModule){
		this.module = scuteModule;
		this.module._printFunction = console.log;
	}

	stringToCharPtr(s: string) {
		let charArray:Array<number> = this.module.intArrayFromString(s);
		let charArrayPtr = this.module._malloc(charArray.length);
		this.module.HEAPU8.set(charArray, charArrayPtr);
		return charArrayPtr;
	}

	runCode(){
		this.module.ccall('runCode', 'number', ['number', 'number'], [this.compiledPtr, this.currentIndex]);
		this.currentIndex = (this.currentIndex + 1) % this.module._maxFrameIndex;
		return this.module._currentFrame;
	}

	compileCode(code: string){
		this.module._frames = [];
		this.module._maxFrameIndex = 0;
		this.module._lines = [];
		if(this.compiledPtr) this.module._freeCompilationPackage(this.compiledPtr);

		let codePtr = this.stringToCharPtr(code);
		this.compiledPtr = this.module.ccall('compileCode', 'number', ['number'], [codePtr]);
		this.module._free(codePtr);
		
		return {maxFrameIndex: this.module._maxFrameIndex, lines: this.module._lines};
	}
}