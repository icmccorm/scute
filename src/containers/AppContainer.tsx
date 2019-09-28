import * as React from 'react';
import Navbar from './Navbar';
import Log from '../components/Log';
import Editor from '../components/Editor';
import Button from '../components/Button';
import Canvas from '../components/Canvas';
import {Tag} from '../components/shapes/Shape';
import './css/AppContainer.css';

enum Commands { 
    OUT = 1,
    DEBUG,
    ERROR,
    RESULT
}

type State = {log: string, output: string, code: string, shapes: Tag[]};
type Props = {worker: Worker};
type CommandData = {code: number, payload: any}

export default class App extends React.Component<{}, State> { 
    readonly state: State;
    readonly props: Props;
    constructor(props: {}){
        super(props);
        this.state = { 
            log: "",
            output: "",
            code: "",
            shapes: []
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
                case Commands.RESULT:
                    this.setState({shapes: this.state.shapes.concat([command.payload])})
                    break;
                default:
                    break;
            }
        }
    }

    updateCode = (value: string) => {
        this.setState({code: value});
    }
    
    print (value: string) {
        this.setState({log: this.state.log + (value)});
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
                            <Canvas tags={this.state.shapes}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}