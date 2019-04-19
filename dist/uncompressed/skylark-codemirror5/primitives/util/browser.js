define(function () {
    'use strict';
    let userAgent = navigator.userAgent;
    let platform = navigator.platform;
    let gecko = /gecko\/\d/i.test(userAgent);
    let ie_upto10 = /MSIE \d/.test(userAgent);
    let ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
    let edge = /Edge\/(\d+)/.exec(userAgent);
    let ie = ie_upto10 || ie_11up || edge;
    let ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
    let webkit = !edge && /WebKit\//.test(userAgent);
    let qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
    let chrome = !edge && /Chrome\//.test(userAgent);
    let presto = /Opera\//.test(userAgent);
    let safari = /Apple Computer/.test(navigator.vendor);
    let mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
    let phantom = /PhantomJS/.test(userAgent);
    let ios = !edge && /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
    let android = /Android/.test(userAgent);
    let mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    let mac = ios || /Mac/.test(platform);
    let chromeOS = /\bCrOS\b/.test(userAgent);
    let windows = /win/i.test(platform);
    let presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
    if (presto_version)
        presto_version = Number(presto_version[1]);
    if (presto_version && presto_version >= 15) {
        presto = false;
        webkit = true;
    }
    let flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
    let captureRightClick = gecko || ie && ie_version >= 9;
    return {
        gecko: gecko,
        ie: ie,
        ie_version: ie_version,
        webkit: webkit,
        chrome: chrome,
        presto: presto,
        safari: safari,
        mac_geMountainLion: mac_geMountainLion,
        phantom: phantom,
        ios: ios,
        android: android,
        mobile: mobile,
        mac: mac,
        chromeOS: chromeOS,
        windows: windows,
        flipCtrlCmd: flipCtrlCmd,
        captureRightClick: captureRightClick
    };
});