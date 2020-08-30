import * as React from 'react';
import {ShapeProps} from '../Shape';
import {useSelector} from 'react-redux';
import { ValueLink, 
        getLinkedValue, 
        getLinkedVector, 
        } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';
import BasicHandle from '../handles/BasicHandle';

import '../style/shapes.scss';

export const Circ = ({defs, style}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
    
    const position:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['position']));
    const radius:number = useSelector((store:scuteStore) => getLinkedValue(store.root.lines, attrs['radius']));

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
			<circle className={(handleable ? 'handleable' : '')}
				cx={position[0]} 
				cy={position[1]} 
                r={radius} 
                style={style}
			></circle>
            {handleable ?
                <g>         
                    <BasicHandle v={attrs['position']} cx={position[0]} cy={position[1]}/>
                    <BasicHandle vx={attrs['radius']} cx={position[0] + radius} cy={position[1]}/>
                </g>
            : null}
		</g>
    );
 }