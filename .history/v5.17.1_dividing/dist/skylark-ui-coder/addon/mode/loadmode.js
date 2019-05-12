/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e,r){function n(e,r){var n=r;return function(){0==--n&&e()}}function o(r,o){var t=e.modes[r].dependencies;if(!t)return o();for(var i=[],a=0;a<t.length;++a)e.modes.hasOwnProperty(t[a])||i.push(t[a]);if(!i.length)return o();for(var d=n(o,i.length),a=0;a<i.length;++a)e.requireMode(i[a],d)}e.modeURL||(e.modeURL="../mode/%N/%N.js");var t={};e.requireMode=function(n,i){if("string"!=typeof n&&(n=n.name),e.modes.hasOwnProperty(n))return o(n,i);if(t.hasOwnProperty(n))return t[n].push(i);var a=e.modeURL.replace(/%N/g,n);if("plain"==r){var d=document.createElement("script");d.src=a;var u=document.getElementsByTagName("script")[0],s=t[n]=[i];e.on(d,"load",function(){o(n,function(){for(var e=0;e<s.length;++e)s[e]()})}),u.parentNode.insertBefore(d,u)}else"cjs"==r?(require(a),i()):"amd"==r&&requirejs([a],i)},e.autoLoadMode=function(r,n){e.modes.hasOwnProperty(n)||e.requireMode(n,function(){r.setOption("mode",r.getOption("mode"))})}});
//# sourceMappingURL=../../sourcemaps/addon/mode/loadmode.js.map
