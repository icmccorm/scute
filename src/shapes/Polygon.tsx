import * as React from 'react';
import { ShapeProps } from './Shape';
import { useSelector, useDispatch } from 'react-redux';
import {generatePoly, PolyPathDefinition } from './PathUtilities';
import { getColorFromArray } from './StyleUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

export const Polygon = React.memo(({defs, children}:ShapeProps) => {
    const[hovering, setHover] = React.useState(false);
    const dispatch = useDispatch();

    const polyDefn:PolyPathDefinition = useSelector((store:scuteStore) => generatePoly(store.root.lines, dispatch, defs.segments));

    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : null,
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : null,
        strokeWidth: defs.styles['strokeWidth'],
    }

    return (
        <g className="hoverGroup" onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
            <polygon className={(hovering ? 'hover' : '')}
                points={polyDefn.defn} 
                style={styles}
            ></polygon>
            {hovering ?
                polyDefn.handles
            : null} 
            {children}
        </g>
    );
 });