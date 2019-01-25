(function ($, window) {
    /**
     * 常用工具类
     * Create By huangfei 2017/07/04
     */
    var util = {
        debug: true,    // 调试模式
        print: function (data) {
            if (util.debug) console.log(data);
        },

        // 动态添加js脚本
        loadScript: function (url) {
            var head = document.getElementsByTagName('head').item(0);
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            head.appendChild(oScript);
        },

        // 动态加载css脚本
        loadCss: function (url) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            head.appendChild(link);
        },

        // 动态添加css代码
        appendCss: function (code) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.appendChild(document.createTextNode(code));
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(style);
        },

        /**
         * 动态加载Iframe
         * @param {string} url 脚本地址
         * @param {string} style  加载样式
         * @param {function} callback  回调函数
         */
        loadIframe: function (url, style, callback) {
            var body = document.getElementsByTagName('body')[0];
            var iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style = style || 'display:none;width:0px;height:0px;';
            if (typeof(callback) == 'function') {
                iframe.onload = iframe.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        callback();
                        iframe.onload = iframe.onreadystatechange = null;
                    }
                };
            }
            body.appendChild(iframe);
        },

        // 获取对象类型
        getObjectType: function (obj) {
            // tostring会返回对应不同的标签的构造函数
            var toString = Object.prototype.toString;
            var map = {
                '[object Object]': 'object',
                '[object Boolean]': 'boolean',
                '[object Number]': 'number',
                '[object String]': 'string',
                '[object Function]': 'function',
                '[object Array]': 'array',
                '[object Date]': 'date',
                '[object RegExp]': 'regExp',
                '[object Undefined]': 'undefined',
                '[object Null]': 'null',
            };
            if (obj instanceof Element) {
                return 'element';
            }
            return map[toString.call(obj)];
        },

        //  获取地址栏参数
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },

        /**
         * 构造类继承关系
         * @param {Function} clazz 源类
         * @param {Function} baseClazz 基类
         */
        inherits: function (clazz, baseClazz) {
            var clazzPrototype = clazz.prototype;

            function F() {
            }

            F.prototype = baseClazz.prototype;
            clazz.prototype = new F();

            for (var prop in clazzPrototype) {
                clazz.prototype[prop] = clazzPrototype[prop];
            }
            clazz.prototype.constructor = clazz;
            clazz.superClass = baseClazz;
        },

        // 1.对象深拷贝（同$.extend(true,{},obj)）
        // 2.数组深拷贝（同$.extend(true,[],obj)）
        clone: function (source) {
            if (typeof source === 'object') {
                var newObj = {};
                for (let key in source) {
                    newObj[key] = util.clone(source[key]);
                }
                return newObj;
            }
            else if (typeof source === 'array') {
                return source.slice(0);
            }
            else {
                return source;
            }
        },

        /**
         * 对象递归合并覆盖（相比比$.extend()未实现多参数）
         * @param {*} target 目标对象
         * @param {*] source 拷贝对象
         * @param {boolean} overlay 是否覆盖
         * @returns {*} target
         */
        assign: function (target, source, overlay) {
            for (let key in target) {
                if (typeof target[key] === 'object' && overlay) {
                    source[key] = util.assign(target[key], source[key], overlay);
                }
            }
            Object.assign(target, source);  // Object.assign()未多级合并，所以使用递归实现
            return target;
        },

        /**
         * 掺和类（Mixin Classes）将一个对象的方法复制到另一个类（无法复制对象的属性）
         * @param {*} target 目标对象
         * @param {*] source 拷贝对象
         * @param {boolean} overlay 是否覆盖
         * @returns target
         */
        augment: function (target, source, overlay) {
            target = 'prototype' in target ? target.prototype : target;
            source = 'prototype' in source ? source.prototype : source;
            for (var key in source) {
                if (source.hasOwnProperty(key) && (overlay ? source[key] != null : target[key] == null)) {
                    target[key] = source[key];
                }
            }
            return target;
        },

        // 数组中对象根据键值排序（正序），用于类似echarts数据排序
        ascSort: function (arr, sortName) {
            return arr.sort(function (a, b) {
                return a[sortName] - b[sortName];
            });
        },
        // 数组中对象根据键值排序（倒序）
        descSort: function (arr, sortName) {
            return arr.sort(function (a, b) {
                return b[sortName] - a[sortName];
            });
        },

        // 数字千分位格式化，四舍五入保留小数
        dataFormat: function (num, fix) {
            fix = fix || 0;
            try {
                num = parseFloat(num).toFixed(fix) + '';
                var re = /(-?\d+)(\d{3})/;
                while (re.test(num)) {
                    num = num.replace(re, "$1,$2");
                }
            } catch (e) {
                console.error(e);
            } finally {
                // num=parseFloat(num); //去掉后面的0
                return num;
            }
        },

        // 数字千分位格式化，过万以万为单位，过亿以亿为单位，四舍五入保留小数
        dataFormatUnit: function (num, fix) {
            fix = fix || 0;
            try {
                var sign = '';  //正负号
                if (num < 0) sign = '-';

                num = Math.abs(num);
                var result = '';

                if (num < 10000) {
                    num = num.toFixed(fix);
                    result = util.dataFormat(num, fix);
                }
                else if (num >= 10000 & num < 100000000) {
                    num = (num / 10000).toFixed(fix);
                    result = util.dataFormat(num, fix) + '万';
                }
                else if (num >= 100000000) {
                    num = (num / 100000000).toFixed(fix);
                    result = util.dataFormat(num, fix) + '亿';
                }

            } catch (e) {
                console.error(e);
            } finally {
                return sign + result;
            }
        },

        // 限制数字范围
        dataLimit: function (num, min, max) {
            if (num < min) num = min;
            if (num > max) num = max;
            return num;
        },

        // 获取字符串长度，一个中文为两个长度
        getStringLength: function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len += 1;
                }
                else {
                    len += 2;
                }
            }
            return len;
        },

        // 字符串换行，一个中文为两个长度
        stringWrap: function (str, num) {
            var result = '';
            var len = 0;
            for (let i = 0; i < str.length; i++) {
                result += str[i];
                var c = str.charCodeAt(i);
                var c2 = str.charCodeAt(i + 1);

                var cn; // 下一个字符串是字母或数字
                if ((c2 >= 0x0001 && c2 <= 0x007e) || (0xff60 <= c2 && c2 <= 0xff9f)) {
                    cn = false;
                }
                else {
                    cn = true;
                }

                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    // 字母或数字
                    len += 1;
                    if (len % num == 0) {
                        result += '\n';
                    }
                    else if (cn && (len + 1) % num == 0) {
                        // 下一个是汉字提前补位
                        len++;
                        result += '\n';
                    }
                }
                else {
                    // 汉字由于是+2会出现跳过余数为整
                    len += 2;
                    if (len % num == 0) {
                        result += '\n';
                    }
                    else if ((len + 1) % num == 0) {
                        // 差一位时提前补位
                        len++;
                        result += '\n';
                    }
                }
            }
            return result;
        },

        // 输入限制：只能输入某一类型且限制长度(现在只有数字类型)
        inputLimit: function (ele, length, type) {
            if (type == 'number') {
                var $this = $(ele);
                $this.val($this.val().replace(/\D/g, ''));
                if ($this.val().length > length) {
                    $this.val($this.val().slice(0, length));
                }
            }
        },

        /*
        * 格式化年月日时间
        * @param fmt {String} 年月+时间："yyyy-mm-dd hh:ii:ss"（可以只显示年月日或时间）
        * return {String} 返回yyyy-mm-dd hh:ii:ss格式的字符串
        */
        dateFormat: function (fmt, time) {
            fmt = fmt || "yyyy-mm-dd hh:ii:ss";
            let date;
            if (time) {
                date = new Date(time);
            }
            else {
                date = new Date();
            }
            var o = {
                "m+": date.getMonth() + 1,  // 月份
                "d+": date.getDate(),       // 日
                "h+": date.getHours(),      // 小时
                "i+": date.getMinutes(),    // 分
                "s+": date.getSeconds(),    // 秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },

        // 时间戳转时间
        timestampToTime: function (timestamp) {
            return util.dateFormat('', timestamp);
        },
        // 时间转时间戳
        timeToTimestamp: function (time) {
            return Date.parse(time);
        },

        /**
         * 秒数格式化为时分秒（最大单位为小时，一般用于歌曲电影时长）
         * @param s 秒数
         * @returns {*} 格式化后的时分秒
         */
        sec_to_time: function (s) {
            var t = '';
            if (s > 3600) {
                var hour = Math.floor(s / 3600);
                var min = Math.floor(s / 60) % 60;
                var sec = s % 60;
                if (hour < 10) {
                    t = '0' + hour + ":";
                } else {
                    t = hour + ":";
                }
                if (min <= 9) {
                    t += "0";
                }
                t += min + ":";
                if (sec <= 9) {
                    t += "0";
                }
                t += sec.toFixed(0);
            }
            else {
                var min = Math.floor(s / 60);
                if (min < 10) min = '0' + min;
                var sec = (s - Math.floor(s / 60) * 60).toFixed(0);
                if (sec < 10) sec = '0' + sec;
                t = min + ":" + sec;
            }
            return t;
        },
        /**
         * 时间转为秒
         * @param time 时间(00:00:00)
         * @returns {string} 秒数
         */
        time_to_sec: function (time) {
            var s = '';
            var hour = time.split(':')[0];
            var min = time.split(':')[1];
            var sec = time.split(':')[2];
            s = Number(hour * 3600) + Number(min * 60) + Number(sec);
            return s;
        },

        // 将上传文件转为blob对象（二进制大对象）
        getObjectURL: function (file) {
            var url = window.URL.createObjectURL(file);
            return url;
        },

        // 判断有页面元素的图片是否全部加载完毕
        imageAllLoad: function (images, callback) {
            var index = 0;
            $(images).each(function () {
                $(this).load(function () {
                    index++;
                    if (index == $(images).length) return callback();
                });
                $(this).error(function () {
                    console.error("图片加载失败！");
                });
            });
        },
        // 判断无页面元素的图片是否全部加载完毕（用于一些特殊场景，如图片帧动画）
        imageAllLoad2: function (images, callback) {
            var index = 0;
            if (this.isArray(images)) {
                $.each(images, function () {
                    var image = new Image();
                    image.src = this;
                    $(image).load(function () {
                        index++;
                        if (index == images.length) return callback();
                    });
                    $(image).error(function () {
                        console.error("图片加载失败！");
                    });
                });
            }
            else {
                var image = new Image();
                image.src = images;
                $(image).load(function () {
                    return callback();
                });
                $(image).error(function () {
                    console.error("图片加载失败！");
                });
            }
        },

        // 元素是否在数组中(同$.inArray())
        inArray: function (value, arr) {
            var result = arr.indexOf(value);
            if (result === -1) {
                return false;
            }
            else {
                return true;
            }
        },
        // 判断对象是否为空
        isEmptyObj: function (obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        },
        // 对象转数组，并丢掉了键保留值
        objToArray: function (obj) {
            var arr = [];
            for (var item in obj) {
                arr.push(obj[item]);
            }
            return arr;
        },
        // 数组转对象
        arrayToObj: function (arr) {
            var obj = {}
            for (var key  in arr) {
                obj[key] = arr[key]
            }
            return obj;
        },

        // 系统函数整理
        // array.concat 连接两个数组
        // array.join(separator) 把数组中的所有元素转换一个字符串。
        // string.split(separator) 把一个字符串分割成字符串数组。
        // object.create(obj) 克隆对象，貌似克隆对象不全，慎用。
        // array.slice(start, end) 提取数组的某个部分，并以新的字符串返回被提取的部分
        // string.slice(start, end) 提取字符串的某个部分，并以新的字符串返回被提取的部分

        // jquery函数整理
        // $.extend(true,{},obj) 对象深拷贝
        // $.extend(true,[],obj) 数组深拷贝
        // $.grep()过滤原始数组
    }

    /*** 原生对象原型扩展 ***/
    // 数组移除
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
    // 数组去重
    Array.prototype.unique = function () {
        var res = [];
        var json = {};
        for (var i = 0; i < this.length; i++) {
            if (!json[this[i]]) {
                res.push(this[i]);
                json[this[i]] = 1;
            }
        }
        return res;
    }

    // 计算类
    util.Math = {
        DEG2RAD: Math.PI / 180,
        RAD2DEG: 180 / Math.PI,

        /**
         * http://www.broofa.com/Tools/Math.uuid.htm
         * Generate a random uuid.
         * length - the desired number of characters
         * the number of allowable values for each character.
         */
        uuid: function (len, radix) {
            var CHARS = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;
            if (len) {
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            }
            else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
                uuid[14] = "4";
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join("");
        },

        randInt: function (low, high) {
            return low + Math.floor(Math.random() * (high - low + 1));
        },

        randFloat: function (low, high) {
            return low + Math.random() * (high - low);
        },

        // 角度转弧度
        degToRad: function (degrees) {
            return degrees * util.Math.DEG2RAD;
        },

        // 弧度转角度
        radToDeg: function (radians) {
            return radians * util.Math.RAD2DEG;
        },

        // 获取两点的距离
        getDistance: function (p1, p2) {
            return Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2));
        }
    }

    // 正则表达式验证
    util.reg = {
        // 判断是否移动设备访问
        isMobile: function () {
            return /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase());
        },
        // 手机号验证
        checkMobileNum: function (mobile) {
            return /^1[3|5|7|8][0-9]\d{8}$/.test(mobile);
        },
        // 账号验证
        isAccount: function (value) {
            return /^[a-zA-Z]\w{3,20}$/.test(value);
        },
        // 密码验证
        checkPassword: function (value) {
            return /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,20}$/.test(value);
        },
    }

    // 表单提交，键值对数据：a=1&b=2&c=3
    util.postForm = function (url, type, data, success, error) {
        $.ajax({
            url: url,
            type: type,
            dataType: 'JSON',
            data: data,
            timeout: 3000,
            success: function (data) {
                util.print(data);
                if (success) return success(data);
            },
            error: function (e) {
                console.error(e);
                if (error) return error(e);
            }
        });
    }

    // JSON提交，JSON数据：{"a":1,"b":2,"c":3}
    util.postJSON = function (url, type, data, success, error) {
        $.ajax({
            url: url,
            type: type,
            dataType: 'JSON',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(data),
            timeout: 3000,
            success: function (data) {
                util.print(data);
                if (success) return success(data);
            },
            error: function (e) {
                console.error(e);
                if (error) return error(e);
            }
        });
    }

    // cookie操作
    util.cookie = {
        setCookie: function (name, value, days) {
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 60 * 60 * 24 * 1000);
            var cookie = name + "=" + encodeURIComponent(value) + ((days == null) ? "" : ";expires=" + exp.toGMTString()) + '; path=/';
            document.cookie = cookie;
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^|)" + name + "=([^=]+)(?:;|$)");
            if (arr = document.cookie.match(reg)) return decodeURIComponent(arr[2]);
            else return null;
        },
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + '; path=/';
        },
        clearCookie: function () {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys && keys.length > 0) {
                for (var i = keys.length; i--;) {
                    delCookie(keys[i]);
                }
            }
        },
    };

    // session操作
    util.sessionStorage = {
        saveData: function (key, data) {
            key = 'data_' + key;
            data = JSON.stringify(data);
            sessionStorage.setItem(key, data);
        },
        readData: function (key) {
            key = 'data_' + key;
            return JSON.parse(sessionStorage.getItem(key));
        },
        removeData: function (key) {
            key = 'data_' + key;
            sessionStorage.removeItem(key);
        }
    };

    // 本地存储操作
    util.localStorage = {
        saveData: function (key, data) {
            key = 'data_' + key;
            data = JSON.stringify(data);
            localStorage.setItem(key, data);
        },
        readData: function (key) {
            key = 'data_' + key;
            return JSON.parse(localStorage.getItem(key));
        },
        removeData: function (key) {
            key = 'data_' + key;
            localStorage.removeItem(key);
        }
    };

    window.util = util;
})(jQuery, window);