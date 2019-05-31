import React, { Component } from 'react';
import '../css/Navbar.css';
import Button from './Button';
class Navbar extends React.Component { 
    
    constructor(props){
        super(props);
        this.state = {};
    }

    render () {
        return (
            <div className='navbar sky-b'>
                <div className='nav nav-l'>
                    <Button title='Run'/>
                    <Button title='Run'/>
                    <Button title='Run'/>
                </div>   
            </div>
        );
    }
}
export default Navbar;