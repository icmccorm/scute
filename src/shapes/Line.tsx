import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';
import Handle from './Handle';
import { ValueLink, manipulate, vecManipulation, getLinkedVector } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';
import { getColorFromArray } from './StyleUtilities';

export const Line = ({defs}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
    let dispatch = useDispatch();

    const start:number = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['start']));
    const end:number = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['end']));
    
    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : null,
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : null,
        strokeWidth: defs.styles['strokeWidth'],
    }

    const[handleable, setHandleable] = React.useState(false);

    const setStart = (dx: number, dy: number) => {
        dispatch(manipulate(vecManipulation(dx, dy, attrs['start'])));
    }

    const setEnd = (dx: number, dy: number) => {
        dispatch(manipulate(vecManipulation(dx, dy, attrs['end'])));
    }

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
		<g className="hoverGroup" onMouseDown={toggleHandle}>
            <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} style={styles}></line>
            {handleable ?
                <g>         
                    <Handle
                        cx={start[0]}
                        cy={start[1]}
                        adjust={setStart}
                    ></Handle>
                    <Handle
                        cx={end[0]}
                        cy={end[1]}
                        adjust={setEnd}
                    ></Handle>
                </g>
            : null}
		</g>
    );
 }