import * as React from 'react';
import {useDispatch} from 'react-redux';
import {ShapeProps} from './Shape';
import {useSelector} from 'react-redux';
import Handle from './Handle';
import { getLinkedValue, manipulation } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';


export const Rect = ({defs}:ShapeProps) => {
    let attrs = defs.attrs;
    const dispatch = useDispatch();

    const xValue:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['x']));
    const yValue:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['y']));
    const widthValue:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['width']));
    const heightValue:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['height']));

    const[hovering, setHover] = React.useState(false);

    const setHeight = (dx: number, dy:number) => {
        dispatch(manipulation(dy, attrs['height']));
    }

    const setPosition = (dx: number, dy:number) => {
        dispatch(manipulation(dx, attrs['x']));
        dispatch(manipulation(dy, attrs['y']))
    }

    const setWidth = (dx: number, dy:number) => {
        dispatch(manipulation(dx, attrs['width']));
    }

    return (
        <g className="hoverGroup" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <rect className={(hovering ? 'hover' : '')}
                x={xValue} 
                y={yValue} 
                width={widthValue} 
                height={heightValue}
              //  style={styleValues}
            ></rect>
            {hovering ?
                <g>
                    <Handle
                        cx={xValue + 0.5*widthValue}
                        cy={yValue + heightValue}
                        adjust={setHeight}
                    ></Handle>
                    <Handle
                        cx={xValue + 0.5*widthValue}
                        cy={yValue + 0.5*heightValue}
                        adjust={setPosition}
                    ></Handle>
                    <Handle
                        cx={xValue + widthValue}
                        cy={yValue + 0.5*heightValue}
                        adjust={setWidth}
                    ></Handle>
                </g>
            : null}
        </g>

    );
 }