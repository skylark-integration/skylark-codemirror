/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
!function(){function t(t){test.mode(t,a,Array.prototype.slice.call(arguments,1),e)}var a=CodeMirror.getMode({indentUnit:2},"xml"),e="xml";t("matching","[tag&bracket <][tag top][tag&bracket >]","  text","  [tag&bracket <][tag inner][tag&bracket />]","[tag&bracket </][tag top][tag&bracket >]"),t("nonmatching","[tag&bracket <][tag top][tag&bracket >]","  [tag&bracket <][tag inner][tag&bracket />]","  [tag&bracket </][tag&error tip][tag&bracket&error >]"),t("doctype","[meta <!doctype foobar>]","[tag&bracket <][tag top][tag&bracket />]"),t("cdata","[tag&bracket <][tag top][tag&bracket >]","  [atom <![CDATA[foo]","[atom barbazguh]]]]>]","[tag&bracket </][tag top][tag&bracket >]"),a=CodeMirror.getMode({indentUnit:2},"text/html"),t("selfclose","[tag&bracket <][tag html][tag&bracket >]",'  [tag&bracket <][tag link] [attribute rel]=[string stylesheet] [attribute href]=[string "/foobar"][tag&bracket >]',"[tag&bracket </][tag html][tag&bracket >]"),t("list","[tag&bracket <][tag ol][tag&bracket >]","  [tag&bracket <][tag li][tag&bracket >]one","  [tag&bracket <][tag li][tag&bracket >]two","[tag&bracket </][tag ol][tag&bracket >]"),t("valueless","[tag&bracket <][tag input] [attribute type]=[string checkbox] [attribute checked][tag&bracket />]"),t("pThenArticle","[tag&bracket <][tag p][tag&bracket >]","  foo","[tag&bracket <][tag article][tag&bracket >]bar")}();
//# sourceMappingURL=../../sourcemaps/mode/xml/test.js.map
