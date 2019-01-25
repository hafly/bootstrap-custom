(function ($) {
    // 导航栏小按钮
    $('.navbar-toggle').click(function () {
        var target = $(this).data('target');
        var $target = $(target);
        $target.slideToggle(100).addClass('in');
    });

    // 导航栏
    if ('ontouchstart' in document.documentElement) {
        $('.dropdown').click(function () {
            var $this = $(this);
            if ($this.hasClass('open')) {
                $this.removeClass('open');
                $(this).find('.dropdown-menu').hide();
            }
            else {
                $this.find('.dropdown-menu').slideDown(100);
                $this.addClass('open');
            }
        });
    }
    else {
        $('.dropdown').hover(function () {
            $(this).find('.dropdown-menu').slideDown(100);
            $(this).addClass('open');
        }, function () {
            $(this).find('.dropdown-menu').slideUp(100, function () {
                $(this).removeClass('open');
            });
        });
    }

    // tab面板
    $('.nav.nav-tabs li').click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) return;
        $(this).addClass('active').siblings().removeClass('active');
        var href = $(this).children('a').attr('href');
        $(href).fadeIn().siblings().hide();
    });
    // 导航元素
    $('.nav.nav-pills li').click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) return;
        $(this).addClass('active').siblings().removeClass('active');
    });

    //折叠面板
    $('.panel-group .panel .panel-heading').click(function (e) {
        e.preventDefault()
        var $collapse = $(this).parents('.panel').find('.panel-collapse');
        // 是否关闭其它项
        if ($collapse.hasClass('collapse')) { $(this).parents('.panel').siblings().find('.panel-collapse').slideUp(200); }
        $collapse.slideToggle(200);
    });
})(jQuery);