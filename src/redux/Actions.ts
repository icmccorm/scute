export enum ActionType{
	REQ_COMPILE = 1,
	FIN_COMPILE,
	PRINT_OUT,
	PRINT_DEBUG,
	PRINT_ERROR,
	FRAME,
	MANIPULATION,
	SHIFT,
}

export class Action {
	type: ActionType;
	payload: any;
	constructor(type: ActionType, payload:any){
		this.type = type;
		this.payload = payload;
	}
}