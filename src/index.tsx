import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './Global.scss';

import {Provider} from 'react-redux';
import {scuteStore} from './redux/ScuteStore';
import AppRoot from './containers/AppRoot';

ReactDOM.render(
	<Provider store={scuteStore}>
    	<AppRoot/>
	</Provider>,
    document.getElementById('root')
);

//import * as serviceWorker from '../scalr/src/serviceWorker';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
