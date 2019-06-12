const RUN = 'RUN_SCRIPT';
const TOGGLE_PLAY = 'TOGGLE_PLAY';
const SEND_RESULT = 'SEND_RESULT';
const PRINT_TO_CONSOLE = 'PRINT_TO_CONSOLE';
/* 
---- Sample State of Application ----
{
    isPlaying: true,
    isRunning: true,
    frames [...],
}
*/


export function addRunScript(script) {
    return {
        type: script,
        payload: {
            script
        }
    }
}
export function addTogglePlay(mode){
    return {
        type: TOGGLE_PLAY,
        payload: {
            mode
        }
    }
}
export function addPrintToConsole(msg) {
    return {
        type: PRINT_TO_CONSOLE,
        payload: {
            msg
        }
    }
}