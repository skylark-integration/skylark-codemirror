/**
 * skylark-codemirror5 - A version of codemirror 5.17.1  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror5/
 * @license MIT
 */
function splitLines(t){return t.split(/\r\n?|\n/)}var countColumn=exports.countColumn=function(t,e,n,s,r){null==e&&-1==(e=t.search(/[^\s\u00a0]/))&&(e=t.length);for(var i=s||0,o=r||0;;){var a=t.indexOf("\t",i);if(a<0||a>=e)return o+(e-i);o+=a-i,o+=n-o%n,i=a+1}};function StringStream(t,e,n){this.pos=this.start=0,this.string=t,this.tabSize=e||8,this.lastColumnPos=this.lastColumnValue=0,this.lineStart=0,this.context=n}StringStream.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return this.pos==this.lineStart},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){if(this.pos<this.string.length)return this.string.charAt(this.pos++)},eat:function(t){var e=this.string.charAt(this.pos);if("string"==typeof t)var n=e==t;else n=e&&(t.test?t.test(e):t(e));if(n)return++this.pos,e},eatWhile:function(t){for(var e=this.pos;this.eat(t););return this.pos>e},eatSpace:function(){for(var t=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>t},skipToEnd:function(){this.pos=this.string.length},skipTo:function(t){var e=this.string.indexOf(t,this.pos);if(e>-1)return this.pos=e,!0},backUp:function(t){this.pos-=t},column:function(){return this.lastColumnPos<this.start&&(this.lastColumnValue=countColumn(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start),this.lastColumnValue-(this.lineStart?countColumn(this.string,this.lineStart,this.tabSize):0)},indentation:function(){return countColumn(this.string,null,this.tabSize)-(this.lineStart?countColumn(this.string,this.lineStart,this.tabSize):0)},match:function(t,e,n){if("string"!=typeof t){var s=this.string.slice(this.pos).match(t);return s&&s.index>0?null:(s&&!1!==e&&(this.pos+=s[0].length),s)}var r=function(t){return n?t.toLowerCase():t};if(r(this.string.substr(this.pos,t.length))==r(t))return!1!==e&&(this.pos+=t.length),!0},current:function(){return this.string.slice(this.start,this.pos)},hideFirstChars:function(t,e){this.lineStart+=t;try{return e()}finally{this.lineStart-=t}},lookAhead:function(t){var e=this.context.line+t;return e>=this.context.lines.length?null:this.context.lines[e]}},exports.StringStream=StringStream,exports.startState=function(t,e,n){return!t.startState||t.startState(e,n)};var modes=exports.modes={},mimeModes=exports.mimeModes={};function copyObj(t,e,n){for(var s in e||(e={}),t)!t.hasOwnProperty(s)||!1===n&&e.hasOwnProperty(s)||(e[s]=t[s]);return e}exports.defineMode=function(t,e){arguments.length>2&&(e.dependencies=Array.prototype.slice.call(arguments,2)),modes[t]=e},exports.defineMIME=function(t,e){mimeModes[t]=e},exports.defineMode("null",function(){return{token:function(t){t.skipToEnd()}}}),exports.defineMIME("text/plain","null"),exports.resolveMode=function(t){return"string"==typeof t&&mimeModes.hasOwnProperty(t)?t=mimeModes[t]:t&&"string"==typeof t.name&&mimeModes.hasOwnProperty(t.name)&&(t=mimeModes[t.name]),"string"==typeof t?{name:t}:t||{name:"null"}};var modeExtensions=exports.modeExtensions={};exports.extendMode=function(t,e){copyObj(e,modeExtensions.hasOwnProperty(t)?modeExtensions[t]:modeExtensions[t]={})},exports.getMode=function(t,e){e=exports.resolveMode(e);var n=modes[e.name];if(!n)return exports.getMode(t,"text/plain");var s=n(t,e);if(modeExtensions.hasOwnProperty(e.name)){var r=modeExtensions[e.name];for(var i in r)r.hasOwnProperty(i)&&(s.hasOwnProperty(i)&&(s["_"+i]=s[i]),s[i]=r[i])}if(s.name=e.name,e.helperType&&(s.helperType=e.helperType),e.modeProps)for(var i in e.modeProps)s[i]=e.modeProps[i];return s},exports.innerMode=function(t,e){for(var n;t.innerMode&&(n=t.innerMode(e))&&n.mode!=t;)e=n.state,t=n.mode;return n||{mode:t,state:e}},exports.registerHelper=exports.registerGlobalHelper=Math.min,exports.runMode=function(t,e,n,s){for(var r=exports.getMode({indentUnit:2},e),i=splitLines(t),o=s&&s.state||exports.startState(r),a={lines:i,line:0},h=0,u=i.length;h<u;++h,++a.line){h&&n("\n");var l=new exports.StringStream(i[h],4,a);for(!l.string&&r.blankLine&&r.blankLine(o);!l.eol();){var p=r.token(l,o);n(l.current(),p,h,l.start,o),l.start=l.pos}}},require.cache[require.resolve("../../lib/codemirror")]=require.cache[require.resolve("./runmode.node")],require.cache[require.resolve("../../addon/runmode/runmode")]=require.cache[require.resolve("./runmode.node")];
//# sourceMappingURL=../../sourcemaps/addon/runmode/runmode.node.js.map
