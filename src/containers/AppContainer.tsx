import * as React from 'react';
import Navbar from './Navbar';
import Log from '../components/Log';
import Editor from '../components/Editor';
import Button from '../components/Button';
import Canvas from '../components/Canvas';
import {EventClient, Events} from '../EventClient';
import './css/AppContainer.css';

type State = {log: string, output: string, code: string};
type Props = {};
type CommandData = {code: number, payload: any}

export default class App extends React.Component<{}, State> { 
    readonly state: State;
    readonly props: Props;
    eventClient: EventClient;
    
    constructor(props: {}){
        super(props);
        this.state = { 
            log: "",
            output: "",
            code: "",
        }
        this.eventClient = new EventClient();
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

    render () {
        return (     
            <div className= 'root'>
                <div className='flex outer outer-flex'>
                    <div className='text-wrapper'>
                        <div className='flex inner-flex max'>
                            <Editor handleChange={this.updateCode}></Editor>
                            <Log value={this.state.log}/>
                        </div>
                    </div>
                    <div className='view-wrapper darkgray-b'>
                        <div className='frame max inset-shadow'>
                            <Navbar>
                                <Button onClick={this.runCode}>Run</Button>
                            </Navbar>
                            <Canvas client={this.eventClient}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}