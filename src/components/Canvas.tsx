import * as React from 'react';
import './css/Canvas.css';
import {Shape, Tag} from './shapes/Shape';

type Props = {tags: Tag[]}
class Canvas extends React.Component<Props, any> {
    updates: Map<number, Function>;
    static defaultProps = {
        tags: []
    }
    constructor(props: Props){
        super(props);
        this.updates = new Map<number, Function>();
    }

    update(id:number, tagName:string){
        let updateFunction = this.updates.get(id);
        if(updateFunction){
            updateFunction(null);
        }else{
        }
    }

    componentDidMount(){

    }
    render () {
        return (
                <div className= 'canvas shadow'>
                    <svg id='canvas'>
                        {this.props.tags.map((item) => {
                            return <Shape key={item.id} funcMap={this.updates} tag={item}/>
                        })}
                    </svg>
                </div>
        );
    }
}
 
export default Canvas;

