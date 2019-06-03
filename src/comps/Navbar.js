import React, { Component } from 'react';
import '../css/Navbar.css';
import Button from './Button';
import Interpreter from '../lang/Interpreter'

class Navbar extends Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className='navbar sky-b'>
                <div className='nav nav-l'>
                    <Button title='Run' click={this.compile}/>

                </div>   
            </div>
        );
    }

    compile () {
        Interpreter.run();
    }
}
export default Navbar;