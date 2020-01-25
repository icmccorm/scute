import {createStore} from 'redux';
import {ActionType, Action} from './Actions';

export var initialStore = {
	currentFrame: [],
	defaultWidth: 500,
	defaultHeight: 500,
}

export function reduceUI(store = initialStore, action: Action){
	switch(action.type){
		case ActionType.REQ_COMPILE:
			break;
		case ActionType.FIN_COMPILE:
			break;
		case ActionType.PRINT_OUT:
			break;
		case ActionType.PRINT_DEBUG:
			break;
		case ActionType.PRINT_ERROR:
			break;
		case ActionType.FRAME:
			break;
		case ActionType.MANIPULATION:
			break;
		case ActionType.SHIFT:
			break;
	}
	return store;
}

export var scuteStore = createStore(reduceUI);