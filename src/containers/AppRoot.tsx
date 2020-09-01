import * as React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Navbar} from './Navbar';
import {Log} from 'src/components/Log';
import {Editor} from 'src/components/Editor';
import {Button} from 'src/components/Button';
import {Dragger} from 'src/components/Dragger';
import {Shape} from 'src/shapes/Shape';

import './style/AppRoot.scss';
import {ActionType, createAction } from 'src/redux/Actions';
import {getTranslate, getScale, UnitType} from 'src/shapes/StyleUtilities';
import {reloadRuntime} from '../redux/ScuteWorker';
import { scuteStore } from 'src/redux/ScuteStore';
import { linkCanvas } from 'src/redux/Manipulation';
import { Scrubber } from 'src/components/Scrubber';

const AppRoot = () => {
	const [mouse, setMouse] = React.useState([0, 0]);
	const [translate, setTranslate] = React.useState([[0, 0], [0, 0]]);
	const [scale, setScale] = React.useState(1);
	const [terminateValid, setTerminationValid] = React.useState(false);
	
	const canvas = useSelector((store:scuteStore) => linkCanvas(store.root.lines, store.root.canvas));
	const frame = useSelector((store:scuteStore) => store.root.frame);
	const code = useSelector((store:scuteStore) => store.root.code);
	const log = useSelector((store:scuteStore) => store.root.log);

    var leftWrapper: React.RefObject<HTMLDivElement> = React.createRef(); 
    var rightWrapper: React.RefObject<HTMLDivElement> = React.createRef();
    var canvasWrapper: React.RefObject<SVGSVGElement> = React.createRef();

	const dispatch = useDispatch();

	const adjustLeft = (pageX: number, pageY: number, dx: number, dy: number) => {
        leftWrapper.current.style.width = pageX + "px";
	}
	
	const resetCanvas = () => {
		setTranslate([[0, 0], [0, 0]])
		setScale(1);

		dispatch(createAction(ActionType.SCALE, 1));
    }

	const getTransform = () => {
        return getTranslate(translate[1], UnitType.PX) + getScale(scale);
	}
	
	const getViewBox = () =>{
		let lowerX = -(canvas.origin[0]);
		let lowerY = -(canvas.origin[1]);
		let upperX = canvas.size[0]
		let upperY = canvas.size[1]
		return [
			lowerX,
			lowerY,
			upperX,
			upperY
		].join(" ");
    }

	const downloadCanvas = () => {
        let svg = canvasWrapper.current;
        let data = new XMLSerializer().serializeToString(svg);
        let svgBlob = new Blob([data], {
            type: 'image/svg+xml;charset=utf-8'
        });
        let link = document.createElement('a');
        link.download = name;
        link.href = URL.createObjectURL(svgBlob);
        // Firefox needs the element to be live for some reason.
        document.body.appendChild(link);
        link.click();
        setTimeout(function () {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        });
	}

	const zoomCanvas = (event: React.WheelEvent<HTMLDivElement>) => {
        const {
            pageX,
            pageY,
        } = event;

        let rightBounds = rightWrapper.current.getBoundingClientRect();
        let leftBounds = leftWrapper.current.getBoundingClientRect();
        let boundsWidth = (rightBounds.x > 0 ? leftBounds.width + rightBounds.width : rightBounds.width);

        let eventX = pageX - boundsWidth;
        let eventY = pageY - rightBounds.height;

        let change = event.deltaY/rightBounds.height;
        let newScale = scale + change * .5;

        let ratio = 1 - newScale/scale;

        let newTransX = translate[1][0] + (eventX - translate[1][0]) * ratio;
        let newTransY = translate[1][1] + (eventY - translate[1][1]) * ratio;

		setScale(newScale);
		setTranslate([[newTransX, newTransY],[newTransX, newTransY]]);
		
		dispatch(createAction(ActionType.SCALE, newScale));
    }

    const dragCanvas = (pageX: number, pageY: number, dx: number, dy: number) => {
		setTranslate([translate[0], [dx + translate[0][0], dy + translate[0][1]]])
    }

    const dropCanvas = () => {
		setTranslate([translate[1], translate[1]]);
    }

    const initiateCompile = () => {
		setTerminationValid(true);
		dispatch(createAction(ActionType.REQ_COMPILE, null));
    }

	const terminate = () => {
		reloadRuntime()
		setTerminationValid(false);
	}

    const recordMousePosition = (event) => {
        let eventBounds = canvasWrapper.current.getBoundingClientRect();
        let newMousePosition = [];

        newMousePosition[0] = (event.pageX - Math.floor(eventBounds.left)) / scale;
        newMousePosition[1] = (event.pageY - Math.floor(eventBounds.top)) / scale;

		setMouse(newMousePosition);
    }

	const updateCode = () => {
		dispatch(createAction(ActionType.UPDATE_CODE, code))
	}

	React.useEffect(() => {
		setTerminationValid(false);
	}, [frame]);
	
	return (     
		<div className='root flex outer-flex'>
			<div className='text-wrapper' ref={leftWrapper}>
				<div className='inner-text-wrapper flex inner-flex max'>
					<Editor value={code} handleChange={updateCode}></Editor>
					<Log value={log}></Log>
				</div>
				<Dragger drag={adjustLeft} className="scrubber"/> 
			</div>

			<div className='view-wrapper darkgray-b' ref={rightWrapper}> 
				<Navbar>
					<Button onClick={initiateCompile}>Run</Button>
					<Button disabled={!terminateValid} onClick={terminate}>Terminate</Button>
					<Button onClick={downloadCanvas}>Export</Button>
					<Button onClick={resetCanvas}>Fit</Button>   
					<Button>Settings</Button>
				</Navbar>
		
				<div className='infoBox'>
					<span className="infoText">{"Dimensions: " + canvas.size[0] + "x" + canvas.size[1]}</span>
					<span className="infoText">{"Cursor: (" + (mouse[0]).toFixed(1) + ", " + mouse[1].toFixed(1) + ")"}</span>
					<span className="infoText">{"Origin: (" + canvas.origin[0] + ", " + canvas.origin[1] + ")"}</span>
				</div>     

				<Dragger drag={dragCanvas} drop={dropCanvas}>
					<div  
						onWheel={zoomCanvas} 
						className="view-flex min-max zoomRelative"
						style={{transform: getTransform()}}>
						<svg 
							ref={canvasWrapper}
							width={canvas.size[0]} 
							height={canvas.size[1]} 
							className='canvas shadow' 
							viewBox={getViewBox()}
							onMouseMove={recordMousePosition}>
							{frame ? frame.map(item => {
								return <Shape key={item.id} defs={item}></Shape>
							}) : null}
						</svg>
					</div>
				</Dragger>
				<Scrubber/>
			</div>
		</div>
	);
}

export default AppRoot;