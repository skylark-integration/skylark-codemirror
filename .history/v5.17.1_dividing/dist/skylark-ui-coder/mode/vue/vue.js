/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../../Coder","../../addon/mode/overlay","../xml/xml","../javascript/javascript","../coffeescript/coffeescript","../css/css","../sass/sass","../stylus/stylus","../jade/jade","../handlebars/handlebars"],function(e){var t={script:[["lang",/coffee(script)?/,"coffeescript"],["type",/^(?:text|application)\/(?:x-)?coffee(?:script)?$/,"coffeescript"]],style:[["lang",/^stylus$/i,"stylus"],["lang",/^sass$/i,"sass"],["type",/^(text\/)?(x-)?styl(us)?$/i,"stylus"],["type",/^text\/sass/i,"sass"]],template:[["lang",/^vue-template$/i,"vue"],["lang",/^jade$/i,"jade"],["lang",/^handlebars$/i,"handlebars"],["type",/^(text\/)?(x-)?jade$/i,"jade"],["type",/^text\/x-handlebars-template$/i,"handlebars"],[null,null,"vue-template"]]};e.defineMode("vue-template",function(t,s){var a={token:function(e){if(e.match(/^\{\{.*?\}\}/))return"meta mustache";for(;e.next()&&!e.match("{{",!1););return null}};return e.overlayMode(e.getMode(t,s.backdrop||"text/html"),a)}),e.defineMode("vue",function(s){return e.getMode(s,{name:"htmlmixed",tags:t})},"htmlmixed","xml","javascript","coffeescript","css","sass","stylus","jade","handlebars"),e.defineMIME("script/x-vue","vue")});
//# sourceMappingURL=../../sourcemaps/mode/vue/vue.js.map
