import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';
import Handle from './Handle';
import { ValueLink, manipulation, manipulate, getLinkedVector, vecManipulation } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';
import { getColorFromArray } from './StyleUtilities';

export const Ellipse = ({defs}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
	let dispatch = useDispatch();
    const position:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['position']));
    const radius: Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['radius']));
    
    const styles = {
        fill: defs.styles['fill'] ? getColorFromArray(defs.styles['fill']) : null,
        stroke: defs.styles['stroke'] ? getColorFromArray(defs.styles['stroke']) : null,
        strokeWidth: defs.styles['strokeWidth'],
    }

    const[hovering, setHover] = React.useState(false);

    const setRadX = (dx: number, dy: number) => {
        dispatch(manipulate(manipulation(dx, attrs['radius'][0])));
    }
    const setRadY = (dx: number, dy: number) => {
        dispatch(manipulate(manipulation(dy, attrs['radius'][1])));
    }

    const setPosition = (dx: number, dy: number) => {
        dispatch(manipulate(vecManipulation(dx, dy, attrs["position"])));
    }

    return (
		<g className="hoverGroup" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
			<ellipse className={(hovering ? 'hover' : '')}
				cx={position[0]} 
				cy={position[1]} 
                rx={radius[0]} 
				ry={radius[1]}
				style={styles}
			></ellipse>
            {hovering ?
                <g>         
                    <Handle
                        cx={position[0] + radius[0]}
                        cy={position[1]}
                        adjust={setRadX}
                    ></Handle>
                    <Handle
                        cx={position[0]}
                        cy={position[1] + radius[1]}
                        adjust={setRadY}
                    ></Handle>
                    <Handle
                        cx={position[0]}
                        cy={position[1]}
                        adjust={setPosition}
                    ></Handle>
                </g>
            : null}
		</g>
    );
 }