import * as React from 'react';
import './css/Button.css';

class Button extends React.Component<any,any> { 


    constructor(props: any){
        super(props);
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
        this.props.onClick();
    }
}
export default Button;