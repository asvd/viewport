viewport.js
===========


`viewport.js` is a small javascript library (2152 bytes minified)
which ships the document sections with additional properties
containing the viewport scrolling position relatively to the
sections. Using these properties you can create a custom scrolling
indicator or a navigation menu precisely reflecting the scrolling
state:

- [demo page](http://asvd.github.io/viewport) / [and its
source](https://github.com/asvd/asvd.github.io/tree/master/viewport);

- [home page of intence project](http://asvd.github.io/intence) also
  uses `viewport.js` for its navigation menu.

In other words, `viewport.js` is similar to
[other](http://davidwalsh.name/js/scrollspy)
[scrollspy](http://getbootstrap.com/javascript/#scrollspy) [solutions]
(https://github.com/sxalexander/jquery-scrollspy), but has the
following advantages:

- it is written on vanilla javascript, does not have dependencies and
  works anywhere;

- it has a simple and flexible API which shows:

 - which section is currently displayed in the viewport;

 - where is the viewport relatively to each section;

 - where are the viewport edges relatively to each section;

 - where should the viewport be scrolled to in order to show a
   particular section.


### Usage

Download and unpack the
[distribution](https://github.com/asvd/viewport/releases/download/v0.0.6/viewport-0.0.6.tar.gz), or install it using [Bower](http://bower.io/):

```sh
$ bower install vanilla-viewport
```

or npm:

```sh
$ npm install vanilla-viewport
```

Load the `viewport.js` in a preferable way (that is an UMD module):

```html
<script src="viewport.js"></script>
```

Add the `section` class to the sections:

```html
<div id=firstSection class=section>
    First section content goes here...
</div>

<div id=secondSection class=section>
    Second section content goes here...
</div>
```

This is it - now the sections are shipped with additional properties
and you can fetch them on viewport scroll in order to reflect the
scrolling state in an indicator:

```js
// use document.body if the whole page is scrollable
var myViewport = document.getElementById('myViewport');
var firstSection = document.getElementById('firstSection');

myViewport.addEventListener(
    'scroll',
    function() {
        var location = firstSection.viewportTopLocation;
        console.log(
            'The viewport is at ' + location +
            ' relatively to the first section'
        );
    },
    false
);
```


Section elements contain the following properties:

- `viewportTopLoctaion` - progress of a viewport scrolling through the
  section. If the section is visible in the viewport, the value is
  between 0 (section start) and 1 (section end). Values <0 or >1 mean
  that the section is outside of the viewport. This property reflects
  the location of the viewport as a whole;

- `veiwportTopStart` - precise position of the top edge of the
  viewport relatively to the section. The value has the same meaning
  as for the `viewportTopLocation`;

- `viewportTopEnd` - same for the bottom border of the viewport.


Use `viewportTopLocation` if you want to display a scrolling progress
as a single value. Use `viewportTopStart` and `viewportTopEnd`
properties together if you need to display the scrolling position as a
range (like on a scrollbar), or if you need to know the rate of how
much the viewport covers the section.

There are also the similar properties for the horizontal scrolling
direction:

- `viewportLeftLocation` - horizontal scrolling position of the
  viewport relatively to the section;

- `viewportLeftStart` - viewport left edge position;

- `viewportLeftEnd` - veiwport right edge position;

The following properties contain the scroll targets where the viewport
should be scrolled in order to display a particular section:

- `viewportScrollTopTarget`

- `viewportScrollLeftTarget`

You will need them to determine where to scroll the viewport when user
clicks a menu button pointing to the section. Always use [natural
scroll](http://github.com/asvd/naturalScroll) when scrolling
programmatically.

If a viewport is not the whole page, add the `viewport` class to the
the element which actually performs scrolling:


```html
<div class=viewport id=myViewport>
  <div id=firstSection class=section>
      First section content goes here...
  </div>

  <div id=secondSection class=section>
      Second section content goes here...
  </div>
</div>
```

The viewport element additionally contains the `currentSection`
property which points to the section element currently visible in the
viewport (more precisely, the section which is the closest to the
viewport):


```js
var currentSection = document.getElementById('myViewport').currentSection;
```

If you change / create the sections dynamically after the page
load, invoke `viewport.reset()` to update the listeners.

You may also have several scrollable viewports with nested sections,
in this case the sections will contain the data related to their
respective viewports.

For the sake of performance, sections dimensions are cached upon page
load. It is assumed that section dimensions may only change upon
window resize, so after it happens, the cached dimensions are
updated. But if in your application section dimensions may change for
other reasons, invoke `viewport.updateDimensions()` after that
happens.

If you create a navigation panel reflecting the scrolling state,
replace the scrollbars with [intence](http://asvd.github.io/intence)
indicator: it designates a scrollable area in more clear and intuitive
way comparing to the ordinary scrollbar.

-

Follow me on twitter: https://twitter.com/asvd0
