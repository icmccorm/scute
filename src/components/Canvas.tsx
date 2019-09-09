import * as React from 'react';
import './css/Canvas.css';
import Shape from './Shape';


type State = {tags: Tag[]}
class Canvas extends React.Component<any, any> {
    readonly state: State;
    updates: Map<number, Function>;
    constructor(props: object){
        super(props);
        this.updates = new Map<number, Function>();
        this.state = {tags: []}

    }
    update(id:number, tagName:string){
        let updateFunction = this.updates.get(id);
        if(updateFunction){
            updateFunction(null);
        }else{
            this.setState({tags: this.state.tags.concat(new Tag(tagName, id))});
        }
    }

    componentDidMount(){
        this.update(1, "rect");

    }
    render () {
        return (
                <div className= 'canvas shadow'>
                    <svg id='canvas'>
                        {this.state.tags.map((item) => {
                            return <Shape 
                                        key={item.id}
                                        tagName={item.tagName}
                                        id={item.id}
                                        funcMap={this.updates}
                                        attrs={[]}
                                    />
                        })}
                    </svg>
                </div>
        );
    }
}

class Tag{
    tagName: string;
    id: number;
    constructor(tagName, id){
        this.tagName = tagName;
        this.id = id;
    }
}

export default Canvas;

