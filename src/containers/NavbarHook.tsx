import * as React from 'react';
import './style/Navbar.scss';

export const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='nav'>
                {this.props.children}
            </div>
        </div>
    );
}


/*
class Navbar extends React.Component<any, any> { 
    
    constructor(props: object){
        super(props);
    }

    render () {
        
    }
}
export default Navbar;*/