import * as React from 'react';
import {ShapeProps, ShapeState, Tag} from './Shape';
import {useSelector} from 'react-redux';
import { ValueLink, getLinkedValue } from '../redux/ScuteStore';
import Handle from './Handle';

export const Rect = (defs: any) => {
    let attrs: Array<ValueLink> = defs.attrs;
    console.log(attrs);
    const linkedAttributes = useSelector(state => {
        let lines = state.root.lines;
        return ({
            x: getLinkedValue(state.root.lines, attrs['x']),
            y: getLinkedValue(state.root.lines, attrs['y']),
            width: getLinkedValue(state.root.lines, attrs['width']),
            height: getLinkedValue(state.root.lines, attrs['height']), 
        });
    });

    const[state, setState] = React.useState(Object.assign({}, linkedAttributes, {
        hovering: false,
        style: {}
    }));

    return (
        <g ref={this.group} className="hoverGroup">
            <rect ref={this.rect} className={(state.hovering ? 'hover' : '')}
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