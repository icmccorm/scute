import * as React from 'react';

import Navbar from './Navbar';
import Log from 'src/components/Log';
import Editor from 'src/components/Editor';
import Button from 'src/components/Button';
import Canvas from 'src/components/Canvas';
import Dragger from 'src/components/Dragger';
import {EventClient, Events} from 'src/events/EventClient';

import './style/AppContainer.scss';

type State = {log: string, output: string, code: string};
type Props = {};

export default class App extends React.Component<Props, State> { 
    readonly state: State;
    readonly props: Props;
    eventClient: EventClient;
    leftWrapper: any; 
    rightWrapper: any;
    
    constructor(props: {}){
        super(props);
        this.state = { 
            log: "",
            output: "",
            code: "",
        }
        this.eventClient = new EventClient();
        this.leftWrapper = React.createRef();
        this.rightWrapper = React.createRef();
    }

    updateCode = (value: string) => {
        this.setState({code: value});
    }
    
    async print (value: string) {
        this.setState({log: this.state.log + (value)});
    }

    runCode = async () => {
        await this.setState({log: ""});

        this.eventClient.requestCompile(this.state.code)
    }
    
    componentDidMount() {
        this.eventClient.on(Events.PRINT_OUT, async (data) => {
            await this.print(data);
        })
        this.eventClient.on(Events.PRINT_ERROR, async (data) => {
            await this.print(data);
        })
    }

    adjustLeft = (dx: number) => {
        let lNode = this.leftWrapper.current;
        let rNode = this.rightWrapper.current;
        if(lNode && rNode){
            lNode.style.width = dx + "px";
            lNode.style.flexGrow = 0;
        }
    }

    render () {
        return (     
            <div className='root flex outer-flex'>
                    <div className='text-wrapper' ref={this.leftWrapper}>
                        <div className='inner-text-wrapper flex inner-flex max'>
                            <Editor client={this.eventClient} handleChange={this.updateCode}></Editor>
                            <Log value={this.state.log}/>
                        </div>
                        <Dragger adjust={this.adjustLeft}/> 
                    </div>

                    <div className='view-wrapper darkgray-b' ref={this.rightWrapper}> 
                        <Navbar>
                            <Button onClick={this.runCode}>Run</Button>
                        </Navbar>
                        <div className='view-flex min-max'>
                            <Canvas client={this.eventClient}/>
                        </div>
                    </div>
            </div>
        );
    }
}