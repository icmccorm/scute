import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector} from 'react-redux';
import Handle from './Handle';
import {Segment, SegmentType} from './PathUtilities';

export const Polygon = React.memo(({defs, children}:ShapeProps) => {
    let segments: Array<Segment> = defs.segments;
    const[hovering, setHover] = React.useState(false);

    const adjustPoint = (dx: number, dy: number, segment: Segment) => {
        switch(segment.type){
            case SegmentType.SG_JUMP:
                
                break;
            case SegmentType.SG_TURTLE:

                break;
            case SegmentType.SG_VERTEX:

                break;
        }
    }

    let points = '';
    let handles: Array<any> = [];
    for(let i = 0; i<defs.segments.length; ++i){
        let point = segments[i].point;
        points += point[0] + "," + point[1] + ' ';
        handles.push(
            <Handle key={i} cx={point[0]} cy={point[1]} adjust={(dx, dy) => adjustPoint(dx, dy, segments[i])}/>
        );
    }
    
    return (
        <g className="hoverGroup" onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
            <polygon className={(hovering ? 'hover' : '')}
                points={points} 
            ></polygon>
            {hovering ? 
                handles
            : null}
        </g>
    );
 });