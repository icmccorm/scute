import * as React from 'react';
import {ShapeProps} from '../Shape';
import {useSelector} from 'react-redux';
import { generatePath, SegmentsRendered } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import "src/Global.scss";
import '../style/shapes.scss';
import { HandleGroup } from '../handles/HandleGroup';

export const Path = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const pathDefn: SegmentsRendered = useSelector((store:scuteStore) => generatePath(store.root.lines, defs.segments));

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
        <g className="hoverGroup" onMouseDown={toggleHandle}>
            <path
                d={pathDefn.defn} 
                style={style}
            ></path>
            <HandleGroup visible={handleable} segments={defs.segments} renders={pathDefn.renders}/>
        </g>
    );
 });