import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';
import Handle from './Handle';
import { ValueLink, getLinkedValue, ValueMeta, manipulation, LinkType, StatusType } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';

export const Circ = ({defs}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
    let dispatch = useDispatch();

    const cxValue:ValueMeta = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['cx']));
    const cyValue:ValueMeta = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['cy']));
    const rValue:ValueMeta = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['r']));
    
    let centerHandleEnabled = attrs['cx'].status != StatusType.COMP && attrs['cy'].status != StatusType.COMP;
    let radiusHandleEnabled = attrs['r'].status != StatusType.COMP;
    
    const[hovering, setHover] = React.useState(false);

    const setRadius = (dx: number, dy: number) => {
        dispatch(manipulation(dx, attrs['r']));
    }

    const setPosition = (dx: number, dy: number) => {
        dispatch(manipulation(dx, attrs['cx']));
        dispatch(manipulation(dy, attrs['cy']));
    }

    return (
		<g className="hoverGroup" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
			<circle className={(hovering ? 'hover' : '')}
				cx={cxValue.value} 
				cy={cyValue.value} 
				r={rValue.value} 
			></circle>

            {hovering ?
                <g>
                    {radiusHandleEnabled ?                     
                        <Handle
                            cx={cxValue.value + rValue.value}
                            cy={cyValue.value}
                            adjust={setRadius}
                        ></Handle>
                    : null}
                    {centerHandleEnabled ?
                        <Handle
                            cx={cxValue.value}
                            cy={cyValue.value}
                            adjust={setPosition}
                        ></Handle>
                    : null}
                </g>
            : null}
		</g>
    );
 }