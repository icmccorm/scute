import * as React from 'react';

type Props = {adjust: Function};
type State = {};

class Dragger extends React.Component<Props,State> { 
	readonly props: Props;
	mouseX: number;
	mouseY: number;
	draggerDiv: any;

    constructor(props: any){
		super(props);
		this.draggerDiv = React.createRef();
    }

    render (){
        return (
			<div 
				ref={this.draggerDiv}
				className="scrubber" 
				onMouseDown={this.recordMousePosition}
			>
			</div>
        );
	};

	recordMousePosition = (event) =>{
		event.preventDefault();

		this.mouseX = event.pageX;
		this.mouseY = event.pageY;
		let node:HTMLDivElement = this.draggerDiv.current;
		window.addEventListener('mousemove', this.resizeComponents, false);	
		window.addEventListener('mouseup', ()=>{
			window.removeEventListener('mousemove', this.resizeComponents, false);
		}, false);
	}
	
	resizeComponents = (event) => {
		event.preventDefault();
		let dx = event.pageX - this.mouseX;
		this.props.adjust(event.pageX);
	}
}

export default Dragger;