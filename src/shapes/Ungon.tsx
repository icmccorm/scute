import * as React from 'react';
import { ShapeProps } from './Shape';
import { useSelector, useDispatch } from 'react-redux';
import { SegmentsRendered, generateChaikinized } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import './style/shapes.scss';
import './style/Handle.scss';

export const Ungon = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const dispatch = useDispatch();
    const ungonDefn:SegmentsRendered = useSelector((store:scuteStore) => generateChaikinized(
        store.root.lines, 
        dispatch, 
        store.root.segments,
        defs.segments, 
        defs.attrs['closed']
    ));

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
        <g className="hoverGroup" onMouseDown={toggleHandle}>
			<path
				d={ungonDefn.defn} 
				style={style}>
			</path>
            {handleable ?
                ungonDefn.handles
            : null} 
        </g>
    );
 });