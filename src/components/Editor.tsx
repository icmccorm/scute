import * as React from 'react';
import './css/Editor.css';
import { EventClient } from 'src/EventClient';
import { LinkedValue } from './shapes/LinkedValue';
import { RefObject } from 'react';

type Props = {client: EventClient, handleChange: Function}
type State = {value: string, lineNums: any, scrollTop: number}

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
            value: ""
        }

        this.wrapper = React.createRef();
        this.nums = React.createRef();
        this.text = React.createRef<HTMLTextAreaElement>();
    }

    render = () => {
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
                    value={this.state.value}
                    onChange={this.handleChange}
                    onKeyDown={this.handleSpecialCharacters}
                />
            </div>
        );
    }
    
    handleChange = (evt: any) => {
        this.setState({value: evt.target.value});
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

    componentDidMount(){
        this.props.client.on('manipulation', this.changeText);
    }

    changeText = (data) => {
        let currentText = this.state.value;
        let payload: LinkedValue = data;
        let oldValueLength = payload.previous.toString().length;

        let newValue = currentText.substring(0, payload.index) 
            + ("" + payload.current) 
            + currentText.substring(payload.index + oldValueLength, currentText.length+1);
        
        this.setState({value: newValue});
        this.props.handleChange(newValue);
        this.text.current.setSelectionRange(payload.index, payload.index + payload.current.toString().length+1);
    }

    componentDidUpdate(){
        this.wrapper.current.scrollTop = this.state.scrollTop;
        this.nums.current.scrollTop = this.state.scrollTop;
    }

    handleSpecialCharacters = (evt: any) => {
        switch(evt.keyCode){
            case 9: //tab
                evt.preventDefault();
                this.setState({value: this.state.value ? (this.state.value + '\t') : '\t'})
                break;
        }
    }
}
export default Editor;