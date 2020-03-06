import * as React from 'react';
import {connect} from 'react-redux';

import {Navbar} from './Navbar';
import {Log} from 'src/components/Log';
import {Editor} from 'src/components/Editor';
import {Button} from 'src/components/Button';
import {Dragger} from 'src/components/Dragger';
import {Shape} from 'src/shapes/Shape';

import './style/AppContainer.scss';
import {ActionType, createAction } from 'src/redux/Actions';
import { getTranslate, getScale, UnitType } from 'src/shapes/StyleUtilities';

type AppState = {
    currentLeftWidth: number,
    currentTranslate: Array<number>,
    initialTranslate: Array<number>,
    mousePosition: Array<number>,
    scale: number
        
    mouseX: number,
    mouseY: number,
};

type AppProps = {
    dimensions: Array<number>,
    origin: Array<number>,
    log: string, 
    frame: Array<any>,
    code: string,
    
    updateCode: Function, 
    manipulate: Function,
    runCode: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
    scale: Function,
};

class App extends React.Component<AppProps, AppState> { 
    readonly state: AppState;
    readonly props: AppProps;
    leftWrapper: React.RefObject<HTMLDivElement>; 
    rightWrapper: React.RefObject<HTMLDivElement>;
    canvasWrapper: React.RefObject<SVGSVGElement>;
    
    constructor(props){
        super(props);
        this.leftWrapper = React.createRef();
        this.rightWrapper = React.createRef();
        this.canvasWrapper = React.createRef();
        this.state = { 
            currentLeftWidth: 0,
            currentTranslate: [0,0],
            initialTranslate: [0,0],
            mousePosition: [0,0],
            scale: 1,
            mouseX: 0,
            mouseY: 0,
        }
    }

    adjustLeft = (pageX: number, pageY: number, dx: number, dy: number) => {
        this.leftWrapper.current.style.width = pageX + "px";
    }

    resetCanvas = (event) => {
        this.setState({
            currentTranslate: [0,0],
            initialTranslate: [0,0],
            scale: 1,
        });
    }

	getViewBox(){
		return [
			this.props.origin[0],
			this.props.origin[1], 
			this.props.dimensions[0],
			this.props.dimensions[1],
		].join(" ");
    }
    
    getTransform(){
        return getTranslate(this.state.currentTranslate, UnitType.PX) + getScale(this.state.scale);
    }

    downloadCanvas = () => {
        var svg = this.canvasWrapper.current;
        var data = new XMLSerializer().serializeToString(svg);
        var svgBlob = new Blob([data], {
            type: 'image/svg+xml;charset=utf-8'
        });
        var link = document.createElement('a');
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

	zoomCanvas = (event: React.WheelEvent<HTMLDivElement>) => {
        const {
            pageX,
            pageY,
        } = event;

        let rightBounds = this.rightWrapper.current.getBoundingClientRect();
        let leftBounds = this.leftWrapper.current.getBoundingClientRect();
        let boundsWidth = (rightBounds.x > 0 ? leftBounds.width + rightBounds.width : rightBounds.width);

        let eventX = pageX - boundsWidth;
        let eventY = pageY - rightBounds.height;

        let change = event.deltaY/rightBounds.height;
        let newScale = this.state.scale + change * .5;

        let ratio = 1 - newScale/this.state.scale;

        let newTransX = this.state.currentTranslate[0] + (eventX - this.state.currentTranslate[0]) * ratio;
        let newTransY = this.state.currentTranslate[1] + (eventY - this.state.currentTranslate[1]) * ratio;

        this.setState({
            scale: newScale,
            currentTranslate: [newTransX, newTransY],
            initialTranslate: [newTransX, newTransY],
        });
        this.props.scale(newScale);
    }

    dragCanvas = (pageX: number, pageY: number, dx: number, dy: number) => {
        this.setState({
            currentTranslate: [dx + this.state.initialTranslate[0], dy + this.state.initialTranslate[1]],
        })
    }

    dropCanvas = () => {
        this.setState({
            initialTranslate: this.state.currentTranslate,
        })
    }

    recordMousePosition = (event) => {
        let eventBounds = this.canvasWrapper.current.getBoundingClientRect();
        let newMousePosition = [];

        newMousePosition[0] = (event.pageX - Math.floor(eventBounds.left)) / this.state.scale;
        newMousePosition[1] = (event.pageY - Math.floor(eventBounds.top)) / this.state.scale;
        this.setState({
            mousePosition: newMousePosition,
        })
    }

    render () {
        return (     
            <div className='root flex outer-flex'>
                <div className='text-wrapper' ref={this.leftWrapper}>
                    <div className='inner-text-wrapper flex inner-flex max'>
                        <Editor value={this.props.code} handleChange={this.props.updateCode}></Editor>
                        <Log value={this.props.log}></Log>
                    </div>
                    <Dragger drag={this.adjustLeft} className="scrubber"/> 
                </div>

                <div className='view-wrapper darkgray-b' ref={this.rightWrapper}> 
                    <Navbar>
                        <Button onClick={this.props.runCode}>Run</Button>
                        <Button onClick={this.downloadCanvas}>Export</Button>
                        <Button onClick={this.resetCanvas}>Fit</Button>   
                        <Button>Settings</Button>
                    </Navbar>
            
                    <div className='infoBox'>
                        <span className="infoText">{"Dimensions: " + this.props.dimensions[0] + "x" + this.props.dimensions[1]}</span>
                        <span className="infoText">{"Cursor: (" + (this.state.mousePosition[0]).toFixed(1) + ", " + this.state.mousePosition[1].toFixed(1) + ")"}</span>
                        <span className="infoText">{"Origin: (" + this.props.origin[0] + ", " + this.props.origin[1] + ")"}</span>
                    </div>     

                    <Dragger drag={this.dragCanvas} drop={this.dropCanvas}>
                        <div  
                            onWheel={this.zoomCanvas} 
                            className="view-flex min-max zoomRelative"
                            style={{transform: this.getTransform()}}>
                            <svg 
                                ref={this.canvasWrapper}
                                width={this.props.dimensions[0]} 
                                height={this.props.dimensions[1]} 
                                className='canvas shadow' 
                                viewBox={this.getViewBox()}
                                onMouseMove={this.recordMousePosition}>
                                {this.props.frame.map(item => {
                                    return <Shape key={item.id} defs={item}></Shape>
                                })}
                            </svg>
                        </div>
                    </Dragger>
                </div>
            </div>
        );
    }
}

function mapStateToProps(store, ownProps){
    return {
        dimensions: store.root.dimensions,
        origin: store.root.origin,
        log: store.root.log,
        frame: store.root.frame,
        code: store.root.code,
    };
}

function mapDispatchToProps(dispatch){
    return {
        runCode: (event: any) => dispatch(createAction(ActionType.REQ_COMPILE, null)),
        updateCode: (code: string) => dispatch(createAction(ActionType.UPDATE_CODE, code)),
        scale: (scale: number) => dispatch(createAction(ActionType.SCALE, scale)),
    }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;