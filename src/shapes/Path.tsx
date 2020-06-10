import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';

import { generatePath, PolyPathDefinition } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import "src/Global.scss";
import './style/shapes.scss';

export const Path = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const dispatch = useDispatch();

    const pathDefn: PolyPathDefinition = useSelector((store:scuteStore) => generatePath(store.root.lines, dispatch, defs.segments));

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