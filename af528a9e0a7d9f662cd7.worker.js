!function(n){var t={};function r(e){if(t[e])return t[e].exports;var a=t[e]={i:e,l:!1,exports:{}};return n[e].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=n,r.c=t,r.d=function(n,t,e){r.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:e})},r.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},r.t=function(n,t){if(1&t&&(n=r(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var e=Object.create(null);if(r.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var a in n)r.d(e,a,function(t){return n[t]}.bind(null,a));return e},r.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return r.d(t,"a",t),t},r.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},r.p="",r(r.s="4wTl")}({"4wTl":function(n,t,r){"use strict";var e;r.r(t),(e="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0,function(n){var t,a=void 0!==(n=n||{})?n:{},o={};for(t in a)a.hasOwnProperty(t)&&(o[t]=a[t]);var i,u=[],f=function(n,t){throw t},l=!1,c=!0,s="";(l||c)&&(c?s=self.location.href:document.currentScript&&(s=document.currentScript.src),e&&(s=e),s=0!==s.indexOf("blob:")?s.substr(0,s.lastIndexOf("/")+1):"",c&&(i=function(n){var t=new XMLHttpRequest;return t.open("GET",n,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}));var p=a.print||console.log.bind(console),m=a.printErr||console.warn.bind(console);for(t in o)o.hasOwnProperty(t)&&(a[t]=o[t]);o=null,a.arguments&&(u=a.arguments),a.thisProgram&&a.thisProgram,a.quit&&(f=a.quit);var d,y,h=function(n){};a.wasmBinary&&(d=a.wasmBinary),"object"!=typeof WebAssembly&&m("no native wasm support detected");var g=!1;function v(n,t){n||pn("Assertion failed: "+t)}function _(n){var t=a["_"+n];return v(t,"Cannot call unknown function "+n+", make sure it is exported"),t}function b(n,t,r,e,a){var o={string:function(n){var t=0;if(null!=n&&0!==n){var r=1+(n.length<<2);x(n,t=fn(r),r)}return t},array:function(n){var t=fn(n.length);return function(n,t){S.set(n,t)}(n,t),t}},i=_(n),u=[],f=0;if(e)for(var l=0;l<e.length;l++){var c=o[r[l]];c?(0===f&&(f=un()),u[l]=c(e[l])):u[l]=e[l]}var s=i.apply(null,u);return s=function(n){return"string"===t?E(n):"boolean"===t?Boolean(n):n}(s),0!==f&&ln(f),s}var w,S,A,M,C="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function T(n,t,r){for(var e=t+r,a=t;n[a]&&!(a>=e);)++a;if(a-t>16&&n.subarray&&C)return C.decode(n.subarray(t,a));for(var o="";t<a;){var i=n[t++];if(128&i){var u=63&n[t++];if(192!=(224&i)){var f=63&n[t++];if((i=224==(240&i)?(15&i)<<12|u<<6|f:(7&i)<<18|u<<12|f<<6|63&n[t++])<65536)o+=String.fromCharCode(i);else{var l=i-65536;o+=String.fromCharCode(55296|l>>10,56320|1023&l)}}else o+=String.fromCharCode((31&i)<<6|u)}else o+=String.fromCharCode(i)}return o}function E(n,t){return n?T(A,n,t):""}function R(n,t,r,e){if(!(e>0))return 0;for(var a=r,o=r+e-1,i=0;i<n.length;++i){var u=n.charCodeAt(i);if(u>=55296&&u<=57343&&(u=65536+((1023&u)<<10)|1023&n.charCodeAt(++i)),u<=127){if(r>=o)break;t[r++]=u}else if(u<=2047){if(r+1>=o)break;t[r++]=192|u>>6,t[r++]=128|63&u}else if(u<=65535){if(r+2>=o)break;t[r++]=224|u>>12,t[r++]=128|u>>6&63,t[r++]=128|63&u}else{if(r+3>=o)break;t[r++]=240|u>>18,t[r++]=128|u>>12&63,t[r++]=128|u>>6&63,t[r++]=128|63&u}}return t[r]=0,r-a}function x(n,t,r){return R(n,A,t,r)}function k(n){for(var t=0,r=0;r<n.length;++r){var e=n.charCodeAt(r);e>=55296&&e<=57343&&(e=65536+((1023&e)<<10)|1023&n.charCodeAt(++r)),e<=127?++t:t+=e<=2047?2:e<=65535?3:4}return t}"undefined"!=typeof TextDecoder&&new TextDecoder("utf-16le");var F=8688,P=a.TOTAL_MEMORY||16777216;function O(n){for(;n.length>0;){var t=n.shift();if("function"!=typeof t){var r=t.func;"number"==typeof r?void 0===t.arg?a.dynCall_v(r):a.dynCall_vi(r,t.arg):r(void 0===t.arg?null:t.arg)}else t()}}(y=a.wasmMemory?a.wasmMemory:new WebAssembly.Memory({initial:P/65536,maximum:P/65536}))&&(w=y.buffer),P=w.byteLength,a.HEAP8=S=new Int8Array(w),a.HEAP16=new Int16Array(w),a.HEAP32=M=new Int32Array(w),a.HEAPU8=A=new Uint8Array(w),a.HEAPU16=new Uint16Array(w),a.HEAPU32=new Uint32Array(w),a.HEAPF32=new Float32Array(w),a.HEAPF64=new Float64Array(w),M[F>>2]=5251584;var I=[],j=[],U=[],W=[];Math.abs,Math.cos,Math.sin,Math.tan,Math.acos,Math.asin,Math.atan,Math.atan2,Math.exp,Math.log,Math.sqrt,Math.ceil,Math.floor,Math.pow,Math.imul,Math.fround,Math.round,Math.min,Math.max,Math.clz32,Math.trunc;var D=0,H=null,z=null;a.preloadedImages={},a.preloadedAudios={};var B="data:application/octet-stream;base64,";function q(n){return String.prototype.startsWith?n.startsWith(B):0===n.indexOf(B)}var L,N=r("n6c4");function Y(){try{if(d)return new Uint8Array(d);if(i)return i(N);throw"both async and sync fetching of the wasm failed"}catch(n){pn(n)}}function G(n){var t={env:n};function r(n,t){var r=n.exports;a.asm=r,function(n){if(D--,a.monitorRunDependencies&&a.monitorRunDependencies(D),0==D&&(null!==H&&(clearInterval(H),H=null),z)){var t=z;z=null,t()}}()}function e(n){r(n.instance)}function o(n){return(d||!l&&!c||"function"!=typeof fetch?new Promise(function(n,t){n(Y())}):fetch(N,{credentials:"same-origin"}).then(function(n){if(!n.ok)throw"failed to load wasm binary file at '"+N+"'";return n.arrayBuffer()}).catch(function(){return Y()})).then(function(n){return WebAssembly.instantiate(n,t)}).then(n,function(n){m("failed to asynchronously prepare wasm: "+n),pn(n)})}if(D++,a.monitorRunDependencies&&a.monitorRunDependencies(D),a.instantiateWasm)try{return a.instantiateWasm(t,r)}catch(n){return m("Module.instantiateWasm callback failed with error: "+n),!1}return function(){if(d||"function"!=typeof WebAssembly.instantiateStreaming||q(N)||"function"!=typeof fetch)return o(e);fetch(N,{credentials:"same-origin"}).then(function(n){return WebAssembly.instantiateStreaming(n,t).then(e,function(n){m("wasm streaming compile failed: "+n),m("falling back to ArrayBuffer instantiation"),o(e)})})}(),{}}function Z(n){return n}function X(n){return n.replace(/\b_Z[\w\d_]+/g,function(n){var t=Z(n);return n===t?n:t+" ["+n+"]"})}function J(){var n=new Error;if(!n.stack){try{throw new Error(0)}catch(t){n=t}if(!n.stack)return"(no stack trace available)"}return n.stack.toString()}q(N)||(L=N,N=a.locateFile?a.locateFile(L,s):s+L),a.asm=function(n,t,r){return t.memory=y,t.table=new WebAssembly.Table({initial:14,maximum:14,element:"anyfunc"}),G(t)},j.push({func:function(){on()}});var K={buffers:[null,[],[]],printChar:function(n,t){var r=K.buffers[n];0===t||10===t?((1===n?p:m)(T(r,0)),r.length=0):r.push(t)},varargs:0,get:function(n){return K.varargs+=4,M[K.varargs-4>>2]},getStr:function(){return E(K.get())},get64:function(){var n=K.get();return K.get(),n},getZero:function(){K.get()}};function Q(){return S.length}function V(n,t,r){A.set(A.subarray(t,t+r),n)}function $(n){return a.___errno_location&&(M[a.___errno_location()>>2]=n),n}function nn(n){pn("OOM")}function tn(n){nn()}var rn={DYNAMICTOP_PTR:F,__setErrNo:$,__syscall140:function(n,t){K.varargs=t;try{return K.getStreamFromFD(),K.get(),K.get(),K.get(),K.get(),0}catch(n){return"undefined"!=typeof FS&&n instanceof FS.ErrnoError||pn(n),-n.errno}},__syscall146:function(n,t){K.varargs=t;try{for(var r=K.get(),e=K.get(),a=K.get(),o=0,i=0;i<a;i++){for(var u=M[e+8*i>>2],f=M[e+(8*i+4)>>2],l=0;l<f;l++)K.printChar(r,A[u+l]);o+=f}return o}catch(n){return"undefined"!=typeof FS&&n instanceof FS.ErrnoError||pn(n),-n.errno}},__syscall6:function(n,t){K.varargs=t;try{return K.getStreamFromFD(),0}catch(n){return"undefined"!=typeof FS&&n instanceof FS.ErrnoError||pn(n),-n.errno}},abort:function(){a.abort()},abortOnCannotGrowMemory:nn,demangle:Z,demangleAll:X,emscripten_get_heap_size:Q,emscripten_memcpy_big:V,emscripten_resize_heap:tn,exit:function(n){!function(n,t){t&&a.noExitRuntime&&0===n||(a.noExitRuntime||(g=!0,a.onExit&&a.onExit(n)),f(n,new cn(n)))}(n)},flush_NO_FILESYSTEM:function(){var n=a._fflush;n&&n(0);var t=K.buffers;t[1].length&&K.printChar(1,10),t[2].length&&K.printChar(2,10)},jsStackTrace:J,memcpy:function(n,t,r){n|=0,t|=0;var e,a,o=0,i=0;if((0|(r|=0))>=8192)return V(0|n,0|t,0|r),0|n;if(e=0|n,a=n+r|0,(3&n)==(3&t)){for(;3&n;){if(0==(0|r))return 0|e;S[n>>0]=0|S[t>>0],n=n+1|0,t=t+1|0,r=r-1|0}for(i=(o=-4&a|0)-64|0;(0|n)<=(0|i);)M[n>>2]=0|M[t>>2],M[n+4>>2]=0|M[t+4>>2],M[n+8>>2]=0|M[t+8>>2],M[n+12>>2]=0|M[t+12>>2],M[n+16>>2]=0|M[t+16>>2],M[n+20>>2]=0|M[t+20>>2],M[n+24>>2]=0|M[t+24>>2],M[n+28>>2]=0|M[t+28>>2],M[n+32>>2]=0|M[t+32>>2],M[n+36>>2]=0|M[t+36>>2],M[n+40>>2]=0|M[t+40>>2],M[n+44>>2]=0|M[t+44>>2],M[n+48>>2]=0|M[t+48>>2],M[n+52>>2]=0|M[t+52>>2],M[n+56>>2]=0|M[t+56>>2],M[n+60>>2]=0|M[t+60>>2],n=n+64|0,t=t+64|0;for(;(0|n)<(0|o);)M[n>>2]=0|M[t>>2],n=n+4|0,t=t+4|0}else for(o=a-4|0;(0|n)<(0|o);)S[n>>0]=0|S[t>>0],S[n+1>>0]=0|S[t+1>>0],S[n+2>>0]=0|S[t+2>>0],S[n+3>>0]=0|S[t+3>>0],n=n+4|0,t=t+4|0;for(;(0|n)<(0|a);)S[n>>0]=0|S[t>>0],n=n+1|0,t=t+1|0;return 0|e},memset:function(n,t,r){t|=0;var e,a=0,o=0,i=0;if(e=(n|=0)+(r|=0)|0,t&=255,(0|r)>=67){for(;0!=(3&n);)S[n>>0]=t,n=n+1|0;for(i=t|t<<8|t<<16|t<<24,o=(a=-4&e|0)-64|0;(0|n)<=(0|o);)M[n>>2]=i,M[n+4>>2]=i,M[n+8>>2]=i,M[n+12>>2]=i,M[n+16>>2]=i,M[n+20>>2]=i,M[n+24>>2]=i,M[n+28>>2]=i,M[n+32>>2]=i,M[n+36>>2]=i,M[n+40>>2]=i,M[n+44>>2]=i,M[n+48>>2]=i,M[n+52>>2]=i,M[n+56>>2]=i,M[n+60>>2]=i,n=n+64|0;for(;(0|n)<(0|a);)M[n>>2]=i,n=n+4|0}for(;(0|n)<(0|e);)S[n>>0]=t,n=n+1|0;return e-r|0},printDebug:function(n){self.postMessage({code:2,payload:a.UTF8ToString(n)})},printError:function(n){self.postMessage({code:3,payload:a.UTF8ToString(n)})},printOut:function(n){self.postMessage({code:1,payload:a.UTF8ToString(n)})},sbrk:function(n){var t,r,e;return n|=0,e=0|Q(),(0|n)>0&(0|(r=(t=0|M[F>>2])+n|0))<(0|t)|(0|r)<0?(nn(),$(12),-1):(0|r)>(0|e)&&!(0|tn())?($(12),-1):(M[F>>2]=0|r,0|t)},setTempRet0:function(n){h(0|n)},stackTrace:function(){var n=J();return a.extraStackTrace&&(n+="\n"+a.extraStackTrace()),X(n)}},en=a.asm({},rn,w);a.asm=en;var an,on=a.___wasm_call_ctors=function(){return a.asm.__wasm_call_ctors.apply(null,arguments)},un=(a._runCode=function(){return a.asm.runCode.apply(null,arguments)},a._free=function(){return a.asm.free.apply(null,arguments)},a.___errno_location=function(){return a.asm.__errno_location.apply(null,arguments)},a._malloc=function(){return a.asm.malloc.apply(null,arguments)},a._setThrew=function(){return a.asm.setThrew.apply(null,arguments)},a.stackSave=function(){return a.asm.stackSave.apply(null,arguments)}),fn=a.stackAlloc=function(){return a.asm.stackAlloc.apply(null,arguments)},ln=a.stackRestore=function(){return a.asm.stackRestore.apply(null,arguments)};function cn(n){this.name="ExitStatus",this.message="Program terminated with exit("+n+")",this.status=n}function sn(n){function t(){an||(an=!0,g||(O(j),O(U),a.onRuntimeInitialized&&a.onRuntimeInitialized(),function(){if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;)n=a.postRun.shift(),W.unshift(n);var n;O(W)}()))}n=n||u,D>0||(function(){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)n=a.preRun.shift(),I.unshift(n);var n;O(I)}(),D>0||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1),t()},1)):t()))}function pn(n){throw a.onAbort&&a.onAbort(n),p(n+=""),m(n),g=!0,"abort("+n+"). Build with -s ASSERTIONS=1 for more info."}if(a.__growWasmMemory=function(){return a.asm.__growWasmMemory.apply(null,arguments)},a.dynCall_v=function(){return a.asm.dynCall_v.apply(null,arguments)},a.dynCall_iiii=function(){return a.asm.dynCall_iiii.apply(null,arguments)},a.dynCall_iidiiii=function(){return a.asm.dynCall_iidiiii.apply(null,arguments)},a.dynCall_vii=function(){return a.asm.dynCall_vii.apply(null,arguments)},a.dynCall_ii=function(){return a.asm.dynCall_ii.apply(null,arguments)},a.dynCall_jiji=function(){return a.asm.dynCall_jiji.apply(null,arguments)},a.asm=en,a.intArrayFromString=function(n,t,r){var e=r>0?r:k(n)+1,a=new Array(e),o=R(n,a,0,a.length);return t&&(a.length=o),a},a.ccall=b,a.UTF8ToString=E,a.then=function(n){if(an)n(a);else{var t=a.onRuntimeInitialized;a.onRuntimeInitialized=function(){t&&t(),n(a)}}return a},z=function n(){an||sn(),an||(z=n)},a.run=sn,a.abort=pn,a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);a.preInit.length>0;)a.preInit.pop()();return a.noExitRuntime=!0,sn(),n})().then(function(n){var t;t="ready",self.postMessage(t,null,null),self.onmessage=function(t){t.data;try{r=t.data,e=function(t){var r=n.intArrayFromString(t),e=n._malloc(r.length);return n.HEAPU8.set(r,e),e}(r),n.ccall("runCode","number",["number"],[e]),n._free(e)}catch(n){}var r,e}})},n6c4:function(n,t,r){n.exports=r.p+"766c759dae06ba8a335f6391b2019a9b.wasm"}});