import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';
import {PolyPathDefinition, generatePoly} from './PathUtilities';
import { getColorFromArray } from './StyleUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

export const Polyline = React.memo(({defs, children}:ShapeProps) => {
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
            <polyline className={(hovering ? 'hover' : '')}
                points={polyDefn.defn} 
                style={styles}
            ></polyline>
            {hovering ? 
                polyDefn.handles
            : null}
        </g>
    );
 });