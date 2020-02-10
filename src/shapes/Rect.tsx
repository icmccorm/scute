import * as React from 'react';
import {ShapeProps, ShapeState, Tag} from './Shape';
import {useSelector} from 'react-redux';
import { ValueLink, getLinkedValue } from '../redux/ScuteStore';
import Handle from './Handle';

export const Rect = ({defs}) => {
    let attrs: Array<ValueLink> = defs.attrs;
    console.log(attrs);
    const lines = useSelector(store => store.root.lines);

    const[state, setState] = React.useState({
        hovering: false,
        style: {},
        x: getLinkedValue(lines, attrs['x']),
        y: getLinkedValue(lines, attrs['y']),
        width: getLinkedValue(lines, attrs['width']),
        height: getLinkedValue(lines, attrs['height']), 
    });

    return (
        <g className="hoverGroup">
            <rect className={(state.hovering ? 'hover' : '')}
                x={state.x} 
                y={state.y} 
                width={state.width} 
                height={state.height}
            ></rect>
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