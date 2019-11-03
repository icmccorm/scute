import * as React from 'react';
import {RefObject} from 'react';
import {LinkedValue} from './LinkedValue';
import Handle from '../Handle';

import "./handles.css";
import { EventClient } from 'src/EventClient';

export type Props = {attrs: any, client: EventClient};
export type State = {
	x: LinkedValue, 
	y: LinkedValue, 
	width: LinkedValue, 
	height: LinkedValue,
	hovering: boolean,
};

export default class Rect extends React.Component<Props, any>{
	readonly props: Props;
	readonly state: State;
	group: RefObject<SVGGElement>;
	pos: RefObject<SVGCircleElement>;
	width: RefObject<SVGCircleElement>;
	height: RefObject<SVGCircleElement>;
	rect: RefObject<SVGRectElement>;

	constructor(props){
		super(props);
		this.state = {
			x: new LinkedValue(props.attrs.x, props.client),
			y: new LinkedValue(props.attrs.y, props.client),
			width: new LinkedValue(props.attrs.width, props.client),
			height: new LinkedValue(props.attrs.height, props.client),
			hovering: false,
		}

		this.group = React.createRef<SVGGElement>();
		this.pos = React.createRef<SVGCircleElement>();
		this.width = React.createRef<SVGCircleElement>();
		this.height = React.createRef<SVGCircleElement>();
		this.rect = React.createRef<SVGRectElement>();
	}

	componentDidMount(){
		this.group.current.addEventListener("mouseenter", () => {
			this.setState({hovering: true});
		})
		this.group.current.addEventListener("mouseleave", () => {
			this.setState({hovering: false});
		})
	}

	setPosition = (dx:number, dy: number) =>{
		this.setState({
			x: this.state.x.diffValue(dx),
			y: this.state.y.diffValue(dy),
		})
		console.log(dx + " " + dy);
	}

	setWidth = (dx: number, dy: number) =>{
		this.setState({
			width: this.state.width.diffValue(dx)
		})
		console.log(dx + " " + dy);

	}

	setHeight = (dx: number, dy: number) =>{
		this.setState({
			height: this.state.height.diffValue(dy)
		})
		console.log(dx + " " + dy);

	}

	render(){
		return (
			<g ref={this.group} className="hoverGroup">
				<rect ref={this.rect} className={(this.state.hovering ? 'hover' : '')}
					x={this.state.x.current} 
					y={this.state.y.current} 
					width={this.state.width.current} 
					height={this.state.height.current}
				></rect>

				{this.state.hovering ?
					<g>
						<Handle
							cx={this.state.x.current + 0.5*this.state.width.current}
							cy={this.state.y.current + this.state.height.current}
							adjust={this.setHeight}
						></Handle>
						<Handle
							cx={this.state.x.current + 0.5*this.state.width.current}
							cy={this.state.y.current + 0.5*this.state.height.current}
							adjust={this.setPosition}
						></Handle>
						<Handle
							cx={this.state.x.current + this.state.width.current}
							cy={this.state.y.current + 0.5*this.state.height.current}
							adjust={this.setWidth}
						></Handle>
					</g>
				: null}
			</g>
		);
	}
}