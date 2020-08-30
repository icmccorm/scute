import * as React from 'react';
import "../style/Handle.scss";
import {useSelector, useDispatch} from 'react-redux';
import { ActionType, createAction} from "src/redux/Actions";
import { scuteStore } from 'src/redux/ScuteStore';
import { ValueLink, getLinkedValue, manipulate, manipulation, vecManipulation } from 'src/redux/Manipulation';

type Props = {
	vx?: ValueLink,
	vy?: ValueLink,
	v?: Array<ValueLink>,
	cx?: number,
	cy?: number,
}

const BasicHandle = React.memo(({vx, vy, v, cx, cy}:Props) => {
	let mousePosition = [0, 0];
	let mouseOffset = [0, 0];

	const scale = useSelector((store:scuteStore) => store.root.scale);
	const dispatch = useDispatch();

	if(!cx) cx = useSelector((store: scuteStore) => getLinkedValue(store.root.lines, (vx ? vx : (v ? v[0] : null))));
	if(!cy) cy = useSelector((store: scuteStore) => getLinkedValue(store.root.lines, (vy ? vy : (v ? v[1] : null))));

	const resizeComponents = (event:MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		let dx = event.pageX - mousePosition[0];
		let dy = event.pageY - mousePosition[1];

		let adj = [(1/scale)*(dx - mouseOffset[0]), (1/scale)*(dy - mouseOffset[1])];
		if(v){
			dispatch(manipulate(vecManipulation(adj[0], adj[1], v)))
		}else{
			if(vx && vy){
				dispatch(manipulate(vecManipulation(adj[0], adj[1], [vx,  vy])));
			}else if(vx){
				dispatch(manipulate(manipulation(adj[0], vx)));
			}else{
				dispatch(manipulate(manipulation(adj[1], vy)));
			}
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

export default BasicHandle;