import * as React from 'react';
import { Jump, Vertex, Arc, Cubic, Quadratic, Turtle, Segment, RenderedSegment } from '../segmented/PathUtilities';
import BasicHandle from 'src/shapes/handles/BasicHandle';
import ThunkHandle from 'src/shapes/handles/ThunkHandle';
import { Segments } from 'src/lang-c/library-interop';

type SegmentHandleGroupProps = {
    segments: Array<Segment>,
    renders: Array<RenderedSegment>,
    visible: boolean
}

export const HandleGroup = ({segments, renders, visible}:SegmentHandleGroupProps) => {
    console.log(segments);
    return (
        <g className={!visible ? "hidden" : ""}>
			{
				segments.map((segment, index) => {
					switch(segment.type){
                        case Segments.JUMP:
                        case Segments.VERTEX: {
                            let handle = segment as (Jump | Vertex);
                            return <BasicHandle key={index} v={handle.point}/>
                        }
                        case Segments.ARC: {
                            let handle = segment as Arc;
                            let thunkSet = renders.shift();
                            return [
                                <BasicHandle key={index} v={handle.center}/>,
                                <ThunkHandle key={index} segment={handle} thunk={thunkSet.thunk} pos={thunkSet.point}></ThunkHandle>
                            ];
                        }
                        case Segments.CBEZIER: {
                            let handle = segment as Cubic;
                            return [
                                <BasicHandle key={index} v={handle.control1}/>,
                                <BasicHandle key={index + 0.25} v={handle.control2}/>,
                                <BasicHandle key={index + 0.5} v={handle.end}/>
                            ];
                        }
                        case Segments.QBEZIER: {
                            let handle = segment as Quadratic;
                            return [
                                <BasicHandle key={index} v={handle.control}/>,
                                <BasicHandle key={index} v={handle.end}/>
                            ];
                        }
                        case Segments.TURTLE: {
                            let handle = segment as Turtle;
                            let thunkSet = renders.shift();
                            console.log(thunkSet);
                            return <ThunkHandle key={index} segment={handle} thunk={thunkSet.thunk} pos={thunkSet.point}></ThunkHandle>;
                        }
                        default:
                            return null;
                    }
				})
			}
		</g>
    );
 }