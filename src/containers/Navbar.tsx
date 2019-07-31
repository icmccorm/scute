import * as React from 'react';
import './css/Navbar.css';

class Navbar extends React.Component<any, any> { 
    
    constructor(props: object){
        super(props);
    }

    render () {
        return (
            <div className='navbar sky-b'>
                <div className='nav nav-l'>
                    {this.props.children}
                </div>   
            </div>
        );
    }
}
export default Navbar;