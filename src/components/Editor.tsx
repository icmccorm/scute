import * as React from 'react';
import './css/Editor.css';

class Editor extends React.Component<any, any> { 
    
    constructor(props: object){
        super(props);
        this.state = {}
    }

    render = () => {
        return (
            <textarea spellCheck={false} className='max dark' value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleSpecialCharacters}/>
        );
    }
    
    handleChange = (evt: any) => {
        this.setState({value: evt.target.value});
        this.props.handleChange(evt.target.value);
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