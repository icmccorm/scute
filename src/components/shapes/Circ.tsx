import * as React from 'react';
import {RefObject} from 'react';
import {LinkedValue} from './LinkedValue';
import Handle from '../Handle';

import "./handles.css";
import { EventClient } from '../../EventClient';

export type Props = {attrs: any, client: EventClient};
export type State = {
	cx: LinkedValue, 
	cy: LinkedValue, 
	r: LinkedValue, 
	hovering: boolean,
};

export default class Circ extends React.Component<Props, any>{
	readonly props: Props;
	readonly state: State;
	group: RefObject<SVGGElement>;
	pos: RefObject<SVGCircleElement>;
	rad: RefObject<SVGCircleElement>;
	circ: RefObject<SVGCircleElement>;

	constructor(props){
		super(props);
		this.state = {
			cx: new LinkedValue(props.attrs.cx, props.client),
			cy: new LinkedValue(props.attrs.cy, props.client),
			r: new LinkedValue(props.attrs.r, props.client),
			hovering: false,
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