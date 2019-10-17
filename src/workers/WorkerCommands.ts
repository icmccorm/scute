
export enum OutputCommands { 
    OUT = 1,
    DEBUG,
    ERROR,
    COMPILED,
    FRAME
}

export enum InputCommands {
	COMPILE,
	RUN
}

export type CommandData = {code: any, payload: any}
