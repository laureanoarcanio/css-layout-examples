--CSS Layout techniques examples

*Grid Layout is only supported by Chrome:
*Enabled in Chrome through the "experimental Web Platform features" flag in chrome://flags

Intro

Layout it’s an ancient concept, people did this since the origin of written communication, it’s all about the arrangement of visual elements in a page to achieve a specific goal.
Over the last few years, the web has experimented a role switch, we moved from classic layout arrangements for webpages to Web App layout with more complex designs and dynamic behaviour.
This article will dig into the Web App layout principles and how CSS is tackling this challenges. Going from standard classic CSS techniques to Flexbox and a peak into the future with Grid Layout.

Case Study
We are going to explore a Web App layout with some dynamic behavior, this application will have fixed elements in the page such as a Header, Footer, Navigation menu and Sub Navigation. Also a content section with scroll.

NOTE: The following code samples are written using HTML5 elements and SASS syntax, also CSS units are in em, which for this case 1em is equal to 16px. 

The dynamic behavior requirements are like this:

Header, Footer, Navigation and Sub Navigation are fixed on scroll.
Navigation menu can be expanded, this is, default will use 5em and expanded 10em.
Both navigation elements will occupy all vertical free space.
Some pages will have Sub Navigation next to Navigation menu (some others won’t).
Content Area should always use remaining free space on the page and have a scrollable area.

Low definition design:



Classic techniques
To achieve this with standard CSS we are heavily depending on the position property, more specifically the position: fixed; combination. 
TALK ABOUT FREE SPACE DESIGNATION SOMEWHERE


The Markup:

<header id="header"></header>
<nav id="nav"></nav>
<aside id="subnav"></aside>
<main id="main"></main>
<footer id="footer"></footer>

TALK ABOUT ELASTIC GRIDS PROBABLY
Positioning fixed elements:
As I mentioned before we need this elements to be fixed on the page, so we are going to use fixed positioning. In order to avoid overlapping problems we’ll set all base element on position 20 of z-index. And as we are using fixed positioning we’ll also set with: 100% to use all available space in the x axis.

  #header, #footer {
    position: fixed;
    width: 100%;
    z-index: 20;
  }
  #header {
    top: 0;
    height: 5em;
  }

  #footer {
    bottom: 0;
    height: 3em;
  }

There is nothing surprising here, but let’s see how we make Navigations use all vertical space now. For this I’ll introduce CSS expansions.

CSS Expansion:  when either positioning fixed or absolute we can use this technique, it consist in setting both top and bottom propertied to a value, so the element will expand vertically to use the space (note it doesn’t actually knows about free space, we need to hardcode how much we want this expansion to use). This also works with left and right properties.

  #nav, #subnav {
    position: fixed;
    top: 6em;
    bottom: 4em;
    z-index: 20;
  }

  #nav {
    left: 0;
    width: 5em;
  }

  #subnav {
    left: 6em;
    width: 13em;
  }

So in the previous code it’s clear we expanded both navigations to go from right below our header (top: 6em) to the footer (bottom: 4em). This also consider 1em margin in both sides, note the reference coordinate system when using bottom changes to the bottom of the screen, so it also considers the footer height.

Later we’ll explore how this can be avoided using either Calc, Flexbox or Grid techniques.

The Main Content
We want to keep this area as much flexible as we can, so we are going to keep it’s position as default (position: static;) and try to make it fit our requirements.

  #main {
    margin: 6em 0 4em 20em;
  }

Note how it just adds some margin to be positioned in the remaining area, no need to do any positioning here. This seems to be enough. So we have 6em top to be below header, 4em bottom to have scroll not overlapping footer and 20em right to be next of our Nav + Subnav width.

Improving maintainability with CSS3 calc function.
CSS expansion can ve now replaced with this new CSS3 function, this is really flexible as it allow us to set dimensions in percentages this way:

  #nav, #subnav {
    position: fixed;
    height: calc(100% - 10em);
    z-index: 20;
  }

By just doing that we achieve same result, it must be taken into consideration that calc will not work in some browsers, and so, will be less trustable. http://caniuse.com/#search=calc

Adding dynamic behaviour

The requirement we stated says that our Navigation can be expanded to show full text and not only icons, we are going to add 5em more to its with and see how this affects other components.

Well do this adding a class “expanded” to our HTML and then writing up the CSS code for this.

  $('.layout-classic #nav').on('click', 'li.nav-toggle', function() {
    $('#nav’').toggleClass('expanded');
  });

and in CSS we’ll add the expanded class to #nav

  #nav {
    left: 0;
    width: 5em;
    &.expanded {
      width: 10em;
    }
  }

So now, our Navigation will toggle its width, but also we have a new issue to overcome. Note now Navigation is overlapping Sub Navigation and nothing seems to work properly. We now see how this kind of techniques doesn’t actually scale well as classic CSS doesn’t work on free space availability principle, it doesn’t know about free space yet.

So in order to fix this we can change our javascript code to add one class to other affected elements like this

  $('.layout-classic #nav').on('click', 'li.nav-toggle', function() {
    $('#nav, #subnav, #main').toggleClass('expanded');
  });

And then we need to add CSS to #subnav and #main to properly accommodate to the new position:

  #subnav {
    left: 6em;
    width: 13em;
    &.expanded {
      left: 11em;
    }
  }

  #main {
    margin: 6em 0 4em 20;
    z-index: 10;
    &.expanded {
      margin-left: 25em;
    }
  }

So this code will now support toggling our Navigation width, note how the class expanded modifies the left property of the Sub Navigation and adds more margin left to Main content. So now let’s see how this works to meet the requirement of having some pages without a Sub Navigation menu.

  $('#nav .fa-user').on('click', function() {
    $('#subnav').toggleClass('hidden');
  });

So now clicking on the users icon, will make the #subnav container to have the class hidden that applies display: none:

.hidden {
  display: none;
}

And again, the code we have written doesn’t seems to work to meet all our requirements, the #subnav is getting hidden but our #main doesn’t accommodate to left, and all seems broken.

Let’s see how we can fix this by using Adjacent sibling CSS selector.

So let’s see how we can make our CSS be “context” aware and code all of our view states properly. 

So if #main is next to a #subnav then we set the margin to be 20em.
  #subnav + #main {
    margin-left: 20em;
  }

Also, if #main has a  class expanded (#nav is expanded) we move it left up to 25em.

  #subnav + #main.expanded {
    margin-left: 25em;
  }

And if #subnav is hidden then we move #main next to #nav

  #subnav.hidden + #main {
    margin-left: 6em;
  }

And the last combination, #subnav is hidden but we have #nav expanded, we set 11em for left margin.

  #subnav.hidden + #main.expanded {
    margin-left: 11em;
  }

So, this enables us to wire things up together without any heavy javascript code, but we can also see how complicated this code can become if we add more elements to the page. All elements are tightly coupled between themselves.

So now out Layout using classic CSS properly meets our requirements, we’ll discuss later pros and cons of all this compared to modern CSS.

NOTE: Using adjacent sibling selector force us to always have #subnav present in dom, regardless if it’s being shown or not.

Solving the same layout using CSS Flexbox












 





