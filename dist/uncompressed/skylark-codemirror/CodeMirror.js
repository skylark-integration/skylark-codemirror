define([
	'./cm',
	'./primitives/edit/main'
], function (cm,_main) {
    'use strict';
    return cm.CodeMirror = _main.CodeMirror;
});