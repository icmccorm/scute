import { createStore, combineReducers } from 'redux';
import { ActionType, Action } from './Actions';
import { requestCompile, requestFrame, requestFrameByIndex, requestRun} from './ScuteWorker';
import { LineMeta, ValueMeta, Manipulation, RoleType, Canvas } from './Manipulation';

export type CompilationResponse = {maxFrameIndex: number};
export type FrameResponse = {animations: Object};
export type RuntimeResponse = {frame: [], lines: [], canvas:Canvas};

export type scuteStore = {
	root: {
		origin: Array<number>,
		dimensions: Array<number>,
		canvas: Canvas,
		code: string,
		log: string,
		frame: Array<React.ReactElement>,
		maxFrameIndex: number,
		lines: Array<LineMeta>
		scale: number,
		frameIndex: number,
		animationLoop: number
	}
}

var initialStore = {
	frame: null,
	canvas: null,
	code: "",
	log: "",
	maxFrameIndex: 0,
	frameIndex: 0,
	lines: [],
	scale: 1.0,
	isPlaying: false,	
	animationLoop: null,
}

export function reduceRoot(store = initialStore, action: Action){
	switch(action.type){
		case ActionType.REQ_COMPILE:
			if(store.animationLoop) clearInterval(store.animationLoop);
			store = Object.assign({}, store, {
				log: "",
				frames: [],
				lines: [],
				animationLoop: null
			})
			requestCompile(store.code);
			break;
		case ActionType.FIN_COMPILE: {
			let response: CompilationResponse = action.payload;
			store = Object.assign({}, store, {
				maxFrameIndex: response.maxFrameIndex
			});
			requestRun();
		} break;
		case ActionType.FIN_RUN: {
			store = Object.assign({}, store, {
				animationLoop: store.maxFrameIndex > 0 ? setInterval(requestFrame, 17) : null,
			});
		} break;
		case ActionType.FIN_FRAME:
			let response: FrameResponse = action.payload;
			
			break;
		case ActionType.SCALE:
			store = Object.assign({}, store, {
				scale: action.payload,
			});
			break;
		case ActionType.PRINT_ERROR:
		case ActionType.PRINT_OUT:
		case ActionType.PRINT_DEBUG:
			store = Object.assign({}, store, {
				log: store.log + action.payload,
			});
			break;
		case ActionType.FIN_FRAME:
			if(action.payload){
				let response:RuntimeResponse = action.payload;
				store = Object.assign({}, store, {
					frame: response.frame,
					lines: response.lines,
					canvas: response.canvas,
					frameIndex: (store.frameIndex + 1) % (store.maxFrameIndex + 1)
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

					meta.prevDelta = meta.delta;
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

						let fractional = Math.floor(newValue * 1000) / 1000;
						let newValueString = (fractional == Math.floor(newValue)) ? fractional.toString() : newValue.toFixed(3);
						if(newValueString == "NaN") throw Error("NaNaNaNaNaNa... batman? " + " " + newValue);
						
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
		case ActionType.SCRUB:
			store = Object.assign({}, store, {
				frameIndex: action.payload
			});
			requestFrameByIndex(store.frameIndex);
			break;
		case ActionType.TOGGLE_PLAYING:
			if(store.animationLoop){
				clearInterval(store.animationLoop);
				store = Object.assign({}, store, {
					animationLoop: null
				})
			}else{
				store = Object.assign({}, store, {
					animationLoop: setInterval(requestFrame, 17)
				})
			}
	}
	return store;
}

var rootReducer = combineReducers({
	root: reduceRoot,
})

export const scuteStore = createStore(rootReducer);