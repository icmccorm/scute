import React, { Component } from 'react';

import Navbar from './Navbar';

import Log from '../components/Log';
import Editor from '../components/Editor';
import Button from '../components/Button';
import Canvas from '../components/Canvas';

import './css/AppContainer.css'

export default class App extends Component { 
    
    constructor(props){
        super(props);

        this.state = {
            code: "",
            log: "",
            output: {
                svg: "",
                css: ""
            }
        };
        
    }

    updateCode = (value) => {
        this.setState({code: value});
    }

    appendToLog = (value) => {
        this.setState({log: this.state.log += ("> " + value + "\n")});
    }

    runCode = () => {
        //Interpreter.run(this.appendToLog);
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
                            <Log text={this.state.log}></Log>
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