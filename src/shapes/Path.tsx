import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';

import { generatePath, PolyPathDefinition } from './PathUtilities';
import { getColorFromArray } from './StyleUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import "src/Global.scss";
import './style/shapes.scss';

export const Path = React.memo(({defs, children}:ShapeProps) => {
    const[hovering, setHover] = React.useState(false);
    const dispatch = useDispatch();

    const pathDefn: PolyPathDefinition = useSelector((store:scuteStore) => generatePath(store.root.lines, dispatch, defs.segments));
    let bbox = pathDefn.bbox;

    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : "none",
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : "black",
        strokeWidth: defs.styles['strokeWidth'] ? defs.styles['strokeWidth'] : "3px",
    }

    return (
        <g className="hoverGroup" onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
            //This rectangle is present to expand the size of the hoverable area of the group to include all vertices, as well an additional %15 padding.
            <rect className="boundingBox"
                x={bbox.position[0]} 
                y={bbox.position[1]} 
                width={bbox.bounds[0]} 
                height={bbox.bounds[1]}>
            </rect>
            <path className={(hovering ? 'hover' : '')}
                d={pathDefn.defn} 
                style={styles}
            ></path>
            {
                pathDefn.handles
            }
        </g>
    );
 });