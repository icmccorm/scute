import * as React from 'react';
import { useSelector } from 'react-redux';
import { SegmentsRendered, generatePoly } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';
import { HandleGroup } from '../handles/HandleGroup';
import { ShapeProps } from '../Shape';
import { Shapes } from 'src/lang-c/library-interop';

import '../style/shapes.scss';
import '../style/Handle.scss';

export const PolyShape = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const polyDefn:SegmentsRendered = useSelector((store:scuteStore) => generatePoly(store.root.lines, defs.segments));
    
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
            <HandleGroup visible={handleable} segments={defs.segments} renders={polyDefn.renders}/>
        </g>
    );
 });