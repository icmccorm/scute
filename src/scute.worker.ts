import InterpreterModule from './lang/scute';

InterpreterModule().then(() => {
	send('ready');
})

function send(s: string) {
	self.postMessage(s, null, null);
}

