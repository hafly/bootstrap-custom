+function ($) {
    // 导航栏小按钮
    $(document).on('click.bs.navbar-toggle.data-api', '.navbar-toggle', function (e) {
        var target = $(this).data('target');
        var $target = $(target);
        $target.slideToggle(100).addClass('in');
    });

    // 导航栏
    if ('ontouchstart' in document.documentElement) {
        $(document).on('click.bs.dropdown.data-api', '.dropdown', function () {
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
        $(document).on('mouseenter.bs.dropdown.data-api', '.dropdown', function () {
            $(this).find('.dropdown-menu').slideDown(100);
            $(this).addClass('open');
        });
        $(document).on('mouseleave.bs.dropdown.data-api', '.dropdown', function () {
            $(this).find('.dropdown-menu').slideUp(100, function () {
                $(this).removeClass('open');
            });
        });
    }

    // tab面板
    $(document).on('click.bs.tab.data-api', '.nav.nav-tabs li', function (e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) return;
        $(this).addClass('active').siblings().removeClass('active');
        var href = $(this).children('a').attr('href');
        $(href).fadeIn().siblings().hide();
    });

    // 导航元素
    $(document).on('click.bs.nav-pills.data-api', '.nav.nav-pills li',function (e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) return;
        $(this).addClass('active').siblings().removeClass('active');
    });

    // 折叠面板
    $(document).on('click.bs.panel-group.data-api', '.panel-group>.panel>.panel-heading',function (e) {
        e.preventDefault()
        var $collapse = $(this).parents('.panel').find('.panel-collapse');
        // 是否关闭其它项
        if ($collapse.hasClass('collapse')) {
            $(this).parents('.panel').siblings().find('.panel-collapse').slideUp(200);
        }
        $collapse.slideToggle(200);
    });

    // alert
    $(document).on('click.bs.alert.data-api', '[data-dismiss="alert"]', function () {
        $(this).parent('.alert').trigger('closed.bs.alert').remove();
    });
}(jQuery);