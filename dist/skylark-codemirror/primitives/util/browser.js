/**
 * skylark-codemirror - A version of codemirror 5.45  that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-codemirror/
 * @license MIT
 */
define(function(){"use strict";let e=navigator.userAgent,t=navigator.platform,i=/gecko\/\d/i.test(e),o=/MSIE \d/.test(e),r=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e),d=/Edge\/(\d+)/.exec(e),n=o||r||d,s=n&&(o?document.documentMode||6:+(d||r)[1]),a=!d&&/WebKit\//.test(e),c=a&&/Qt\/\d+\.\d+/.test(e),m=!d&&/Chrome\//.test(e),l=/Opera\//.test(e),p=/Apple Computer/.test(navigator.vendor),b=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e),u=/PhantomJS/.test(e),g=!d&&/AppleWebKit/.test(e)&&/Mobile\/\w+/.test(e),M=/Android/.test(e),h=g||M||/webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e),O=g||/Mac/.test(t),v=/\bCrOS\b/.test(e),w=/win/i.test(t),C=l&&e.match(/Version\/(\d*\.\d*)/);return C&&(C=Number(C[1])),C&&C>=15&&(l=!1,a=!0),{gecko:i,ie:n,ie_version:s,webkit:a,chrome:m,presto:l,safari:p,mac_geMountainLion:b,phantom:u,ios:g,android:M,mobile:h,mac:O,chromeOS:v,windows:w,flipCtrlCmd:O&&(c||l&&(null==C||C<12.11)),captureRightClick:i||n&&s>=9}});
//# sourceMappingURL=../../sourcemaps/primitives/util/browser.js.map
