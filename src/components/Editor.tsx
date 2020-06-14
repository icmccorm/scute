import * as React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './style/Editor.scss';
import { createAction, ActionType } from 'src/redux/Actions';
import { scuteStore } from 'src/redux/ScuteStore';

type Props = {handleChange: Function, value: string}

const CODE_COOKIE = "scute_src=";

export const Editor = React.memo(({value, handleChange}:Props) => {
    const [lineNums, setLineNums] = React.useState([<span key={1}>1</span>]);
    const [scrollTop, setScrollTop] = React.useState(0);

    const wrapper:React.RefObject<HTMLDivElement> = React.createRef();
    const area:React.RefObject<HTMLTextAreaElement> = React.createRef();
    const nums:React.RefObject<HTMLDivElement> = React.createRef();

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
        let numLines:number = text.split('\n').length;
        let displayData = [];

        for(let i = 0; i<numLines; ++i){
            displayData.push(<span key={i+1}>{i+1}</span>);
        }
        setLineNums(displayData);    
        setCookie(text);   
    }

    const syncScroll = (evt) => {
        setScrollTop(evt.target.scrollTop);
        wrapper.current.scrollTop = scrollTop;
        nums.current.scrollTop = scrollTop;
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

    var handleSpecialCharacters = (evt) => {
        let text:string = evt.target.value;
        if(evt.keyCode == 9){
            evt.preventDefault();
            let start = evt.currentTarget.selectionStart;
            let newVal = text.substring(0, start) + '\t' + text.substring(start);
            area.current.value = newVal;
            area.current.setSelectionRange(start+1, start+1);
        }
        return true;
    }

    return(
        <div ref={wrapper} id="code" className='editor-wrapper' onScroll={syncScroll}>
            <div
                ref={nums} 
                className='lineNums textPadding'
            >
            {lineNums}
            </div>
            <textarea
                ref={area}
                spellCheck={false}
                className='dark textArea textPadding'
                onChange={(evt) => {syncText(evt.target.value)}}
                onKeyDown={handleSpecialCharacters}
                value={sourceText}
            />
      </div>
    );
});