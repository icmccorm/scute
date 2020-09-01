import * as React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { createAction, ActionType } from 'src/redux/Actions';
import { scuteStore } from 'src/redux/ScuteStore';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/webpack-resolver";
import './style/Editor.scss';

type Props = {handleChange: Function, value: string}

const CODE_COOKIE = "scute_src=";

export const Editor = React.memo(({value, handleChange}:Props) => {
    const sourceText:string = useSelector((store:scuteStore) => store.root.code);

    const dispatch = useDispatch();

    React.useEffect(() => {
        let cookieCode = getCookie();
        if(cookieCode != ""){
            syncText(cookieCode);
        }
    }, []);

    const syncText = (text) => {
        dispatch(createAction(ActionType.UPDATE_CODE, text));
        setCookie(text);   
    }

    const setCookie = (text) => {
        let encodedText = encodeURI(text);
        let d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*100));
        let cookie = CODE_COOKIE + encodedText + ";expires=" + d.toUTCString() + ";path=/";
        document.cookie = cookie; 
    }

    const getCookie = () => {
        let name = CODE_COOKIE;
        let decodedCookie = decodeURIComponent(document.cookie);
        let decoded = decodedCookie.split(';');
        for(let i = 0; i<decoded.length; ++i){
            let dVal = decoded[i];
            while(dVal.charAt(0) == ' '){
                dVal = dVal.substring(1);
            }
            if(dVal.indexOf(name) == 0){
                return dVal.substring(name.length, dVal.length);
            }
        }
        return "";
    }

    return(
        <AceEditor 
            name="ace-editor"
            mode="java"
            onChange={syncText} value={sourceText}
            setOptions={{useSoftTabs: false}}
        />
    );
});