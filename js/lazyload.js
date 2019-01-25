/**
 * carousel v0.1 图片懒加载
 * Created by huangfei on 2017.10.14
 * 说明：实现了基本的懒加载功能，向上向下滑动懒加载。（写得比较简单，只能适应于对应的环境）
 * 使用方法：
 *     页面:<img class="lazyload" src="loading.gif" data-original="img.jpg">
 *     实例化：var lazy = new Lzyload();重新绑定：lazy.update();
 */
(function ($, window) {
    "use strict";
    var LazyLoad = function (options) {
        var defaults = {
            container: window,          // 触发事件载体
            event: "scroll",            // 触发方式
            data_attribute: "original", // 懒加载图片原图片地址
            element: "lazyload",        // 懒加载元素类名
            effect: "fadeIn",           // 显示效果
            threshold: 20,              // 提前加载距离
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };
        this.settings = $.extend({}, defaults, options);
        this.init();
        this.bindEvent();
    };
    LazyLoad.prototype = {
        constructor: LazyLoad,
        // 初始化（让已经在视野中的图片显示）
        init: function () {
            var self = this;
            self.$element = $("." + self.settings.element);
            self.$container = $(self.settings.container);
            self.containerHeight = self.$container.height();

            self.$element.each(function () {
                var $self = $(this);
                if(self.settings.placeholder) $self.attr('src', self.settings.placeholder);
                self.inView($self);
            });
        },
        // 绑定事件
        bindEvent: function () {
            var self = this;
            // 触发懒加载事件
            $(self.settings.container).bind(self.settings.event, function () {
                self.$element.each(function () {
                    var $self = $(this);
                    self.inView($self);
                });
            });
            // 窗口变化
            $(window).resize(function () {
                self.containerHeight = self.$container.height();
            });
        },
        // 在视野中
        inView: function ($ele) {
            var self = this;
            var $self = $ele;
            if (!$self.hasClass(self.settings.element)) return;
            if ($self.offset().top - self.$container.position().top < self.containerHeight + self.settings.threshold && self.$container.position().top - self.settings.threshold < $self.offset().top + $self.height()) {
                self.load($self);
            }
        },
        // 加载图片
        load: function ($ele) {
            var self = this;
            var $self = $ele;
            $self.hide();
            $self.attr("src", $self.attr("data-" + self.settings.data_attribute));
            $self[self.settings.effect]();
            $self.removeClass(self.settings.element);
        },
        // 更新配置
        update: function (options) {
            this.settings = $.extend(this.settings, options);
            this.init();
        }
    }

    window.lazyload = LazyLoad;
})(jQuery, window);