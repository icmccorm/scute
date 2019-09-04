import WebWorker from 'worker-loader!*';
import InterpreterModule from './scute.js';

const ScuteWorker: WebWorker = self as any;

InterpreterModule().then(event => {
	ScuteWorker.dispatchEvent(new Event("interp"));
})

export default ScuteWorker;