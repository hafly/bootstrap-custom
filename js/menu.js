/**
 * menu v0.1 菜单
 * Created by huangfei on 2017.5.16
 */
(function($){
    $.fn.menu = function (options) {
        var defaults = {
            speed: 200,         // 菜单折叠速度
            toggle: true        // 自动隐藏菜单
        };
        var self = this,
            $item = $(this).find('ul li');

        var settins = $.extend({}, defaults, options);

        init();
        function init() {
            $item.each(function (index, ele) {
                if ($(ele).hasClass('active')) {
                    $(ele).find('.has-arrow').addClass('active');
                    $(ele).children('ul').show();
                }
            })
            $item.click(fold);
            $(self).find('ul li a').click(function () {
                if(!$(this).hasClass('has-arrow')){
                    $(self).find('ul li a').removeClass('active');
                    $(this).addClass('active');
                }
            });
        }

        //折叠菜单
        function fold(e) {
            e.stopPropagation();
            var $this = $(this);
            if ($this.hasClass('active')) {
                $this.removeClass('active').addClass('inactive');
                $this.children('ul').slideUp(settins.speed);
                $this.find('.has-arrow').removeClass('active');
            }
            else {
                $this.removeClass('inactive').addClass('active');
                $this.children('ul').slideDown(settins.speed);
                $this.find('.has-arrow').addClass('active');
                if (settins.toggle) {
                    var $siblings = $this.siblings();
                    $siblings.find('.has-arrow').removeClass('active');
                    $siblings.children('ul').slideUp(settins.speed);
                    $siblings.removeClass('active').addClass('inactive');
                }
            }
        }
    }
})(jQuery);