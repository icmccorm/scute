import * as React from 'react';
import "./style/Handle.scss";
import { useDispatch } from 'react-redux';
import { manipulation, ValueLink } from 'src/redux/Manipulation';

type Props = {linkX?: ValueLink, linkY?: ValueLink, cx: number, cy: number};

const LinkedHandle = ({linkX, linkY, cx, cy}:Props) => {
	let mousePosition = [0, 0];
	let mouseOffset = [0, 0];

	const dispatch = useDispatch();

	const resizeComponents = (event) => {
		event.preventDefault();
		let dx = event.pageX - mousePosition[0];
		let dy = event.pageY - mousePosition[1];
		adjust(dx - mouseOffset[0], dy - mouseOffset[1]);
		mouseOffset = [dx, dy];
	}

	const adjust = (dx: number, dy: number) => {
		if(linkX) dispatch(manipulation(dx, linkX));
		if(linkY) dispatch(manipulation(dy, linkY));
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

export default LinkedHandle;