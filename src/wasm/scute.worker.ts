import InterpreterModule from '../wasm/scute';

InterpreterModule().then(() => {
	send('ready');
})

function send(s: string) {
	self.postMessage(s, null, null);
}

