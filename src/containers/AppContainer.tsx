import * as React from 'react';

import Navbar from './Navbar';
import Log from '../components/Log';
import Editor from '../components/Editor';
import Button from '../components/Button';
import Canvas from '../components/Canvas';
import {Parser} from '../lang/Parser';
import './css/AppContainer.css';

type State = {log: string, output: string, code: string};

export default class App extends React.Component<{}, State> { 
    readonly state: State;

    constructor(props: {}){
        super(props);
        this.state = {
            log: "",
            output: "",
            code: ""
        }
    }

    updateCode = (value: string) => {
        this.setState({code: value});
    }
    print = async (value: string) => {
        await this.setState({log: this.state.log + ("> " + value + "\n")});
    }

    clearLog = async () => {
        await this.setState({log: ""});
    }

    runCode = async () => {
        await this.clearLog();
        await this.print("Parsing code...");
        let parser: Parser = new Parser(this.state.code);
        console.log(parser.createAST());
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