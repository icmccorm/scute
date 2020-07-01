import * as React from 'react';
import {useDispatch} from 'react-redux';
import {ShapeProps} from './Shape';
import {useSelector} from 'react-redux';
import Handle from './Handle';
import { manipulation, manipulate, getLinkedVector, vecManipulation } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';


export const Rect = ({defs, style}:ShapeProps) => {
    
    let attrs = defs.attrs;
    const dispatch = useDispatch();

    const position:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['position']));
    const size:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['size']));

    const[handleable, setHandleable] = React.useState(false);

    const setHeight = (dx: number, dy:number) => {
        dispatch(manipulate(manipulation(dy, attrs['size'][1])));
    }

    const setPosition = (dx: number, dy:number) => {
        dispatch(manipulate(vecManipulation(dx, dy, attrs['position'])));
    }

    const setWidth = (dx: number, dy:number) => {
        dispatch(manipulate(manipulation(dx, attrs['size'][0])));
    }
    
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
                    <Handle
                        cx={position[0] + 0.5*size[0]}
                        cy={position[1] + size[1]}
                        adjust={setHeight}
                    ></Handle>
                    <Handle
                        cx={position[0] + 0.5*size[0]}
                        cy={position[1] + 0.5*size[1]}
                        adjust={setPosition}
                    ></Handle>
                    <Handle
                        cx={position[0] + size[0]}
                        cy={position[1] + 0.5*size[1]}
                        adjust={setWidth}
                    ></Handle>
                </g>
            : null}
        </g>

    );
 }