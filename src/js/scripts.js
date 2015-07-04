(function ($, window, document, undefined) {

  'use strict';

  $('#subnav .fa-close').on('click', function() {
    $(this).parent().addClass('hidden');
  });

  $('#nav .fa-user').on('click', function() {
    $('#subnav').toggleClass('hidden');
  });

  $('#nav').on('click', 'li.nav-toggle', function() {
    $('#nav, #subnav, #main').toggleClass('expanded');
  });
  
})(jQuery, window, document);
