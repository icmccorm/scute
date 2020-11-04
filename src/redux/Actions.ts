export enum ActionType{
	REQ_COMPILE = 1,
	FIN_COMPILE,
	PRINT_OUT,
	PRINT_DEBUG,
	PRINT_ERROR,
	REQ_FRAME,
	FIN_FRAME,
	REQ_RUN,
	FIN_RUN,
	MANIPULATION,
	SHIFT,
	UPDATE_CODE,
	END_MANIPULATION,
	SCALE,
	TERMINATE,
	TOGGLE_PLAYING,
	SCRUB
}

export type Action = {type: ActionType, payload?: any};

export function createAction(type: ActionType, payload?: any){
	return {type: type, payload: payload};
}