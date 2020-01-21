import * as React from 'react';
import {RefObject} from 'react';
import {LinkedValue} from 'src/events/LinkedValue';
import Handle from 'src/components/Handle';
import {ShapeProps, ShapeState} from './Shape'

import "src/components/css/Handle.css";
import { EventClient } from '../events/EventClient';

type Props = ShapeProps;
type State = {
	cx: LinkedValue, 
	cy: LinkedValue, 
	r: LinkedValue, 
} & ShapeState;

export default class Circ extends React.Component<Props, any>{
	readonly props: Props;
	readonly state: State;
	group: RefObject<SVGGElement>;
	pos: RefObject<SVGCircleElement>;
	rad: RefObject<SVGCircleElement>;
	circ: RefObject<SVGCircleElement>;

	constructor(props){
		super(props);
		this.props = props;
		let attrs:any = props.defs.attrs;
		this.state = {
			cx: new LinkedValue(attrs.cx, props.client),
			cy: new LinkedValue(attrs.cy, props.client),
			r: new LinkedValue(attrs.r, props.client),
			hovering: false,
			style: this.props.defs.style.values
		}
		this.group = React.createRef<SVGGElement>();
		this.pos = React.createRef<SVGCircleElement>();
		this.rad = React.createRef<SVGCircleElement>();
		this.circ = React.createRef<SVGCircleElement>();
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
			cx: this.state.cx.diffValue(dx),
			cy: this.state.cy.diffValue(dy),
		})
	}

	setRadius = (dx: number, dy: number) =>{
		this.setState({
			r: this.state.r.diffValue(dx)
		})
	}

	render(){
		return (
			<g ref={this.group} className="hoverGroup">
				<circle ref={this.circ} className={(this.state.hovering ? 'hover' : '')}
					cx={this.state.cx.current} 
					cy={this.state.cy.current} 
					r={this.state.r.current} 
					style={this.state.style}
				></circle>

				{this.state.hovering ?
					<g>
						<Handle
							cx={this.state.cx.current + this.state.r.current}
							cy={this.state.cy.current}
							adjust={this.setRadius}
						></Handle>
						<Handle
							cx={this.state.cx.current}
							cy={this.state.cy.current}
							adjust={this.setPosition}
						></Handle>
					</g>
				: null}
			</g>
		);
	}
}