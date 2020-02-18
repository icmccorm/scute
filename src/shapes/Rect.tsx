import * as React from 'react';
import {useDispatch} from 'react-redux';
import {ShapeProps} from './Shape';
import {useSelector} from 'react-redux';
import Handle from './Handle';
import { ValueLink, ValueMeta, getLinkedValue, manipulation } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';


export const Rect = ({defs}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
    const dispatch = useDispatch();

    const xValue:ValueMeta = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['x']));
    const yValue:ValueMeta = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['y']));
    const widthValue:ValueMeta = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['width']));
    const heightValue:ValueMeta = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['height']));

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
                x={xValue.value} 
                y={yValue.value} 
                width={widthValue.value} 
                height={heightValue.value}
            ></rect>
            {hovering ?
                <g>
                    <Handle
                        cx={xValue.value + 0.5*widthValue.value}
                        cy={yValue.value + heightValue.value}
                        adjust={setHeight}
                    ></Handle>
                    <Handle
                        cx={xValue.value + 0.5*widthValue.value}
                        cy={yValue.value + 0.5*heightValue.value}
                        adjust={setPosition}
                    ></Handle>
                    <Handle
                        cx={xValue.value + widthValue.value}
                        cy={yValue.value + 0.5*heightValue.value}
                        adjust={setWidth}
                    ></Handle>
                </g>
            : null}
        </g>

    );
 }