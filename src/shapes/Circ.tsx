import * as React from 'react';
import {ShapeProps, ShapeState, Tag} from './Shape';
import {useSelector} from 'react-redux';
import { ValueLink, getLinkedValue } from '../redux/ScuteStore';
import Handle from './Handle';

export const Circ = ({defs}) => {
    let attrs: Array<ValueLink> = defs.attrs;
    console.log(attrs);
    const lines = useSelector(store => store.root.lines);

    const[state, setState] = React.useState({
        hovering: false,
        style: {},
        r: getLinkedValue(lines, attrs['r']),
        cx: getLinkedValue(lines, attrs['cx']),
        cy: getLinkedValue(lines, attrs['cy']),
    });

    return (
		<g className="hoverGroup">
			<circle className={(state.hovering ? 'hover' : '')}
				cx={state.cx} 
				cy={state.cy} 
				r={state.r} 
				style={state.style}
			></circle>
		</g>
    );
 }

 /*
        {state.hovering ?
            <g>
                <Handle
                    cx={state.x + 0.5*state.width}
                    cy={state.y + state.height}
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