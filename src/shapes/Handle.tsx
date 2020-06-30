import * as React from 'react';
import "./style/Handle.scss";
import {useSelector, useDispatch} from 'react-redux';
import { ActionType, createAction} from "src/redux/Actions";
import { scuteStore } from 'src/redux/ScuteStore';

type Props = {adjust?: Function, adjustDirect?: Function, cx: number, cy: number, ex?: number, ey?:number, sx?: number, sy?:number};

const Handle = React.memo(({adjust, adjustDirect, cx, cy, ex, ey, sx, sy}:Props) => {
	let mousePosition = [0, 0];
	let mouseOffset = [0, 0];

	const scale = useSelector((store:scuteStore) => store.root.scale);
	const dispatch = useDispatch();

	const resizeComponents = (event:MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		let dx = event.pageX - mousePosition[0];
		let dy = event.pageY - mousePosition[1];

		if(adjust) {		
			adjust((1/scale)*(dx - mouseOffset[0]), (1/scale)*(dy - mouseOffset[1]));
		}
		if(adjustDirect){
			adjustDirect((1/scale)*(mousePosition[0] + dx), (1/scale)*(mousePosition[1] + dy));
		}

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

	let scaledRadius = Math.abs(1/scale*15);
	let scaledStrokeWidth = Math.abs(1/scale*4);

	const strokeStyles = {
		strokeWidth: scaledStrokeWidth + "px"
	}
	return (
		<g>
			{ex && ey ? 
				<line className={'handleTrail'} style={strokeStyles} x1={cx} y1={cy} x2={ex} y2={ey}></line>
			: null}
			{sx && sy ? 
				<line className={'handleTrail'} style={strokeStyles} x1={cx} y1={cy} x2={sx} y2={sy}></line>
			: null}

			<svg 
				onMouseDown={recordMousePosition} 
				x={cx - 0.5*scaledRadius} 
				y={cy - 0.5*scaledRadius} 
				width={scaledRadius} 
				height={scaledRadius} 
				viewBox="-50 -50 100 100"
				style={{zIndex:1}}
			>
				<circle className="handleCircle" cx="0" cy="0" r="45"/>
				<path className="handlePath" d="M -25 0 L 25 0 M 0 -25 L 0 25"/>
			</svg>
		</g>

	);
});

export default Handle;