import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';

import { generatePath, PolyPathDefinition } from './PathUtilities';
import { getColorFromArray } from './StyleUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import "src/Global.scss";
import './style/shapes.scss';

export const Path = React.memo(({defs, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const dispatch = useDispatch();

    const pathDefn: PolyPathDefinition = useSelector((store:scuteStore) => generatePath(store.root.lines, dispatch, defs.segments));
    let bbox = pathDefn.bbox;

    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : "none",
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : "black",
        strokeWidth: defs.styles['strokeWidth'] ? defs.styles['strokeWidth'] : "3px",
    }

    return (
        <g className="hoverGroup" onMouseDown={()=>setHandleable(!handleable)}>
            <path className={(handleable ? 'handleable' : '')}
                d={pathDefn.defn} 
                style={styles}
            ></path>
            { hovering ?
                pathDefn.handles
            : false}
        </g>
    );
 });