/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(){function e(e){test.mode(e,t,Array.prototype.slice.call(arguments,1))}var t=CodeMirror.getMode({indentUnit:2},"mscgen");e("empty chart","[keyword msc][bracket {]","[base   ]","[bracket }]"),e("comments","[comment // a single line comment]","[comment # another  single line comment /* and */ ignored here]","[comment /* A multi-line comment even though it contains]",'[comment msc keywords and "quoted text"*/]'),e("strings",'[string "// a string"]','[string "a string running over]','[string two lines"]','[string "with \\"escaped quote"]'),e("xù/ msgenny keywords classify as 'base'","[base watermark]","[base alt loop opt ref else break par seq assert]"),e("mscgen options classify as keyword","[keyword hscale]","[keyword width]","[keyword arcgradient]","[keyword wordwraparcs]"),e("mscgen arcs classify as keyword","[keyword note]","[keyword abox]","[keyword rbox]","[keyword box]","[keyword |||...---]","[keyword ..--==::]","[keyword ->]","[keyword <-]","[keyword <->]","[keyword =>]","[keyword <=]","[keyword <=>]","[keyword =>>]","[keyword <<=]","[keyword <<=>>]","[keyword >>]","[keyword <<]","[keyword <<>>]","[keyword -x]","[keyword x-]","[keyword -X]","[keyword X-]","[keyword :>]","[keyword <:]","[keyword <:>]"),e("within an attribute list, attributes classify as attribute","[bracket [[][attribute label]","[attribute id]","[attribute url]","[attribute idurl]","[attribute linecolor]","[attribute linecolour]","[attribute textcolor]","[attribute textcolour]","[attribute textbgcolor]","[attribute textbgcolour]","[attribute arclinecolor]","[attribute arclinecolour]","[attribute arctextcolor]","[attribute arctextcolour]","[attribute arctextbgcolor]","[attribute arctextbgcolour]","[attribute arcskip][bracket ]]]"),e("outside an attribute list, attributes classify as base","[base label]","[base id]","[base url]","[base idurl]","[base linecolor]","[base linecolour]","[base textcolor]","[base textcolour]","[base textbgcolor]","[base textbgcolour]","[base arclinecolor]","[base arclinecolour]","[base arctextcolor]","[base arctextcolour]","[base arctextbgcolor]","[base arctextbgcolour]","[base arcskip]"),e("a typical program","[comment # typical mscgen program]","[keyword msc][base  ][bracket {]",'[keyword wordwraparcs][operator =][string "true"][base , ][keyword hscale][operator =][string "0.8"][keyword arcgradient][operator =][base 30;]','[base   a][bracket [[][attribute label][operator =][string "Entity A"][bracket ]]][base ,]','[base   b][bracket [[][attribute label][operator =][string "Entity B"][bracket ]]][base ,]','[base   c][bracket [[][attribute label][operator =][string "Entity C"][bracket ]]][base ;]','[base   a ][keyword =>>][base  b][bracket [[][attribute label][operator =][string "Hello entity B"][bracket ]]][base ;]','[base   a ][keyword <<][base  b][bracket [[][attribute label][operator =][string "Here\'s an answer dude!"][bracket ]]][base ;]','[base   c ][keyword :>][base  *][bracket [[][attribute label][operator =][string "What about me?"][base , ][attribute textcolor][operator =][base red][bracket ]]][base ;]',"[bracket }]")}();
//# sourceMappingURL=../../sourcemaps/mode/mscgen/mscgen_test.js.map
