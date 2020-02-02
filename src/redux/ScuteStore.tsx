import * as React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {ActionType, Action} from './Actions';
import {requestCompile, requestFrame} from './ScuteWorker';
import {Shape} from 'src/shapes/Shape';
import {Manipulation} from './LinkedValue';

export type CompilationResponse = {maxFrameIndex: number, values: []};
export type ValueMeta = {line: number, startIndex: number, length: number};

export type scuteStore = {
	origin: Array<number>,
	dimensions: Array<number>,
	code: string,
	log: string,
	frame: Array<Shape>,
	frameIndex: number,
	maxFrameIndex: number,
	values: Array<ValueMeta>
}

var initialStore: scuteStore = {
	frame: [],
	dimensions: [500, 500],
	origin: [0,0],
	code: "",
	log: "",
	maxFrameIndex: 0,
	frameIndex: 0,
	values: [],
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
				values: response.values,
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
			let meta = store.values[change.valueIndex];

			let start = store.code.substring(0, meta.startIndex);
			let end = store.code.substring(meta.startIndex + meta.length);

			store = Object.assign({}, store, {
				code: start + change.value + end,
			});

			if(change.lengthDifference != 0){
				meta.length += change.lengthDifference;
				for(let i = change.valueIndex + 1; i< store.values.length; ++i){
					store.values[i].startIndex += change.lengthDifference;
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

var rootReducer = combineReducers({
	root: reduceUI,
})
export const scuteStore = createStore(rootReducer);