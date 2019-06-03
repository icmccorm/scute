import React, { Component } from 'react';
import '../css/Button.css';

class Button extends Component { 
    constructor(props){
        super(props);
        this.state = {};
    }

    render (){
        return (
            <button className='turq-b sky-f' onClick={this.props.click}>{this.props.title}</button>
        );
    };

}
export default Button;