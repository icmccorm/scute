import {createStore, combineReducers} from 'redux';
import {ActionType, Action} from './Actions';
import {requestCompile, requestFrame} from './ScuteWorker';
import { LineMeta, ValueMeta, Manipulation, RoleType } from './Manipulation';

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
				frame: [],
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
			meta.mouseDelta += change.mouseDelta;


			let newValue;
			let newValueString;
			switch(meta.role){
				
				case RoleType.TIMES:{
					let factor = change.originalValue / meta.targetValue;
					newValue = (change.originalValue + meta.mouseDelta) / factor;
					newValueString = newValue.toFixed(3);
				} break;
				
				case RoleType.DIVIDE: {
					let dividend = change.originalValue * meta.targetValue;
					newValue = dividend / (change.originalValue + meta.mouseDelta);
					newValueString = newValue.toFixed(3);
				} break;
				
				case RoleType.MINUS:
				case RoleType.PLUS:
				default:{
					newValue = meta.targetValue + meta.mouseDelta;
					newValueString = newValue.toFixed(3);
				 }break;
			}

			let lengthDifference = newValueString.length - meta.length;
			let start = store.code.substring(0, startIndex-1);
			let end = store.code.substring(startIndex-1 + meta.length);
			
			store = Object.assign({}, store, {
				code: start + newValueString + end,
			});

			meta.length = newValueString.length;
		
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