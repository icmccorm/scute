import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer';
import './Global.css';
import ScuteWorker from 'worker-loader!./scute.worker';

const worker = new ScuteWorker();

worker.onmessage = event => {
    ReactDOM.render(
        <AppContainer worker={worker}/>,
        document.getElementById('root')
    );
}

//import * as serviceWorker from '../scalr/src/serviceWorker';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
