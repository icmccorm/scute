import {Interpreter} from '../lang/Interpreter';

const interp: Worker = self as any;

interp.onmessage = (event) => {
    let result = event.data[0] as string;
    if(result){
        let interpret = new Interpreter(result, postMessage);
        interpret.interpret();
    }
}
 
export default interp; 