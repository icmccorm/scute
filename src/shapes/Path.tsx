import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';

import Handle from './Handle';
import { generatePath, generateHandle, generateHandles } from './PathUtilities';
import { getColorFromArray } from './StyleUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

export const Path = React.memo(({defs, children}:ShapeProps) => {
    const[hovering, setHover] = React.useState(false);
    const dispatch = useDispatch();
    const links = useSelector((store:scuteStore) => store.root.lines);
    const pathData = useSelector((store:scuteStore) => generatePath(store.root.lines, defs.segments));

    const pathRef:React.RefObject<SVGPathElement> = React.createRef();

    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : "none",
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : "black",
        strokeWidth: defs.styles['strokeWidth'] ? defs.styles['strokeWidth'] : "3px",
    }
    return (
        <g className="hoverGroup" onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
            <path className={(hovering ? 'hover' : '')}
                ref={pathRef}
                d={pathData} 
                style={styles}
            ></path>
            {
                generateHandles(links, dispatch, defs.segments)    
            }
        </g>
    );
 });