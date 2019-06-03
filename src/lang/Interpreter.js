import * as lib from './Hierarchy.js';
import Parser from './Parser';

class FrameCollection {
    constructor(ast){
        this.ast = ast;
        this.frames  = {};
        this.end = -1;
        this.global = new Frame(0);
        this.current = global;
    }
    add (tag, val, attrs) {
        var element = this.makeSVG(tag, val, attrs);
        this.current.addTag(element);
    }

    hasMultiple () {
        return this.frames.length > 1;
    }

    makeSVG (tag, val, attrs) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", tag);

        element.innerHTML = val;

        for (var k in attrs) {
            element.setAttribute(k, attrs[k]);
        }

        return element;
    }
}

export default function run(src){
    var ast = Parser.createAST(src);
    var compiled = new FrameCollection(ast);
    return sortAndExecute.call(compiled);
}

function sortAndExecute(){
    if (this.ast && this.ast.length > 0) {
            //Once statements are produced, they are split into two categories
            var filtered = [];

            for (var line of this.ast) {
                if (line.global) {
                    //Category one contains TimeSteps and Global statements.
                    //These are evaluated for each frame.
                    filtered.push(line);

                    if (line instanceof lib.TimeStep) {
                        if (line.end > this.end) {
                            this.end = line.end;
                        }
                    }

                } else {
                    //Category two encompasses all statements that fall outside the two previous types.
                    //These are only executed once before any frames are rendered.
                    line.eval();
                }
            }
            //Once category 2 statements are executed, the TimeSteps and global statements are executed.
            //The resulting array of frames is passed to the ViewEngine for execution.
            executeTimed.call(this, filtered);
            return this.frames;
    }
}

function executeTimed (statements){
    var index = 0;
    do {
        this.current = new Frame(index);
        this.current.join(this.global);

        for (var line of statements) {
            line.eval();
        }

        this.frames.push(this.current.eval());
        ++index;

    } while (index <= this.end);
}

class Frame {
    constructor(index){
        this.tags = [];
        this.index = index;
    }
    
    addTag(tag){
        this.tags.push(tag);
    }

    join(frame){
        this.tags = this.tags.concat(frame.tags);
    }

    eval(){
        var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        for(var i = 0; i<this.tags.length; ++i){
            group.appendChild(this.tags[i]);
        }
        return group;
    }
}