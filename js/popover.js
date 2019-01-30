/**
 * popover v0.1 弹出框
 * Created by huangfei on 2017.7.5
 * 弹出框和tooltip很类似，完全可以继承tooltip再重写，这里独立出来
 */
(function ($) {
    'use strict';
    var Popover = function (element, options) {
        this.$element = $(element);
        this.defaults = {
            title: this.$element.attr('title') || '',   // 提示内容
            content: '',        // 内容
            trigger: 'click',   // 触发条件
            placement: 'top',   // 提示工具位置
            selector: false,    // 选择器
            delay: 0,           // 延时
            html: false         // 插入html
        };
        this.options = $.extend({}, this.defaults, this.$element.data(), options);
        this.type = 'popover';
        this.$tooltip = $('<div class="popover fade"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>');
        this.timer = 0;
        this.init();
    }

    Popover.prototype.init = function () {
        this.$tooltip.addClass(this.options.placement).data('bs.' + this.type, this);
        this.$tooltip.find('.popover-title').text(this.options.title);
        if (!this.options.html) this.$tooltip.find('.popover-content').text(this.options.content);
        else this.$tooltip.find('.popover-content').html(this.options.content);

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

    Popover.prototype.enter = function () {
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

    Popover.prototype.leave = function () {
        this.$tooltip.removeClass('in').remove();
    }

    Popover.prototype.getPosition = function () {
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

    Popover.prototype.applyPlacement = function (offset) {
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

    Popover.prototype.show = function () {
        this.enter();
    }

    Popover.prototype.hide = function () {
        this.leave();
    }

    Popover.prototype.toggle = function () {
        if (this.$tooltip.hasClass('in')) this.hide();
        else this.show();
    }

    Popover.prototype.destroy = function () {
        clearTimeout(this.timer);
        this.hide();
        this.$element.off();
    }

    $.fn.popover = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.popover');
            var options = typeof option == 'object' && option;

            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data('bs.popover', (data = new Popover(this, options)));// 用data存储实例化对象
            if (typeof option == 'string') data[option]();

        })
    }

})(jQuery);