/**
* scrollspy v0.1 滚动监听
* Created by huangfei on 2017.11.9
*/
(function ($) {
    'use strict';
    var ScrollSpy = function ($element, options) {
        this.$element = $element;
        this.defaults = {};
        this.options = $.extend({}, this.defaults, options);
        this.init();
    }
    ScrollSpy.prototype = {
        init: function () {
            this.$element.each(function (index, ele) {
                var $scrollNav = $(ele).find('li>a');
                var $target = $($(ele).data('target'));
                var scrolling = false;
                var tops = {};
                $scrollNav.each(function (index, item) {
                    var id = $(item).attr('href');
                    tops[id] = $(id).position().top;
                });
                $target.scroll(function () {
                    if (!scrolling) {
                        var temp = 0
                        $scrollNav.each(function (index, item) {
                            var id = $(item).attr('href');
                            if (($(id).position().top - 1) < 0) {
                                temp = index;
                            }
                        });
                        $scrollNav.eq(temp).parent('li').addClass('active').siblings().removeClass('active');
                    }
                });
                $scrollNav.click(function (e) {
                    scrolling = true;
                    $(this).parent('li').addClass('active').siblings().removeClass('active');
                    var id = $(this).attr('href');
                    var top = tops[id];
                    $target.stop().animate({ scrollTop: top + 'px' }, 500, function () { scrolling = false; });
                });
            });
        }
    }
    $.fn.scrollspy = function (options) {
        new ScrollSpy(this, options);
    }
})(jQuery);