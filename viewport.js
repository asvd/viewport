/**
 * @fileoverview viewport - calculates viewport position
 * @version 0.0.1
 * 
 * @license MIT, see http://github.com/asvd/viewport
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.viewport = {}));
    }
}(this, function (exports) {
    var entries = [];  // each entry contains a viewport with sections
    var ctx = 40;      // context to substract from the scroll targets

    // for better compression
    var VIEWPORT = 'viewport';
    var EventListener = 'EventListener';
    var addEventListener = 'add'+EventListener;
    var removeEventListener = 'remove'+EventListener;
    var getBoundingClientRect = 'getBoundingClientRect';

    var top    = 'top';
    var bottom = 'bottom';
    var left   = 'left';
    var right  = 'right';
      
    var Top    = 'Top';
    var Left   = 'Left';
      
    var Location = 'Location';
    var Start    = 'Start';
    var End      = 'End';
    var Scroll   = 'Scroll';
    var Target   = 'Target'
    var scroll   = 'scroll';
    var resize   = 'resize';
    var length   = 'length';
    var _window  = window;
    var _document = document;
    var _null = null;
    var _Math = Math;
    var Math_min = _Math.min;
    var Math_max = _Math.max;
    var Math_abs = _Math.abs;
      
      
    var reset = function() {
        var i, j, isBody, hasViewportClass, classes,
            listener, section, viewport, scroller, entry, sections;

        // running through existing entries and removing listeners
        for (i = 0; i < entries[length]; i++) {
            listener = entries[i].r.vpl;
            entries[i].r[removeEventListener](scroll, listener, 0);
            _window[removeEventListener](resize, listener, 0);
        }

        // rebuilding entries
        entries = [];
        sections = _document.getElementsByClassName('section');
        for (i = 0; i < sections[length]; i++) {
            // searching for a parent viewport
            viewport = section = sections[i];
            do {
                hasViewportClass = 0;
                isBody = viewport == _document.body;
                if (!isBody) {
                    classes = viewport.className.split(' ');
                    for (j = 0; j < classes[length]; j++) {
                        if (classes[j] == VIEWPORT) {
                            hasViewportClass = 1;
                            break;
                        }
                    }
                }

                if (isBody || hasViewportClass) {
                    break;
                }

                viewport = viewport.parentNode;
            } while(1);

            // searching for exisiting entry for the viewport
            entry = _null;
            for (j = 0; j < entries[length]; j++) {
                if (entries[j].v == viewport) {
                    entry = entries[j];
                    break;
                }
            }

            if (!entry) {
                scroller = viewport.scroller||viewport;
                // a new entry for the viewport
                entry = {
                    v : viewport,
                    r : scroller,
                    s : []  // list of all sections
                };

                // listener invoked upon the viewport scroll
                scroller.vpl = (function(entry) {
                return function() {
                    var scroller = entry.r;
                    var vRect = scroller[getBoundingClientRect]();

                    var vTop    = vRect[top];
                    var vLeft   = vRect[left];
                    var vBottom = vRect[bottom];
                    var vRight  = vRect[right];

                    var vMiddle = (vBottom + vTop)/2;
                    var vCenter = (vLeft + vRight)/2;

                    // full scorlling amount
                    var maxVert = scroller.scrollHeight - vRect.height;
                    var maxHoriz = scroller.scrollWidth - vRect.width;
                    
                    // viewport scroll ratio, 0..1
                    var rateVert = scroller[scroll+Top] / maxVert;
                    var rateHoriz = scroller[scroll+Left] / maxHoriz;
                                                      
                    // viewport location point moves along with
                    // viewport scroll to always meet the borders
                    var vMiddlePos = vTop + (vBottom-vTop)*rateVert;
                    var vCenterPos = vLeft + (vRight-vLeft)*rateHoriz;

                    // updating the data for each section
                    // (and searching for the closest section)
                    var closest = _null;
                    var minDist = _null;
                    for (var i = 0; i < entry.s[length]; i++) {
                        var section = entry.s[i];

                        var sRect = section[getBoundingClientRect]();
                        var sTop = sRect[top];
                        var sLeft = sRect[left];
                        var sHeight = sRect[bottom] - sTop;
                        var sWidth  = sRect[right] - sLeft;

                        var topOffset = vTop - sTop;
                        var leftOffset = vLeft - sLeft;

                        // viewport location related to the section
                        var vLeftLocation = (vCenterPos - sLeft) / sWidth;
                        var vTopLocation =  (vMiddlePos - sTop)  / sHeight;

                        // viewport to section distance, normalized
                        var vVertDist =
                            Math_max( 0, Math_abs(vTopLocation - 0.5) - 0.5);
                        var vHorizDist =
                            Math_max(0, Math_abs(vLeftLocation - 0.5) - 0.5);

                        // squared, but we only need to compare
                        var dist = vVertDist*vVertDist + vHorizDist*vHorizDist;

                        var scrollTopToStart = -topOffset - ctx;
                        var scrollTopToMiddle =
                            (sRect[bottom] + sTop)/2 - vMiddle;

                        var scrollLeftToStart = -leftOffset - ctx;
                        var scrollLeftToCenter =
                            (sLeft + sRect[right])/2 - vCenter;

                        // updating section data concerning the viewport
                        section[VIEWPORT+Top+Start] = topOffset / sHeight;
                        section[VIEWPORT+Top+End] = (vBottom - sTop) / sHeight;

                        section[VIEWPORT+Left+Start] = leftOffset / sWidth;
                        section[VIEWPORT+Left+End] = (vRight - sLeft) / sWidth;

                        section[VIEWPORT+Top+Location] = vTopLocation;
                        section[VIEWPORT+Left+Location] = vLeftLocation;
                        
                        section[VIEWPORT+Scroll+Top+Target] =
                            Math.max(
                                0,
                                Math_min(
                                    maxVert,
                                    scroller[scroll+Top] +
                                        Math_min(scrollTopToStart,
                                                 scrollTopToMiddle)
                                )
                            );

                        section[VIEWPORT+Scroll+Left+Target] =
                            Math_max(
                                0,
                                Math_min(
                                    maxHoriz,
                                    scroller[scroll+Left] +
                                        Math_min(scrollLeftToStart,
                                                 scrollLeftToCenter)
                                )
                            );
                        
                        // checking if the section is closer to the viewport
                        if (minDist === _null || minDist > dist) {
                            minDist = dist;
                            closest = section;
                        }
                    }

                    entry.v.currentSection = closest;
                }})(entry);

                scroller[addEventListener](scroll, scroller.vpl, 0);
                _window[addEventListener](resize, scroller.vpl, 0);

                entries.push(entry);
            }

            // adding section to the entry of the viewport
            entry.s.push(section);
        }

        // initially setting-up the properties
        for (i = 0; i < entries[length]; i++) {
            entry.r.vpl();
        }
    }


    if (_document.readyState == "complete") {
        reset();
    } else {
        _window[addEventListener]("load", reset, 0);
    }

    exports.reset = reset;
}));

