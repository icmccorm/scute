import * as React from 'react';
import './style/Button.scss';

class Button extends React.Component<any,any> { 

    constructor(props: any){
        super(props);
    }

    render (){
        return (
            <button 
                className='button turq-b' 
                onClick={this.props.onClick}>

                    {this.props.children}

            </button>
        );
    };
    handleClick = () => {
        this.props.onClick();
    }
}
export default Button;