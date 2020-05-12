import * as React from 'react';
import "./style/Handle.scss";
import {useSelector, useDispatch} from 'react-redux';
import { ActionType, createAction, Action } from "src/redux/Actions";
import { scuteStore } from 'src/redux/ScuteStore';

type Props = {adjust: Function, cx: number, cy: number};


const Handle = React.memo(({adjust, cx, cy}:Props) => {
	let mousePosition = [0, 0];
	let mouseOffset = [0, 0];

	const scale = useSelector((store:scuteStore) => store.root.scale);
	const dispatch = useDispatch();

	const resizeComponents = (event) => {
		event.preventDefault();
		let dx = event.pageX - mousePosition[0];
		let dy = event.pageY - mousePosition[1];
		adjust((1/scale)*(dx - mouseOffset[0]), (1/scale)*(dy - mouseOffset[1]));
		mouseOffset = [dx, dy];
	}

	const recordMousePosition = (event) =>{
		mousePosition = [event.pageX, event.pageY];
		
		event.preventDefault();
		event.stopPropagation();

		document.body.style.cursor = "grabbing";
		window.addEventListener('mousemove', resizeComponents);	
		window.addEventListener('mouseup', endRecording, {once: true, capture: false});
	}

	const endRecording = (event) => {
		event.stopPropagation();

		document.body.style.cursor = "grab";
		window.removeEventListener('mousemove', resizeComponents, false);
		mouseOffset = [0, 0];
		dispatch(createAction(ActionType.END_MANIPULATION, null));
	}

	return (
		<circle
			className={'handle'} 
			r={Math.abs((1/scale*5)) + "px"} 
			cx={cx}
			cy={cy}
			onMouseDown={recordMousePosition}
		></circle>
	);
});

export default Handle;