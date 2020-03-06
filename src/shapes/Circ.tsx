import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';
import Handle from './Handle';
import { ValueLink, getLinkedValue, ValueMeta, manipulation, StatusType } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';
import { getColorFromArray } from './StyleUtilities';

export const Circ = ({defs}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
    let dispatch = useDispatch();

    const cxValue:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['cx']));
    const cyValue:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['cy']));
    const rValue:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['r']));
    
    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : null,
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : null,
        strokeWidth: defs.styles['strokeWidth'],
    }

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
				cx={cxValue} 
				cy={cyValue} 
                r={rValue} 
                style={styles}
			></circle>
            {hovering ?
                <g>         
                    <Handle
                        cx={cxValue + rValue}
                        cy={cyValue}
                        adjust={setRadius}
                    ></Handle>
                    <Handle
                        cx={cxValue}
                        cy={cyValue}
                        adjust={setPosition}
                    ></Handle>
                </g>
            : null}
		</g>
    );
 }