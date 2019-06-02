import * as err from './Exceptions';
//start, current, line, indent, tokens, source
var types = {
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    BOOLEAN: 'BOOLEAN',
    REAL: 'REAL',
    ID: 'ID',
    OP: 'OP',
    KEY: 'KEY',
    SHAPE: 'SHAPE',
    ATTRIBUTE: 'ATTRIBUTE',
    T: 'T',

}

var keys = {
    //Control flow
    'for': 'FOR',
    'if': 'IF',
    'else': 'ELSE',
    'while': 'WHILE',

    //Output Functions
    'print': 'PRINT',
    'draw': 'DRAW',

    //Style & Color
    'rgb': 'RGB',

    //Trig
    'sin': 'SINE',
    'cos': 'COSINE',
    'tan': 'TANGENT',
    'log': 'LOG',
    'ln': 'NAT_LOG',

    //Constants
    'pi': 'pi',
    'tau': 'tau',

}
/*
var attributes = {
    'fill': 'FILL',
    'color': 'COLOR',
    'stroke-width': 'STROKE_W',
    'stroke': 'STROKE',
    'alignment-baseline': "ALIGNMENT_BASELINE",
    'baseline-shift': 'BASELINE_SHIFT',
    'clip': 'CLIP',
    'clip-path': 'CLIP_PATH',
    'clip-rule': 'CLIP_RULE',

    'color-interpolation': 'COLOR_INTER',
    'color-interpolation-filters': 'COLOR_INTER_FILTERS',
    'color-rendering': 'COLOR_RENDER',
    'direction': 'DIRECTION',
    'dominant-baseline': 'DOMINANT_BASE',
    'fill-opacity': 'FILL_OPACITY',
    'fill-rule': 'FILL_RULE',
    'filter': 'FILTER',
    'flood-color': 'FLOOD_COLOR',
    'flood-opacity': 'FLOOD_OPACITY',
    'font-family': 'FONT_FAMILY',
    'font-size': 'FONT_SIZE',
    'font-size-adjust': 'FONT_SIZE_ADJUST',
    'white-space': "WHITE_SPACE",
    'word-spacing': 'WORD_SPACING',
    'font-stretch': 'FONT_STRETCHING',
    'font-style': 'FONT_STYLE',
    'font-variant': 'FONT_VARIANT',
    'font-weight': 'FONT_WEIGHT',
    'mask': 'MASK',
    'opacity': 'OPACITY',
    'overflow': 'OVERFLOW',
    'solid-color': 'SOLID_COLOR',
    'solid-opacity': 'SOLID_OPACITY',
    'stop-color': 'STOP_COLOR',
    'stop-opacity': 'STOP_OPACITY',
    'stroke-dasharray': 'STROKE_DASHARRAY',
    'stroke-dashoffset': 'STROKE_DASHOFFSET',
    'stroke-linecap': 'STROKE_LINECAP',
    'stroke-linejoin': 'STROKE_LINEJOIN',
    'stroke-miterlimit': 'STROKE_MITERLIMIT',
    'stroke-opacity': 'STROKE_OPACITY',
    'text-anchor': 'TEXT_ANCHOR',
    'text-decoration': 'TEXT_DECORATION',
    'text-overflow': 'TEXT_OVERFLOW',
    'text-rendering': 'TEXT_RENDER',

}*/

var shapes = {
    'rect': 'RECT',
    'circle': 'CIRCLE',
    'ellipse': 'ELLIPSE',
    'text': 'TEXT',
    'line': 'LINE',
    'polyline': 'POLYLINE',
    'polygon': 'POLYGON',
}


class Script {
    constructor(src, callback){
        this.tokens = [];
        this.source = src;
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.indent = 0;
        this.callback = callback
    }
    toString() {
        return "Type: " + this.type + "\n   -Lexeme: " + this.text + "\n   -Line #: " + this.line + "\n";
    }

    hasNext() {
        return this.current < this.source.length;
    }
    
    next() {
        this.current++;
        return this.source.charAt(this.current - 1);
    }
    
