import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';

import { renderPath, SegmentsRendered } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import "src/Global.scss";
import './style/shapes.scss';

export const Path = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const dispatch = useDispatch();

    const pathDefn: SegmentsRendered = useSelector((store:scuteStore) => renderPath(store.root.lines, dispatch, store.root.segments, defs.segments));

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
        <g className="hoverGroup" onMouseDown={toggleHandle}>
            <path
                d={pathDefn.defn} 
                style={style}
            ></path>
            { handleable ?
                pathDefn.handles
            : false}
        </g>
    );
 });