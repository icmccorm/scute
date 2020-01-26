import * as React from 'react';

import Navbar from './Navbar';
import Log from 'src/components/Log';
import Editor from 'src/components/Editor';
import Button from 'src/components/Button';
import Canvas from 'src/components/Canvas';
import Dragger from 'src/components/Dragger';
import {EventClient, Events} from 'src/events/EventClient';
import {Shape, Tag} from 'src/shapes/Shape';

import {connect} from 'react-redux';

import './style/AppContainer.scss';

type State = {log: string, output: string, code: string, canvasWidth: number, canvasHeight: number, originX: number, originY: number, frame: any};
type Props = {defaultHeight: number, defaultWidth: number};

export class App extends React.Component<Props, State> { 
    readonly state: State;
    readonly props: Props;
    eventClient: EventClient;
    leftWrapper: any; 
    rightWrapper: any;
    
    constructor(props){
        super(props);
        this.state = { 
            log: "",
            output: "",
            code: "",
            canvasWidth: props.defaultWidth,
            canvasHeight: props.defaultHeight,
            originX: 0,
            originY: 0,
            frame: [],
        }
        this.eventClient = new EventClient();
        this.leftWrapper = React.createRef();
        this.rightWrapper = React.createRef();
    }

    updateCode = (value: string) => {
        this.setState({code: value});
    }
    
    async print (value: string) {
        this.setState({log: this.state.log + (value)});
    }

    runCode = async () => {
        await this.setState({log: ""});

        this.eventClient.requestCompile(this.state.code)
    }
    
    componentDidMount() {
        this.eventClient.on(Events.PRINT_OUT, async (data) => {
            await this.print(data);
        })
        this.eventClient.on(Events.PRINT_ERROR, async (data) => {
            await this.print(data);
        })
    }

    adjustLeft = (dx: number) => {
        let lNode = this.leftWrapper.current;
        let rNode = this.rightWrapper.current;
        if(lNode && rNode){
            lNode.style.width = dx + "px";
            lNode.style.flexGrow = 0;
        }
    }

    resetCanvas = (event) => {
        this.setState({
            canvasHeight: this.props.defaultHeight,
            canvasWidth: this.props.defaultWidth
        });
    }

	getViewBox(){
		return [
			this.state.originX,
			this.state.originY, 
			this.props.defaultWidth, 
			this.props.defaultHeight
		].join(" ");
	}

	zoomCanvas = (event: React.WheelEvent<HTMLDivElement>) => {
        let change = event.deltaY;
        this.setState({
            canvasWidth: this.state.canvasWidth + change,
            canvasHeight: this.state.canvasHeight + change,
        });
    }

	generateFrame(data){
        //Triggered on ActionType.FRAME, receives the output from webworker.
		/*const tags = data ? data.map((item) => {
			return <Shape client={null} key={item.id} defs={item}/>
		}): null;
		this.setState({frame: tags});*/
	}

    render () {
        return (     
            <div className='root flex outer-flex'>
                <div className='text-wrapper' ref={this.leftWrapper}>
                    <div className='inner-text-wrapper flex inner-flex max'>
                        <Editor client={this.eventClient} handleChange={this.updateCode}></Editor>
                        <Log value={this.state.log}/>
                    </div>
                    <Dragger adjust={this.adjustLeft}/> 
                </div>

                <div className='view-wrapper darkgray-b' ref={this.rightWrapper}> 
                    <Navbar>
                        <Button onClick={this.runCode}>Run</Button>
                        <Button>Export</Button>
                        <Button onClick={this.resetCanvas}>Fit</Button>
                    </Navbar>
                    <div className="view-flex min-max" onWheel={this.zoomCanvas}>
                        <svg 
                            width={this.state.canvasWidth} 
                            height={this.state.canvasHeight} 
                            className='canvas shadow' 
                            viewBox={this.getViewBox()}
                        >
                            {this.state.frame}
                        </svg>
			        </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        defaultWidth: state.defaultWidth,
        defaultHeight: state.defaultHeight,
    };
}

function mapDispatchToProps(){
    
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;