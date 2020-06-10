import * as React from 'react';
import {ShapeProps} from './Shape';
import {useSelector, useDispatch} from 'react-redux';
import Handle from './Handle';
import { ValueLink, manipulation, manipulate, getLinkedVector, vecManipulation } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';

export const Ellipse = ({defs, style}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
	let dispatch = useDispatch();
    const position:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['position']));
    const radius: Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['radius']));

    const[handleable, setHandleable] = React.useState(false);

    const setRadX = (dx: number, dy: number) => {
        dispatch(manipulate(manipulation(dx, attrs['radius'][0])));
    }
    const setRadY = (dx: number, dy: number) => {
        dispatch(manipulate(manipulation(dy, attrs['radius'][1])));
    }

    const setPosition = (dx: number, dy: number) => {
        dispatch(manipulate(vecManipulation(dx, dy, attrs["position"])));
    }

    const toggleHandle = (event:React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        setHandleable(!handleable);
    }

    return (
		<g className="hoverGroup" onMouseDown={toggleHandle}>
			<ellipse className={(handleable ? 'handleable' : '')}
				cx={position[0]} 
				cy={position[1]} 
                rx={radius[0]} 
				ry={radius[1]}
				style={style}
			></ellipse>
            {handleable ?
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