import * as React from 'react';
import './style/Canvas.scss';
import {Shape, Tag} from 'src/shapes/Shape';
import {EventClient, Events} from 'src/events/EventClient';

type Props = {client: EventClient, width:number, height:number}
type State = {frame: any, width: number, height: number, originX: number, originY: number}
class Canvas extends React.PureComponent<Props, State> {
	timer: any;
	state: State;
	client: EventClient;

	constructor(props: Props){
		super(props);
		this.state = {
			frame: [],
			width: props.width,
			height: props.height,
			originX: 0,
			originY: 0
		}
	}

	play(){
		this.timer = setInterval(()=>{
			this.props.client.requestFrame();
		}, 10);
	}

	pause(){
		clearInterval(this.timer);
	}

	componentDidUpdate(prevProps){
		if(this.props.width != prevProps.width || this.props.height != prevProps.height){
			this.setState({
				width: this.props.width,
				height: this.props.height,
			})
		}
	}

	componentDidMount(){
		this.props.client.on(Events.REQ_COMPILE, () => {
			this.pause();
		});

		this.props.client.on(Events.FIN_COMPILE, (data) => {
			if(data > 1){
				this.play();
			}else{
				this.props.client.requestFrame();
			}
		});

		this.props.client.on(Events.FRAME, (data) => {
			const tags = data ? data.map((item) => {
				return <Shape client={this.props.client} key={item.id} defs={item}/>
			}): null;
			this.setState({frame: tags});
		});
	}

	getViewBox(){
		return [
			this.state.originX,
			this.state.originY, 
			this.props.width, 
			this.props.height
		].join(" ");
	}

	zoomCanvas = (event: React.WheelEvent<HTMLDivElement>) => {
        let change = event.deltaY;
        this.setState({
            width: this.state.width + change,
            height: this.state.height + change,
        });
    }

	render () {
		return (
			<div className="view-flex min-max" onWheel={this.zoomCanvas}>
				<svg 
					width={this.state.width} 
					height={this.state.height} 
					className='canvas shadow' 
					viewBox={this.getViewBox()}
				>
					{this.state.frame}
				</svg>
			</div>
		);
	}
}
export default Canvas;