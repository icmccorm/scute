import * as React from 'react';

type Props = {drag: Function, drop?: Function, children?: any, className?:string};
type State = {dragging: boolean};

export class Dragger extends React.Component<Props,State> { 
	readonly props: Props;
	mouseX: number;
	mouseY: number;
	draggerDiv: any;

    constructor(props: any){
		super(props);
		this.draggerDiv = React.createRef();
		this.state = {
			dragging: false,
		}
    }

    render (){
        return (
			<div 
				ref={this.draggerDiv}
				className={this.props.className}
				onMouseDown={this.recordMousePosition}>
				{this.props.children}
			</div>
		);
	};

	recordMousePosition = (event) =>{
		event.preventDefault();

		this.setState({dragging: true});

		this.mouseX = event.pageX;
		this.mouseY = event.pageY;
		let node:HTMLDivElement = this.draggerDiv.current;

		this.draggerDiv.current.addEventListener('mousemove', this.resizeComponents, false);	

		this.draggerDiv.current.addEventListener('mouseup', ()=>{

			this.draggerDiv.current.removeEventListener('mousemove', this.resizeComponents, false);
			this.setState({dragging: false});
			if(this.props.drop) this.props.drop();

		}, false);
	}
	
	resizeComponents = (event) => {
		event.preventDefault();

		let dx = event.pageX - this.mouseX;
		let dy = event.pageY - this.mouseY;
		
		this.props.drag(event.pageX, event.pageY, dx, dy);
	}
}