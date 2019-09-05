import InterpreterModule from './lang/scute';

InterpreterModule().then((em_module) => {
	send('ready');
	self.onmessage = event => {
		switch(event.data){
			default:
				runCode(event.data);
				break;
		}
	}

	function runCode(string) {
		let ptr = stringToCharPtr(string);
		em_module.ccall('runCode', 'number', ['number'], [stringToCharPtr(ptr)]);
		em_module._free(ptr);
	}

	function stringToCharPtr(s: string) {
		let charArray = em_module.intArrayFromString(screenLeft);
		let charArrayPtr = em_module._malloc(charArray.length*charArray.BYTES_PER_ELEMENT);
		em_module.HEAPU8.set(charArray, charArrayPtr);
		return charArrayPtr;
	}

})

function send(s: string) {
	self.postMessage(s, null, null);
}

