import * as React from 'react';
import { ShapeProps, ShapeType } from './Shape';
import { useSelector, useDispatch } from 'react-redux';
import { PolyPathDefinition, generatePoly } from './PathUtilities';
import { getColorFromArray } from './StyleUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import './style/shapes.scss';
import './style/Handle.scss';

export const PolyShape = React.memo(({defs, children}:ShapeProps) => {
    const[hovering, setHover] = React.useState(false);
    const dispatch = useDispatch();
    const polyDefn:PolyPathDefinition = useSelector((store:scuteStore) => generatePoly(store.root.lines, dispatch, defs.segments));
    let bbox = polyDefn.bbox;
    
    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : null,
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : null,
        strokeWidth: defs.styles['strokeWidth'],
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

            {defs.tag == ShapeType.SP_POLYG ?
                <polygon className={(hovering ? 'hover' : '')}
                    points={polyDefn.defn} 
                    style={styles}
                ></polygon>
                :
                <polyline className={(hovering ? 'hover' : '')}
                    points={polyDefn.defn} 
                    style={styles}
                ></polyline>
            }

            {hovering ?
                polyDefn.handles
            : null} 
            <circle cx={bbox.centroid[0]} cy={bbox.centroid[1]} r={1} className="handle" ></circle>
        </g>
    );
 });