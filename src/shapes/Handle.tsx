import * as React from 'react';
import "./style/Handle.scss";

type Props = {adjust: Function, cx: number, cy: number};

const Handle = ({adjust, cx, cy}:Props) => {
	let mousePosition = [0, 0];
	let mouseOffset = [0, 0];

	const resizeComponents = (event) => {
		event.preventDefault();
		let dx = event.pageX - mousePosition[0];
		let dy = event.pageY - mousePosition[1];
		adjust(dx - mouseOffset[0], dy - mouseOffset[1]);
		mouseOffset = [dx, dy];
	}

	const recordMousePosition = (event) =>{
		mousePosition = [event.pageX, event.pageY];
		event.preventDefault();
		event.stopPropagation();

		document.body.style.cursor = "grabbing";
		window.addEventListener('mousemove', resizeComponents, false);	
		window.addEventListener('mouseup', endRecording, false);
	}

	const endRecording = () => {
		document.body.style.cursor = "grab";
		window.removeEventListener('mousemove', resizeComponents, false);
		window.removeEventListener('mosueup', endRecording, false);
		mouseOffset = [0, 0];
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