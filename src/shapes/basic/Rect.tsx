import * as React from 'react';
import {ShapeProps} from '../Shape';
import {useSelector} from 'react-redux';
import { getLinkedVector } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';
import BasicHandle from 'src/shapes/handles/BasicHandle';


export const Rect = ({defs, style}:ShapeProps) => {
    
    let attrs = defs.attrs;

    const position:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['position']));
    const size:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['size']));

    const[handleable, setHandleable] = React.useState(false);
    
    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
        <g className="hoverGroup" 
            onMouseDown={toggleHandle} 
        >
            <rect className={(handleable ? 'hover' : '')}
                x={position[0]} 
                y={position[1]} 
                width={size[0]} 
                height={size[1]}
                style={style}
            ></rect>
            {handleable ?
                <g>
                    <BasicHandle vy={attrs['size'][1]} cx={position[0] + 0.5*size[0]} cy={position[1] + size[1]}/>
                    <BasicHandle vx={attrs['size'][0]} cx={position[0] + size[0]} cy={position[1] + 0.5*size[1]}/>
                    <BasicHandle v={attrs['position']} cx={position[0] + 0.5*size[0]} cy={position[1] + 0.5*size[1]}/>
                </g>
            : null}
        </g>

    );
 }