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
}(this,
function (exports) {

    var entries = [];  // each entry contains a viewport with sections
    var ctx = 50;      // context to add for the scroll targets

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
    var Middle = 'Middle';
    var Bottom = 'Bottom';
    var Left   = 'Left';
    var Center = 'Center';
    var Right  = 'Right';

    var Scroll = 'Scroll';
    var Target = 'Target'
    var ScrollTopTarget = Scroll + Top + Target;
    var ScrollLeftTarget = Scroll + Left + Target;

    var scroll = 'scroll';
    var resize = 'resize';

    var length = 'length';
    var _window = window;
    var _document = document;

    var min = Math.min;

    var reset = function() {
        var i, j, isBody, hasViewportClass, classes,
            listener, section, viewport, entry, sections;

        // running through existing entries and removing listeners
        for (i = 0; i < entries[length]; i++) {
            listener = entries[i].v.vpl;
            entries[i].v[removeEventListener](scroll, listener, 0);
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
                    viewport = viewport.scroller||viewport;
                    break;
                }

                viewport = viewport.parentNode;
            } while(1);

            // searching for exisiting entry for the viewport
            entry = null;
            for (j = 0; j < entries[length]; j++) {
                if (entries[j].v == viewport) {
                    entry = entries[j];
                    break;
                }
            }

            if (!entry) {
                // creating a new entry for the viewport
                entry = {
                    v : viewport,
                    s : []  // list of all sections
                };

                // listener invoked upon the viewport scroll
                viewport.vpl = (function(entry) { return function() {
                    var viewport = entry.v;

                    // updating the data for each section
                    for (var i = 0; i < entry.s[length]; i++) {
                        var section = entry.s[i];
                        
                        var vRect = viewport[getBoundingClientRect]();
                        var sRect = section[getBoundingClientRect]();
                        var sHeight = sRect[bottom] - sRect[top];
                        var sWidth  = sRect[right] - sRect[left];
                        var vMiddle = (vRect[bottom] + vRect[top])/2;
                        var vCenter = (vRect[left] + vRect[right])/2;
                        var sMiddle = (sRect[bottom] + sRect[top])/2;
                        var sCenter = (sRect[left] + sRect[right])/2;
                        var topOffset = vRect[top] - sRect[top];
                        var leftOffset = vRect[left] - sRect[left];

                        section[VIEWPORT+Top] = topOffset / sHeight;

                        section[VIEWPORT+Middle] =
                            (vMiddle - sRect[top]) / sHeight;

                        section[VIEWPORT+Bottom] =
                            (vRect[bottom] - sRect[top]) / sHeight;

                        section[VIEWPORT+Left] = leftOffset / sWidth;

                        section[VIEWPORT+Center] =
                            (vCenter - sRect[left]) / sWidth;

                        section[VIEWPORT+Right] =
                            (vRect[right] - sRect[left]) / sWidth;

                        section[VIEWPORT+ScrollTopTarget] =
                            viewport[scroll+Top] +
                            min(sMiddle - vMiddle, -topOffset - ctx);

                        section[VIEWPORT+ScrollLeftTarget] =
                            viewport[scroll+Left] +
                            min(sCenter - vCenter, -leftOffset - ctx);
                    }
                }})(entry);

                viewport[addEventListener](scroll, entry.v.vpl, 0);
                _window[addEventListener](resize, entry.v.vpl, 0);

                entries.push(entry);
            }

            // adding section to the entry of the viewport
            entry.s.push(section);
        }

        // initially setting-up the properties
        for (i = 0; i < entries[length]; i++) {
            entry.v.vpl();
        }
    }


    if (_document.readyState == "complete") {
        reset();
    } else {
        _window[addEventListener]("load", reset, 0);
    }

    exports.reset = reset;
}));

