import * as React from 'react';
import {RefObject} from 'react';
import {LinkedValue} from 'src/events/LinkedValue';
import Handle from 'src/components/Handle';
import {ShapeProps, ShapeState} from './Shape'

import "src/components/style/Handle.scss";

type Props = ShapeProps;
type State = {
	cx: any,//LinkedValue, 
	cy: any,//LinkedValue, 
	r: any,//LinkedValue, 
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
			cx: attrs.cx, //new LinkedValue(attrs.cx, props.client),
			cy: attrs.cy, //new LinkedValue(attrs.cy, props.client),
			r: attrs.r, //new LinkedValue(attrs.r, props.client),
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
			cx: this.state.cx,//this.state.cx.diffValue(dx),
			cy: this.state.cy,//this.state.cy.diffValue(dy),
		})
	}

	setRadius = (dx: number, dy: number) =>{
		this.setState({
			r: this.state.r, //this.state.r.diffValue(dx)
		})
	}

	render(){
		return (
			<g ref={this.group} className="hoverGroup">
				<circle ref={this.circ} className={(this.state.hovering ? 'hover' : '')}
					cx={this.state.cx } 
					cy={this.state.cy } 
					r={this.state.r } 
					style={this.state.style}
				></circle>

				{this.state.hovering ?
					<g>
						<Handle
							cx={this.state.cx  + this.state.r }
							cy={this.state.cy }
							adjust={this.setRadius}
						></Handle>
						<Handle
							cx={this.state.cx}// }
							cy={this.state.cy }
							adjust={this.setPosition}
						></Handle>
					</g>
				: null}
			</g>
		);
	}
}