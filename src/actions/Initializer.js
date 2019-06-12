import * as Actions from './actions/ActionTypes';
import Interpreter from '../lang/Interpreter'

const initialState = {
    isPlaying: false,
    frames: [],
    frameIndex: 0,
    console: ''
}

export function initState(state, action){
    if(typeof state == undefined){
        return initialState;
    }
    switch(action.type){
        case Actions.RUN:
            let result = Interpreter.run();
            return Object.assign({}, state, {
                isPlaying: false,
                frames: [...result.frames],
                frameIndex: 0,
                console: result.console
            });

        case Actions.TOGGLE_PLAY:
            return Object.assign({}, state, {
                isPlaying: !state.isPlaying,
                frameIndex: state.frameIndex,
                frames: [...state.frames],
                console: state.console
            });
    }
}