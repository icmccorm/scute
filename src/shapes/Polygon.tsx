import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';
import {Segment, generateHandles, generatePoints} from './PathUtilities';
import { getColorFromArray } from './StyleUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

export const Polygon = React.memo(({defs, children}:ShapeProps) => {
    let segments: Array<Segment> = defs.segments;
    const[hovering, setHover] = React.useState(false);
    const dispatch = useDispatch();

    const links = useSelector((store: scuteStore) => store.root.lines);

    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : null,
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : null,
        strokeWidth: defs.styles['strokeWidth'],
    }
    return (
        <g className="hoverGroup" onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
            <polygon className={(hovering ? 'hover' : '')}
                points={generatePoints(links, segments)} 
                style={styles}
            ></polygon>
            {hovering ? 
                generateHandles(links, dispatch, segments)    
            : null} 
            {children}
        </g>
    );
 });