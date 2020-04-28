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

const AppRoot = () => {
	const [mouse, setMouse] = React.useState([0, 0]);
	const [translate, setTranslate] = React.useState([[0, 0], [0, 0]]);
	const [scale, setScale] = React.useState(1);
	const [terminateValid, setTerminationValid] = React.useState(false);

	const origin = useSelector((store:scuteStore) => store.root.origin);
	const dimensions = useSelector((store:scuteStore) => store.root.dimensions);
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
    }

	const getTransform = () => {
        return getTranslate(translate[1], UnitType.PX) + getScale(scale);
	}
	
	const getViewBox = () =>{
		return [
			origin[0],
			origin[1], 
			dimensions[0],
			dimensions[1],
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
					<span className="infoText">{"Dimensions: " + dimensions[0] + "x" + dimensions[1]}</span>
					<span className="infoText">{"Cursor: (" + (mouse[0]).toFixed(1) + ", " + mouse[1].toFixed(1) + ")"}</span>
					<span className="infoText">{"Origin: (" + origin[0] + ", " + origin[1] + ")"}</span>
				</div>     

				<Dragger drag={dragCanvas} drop={dropCanvas}>
					<div  
						onWheel={zoomCanvas} 
						className="view-flex min-max zoomRelative"
						style={{transform: getTransform()}}>
						<svg 
							ref={canvasWrapper}
							width={dimensions[0]} 
							height={dimensions[1]} 
							className='canvas shadow' 
							viewBox={getViewBox()}
							onMouseMove={recordMousePosition}>
							{frame ? frame.map(item => {
								return <Shape key={item.id} defs={item}></Shape>
							}) : null}
						</svg>
					</div>
				</Dragger>
			</div>
		</div>
	);
}

export default AppRoot;