/**
 * carousel v0.1 图片轮播
 * Created by huangfei on 2017.4.14
 */
(function ($) {
    'use strict';
    var Carousel = function (element, options) {
        this.element = element;
        this.defaults = {
            interval: 5000,     // 轮播间隔时间
            autoplay: true,     // 自动播放
            pause: 'hover'
        };
        this.options = $.extend({}, this.defaults, options);

        this.$items = $(element).find('.carousel-inner').children();
        this.$indicators = $(element).find('.carousel-indicators>li');
        this.$control = $(element).find('.carousel-control');

        this.itemLength = this.$items.length - 1;
        this.itemIndex = 0;
        this.next = 0;
        this.paused = false;    // 悬浮时暂停
        this.sliding = false;   // 滑动中
        this.timer = 0;
    }
    Carousel.prototype = {
        init: function () {
            this.cycle();
            this.bindEvent();
        },
        play: function () {
            this.next = this.itemIndex + 1;
            if (this.next > this.itemLength) this.next = 0;

            this.move('next');
        },
        // 轮播
        cycle: function () {
            var self = this;
            if (this.options.autoplay && !this.sliding && !this.paused) {
                clearTimeout(self.timer);
                self.timer = setTimeout(function () {
                    self.play();
                }, self.options.interval);
            }
        },
        move: function (direction) {
            let self = this;
            clearTimeout(self.timer);
            self.sliding = true;
            var anim = direction === 'next' ? 'left' : 'right';

            self.$items.eq(self.next).addClass(direction);
            self.$indicators.eq(self.next).addClass('active').siblings().removeClass('active');
            setTimeout(function () {
                self.$items.eq(self.itemIndex).addClass(anim);
                self.$items.eq(self.next).addClass(anim);

                self.itemIndex = self.next;
            });
        },
        to: function (e) {
            var self = e.data.self;
            if (self.sliding) return;

            if ($(this).hasClass('right')) {
                self.next = self.itemIndex + 1;
                if (self.next > self.itemLength) self.next = 0;
                self.move('next');
            }
            else {
                self.next = self.itemIndex - 1;
                if (self.next < 0) self.next = self.itemLength;
                self.move('prev');
            }
        },
        bindEvent: function () {
            var self = this;
            if (this.pause === 'hover') {
                $(this.element).hover(function () {
                    self.paused = true;
                }, function () {
                    self.paused = false;
                });
            }

            // 控制器
            this.$control.on('click', {self: this}, this.to);

            // 指示器
            this.$indicators.click(function () {
                if (self.sliding) return;
                self.next = $(this).index();
                if (self.next > self.itemIndex) self.move('next');
                else self.move('prev');
            });

            // 动画结束
            this.$items.on('transitionend', function () {
                self.sliding = false;
                var $this = $(this);
                if ($this.hasClass('active')) {
                    if ($this.hasClass('left')) $this.removeClass('active left');
                    else $this.removeClass('active right');
                }
                else {
                    if ($this.hasClass('left')) $this.removeClass('next left').addClass('active');
                    else $this.removeClass('prev right').addClass('active');
                }
                self.cycle();
            });
        }
    }
    $.fn.carousel = function (options) {
        var carousel = new Carousel(this, options);
        return carousel.init();
    }
})(jQuery);