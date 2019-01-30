/**
 * tooltip v0.1 小提示
 * Created by huangfei on 2017.7.5
 * 添加show、hide、destroy方法，show事件
 */
(function ($) {
    'use strict';
    var Tooltip = function (element, options) {
        this.$element = $(element);
        this.defaults = {
            title: this.$element.attr('title') || '',   // 提示内容
            trigger: 'hover',   // 触发条件
            placement: 'top',   // 提示工具位置
            selector: false,    // 选择器
            delay: 0,           // 延时
            html: false         // 插入html
        };
        this.options = $.extend({}, this.defaults, this.$element.data(), options);
        this.type = 'tooltip';
        this.$tooltip = $('<div class="tooltip fade" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>');

        this.timer = 0;
        this.init();
    }

    Tooltip.prototype.init = function () {
        this.$tooltip.addClass(this.options.placement).data('bs.' + this.type, this);
        if (!this.options.html) this.$tooltip.find('.tooltip-inner').text(this.options.title);
        else this.$tooltip.find('.tooltip-inner').html(this.options.title);

        if (this.options.trigger === 'click') {
            this.$element.on('click' + '.' + this.type, this.options.selector, $.proxy(this.toggle, this));
        }
        else {
            var eventIn = this.options.trigger == 'focus' ? 'focusin' : 'mouseenter';
            var eventOut = this.options.trigger == 'focus' ? 'focusout' : 'mouseleave';

            this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
            this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
        }
    }

    Tooltip.prototype.enter = function () {
        var self = this;
        clearTimeout(self.timer);
        var pos = self.getPosition();
        self.$element.after(self.$tooltip);
        self.applyPlacement(pos);

        self.timer = setTimeout(function () {
            self.$tooltip.addClass('in');
            self.$element.trigger('shown.bs.' + self.type);
        }, self.options.delay);
    }

    Tooltip.prototype.leave = function () {
        this.$tooltip.removeClass('in').remove();
    }

    Tooltip.prototype.getPosition = function () {
        var ele = this.$element[0];
        var eleRect = {};
        eleRect.width = ele.offsetWidth;
        eleRect.height = ele.offsetHeight;
        eleRect.top = ele.offsetTop;
        eleRect.left = ele.offsetLeft;
        eleRect.right = eleRect.width + eleRect.left;
        eleRect.bottom = eleRect.height + eleRect.top;
        return eleRect;
    }

    Tooltip.prototype.applyPlacement = function (offset) {
        var tipWidth = this.$tooltip[0].offsetWidth;
        var tipHeight = this.$tooltip[0].offsetHeight;
        switch (this.options.placement) {
            case 'left':
                var deltaX = offset.left - tipWidth;
                var deltaY = offset.top - (tipHeight - offset.height) / 2;
                break;
            case 'right':
                var deltaX = offset.right;
                var deltaY = offset.top - (tipHeight - offset.height) / 2;
                break;
            case 'top':
                var deltaX = offset.left - (tipWidth - offset.width) / 2;
                var deltaY = offset.top - tipHeight;
                break;
            case 'bottom':
                var deltaX = offset.left - (tipWidth - offset.width) / 2;
                var deltaY = offset.bottom;
                break;
        }
        this.$tooltip.css({top: deltaY, left: deltaX});
    }

    Tooltip.prototype.show = function () {
        this.enter();
    }

    Tooltip.prototype.hide = function () {
        this.leave();
    }

    Tooltip.prototype.toggle = function () {
        if (this.$tooltip.hasClass('in')) this.hide();
        else this.show();
    }

    Tooltip.prototype.destroy = function () {
        clearTimeout(this.timer);
        this.hide();
        this.$element.off('.' + this.type);
    }

    $.fn.tooltip = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.tooltip');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));// 用data存储实例化对象
            if (typeof option == 'string') data[option]();

        })
    }

})(jQuery);