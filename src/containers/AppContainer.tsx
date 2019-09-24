import * as React from 'react';
import Navbar from './Navbar';
import Log from '../components/Log';
import Editor from '../components/Editor';
import Button from '../components/Button';
import Canvas from '../components/Canvas';
import './css/AppContainer.css';

enum Commands {
    OUT = 1,
    DEBUG = 2,
    ERROR = 3
}

type State = {log: string, output: string, code: string};
type Props = {worker: Worker};
type CommandData = {code: number, payload: string}

export default class App extends React.Component<{}, State> { 
    readonly state: State;
    readonly props: Props;
    constructor(props: {}){
        super(props);
        this.state = {
            log: "",
            output: "",
            code: "",
        }
    }


    componentDidMount(){
        this.props.worker.onmessage = async (event) => {
            let command: CommandData = event.data;
            switch(command.code){
                case Commands.OUT:
                    await this.print(command.payload);
                    break;
                case Commands.ERROR:
                    await this.print(command.payload);
                    break;
            }
        }
    }

    updateCode = (value: string) => {
        this.setState({code: value});
    }
    
    print (value: string) {
        this.setState({log: this.state.log + ("> " + value + "\n")});
    }

    runCode = async () => {
        await this.setState({log: ""})
        this.props.worker.postMessage(this.state.code);
    }
    
    render () {
        return (     
            <div className= 'root'>
                <div className='flex outer outer-flex'>
                    <div className='text-wrapper'>
                        <div className='flex inner-flex max'>
                            <div id="code" className='editor-wrapper'>
                                <Editor handleChange={this.updateCode}></Editor>
                            </div>
                            <Log value={this.state.log}>
                            </Log>
                        </div>
                    </div>
                    <div className='view-wrapper darkgray-b'>
                        <div className='frame max inset-shadow'>
                            <Navbar>
                                <Button onClick={this.runCode}>Run</Button>
                            </Navbar>
                            <Canvas display={this.state.output}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}