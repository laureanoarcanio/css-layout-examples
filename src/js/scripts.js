(function ($, window, document, undefined) {

  'use strict';

  $('#subnav .fa-close').on('click', function() {
    $(this).parent().addClass('hidden');
  });

  $('#nav .fa-user').on('click', function() {
    $('#subnav').toggleClass('hidden');
  });

  // when classic layout we need to set expanded for all affected childs
  $('.layout-classic #nav').on('click', 'li.nav-toggle', function() {
    $('#nav, #subnav, #main').toggleClass('expanded');
  });
  // Flexbox and Grid are context sensitive, just changing nav CSS do the rest
  $('.layout-flexbox #nav, .layout-grid #nav').on('click', 'li.nav-toggle', function() {
    $('#nav').toggleClass('expanded');
  });

})(jQuery, window, document);