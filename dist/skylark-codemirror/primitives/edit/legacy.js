/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../display/scrollbars","../display/scroll_events","../input/keymap","../input/keynames","../line/line_data","../line/pos","../model/change_measurement","../model/Doc","../model/line_widget","../model/mark_text","../modes","../util/dom","../util/event","../util/feature_detection","../util/misc","../util/StringStream","./commands"],function(e,o,t,n,s,a,i,d,l,r,m,c,p,u,M,y,g){"use strict";return{addLegacyProps:function(k){k.off=p.off,k.on=p.on,k.wheelEventPixels=o.wheelEventPixels,k.Doc=d,k.splitLines=u.splitLinesAuto,k.countColumn=M.countColumn,k.findColumn=M.findColumn,k.isWordChar=M.isWordCharBasic,k.Pass=M.Pass,k.signal=p.signal,k.Line=s.Line,k.changeEnd=i.changeEnd,k.scrollbarModel=e.scrollbarModel,k.Pos=a.Pos,k.cmpPos=a.cmp,k.modes=m.modes,k.mimeModes=m.mimeModes,k.resolveMode=m.resolveMode,k.getMode=m.getMode,k.modeExtensions=m.modeExtensions,k.extendMode=m.extendMode,k.copyState=m.copyState,k.startState=m.startState,k.innerMode=m.innerMode,k.commands=g.commands,k.keyMap=t.keyMap,k.keyName=t.keyName,k.isModifierKey=t.isModifierKey,k.lookupKey=t.lookupKey,k.normalizeKeyMap=t.normalizeKeyMap,k.StringStream=y,k.SharedTextMarker=r.SharedTextMarker,k.TextMarker=r.TextMarker,k.LineWidget=l.LineWidget,k.e_preventDefault=p.e_preventDefault,k.e_stopPropagation=p.e_stopPropagation,k.e_stop=p.e_stop,k.addClass=c.addClass,k.contains=c.contains,k.rmClass=c.rmClass,k.keyNames=n.keyNames}}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/legacy.js.map
