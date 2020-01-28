import * as React from 'react';
import './style/Navbar.scss';

class Navbar extends React.Component<any, any> { 
    
    constructor(props: object){
        super(props);
    }

    render () {
        return (
            <div className='navbar'>
                <div className='nav'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
export default Navbar;