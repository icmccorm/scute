import * as React from 'react';
import { ShapeProps } from '../Shape';
import { useSelector, useDispatch } from 'react-redux';
import { generateChaikinized, SegmentsRendered } from './PathUtilities';
import { scuteStore } from 'src/redux/ScuteStore';

import '../style/shapes.scss';
import '../style/Handle.scss';
import ThunkHandle from '../handles/ThunkHandle';

export const Ungon = React.memo(({defs, style, children}:ShapeProps) => {
    const[handleable, setHandleable] = React.useState(false);
    const dispatch = useDispatch();
    const ungonDefn:SegmentsRendered = useSelector((store:scuteStore) => generateChaikinized(store.root.lines, dispatch, defs.segments, true));

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
        <g className="hoverGroup" onMouseDown={toggleHandle}>
			<path
				d={ungonDefn.defn} 
				style={style}>
			</path>

            <g className={!handleable ? "hidden" : ""}>
            {
                ungonDefn.renders.map((thunkSet, index) => {
                    return <ThunkHandle key={index} segment={thunkSet.segment} thunk={thunkSet.thunk} pos={thunkSet.point}/>
                })
            }
            </g>
        </g>
    );
 });