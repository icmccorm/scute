import * as React from 'react';
import {useSelector} from 'react-redux';
import { ValueLink, getLinkedVector } from 'src/redux/Manipulation';
import { scuteStore } from 'src/redux/ScuteStore';
import { ShapeProps } from '../Shape';
import BasicHandle from 'src/shapes/handles/BasicHandle';

export const Ellipse = ({defs, style}:ShapeProps) => {
    let attrs: Array<ValueLink> = defs.attrs;
    const position:Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['position']));
    const radius: Array<number> = useSelector((store:scuteStore) => getLinkedVector(store.root.lines, attrs['radius']));

    const[handleable, setHandleable] = React.useState(false);
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
                    <BasicHandle vx={attrs['radius'][0]} cx={position[0] + radius[0]} cy={position[1]}/>
                    <BasicHandle vy={attrs['radius'][1]} cx={position[0]} cy={position[1] + radius[1]}/>
                    <BasicHandle v={attrs['position']} cx={position[0]} cy={position[1]}/>
                </g>
            : null}
		</g>
    );
 }