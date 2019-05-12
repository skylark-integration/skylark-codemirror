/**
 * skylark-ui-coder - The skylark coder widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-coder/
 * @license MIT
 */
define(["../CoderCtor"],function(e){var t=navigator.userAgent,o=navigator.platform,i=/gecko\/\d/i.test(t),r=/MSIE \d/.test(t),n=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(t),s=r||n,a=s&&(r?document.documentMode||6:n[1]),d=/WebKit\//.test(t),c=d&&/Qt\/\d+\.\d+/.test(t),m=/Chrome\//.test(t),p=/Opera\//.test(t),b=/Apple Computer/.test(navigator.vendor),u=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(t),M=/PhantomJS/.test(t),v=/AppleWebKit/.test(t)&&/Mobile\/\w+/.test(t),g=v||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(t),l=v||/Mac/.test(o),w=/\bCrOS\b/.test(t),O=/win/i.test(o),h=p&&t.match(/Version\/(\d*\.\d*)/);h&&(h=Number(h[1])),h&&h>=15&&(p=!1,d=!0);return{gecko:i,ie_upto10:r,ie_11up:n,ie_version:a,webkit:d,qtwebkit:c,chrome:m,presto:p,safari:b,mac_geMountainLion:u,phantom:M,ios:v,mobile:g,mac:l,chromeOS:w,windows:O,presto_version:h}});
//# sourceMappingURL=../../sourcemaps/primitives/util/browser.js.map
