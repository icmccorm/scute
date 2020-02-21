import * as React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './style/Editor.scss';
import { createAction, ActionType } from 'src/redux/Actions';
import { scuteStore } from 'src/redux/ScuteStore';

type Props = {handleChange: Function, value: string}

export const Editor = React.memo(({value, handleChange}:Props) => {
    const [lineNums, setLineNums] = React.useState([<span key={1}>1</span>]);
    const [scrollTop, setScrollTop] = React.useState(0);

    const wrapper:React.RefObject<HTMLDivElement> = React.createRef();
    const area:React.RefObject<HTMLTextAreaElement> = React.createRef();
    const nums:React.RefObject<HTMLDivElement> = React.createRef();

    const sourceText:string = useSelector((store:scuteStore) => store.root.code);

    const dispatch = useDispatch();


    const syncText = (evt) => {
        let text:string = evt.target.value;
        dispatch(createAction(ActionType.UPDATE_CODE, text));
        let numLines:number = text.split('\n').length;
        let displayData = [];

        for(let i = 0; i<numLines; ++i){
            displayData.push(<span key={i+1}>{i+1}</span>);
        }
        setLineNums(displayData);       
    }

    const syncScroll = (evt) => {
        setScrollTop(evt.target.scrollTop);
        wrapper.current.scrollTop = scrollTop;
        nums.current.scrollTop = scrollTop;
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
                onChange={syncText}
                onKeyDown={handleSpecialCharacters}
                value={sourceText}
            />
      </div>
    );
});