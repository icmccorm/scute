import React, { Component } from 'react';
import './css/Button.css';

class Button extends Component { 
    constructor(props){
        super(props);
        this.state = {};
    }

    render (){
        return (
            <button 
                className='btn turq-b sky-f' 
                onClick={this.props.onClick}>

                    {this.props.children}

            </button>
        );
    };
    handleClick = () => {
        console.log("clicked.");
        this.onClick();
    }
}
export default Button;