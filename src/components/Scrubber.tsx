import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { scuteStore } from 'src/redux/ScuteStore';
import { createAction, ActionType } from 'src/redux/Actions';
import './style/Scrubber.scss';
import { Button } from './Button';

export const Scrubber = () => {
	const maxFrameIndex = useSelector((store:scuteStore) => store.root.maxFrameIndex);
	const currentFrameIndex = useSelector((store: scuteStore) => store.root.frameIndex);
	const isPlaying = useSelector((store:scuteStore) => store.root.animationLoop != null);
	
	const dispatch = useDispatch();
	const togglePlaying = () => {
		dispatch(createAction(ActionType.TOGGLE_PLAYING));
	}
	const scrub = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(createAction(ActionType.SCRUB, parseInt(event.target.value)));
	}

	return(
		<div className={"scrub-wrapper " + (maxFrameIndex > 0 ? "" : "hidden")}>
			<div className="scrub-box">
				<Button onClick={togglePlaying}>{isPlaying ? "Pause" : "Play"}</Button>
				<span>{(currentFrameIndex + 1) + "/" + maxFrameIndex}</span>
				<input className="scrub-bar" type="range" min="1" 
					max={maxFrameIndex} 
					value={currentFrameIndex} 
					onChange={scrub} 
					onMouseDown={togglePlaying} 
					onMouseUp={togglePlaying}>
				</input>	
			</div>
		</div>
    );
}
