import InterpreterModule from './lang/scute';

InterpreterModule().then((em_module) => {
	send('ready');
	self.onmessage = event => {
		switch(event.data){
			default:
				try{
					runCode(event.data);
				}catch(e){
					
				}
				break;
		}
	}

	function runCode(string) {
		let ptr = stringToCharPtr(string);
		em_module.ccall('runCode', 'number', ['number'], [ptr]);
		em_module._free(ptr);
	}

	function stringToCharPtr(s: string) {
		let charArray:Array<number> = em_module.intArrayFromString(s);
		let charArrayPtr = em_module._malloc(charArray.length);
		em_module.HEAPU8.set(charArray, charArrayPtr);
		return charArrayPtr;
	}

})

function send(s: string) {
	self.postMessage(s, null, null);
}

