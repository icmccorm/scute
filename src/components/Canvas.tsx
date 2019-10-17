import * as React from 'react';
import './css/Canvas.css';
import {Shape, Tag} from './shapes/Shape';
import {EventClient, Events} from '../EventClient';

type Props = {client: EventClient}
type State = {frame: any}

class Canvas extends React.PureComponent<Props, State> {
	timer: any;
	state: State;
	client: EventClient;

	constructor(props: Props){
		super(props);
		this.state = {
			frame: []
		}
	}

	play(){
		this.timer = setInterval(()=>{
			this.props.client.requestFrame();
		}, 500);
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
				return <Shape key={item.id} defs={item}/>
			}): null;
			this.setState({frame: tags});
		});
	}
	render () {
		return (
			<div className= 'canvas shadow'>
				<svg id='canvas'>
					{this.state.frame}
				</svg>
			</div>
		);
	}
}
 
export default Canvas;

