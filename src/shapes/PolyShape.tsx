import * as React from 'react';
import { ShapeProps } from './Shape';
import { useSelector, useDispatch } from 'react-redux';
import { SegmentsRendered, renderPolyshape } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';
import { Shapes } from 'src/lang-c/scute.js';

import './style/shapes.scss';
import './style/Handle.scss';

export const PolyShape = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const dispatch = useDispatch();
    const polyDefn:SegmentsRendered = useSelector((store:scuteStore) => renderPolyshape(store.root.lines, dispatch, defs.segments));

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
        <g className="hoverGroup" onMouseDown={toggleHandle}>

            {defs.tag == Shapes.POLYG ?
                <polygon
                    points={polyDefn.defn} 
                    style={style}
                ></polygon>
                :
                <polyline
                    points={polyDefn.defn} 
                    style={style}
                ></polyline>
            }

            {handleable ?
                polyDefn.handles
            : null} 
        </g>
    );
 });