import * as React from 'react';
import "./style/Handle.scss";

type Props = {adjust: Function, cx: number, cy: number};

const Handle = ({adjust, cx, cy}:Props) => {
	const [mousePosition, setMouse] = React.useState([0, 0]);

	const resizeComponents = (event) => {
		event.preventDefault();
		adjust(event.pageX - mousePosition[0], event.pageY - mousePosition[1]);
		setMouse([event.pageX, event.pageY]);
	}

	const recordMousePosition = (event) =>{
		event.preventDefault();
		event.stopPropagation();

		document.body.style.cursor = "grabbing";
		setMouse([event.pageX, event.pageY]);
		window.addEventListener('mousemove', resizeComponents, false);	

		window.addEventListener('mouseup', ()=>{
			document.body.style.cursor = "grab";
			window.removeEventListener('mousemove', resizeComponents, false);
		}, false);
	}

	return (
		<circle
			className={'handle'} 
			r="5px" 
			cx={cx}
			cy={cy}
			onMouseDown={recordMousePosition}
		></circle>
	);
}

export default Handle;