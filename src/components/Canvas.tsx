import * as React from 'react';
import './css/Canvas.css';
import {Shape, Tag} from './shapes/Shape';
import {EventClient, Events} from '../containers/EventClient';

type Props = {client: EventClient}
type State = {frame: Tag}

class Canvas extends React.Component<Props, State> {
    timer: any;
    state: State;
    client: EventClient;

    constructor(props: Props){
        super(props);
        this.state = {
            frame: undefined
        }

    }

    play(){
        this.timer = setTimeout(()=>{
        }, 10);
    }

    pause(){
        clearTimeout(this.timer);
    }

    componentDidMount(){
        this.props.client.on(Events.REQ_COMPILE, this.pause);
        this.props.client.on(Events.FIN_COMPILE, this.play);
    }

    render () {
        return (
                <div className= 'canvas shadow'>
                    <svg id='canvas'>
                        {this.state.frame ? <Shape key={this.state.frame.id} tag={this.state.frame}/> : ''}
                    </svg>
                </div>
        );
    }
}
 
export default Canvas;

