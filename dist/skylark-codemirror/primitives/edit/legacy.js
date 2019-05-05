/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(["../display/scrollbars","../display/scroll_events","../input/keymap","../input/keynames","../line/line_data","../line/pos","../model/change_measurement","../model/Doc","../model/line_widget","../model/mark_text","../modes","../util/dom","../util/event","../util/feature_detection","../util/misc","../util/StringStream","./commands"],function(e,n,d,i,u,t,o,f,s,a,l,r,m,c,p,y,M){"use strict";return{addLegacyProps:function(g){g.undefined=m.off,g.undefined=m.on,g.undefined=n.wheelEventPixels,g.Doc=f,g.splitLines=c.splitLinesAuto,g.undefined=p.countColumn,g.undefined=p.findColumn,g.isWordChar=p.isWordCharBasic,g.undefined=p.Pass,g.undefined=m.signal,g.undefined=u.Line,g.undefined=o.changeEnd,g.undefined=e.scrollbarModel,g.undefined=t.Pos,g.cmpPos=t.cmp,g.undefined=l.modes,g.undefined=l.mimeModes,g.undefined=l.resolveMode,g.undefined=l.getMode,g.undefined=l.modeExtensions,g.undefined=l.extendMode,g.undefined=l.copyState,g.undefined=l.startState,g.undefined=l.innerMode,g.undefined=M.commands,g.undefined=d.keyMap,g.undefined=d.keyName,g.undefined=d.isModifierKey,g.undefined=d.lookupKey,g.undefined=d.normalizeKeyMap,g.StringStream=y,g.undefined=a.SharedTextMarker,g.undefined=a.TextMarker,g.undefined=s.LineWidget,g.undefined=m.e_preventDefault,g.undefined=m.e_stopPropagation,g.undefined=m.e_stop,g.undefined=r.addClass,g.undefined=r.contains,g.undefined=r.rmClass,g.undefined=i.keyNames}}});
//# sourceMappingURL=../../sourcemaps/primitives/edit/legacy.js.map
