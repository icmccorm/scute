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

    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : "none",
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : "black",
        strokeWidth: defs.styles['strokeWidth'] ? defs.styles['strokeWidth'] : "3px",
    }

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
        <g className="hoverGroup" onMouseDown={toggleHandle}>
            <path
                d={pathDefn.defn} 
                style={styles}
            ></path>
            { handleable ?
                pathDefn.handles
            : false}
        </g>
    );
 });