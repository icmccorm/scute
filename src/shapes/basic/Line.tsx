import * as React from 'react';
import {ShapeProps} from '../Shape';
import {useSelector} from 'react-redux';
import { ValueLink, getLinkedVector } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';
import BasicHandle from 'src/shapes/handles/BasicHandle';

export const Line = ({defs, style}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;

    const start:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['start']));
    const end:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['end']));

    const[handleable, setHandleable] = React.useState(false);

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
		<g className="hoverGroup" onMouseDown={toggleHandle}>
            <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} style={style}></line>
            {handleable ?
                <g>    
                    <BasicHandle v={attrs['start']} cx={start[0]} cy={start[1]}/>     
                    <BasicHandle v={attrs['end']} cx={end[0]} cy={end[1]}/>
                </g>
            : null}
		</g>
    );
 }