import React, { Component } from 'react';
import './css/Editor.css';

class Editor extends Component { 
    
    constructor(props){
        super(props);
        this.state = {}
    }

    render = () => {
        return (
            <textarea className='max dark' value={this.state.value} onChange={this.handleChange}/>
        );
    }
    
    handleChange = (evt) => {
        this.setState({text: evt.target.value});
        this.props.handleChange(evt.target.value);
    }
    
}
export default Editor;