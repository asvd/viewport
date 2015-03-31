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

    // contains all viewports
    var entries = [];
    
    

    /**
     * Runs through the viewports, and releases the events
     */
    var releaseViewports = function() {
        for (var i = 0; i < entries.length; i++) {
            for (var j = 0; j < entries[i].sections.length; j++) {
                updateSection(entries[i].sections[j]);
            }

            entries[i].viewport.removeEventListener(
                entries[i].viewport.vpListener
            );
        }

        entries = [];
    }



    /**
     * Collects all viewports and sections along the document, and
     * sets the events for them
     */
    var setViewports = function() {
        var sections = document.getElementsByClassName('section');

        var i, j, section, listener,
            viewport, entry,
            len = sections.length;

        // building entries
        for (i = 0; i < len; i++) {
            section = sections[i];
            viewport = findViewport(section);

            entry = null;
            for (j = 0; j < entries.length; j++) {
                if (entries[i].viewport == viewport) {
                    entry = entries[i];
                }
            }

            if (!entry) {
                entry = {
                    viewport : viewport,
                    sections : []
                };

                entries.push(entry);
            }

            entry.sections.push(section);
            updateSection(section, viewport);
        }

        // setting-up the events
        for (i = 0; i < entries.length; i++) {
            listener = entries[i].viewport.vpListener =
                (function(sections, viewport) {
                    return function() {
                        for (var i = 0; i < sections.length; i++) {
                            updateSection(sections[i], viewport);
                        }
                    }
                })(entries[i].sections, entries[i].viewport);

            entries[i].viewport.addEventListener(
                'scroll', listener, 0
            );
        }
    }



    /**
     * Updates the viewport position for a single section
     * 
     * @param {Element} section to update data for
     * @param {Element} viewport of an element
     */
    var updateSection = function(section, viewport) {
        if (viewport) {
            var vRect = viewport.getBoundingClientRect();
            var sRect = section.getBoundingClientRect();

            var sHeight = sRect.bottom - sRect.top;
            var sWidth = sRect.right - sRect.left;

            var vMiddle = (vRect.bottom + vRect.top) / 2;
            var vCenter = (vRect.left + vRect.right) / 2;

            section.viewportTop = (vRect.top - sRect.top) / sHeight;
            section.viewportMiddle = (vMiddle - sRect.top) / sHeight;
            section.viewportBottom = (vRect.bottom - sRect.top) / sHeight;

            section.viewportLeft = (vRect.left - sRect.left) / sWidth;
            section.viewportCenter = (vCenter - sRect.left) / sWidth;
            section.viewportRight = (vRect.right - sRect.left) / sWidth;
        } else {
            delete section.viewportTop;
            delete section.viewportMiddle;
            delete section.viewportBottom;
            delete section.viewportLeft;
            delete section.viewportCenter;
            delete section.viewportRight;
        }
    }



    /**
     * Searches for the viewport of the given section element. Runs
     * through the parents and finds the firts element with a viewport
     * class (if no element found, body is considered as a viewport
     * 
     * @param {Element} section to find viewport for
     * 
     * @returns {Element} viewport of the section
     */
    var findViewport = function(section) {
        var viewport = section;

        var i, isBody, hasViewportClass, classes;
        do {
            viewport = viewport.parentNode;
            hasViewportClass = false;
            isBody = viewport == document.body;

            if (!isBody) {
                classes = viewport.className.split(' ');
                for (i = 0; i < classes.length; i++) {
                    if (classes[i] == 'viewport') {
                        hasViewportClass = true;
                        break;
                    }
                }
            }
        } while (viewport.parentNode &&
                 !isBody && !hasViewportClass);

        return viewport;
    }



    var reset = function() {
        releaseViewports();
        setViewports();
    }


    if (document.readyState == "complete") {
        reset();
    } else {
        window.addEventListener("load", reset, false);
    }

    exports.reset = reset;
}));

