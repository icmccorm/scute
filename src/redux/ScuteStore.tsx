import {createStore, combineReducers} from 'redux';
import {ActionType, Action} from './Actions';
import {requestCompile, requestFrame} from './ScuteWorker';
import {Shape} from 'src/shapes/Shape';
import {Manipulation} from './LinkedValue';

export type CompilationResponse = {maxFrameIndex: number, lines: []};
export type ValueMeta = {inlineOffset: number, length: number};
export type LineMeta = {charIndex: number, values: Array<ValueMeta>};
export type ValueLink = {type: number, lineIndex: number, inlineIndex};

export type scuteStore = {
	origin: Array<number>,
	dimensions: Array<number>,
	code: string,
	log: string,
	frame: Array<Shape>,
	frameIndex: number,
	maxFrameIndex: number,
	lines: Array<LineMeta>
}

var initialStore: scuteStore = {
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

			let start = store.code.substring(0, startIndex);
			let end = store.code.substring(startIndex + meta.length);
			meta.length += change.lengthDifference;

			store = Object.assign({}, store, {
				code: start + change.value + end,
			});

			if(change.lengthDifference != 0){
				for(let i = change.inlineIndex + 1; i< line.values.length; ++i){
					line.values[i].inlineOffset += change.lengthDifference;
				}
				for(let i = change.lineIndex + 1; i < store.lines.length; ++i){
					store.lines[i].charIndex += change.lengthDifference;
				}
			}
			break;
		case ActionType.UPDATE_CODE:
			store = Object.assign({}, store, {
				code: action.payload,
			});
			break;
	}
	return store;
}

export function getLinkedValue(lines: Array<LineMeta>, link: ValueLink){
	return lines[link.lineIndex][link.inlineIndex].value;
}

var rootReducer = combineReducers({
	root: reduceUI,
})
export const scuteStore = createStore(rootReducer);