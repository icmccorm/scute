import React, { Component } from 'react';
import '../css/Navbar.css';
import Button from './Button';
import Lexer from '../lang/Lexer'

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
        console.log("Click");
        Lexer.run("henlo", 1).then(tokens => {
            console.log(JSON.stringify(tokens));
        });
        Lexer.run("whats up", 2).then(tokens => {
            console.log(JSON.stringify(tokens));
        });
        
    }
}
export default Navbar;