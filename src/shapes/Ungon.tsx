import * as React from 'react';
import { ShapeProps, ShapeType } from './Shape';
import { useSelector, useDispatch } from 'react-redux';
import { PolyPathDefinition, generatePoly } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import './style/shapes.scss';
import './style/Handle.scss';

export const Ungon = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const dispatch = useDispatch();
    const ungonDefn:PolyPathDefinition = useSelector((store:scuteStore) => generateUngon(store.root.lines, dispatch, defs.segments));

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