    match(char) {
        if (this.hasNext() && this.peek() === char) {
            this.current++;
            return true;
        } else {
            return false;
        }
    }
    
    getCurrent() {
        return this.source.charAt(this.source.length - 1);
    }
    
    peek() {
        if (!this.hasNext()) return '\0';
        return this.source.charAt(this.current);
    }
    
    previous() {
        if (this.current > 1) return this.source.charAt(this.current - 2);
        return null;
    }
    
    previousToken() {
        if(this.tokens.length > 0){
            return this.tokens[this.tokens.length - 1];
        }
    }
    
    peekNext() {
        if (this.current + 1 >= this.source.length) return '\\0';
        return this.source.charAt(this.current + 1);
    }
    
    addToken(text, type) {
        if(type !== undefined){
            this.tokens.push(new Token(type, text, this.line));
        }else{
            this.tokens.push(new Token(types.OP, text, this.line));
    
        }
    }
    
    addIndent(){
        if(this.indent > 0){
            this.tokens.push(new Indent(this.indent, this.line));
            this.indent = 0;
        }
    }
    addTextToken(text) {
        if (keys[text] !== undefined) {
            this.addToken(text, types.KEY);
    
        } else if (shapes[text] !== undefined) {
            this.addToken(text, types.SHAPE);
    
        } else {
    
            switch(text){
                case 'true':
                case 'false':
                    this.addToken(text, types.BOOLEAN);
                    break;
                case 't':
                    this.addToken(text, types.T);
                    break;
                default:
                    this.addToken(text, types.ID);
                    break;
            }
        }
    }
}

class Token {
    constructor (type, text, line) {
        this.type = type;
        this.text = text;
        this.line = line;
    }
}

class Indent extends Token {
    constructor (num, line) {
        super('INDENT', '\t('+num+')', line);
        this.num = num;
    }
}

function isDigit(char) {
    return /[0-9]/.test(char);
}

