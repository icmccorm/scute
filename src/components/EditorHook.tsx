import * as React from 'react';
import './style/Editor.scss';
import { RefObject } from 'react';

type Props = {handleChange: Function, value: string}
type State = {lineNums: any, scrollTop: number}


export const Editor = () => {


    
    return (
        <div ref={this.wrapper} id="code" className='editor-wrapper' onScroll={this.syncScroll}>
            <div
                ref={this.nums} 
                className='lineNums textPadding'
            >
                    {this.state.lineNums}
            </div>
            <textarea
                ref={this.text}
                spellCheck={false}
                className='dark textArea textPadding'
                value={this.props.value}
                onChange={this.handleChange}
                onKeyDown={this.handleSpecialCharacters}
            />
        </div>
    );
}

/*
class Editor extends React.Component<Props, State> { 
    readonly props: Props;
    wrapper: any;
    nums: any;
    text: RefObject<HTMLTextAreaElement>;;

    constructor(props){
        super(props);
        this.state = {
            lineNums: [<span key={1}>1</span>],
            scrollTop: 0,
        }

        this.wrapper = React.createRef();
        this.nums = React.createRef();
        this.text = React.createRef<HTMLTextAreaElement>();
    }

    render = () => {
        
    }
    
    handleChange = (evt: any) => {
        this.props.handleChange(evt.target.value);
        this.syncLineNumbers(evt.target.value);
    }
    
    syncLineNumbers(txt: string) {
        let numLines:number = txt.split('\n').length;
        let displayData = [];

        for(let i = 0; i<numLines; ++i){
            displayData.push(<span key={i+1}>{i+1}</span>);
        }
        this.setState({lineNums: displayData});
    }

    syncScroll = (evt) =>{
        this.setState({scrollTop: evt.target.scrollTop});
    }

    componentDidUpdate(){
        this.wrapper.current.scrollTop = this.state.scrollTop;
        this.nums.current.scrollTop = this.state.scrollTop;
    }

    handleSpecialCharacters = async (evt: any) => {
        switch(evt.keyCode){
            case 9: //tab
                evt.preventDefault();
                let start = evt.currentTarget.selectionStart;
                let newVal = this.props.value ?
                this.props.value.substring(0, start) + '\t' + this.props.value.substring(start) 
                : '\t';
                this.props.handleChange(newVal);
                this.text.current.setSelectionRange(start + 1, start + 1);
                break;
        }
    }
}
export default Editor;*/