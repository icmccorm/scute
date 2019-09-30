import * as React from 'react';
import './css/Editor.css';

class Editor extends React.Component<any, any> { 
    wrapper: any;
    nums: any;

    constructor(props: object){
        super(props);
        this.state = {
            lineNums: [<span key={1}>1</span>],
            scrollTop: 0,
        }

        this.wrapper = React.createRef();
        this.nums = React.createRef();
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