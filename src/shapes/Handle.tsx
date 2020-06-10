import * as React from 'react';
import "./style/Handle.scss";
import {useSelector, useDispatch} from 'react-redux';
import { ActionType, createAction} from "src/redux/Actions";
import { scuteStore } from 'src/redux/ScuteStore';

type Props = {adjust: Function, cx: number, cy: number, ex?: number, ey?:number, sx?: number, sy?:number};

const Handle = React.memo(({adjust, cx, cy, ex, ey, sx, sy}:Props) => {
	let mousePosition = [0, 0];
	let mouseOffset = [0, 0];

	const scale = useSelector((store:scuteStore) => store.root.scale);
	const dispatch = useDispatch();

	const resizeComponents = (event:MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		let dx = event.pageX - mousePosition[0];
		let dy = event.pageY - mousePosition[1];
		adjust((1/scale)*(dx - mouseOffset[0]), (1/scale)*(dy - mouseOffset[1]));
		mouseOffset = [dx, dy];
	}

	const recordMousePosition = (event:React.MouseEvent) =>{
		event.preventDefault();
		event.stopPropagation();

		mousePosition = [event.pageX, event.pageY];
		document.body.style.cursor = "grabbing";
		window.addEventListener('mousemove', resizeComponents);	
		window.addEventListener('mouseup', endRecording, {once: true, capture: false});
	}

	const endRecording = (event) => {
		event.preventDefault();
		event.stopPropagation();

		document.body.style.cursor = "grab";
		window.removeEventListener('mousemove', resizeComponents, false);
		mouseOffset = [0, 0];
		dispatch(createAction(ActionType.END_MANIPULATION, null));
	}

	return (
		<g>
			{ex && ey ? 
				<line className={'handleTrail'} x1={cx} y1={cy} x2={ex} y2={ey}></line>
			: null}
			{sx && sy ? 
				<line className={'handleTrail'} x1={cx} y1={cy} x2={sx} y2={sy}></line>
			: null}
			<circle
				className={'handle'} 
				r={Math.abs((1/scale*5)) + "px"} 
				cx={cx}
				cy={cy}
				onMouseDown={recordMousePosition}
			></circle>
		</g>

	);
});

export default Handle;