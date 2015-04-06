viewport.js
===========


`viewport.js` is a small javascript library which ships the sections
of a page with additional properties which reflect the location of a
scrollable viewport relatively to them. A custom scrolling indicator
or an interactive navigation menu can then represent the viewport
position using these properties.

[Demo](http://asvd.github.io/viewport) / [and its
source](https://github.com/asvd/asvd.github.io/tree/master/viewport)

In other words, `viewport.js` is similar to
[other](http://davidwalsh.name/js/scrollspy)
[scrollspy](http://getbootstrap.com/javascript/#scrollspy) [solutions]
(https://github.com/sxalexander/jquery-scrollspy), but the advantages
of `viewport.js` are:

- It does not have any dependencies and works anywhere;

- It's size is only 1548 bytes minified;

- It has very simple and flexible API which reports:

 - the current section currentyl visible in the scrollable viewport;

 - current position of a viewport in both dimensions relatively to
   each section;

 - current positions of a viewport start and end borders in both
   dimensions relatively to each section;

 - scroll targets the viewport should be scrolled to in order to
   display a particular section (also in both dimensions and for each
   section).


### Usage

Download the
[distribution](https://github.com/asvd/viewport/releases/download/v0.0.1/viewport-0.0.1.tar.gz),
unpack it and load the `viewport.js` in a preferable way (that is an
UMD module):

```html
<script src="viewport.js"></script>
```

Add the `section` class to every section to be equipped with the
additional viewport position properties:

```html
<div id=firstSection class=section>
    First section content goes here...
</div>

<div id=secondSection class=section>
    Second section content goes here...
</div>
```

Now you can fetch the section elements and read the viewport
properties which are updated on page scroll:

```js
var firstSection = document.getElementById('firstSection');

// location of a viewport relatively to the first section
var viewportLocation = firstSection.viewportTopLocation;
```


Section elements are equipped with the following properties:

- `viewportTopLocation` - a number designating the vertical scrolling
  position of the viewport relatively to the section. If the section
  is currently visible in the viewport, the number is between 0
  and 1. Value < 0 means that section is above the viewport; value > 1
  means that the section is below the area displayed in the
  viewport. The `viewportTopLocation` property designates a progress
  of scrolling through the section.

- `viewportTopStart` - a number designating the current location of
  the top border of the viewport relatively to the section. Value has
  the same meaning as for the `viewportTopLocation` property, but
  `viewportTopStart` represents the exact location of the top border,
  and not of the whole viewport.

- `viewportTopEnd` - same as `viewportTopEnd`, but for the bottom
  border of the viewport. You will need to use these two properties if
  you wish to display a viewport position as a range (like on a
  scrollbar).

There are also the similar properties, but for the horizontal
dimension:

- `viewportLeftLocation` - horizontal scrolling progress of a viewport
  relatively to the section;

- `viewportLeftStart` position of a left border of the viewport;

- `viewportLeftEnd` position of a right border of the viewport;

These properties allow to determine where the viewport should be
programmatically scrolled in order to display the beginning of the
section:

- `viewportScrollTopTarget`

- `viewportScrollLeftTarget`

You will need this properties if you have a navigation component which
should scroll the viewport to the given section upon the click.


If the scrollable viewport is not the whole page, add the `viewport`
class to it (it should be the element which actually performs
scrolling):


```html
<div class=viewport>
  <div id=firstSection class=section>
      First section content goes here...
  </div>

  <div id=secondSection class=section>
      Second section content goes here...
  </div>
</div>
```


A viewport element also has the `currentSection` property which points
to the section element which is currently displayed in the viewport
(actually the section which is the closest to the viewport):


```js
var currentSection = document.getElementById('myViewport').currentSection;
```



If you are going to use `viewport.js`, you are likely going to create
a navigation component which is relevant to the particular application
/ web-page and should work for the navigation better than the ordinary
scrollbar. In this case it might be reasonable to replace the
scrollbar with [intence](http://asvd.github.io/intence) indicator
which additionally designates the scrollable area.

