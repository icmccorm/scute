import * as React from 'react';
import './style/Canvas.scss';
import {Shape, Tag} from 'src/shapes/Shape';
import {EventClient, Events} from 'src/events/EventClient';

type Props = {client: EventClient, width:number, height:number}
type State = {frame: any, originX: number, originY: number}
class Canvas extends React.PureComponent<Props, State> {
	timer: any;
	state: State;
	client: EventClient;

	constructor(props: Props){
		super(props);
		this.state = {
			frame: [],
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

	render () {
		return (
				<svg 
					width={this.props.width} 
					height={this.props.height} 
					className='canvas shadow' 
					viewBox={this.getViewBox()}
				>
					{this.state.frame}
				</svg>
		);
	}
}
 
export default Canvas;