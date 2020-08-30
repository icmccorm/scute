import * as React from 'react';
import "../style/Handle.scss";
import {useSelector, useDispatch} from 'react-redux';
import { ActionType, createAction} from "src/redux/Actions";
import { scuteStore } from 'src/redux/ScuteStore';
import { RenderThunk, Segment } from '../segmented/PathUtilities';

type Props = {
	segment: Segment,
	pos: Array<number>,
	thunk: RenderThunk,
}

const ThunkHandle = ({segment, pos, thunk}:Props) => {
	let mousePosition = [0, 0];
	let mouseOffset = [0, 0];

	const scale = useSelector((store:scuteStore) => store.root.scale);
	const links = useSelector((store:scuteStore) => store.root.lines);
	const dispatch = useDispatch();

	const resizeComponents = (event:MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		let dx = event.pageX - mousePosition[0];
		let dy = event.pageY - mousePosition[1];

		let adj = [(1/scale)*(dx - mouseOffset[0]), (1/scale)*(dy - mouseOffset[1])];
		
		thunk(dispatch, adj[0], adj[1], segment, links);

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
			<svg 
				onMouseDown={recordMousePosition} 
				x={pos[0] - 0.5*scaledRadius} 
				y={pos[1] - 0.5*scaledRadius} 
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
}

export default ThunkHandle;