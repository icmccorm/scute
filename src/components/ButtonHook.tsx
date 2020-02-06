import * as React from 'react';
import './style/Button.scss';

export const Button  = () => {
    return (
        <button 
            className='button turq-b' 
            onClick={this.props.onClick}>

                {this.props.children}

        </button>
    );
}
/*
extends React.Component<any,any> { 

    constructor(props: any){
        super(props);
    }

    render (){
        
    };
    handleClick = () => {
        this.props.onClick();
    }
}
export default Button;
*/