function isText(char) {
    return /[[A-Z-a-z]/.test(char);
}

function comment (char) {
    switch (char) {
        case '/':
            if (this.match('/')) {
                //If it's a one-line comment, skip all the way to the end of the line, or until the string ends.
                while (this.peek() !== '\n' && this.hasNext()) this.next();

            } else if (this.match('*')) {
                //If it's a multi-line comment, continue through the text until a '*/' is reached or the string ends.
                while (!(this.peek() === '/' && this.getCurrent() === '*') && this.hasNext()) {
                    this.next();
                }

            } else {
                //If the previous two cases evaluated false, the forward slash is a division operator. Add it as a token.
                this.addToken(char);
            }
            break;
        case '#':
            while (this.peek() !== '\n' && this.hasNext()) this.next();
            break;
        default:
            break;
    }
}

function number(mode) {
    if(isDigit(this.peek())){
        this.next();
        number.call(this);
    
    }if(!mode && this.peek() === '.' && isDigit(this.peekNext())){
        this.next();
        number.call(this, true);

    }else{
        let type = (mode ? types.REAL : types.INTEGER)        
        var numText = this.source.substring(this.start, this.current);
        this.addToken(parseFloat(numText), type);
    }
}
function text() {
    //var dashed = false;
    while (isText(this.peek()) || (this.peek().text === '-' && isText(this.peekNext()))) {
        this.next();
    }

    var idText = this.source.substring(this.start, this.current);
   /* if(this.isValidAttribute(idText)){
        this.addToken(idText, types.ID);

    }else{*/
        //Dashes are not allowed as variable names, so they will be interpreted as minus signs here.
        var textTokens = idText.split('-');
        this.addTextToken(textTokens[0]);

        for(var i = 1; i<textTokens.length; ++i){
            this.addToken('-');
            this.addTextToken(textTokens[i]);
        }
   // }
}

function string (char) {
    var txt = "";
    while (this.hasNext() && this.peek() !== char) {

        if (this.peek() === '\n') this.line++;
        if (this.peek() === '\\' && (this.peekNext() === '\'' || this.peekNext() === '\"')) this.current++;
        txt += this.next();

    }

    if (!this.hasNext()) {
        throw new err.LexingError(this.line, "Unterminated String.");

    } else {

        this.addToken(txt, types.STRING);
    }

    this.next();

}

function scanToken() {
    var c = this.next();
    switch (c) {

        case '*':
        case '(':
        case ')':
        case '[':
        case ']':
        case '{':
        case '}':
        case ',':
        case '%':
        case '.':
        case '^':
        case '~':
        case ';':
            //if no type is specified, it is assumed to be an operator
            this.addToken(c);
            break;
        case '+':
            if (this.match('+')) {
                this.addToken('++');

            } else if (this.match('=')) {
                this.addToken('+=');

            } else {
                this.addToken(c);
            }
            break;

        case '-':
            if (isDigit(this.peek()) && !isDigit(this.previous())) {
                this.number();

            } else if (this.match('>')) {
                this.addToken('->');

            } else if (this.match('-')) {
                this.addToken('--');

            } else if (this.match('=')) {
                this.addToken('-=');

            } else {
                this.addToken(c);
            }

            break;

        case '<':
            if (this.match('-') && !/[1-9]/.test(this.peek())) {
                this.addToken('<-');
            } else if (this.match('=')) {
                this.addToken('<=');

            } else {
                this.addToken(c);
            }
            break;

        case '>':
            if (this.match('=')) {
                this.addToken('>=');
            } else {
                this.addToken(c);
            }
            break;

            //If the given character is an equals, check to see if it's being used for assignment or equality
        case '=':
            if (this.match('=')) {
                this.addToken('==');

            } else {
                this.addToken(c);

            }
            break;
        case '|':
            if (this.match('=')) {
                this.addToken('|=');
            }else if(this.match('|')){
                this.addToken('||');
            }
            break;
            //If the given character is an exclamation mark, check to see whether it's unary or binary.
        case '!':
            if (this.match('=')) {
                this.addToken('!=');
            } else {
                this.addToken(c);

            }
            break;
            //If the character is either a forward slash or a pound sign, refer to the comment() function.
        case '/':
        case '#':
            comment.call(this, c);
            break;
            //Double or single quotes signify the beginning of a String literal; refer to the string() function.
        case '"':
        case '\'':
            string.call(this, c);
            break;

        case '\n':
            //Only significant, non-repeated newlines are added as tokens, which leads to more efficient parsing.
            if(this.previous() !== '\n' && (this.previousToken() !== undefined && this.previousToken().type !== 'NEWLINE')) {

                this.addToken('\\n', 'NEWLINE');
            }

            this.line++;

            this.indent = 0;
            while(this.hasNext() && (this.peek() === ' ' || this.peek() === '\t')){
                if(this.next() === '\t') ++this.indent;
            }

            //Similar to newlines, tab tokens are only added if they are contextually significant.
            if(this.indent > 0 && this.peek() !== '\n'){
                this.tokens.push(new Indent(this.indent, this.line));
                this.indent = 0;
            }

            break;

            //All carriage returns, tabs, and spaces are ignored by the lexer.
        case '\r':
        case '\t':
        case ' ':
            break;

            //Numbers are handled within the default case because regular expressions are used for identification
        default:

            //If the character is a number [0-9], process it as a potential integer or real number using the number() function.
            if (isDigit(c)) {

                number.call(this);

                //If the character is alphabetical, process it as a potential keyword or identifier.
            } else if (isText(c)) {

                text.call(this);

            } else {
                //if the charactrer is not numeric or alphabetical, mark it as an error.

            }
            break;
    }
}

var Lexer = {
    lex: function (doc) {
        if(doc.hasNext()){
            doc.start = doc.current;
            scanToken.call(doc);
            this.lex(doc);
        }else{
            doc.addToken('\\n', 'NEWLINE');
            doc.addToken('\\0', 'EOF');
        }
    
    },
    tokenize: function (src, id) {
        var doc = new Script(src);
        this.lex(doc);
        return doc.tokens;
    },
}
export default Lexer;