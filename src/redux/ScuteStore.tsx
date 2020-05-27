import { createStore, combineReducers } from 'redux';
import { ActionType, Action } from './Actions';
import { requestCompile, requestFrame } from './ScuteWorker';
import { LineMeta, ValueMeta, Manipulation, RoleType } from './Manipulation';

export type CompilationResponse = {maxFrameIndex: number};
export type FrameResponse = {maxFrameIndex: number, frames: Array<Object>};
export type RuntimeResponse = {frame: [], lines: []};

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
		scale: number,
		runtimeCounter: 0,
	}
}

var initialStore = {
	frame: null,
	dimensions: [500, 500],
	origin: [0,0],
	code: "",
	log: "",
	maxFrameIndex: 0,
	frameIndex: 0,
	lines: [],
	scale: 1.0,
	runtimeCounter: 0,
}

export function reduceRoot(store = initialStore, action: Action){
	switch(action.type){
		case ActionType.REQ_COMPILE:
			store = Object.assign({}, store, {
				log: "",
				frames: [],
				lines: [],
			})
			requestCompile(store.code);
			break;

		case ActionType.FIN_COMPILE:
			let response: CompilationResponse = action.payload;
			store = Object.assign({}, store, {
				maxFrameIndex: response.maxFrameIndex,
			});
			requestFrame();
			break;
		
		case ActionType.SCALE:
			store = Object.assign({}, store, {
				scale: action.payload,
			});
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
		case ActionType.FIN_FRAME:
			if(action.payload){
				let response:RuntimeResponse = action.payload;
					store = Object.assign({}, store, {
						frame: response.frame,
						lines: response.lines,
					});
			}
			break;
		case ActionType.MANIPULATION:
			let changes: Manipulation[] = action.payload;
			for(let i = 0; i < changes.length; ++i){
				let change = changes[i];
				if(change.lineIndex > -1){
					let line: LineMeta = store.lines[change.lineIndex];
					let meta: ValueMeta = line.values[change.inlineIndex];
					let startIndex = line.charIndex + meta.inlineOffset;

					meta.delta += change.delta;
				    let newValue = change.finalValue + meta.delta;
					let lengthDifference = 0;

					if(meta.length > 0){
						switch(meta.op){
							case RoleType.TIMES:{
								let factor = change.finalValue / meta.origin;
								newValue = (newValue) / factor;
							} break;
							case RoleType.DIVIDE: {
								let factor = change.finalValue * meta.origin;
								newValue = newValue * factor;
							} break;
							case RoleType.MINUS:{
								let term = change.finalValue + meta.origin;
								newValue = newValue + term;
							}break;				
							case RoleType.PLUS:{
								let term = change.finalValue - meta.origin;
								newValue = newValue - term;
							}break;
						}				

						let fractional = Math.floor(newValue* 1000) / 1000;
						let newValueString = (fractional == Math.floor(newValue)) ? fractional.toString() : newValue.toFixed(3);
	
						lengthDifference = newValueString.length - meta.length;
						let start = store.code.substring(0, startIndex);
						let end = store.code.substring(startIndex + meta.length);
						
						store = Object.assign({}, store, {
							code: start + newValueString + end,
						});
			
						meta.length = newValueString.length;
					}else{
						let newValueString = " + " + meta.delta.toString();
						meta.length = newValueString.length;
						meta.inlineOffset += 3;
						meta.origin = meta.delta;

						let start = store.code.substring(0, startIndex);
						let end = store.code.substring(startIndex);

						store = Object.assign({}, store, {
							code: start + newValueString + end,
						});

						lengthDifference = meta.length;
						meta.length = newValueString.length - 3;
					}
				
					if(lengthDifference != 0){
						for(let i = change.inlineIndex + 1; i< line.values.length; ++i){
							line.values[i].inlineOffset += lengthDifference;
						}
						for(let i = change.lineIndex + 1; i < store.lines.length; ++i){
							store.lines[i].charIndex += lengthDifference;
						}
					}
				}
			}
			break;
		case ActionType.END_MANIPULATION:
			store = Object.assign({}, store, {
				receivingUpdate: true,
			});
			requestCompile(store.code);
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
	root: reduceRoot,
})

export const scuteStore = createStore(rootReducer);