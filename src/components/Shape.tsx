import * as React from 'react';

type State = {tagObj: Element}
type Props = {id: number, tagName: string, funcMap: Map<number, Function>, attrs: []}

export default class Shape extends React.Component<any, any>{
	readonly props: Props;
	readonly state: State;

	constructor(props){
		super(props);
	}

	update (attrs: Map<string, string>){
		this.setState({attrs: attrs});
	}

	componentDidMount(){
		this.props.funcMap.set(this.props.id, this.update);
	}
	
	render(){
		return React.createElement(this.props.tagName, this.props.attrs, null);
	}
}
export class Attr {
	name: string;
	value: string;

	constructor(name, value){
		this.name = name;
		this.value = value;
	}
}