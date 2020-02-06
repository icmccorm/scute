import * as React from 'react';
import {ShapeProps, ShapeState, Tag} from './Shape';
import {useSelector} from 'react-redux';
import { ValueLink, getLinkedValue } from '../redux/ScuteStore';
import Handle from './Handle';

export const Circ = (defs: any) => {
    let attrs: Array<ValueLink> = defs.attrs;
    console.log(attrs);
    const linkedAttributes = useSelector(state => {
        let lines = state.root.lines;
        return ({
            r: getLinkedValue(lines, attrs['r']),
            cx: getLinkedValue(lines, attrs['cx']),
            cy: getLinkedValue(lines, attrs['cy']),
        });
    });

    const[state, setState] = React.useState(Object.assign({}, linkedAttributes, {
        hovering: false,
        style: {}
    }));

    return (
		<g ref={this.group} className="hoverGroup">
			<circle ref={this.circ} className={(this.state.hovering ? 'hover' : '')}
				cx={this.state.cx.current} 
				cy={this.state.cy.current} 
				r={this.state.r.current} 
				style={this.state.style}
			></circle>
		</g>
    );
 }

 /*
        {state.hovering ?
            <g>
                <Handle
                    cx={state.x.current + 0.5*state.width}
                    cy={state.y.current + state.height}
                    adjust={this.setHeight}
                ></Handle>
                <Handle
                    cx={state.x + 0.5*state.width}
                    cy={state.y + 0.5*state.height}
                    adjust={this.setPosition}
                ></Handle>
                <Handle
                    cx={state.x + state.width}
                    cy={state.y + 0.5*state.height}
                    adjust={this.setWidth}
                ></Handle>
            </g>
        : null}
 */