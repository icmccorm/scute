import * as React from 'react';
import {createStore, combineReducers} from 'redux';
import {ActionType, Action} from './Actions';
import {requestCompile, requestFrame} from './ScuteWorker';
import {Shape} from 'src/shapes/Shape';

export type scuteStore = {
	defaultWidth: number,
	defaultHeight: number,
	code: string,
	log: string,
	frame: Array<Shape>
}

var initialStore: scuteStore = {
	frame: [],
	defaultWidth: 500,
	defaultHeight: 500,
	code: "",
	log: "",
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
				let newFrame: Array<JSX.Element> = [];
				for(let item of action.payload){
					newFrame.push(<Shape key={item.id} defs={item}/>);
				}
				store = Object.assign({}, store, {
					frame: newFrame,
				})
			}
			break;
		case ActionType.MANIPULATION:
			break;
		case ActionType.SHIFT:
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