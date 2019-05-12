/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder"],function(e){"use strict";function r(e,r){if(!window.JSHINT)return[];JSHINT(e,r,r.globals);var n=JSHINT.data().errors,i=[];return n&&a(n,i),i}function n(e){return i(e,s,"warning",!0),i(e,c,"error"),t(e)?null:e}function i(e,r,n,i){var t,a,o,s,c;t=e.description;for(var d=0;d<r.length;d++)a=r[d],o="string"==typeof a?a:a[0],s="string"==typeof a?null:a[1],c=t.indexOf(o)!==-1,(i||c)&&(e.severity=n),c&&s&&(e.description=s)}function t(e){for(var r=e.description,n=0;n<o.length;n++)if(r.indexOf(o[n])!==-1)return!0;return!1}function a(r,i){for(var t=0;t<r.length;t++){var a=r[t];if(a){var o,s;if(o=[],a.evidence){var c=o[a.line];if(!c){var d=a.evidence;c=[],Array.prototype.forEach.call(d,function(e,r){"\t"===e&&c.push(r+1)}),o[a.line]=c}if(c.length>0){var f=a.character;c.forEach(function(e){f>e&&(f-=1)}),a.character=f}}var u=a.character-1,l=u+1;a.evidence&&(s=a.evidence.substring(u).search(/.\b/),s>-1&&(l+=s)),a.description=a.reason,a.start=a.character,a.end=l,a=n(a),a&&i.push({message:a.description,severity:a.severity,from:e.Pos(a.line-1,u),to:e.Pos(a.line-1,l)})}}}var o=["Dangerous comment"],s=[["Expected '{'","Statement body should be inside '{ }' braces."]],c=["Missing semicolon","Extra comma","Missing property name","Unmatched "," and instead saw"," is not defined","Unclosed string","Stopping, unable to continue"];e.registerHelper("lint","javascript",r)});
//# sourceMappingURL=../../sourcemaps/addon/lint/javascript-lint.js.map
