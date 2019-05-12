/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
function getFile(e,t){postMessage({type:"getFile",name:e,id:++nextId}),pending[nextId]=t}function startServer(e,t,r){r&&importScripts.apply(null,r),server=new tern.Server({getFile:getFile,async:!0,defs:e,plugins:t})}var server;this.onmessage=function(e){var t=e.data;switch(t.type){case"init":return startServer(t.defs,t.plugins,t.scripts);case"add":return server.addFile(t.name,t.text);case"del":return server.delFile(t.name);case"req":return server.request(t.body,function(e,r){postMessage({id:t.id,body:r,err:e&&String(e)})});case"getFile":var r=pending[t.id];return delete pending[t.id],r(t.err,t.text);default:throw new Error("Unknown message type: "+t.type)}};var nextId=0,pending={};this.console={log:function(e){postMessage({type:"debug",message:e})}};
//# sourceMappingURL=../../sourcemaps/addon/tern/worker.js.map
