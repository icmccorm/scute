import * as React from 'react';
import './css/Editor.css';

class Editor extends React.Component<any, any> { 
    
    constructor(props: object){
        super(props);
        this.state = {}
    }

    render = () => {
        return (
            <textarea className='max dark' value={this.state.value} onChange={this.handleChange}/>
        );
    }
    
    handleChange = (evt: any) => {
        this.setState({text: evt.target.value});
        this.props.handleChange(evt.target.value);
    }
    
}
export default Editor;