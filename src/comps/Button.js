import React, { Component } from 'react';
import '../css/Button.css';

class Button extends React.Component { 
    constructor(props){
        super(props);
        this.state = {};
    }

    render (){
        return (
            <button className='turq-b sky-f'>{this.props.title}</button>
        );
    };

}
export default Button;