import {createStore, combineReducers} from 'redux';
import {ActionType, Action} from './Actions';
import {requestCompile, requestFrame} from './ScuteWorker';
import { LineMeta, numberCharLength, ValueMeta, Manipulation } from './Manipulation';

export type CompilationResponse = {maxFrameIndex: number, lines: []};

export type scuteStore = {
	root: {
		origin: Array<number>,
		dimensions: Array<number>,
		code: string,
		log: string,
		frame: Array<React.ReactElement>,
		frameIndex: number,
		maxFrameIndex: number,
		lines: Array<LineMeta>
	}
}

var initialStore = {
	frame: [],
	dimensions: [500, 500],
	origin: [0,0],
	code: "",
	log: "",
	maxFrameIndex: 0,
	frameIndex: 0,
	lines: [],
}

export function reduceUI(store = initialStore, action: Action){

	switch(action.type){

		case ActionType.REQ_COMPILE:
			store = Object.assign({}, store, {
				log: "",
			})
			requestCompile(store.code);
			break;
		case ActionType.FIN_COMPILE:
			let response: CompilationResponse = action.payload;
			store = Object.assign({}, store, {
				lines: response.lines,
				maxFrameIndex: response.maxFrameIndex,
			});

			requestFrame();
			break;

		case ActionType.PRINT_ERROR:
			break;
		case ActionType.PRINT_OUT:
			store = Object.assign({}, store, {
				log: store.log + action.payload,
			});
			break;
		case ActionType.PRINT_DEBUG:
			break;

		case ActionType.REQ_FRAME:
			requestFrame();
			break;
		case ActionType.FIN_FRAME:
			if(action.payload){
				store = Object.assign({}, store, {
					frame: action.payload,
				})
			}
			break;
		case ActionType.MANIPULATION:
			let change: Manipulation = action.payload;
			let line: LineMeta = store.lines[change.lineIndex];
			let meta: ValueMeta = line.values[change.inlineIndex];

			let startIndex = line.charIndex + meta.inlineOffset;
			
			let newValue = meta.value + change.delta;
			let newValueLength = numberCharLength(newValue);
			let oldValueLength = numberCharLength(meta.value);

			let lengthDifference = newValueLength - oldValueLength;
			

			let start = store.code.substring(0, startIndex);
			let end = store.code.substring(startIndex + meta.length);
			meta.length += lengthDifference;


			store = Object.assign({}, store, {
				code: start + (meta.value + change.delta) + end,
			});

			meta.value = newValue;

			if(lengthDifference != 0){
				for(let i = change.inlineIndex + 1; i< line.values.length; ++i){
					line.values[i].inlineOffset += lengthDifference;
				}
				for(let i = change.lineIndex + 1; i < store.lines.length; ++i){
					store.lines[i].charIndex += lengthDifference;
				}
			}
			break;
		case ActionType.END_MANIPULATION:
			break;
		case ActionType.UPDATE_CODE:
			store = Object.assign({}, store, {
				code: action.payload,
			});
			break;
	}
	return store;
}

var rootReducer = combineReducers({
	root: reduceUI,
})
export const scuteStore = createStore(rootReducer);