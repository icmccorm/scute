import * as React from 'react';
import {RefObject} from 'react';

type Props = {adjust: Function, cx: number, cy: number};
type State = {dragging: boolean}
class Handle extends React.Component<Props,any> { 
	readonly props: Props;
	readonly state: State;
	mouseX: number;
	mouseY: number;
	handle: RefObject<SVGCircleElement>;

    constructor(props: any){
		super(props);
		this.handle = React.createRef<SVGCircleElement>();
		this.state = {
			dragging: false
		}
    }

    render (){
        return (
			<circle ref={this.handle}
				className={'handle'} 
				r="10px" 
				cx={this.props.cx}
				cy={this.props.cy}
				onMouseDown={this.recordMousePosition}
			></circle>
        );
	};

	recordMousePosition = (event) =>{
		event.preventDefault();
		event.stopPropagation();

		document.body.style.cursor = "grabbing";

		this.mouseX = event.pageX;
		this.mouseY = event.pageY;
		window.addEventListener('mousemove', this.resizeComponents, false);	

		window.addEventListener('mouseup', ()=>{
			document.body.style.cursor = "grab";
			window.removeEventListener('mousemove', this.resizeComponents, false);
		}, false);
	}
	
	resizeComponents = (event) => {
		event.preventDefault();
		this.props.adjust(event.pageX - this.mouseX, event.pageY - this.mouseY);
		this.mouseX = event.pageX;
		this.mouseY = event.pageY;
	}

}

export default Handle;