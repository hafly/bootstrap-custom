//验证账户
jQuery.validator.addMethod("checkAccount", function (value, element) {
    return this.optional(element) || /^[a-zA-Z]\w{3,20}$/.test(value);
}, "请输入4-16位字母开头的字母或数字和下划线");

//手机号码验证       
jQuery.validator.addMethod("isMobile", function (value, element) {
    return this.optional(element) || /^1[3|5|8][0-9]\d{8}$/.test(value);;
}, "请输入有效的手机号码");

//电话号码验证
jQuery.validator.addMethod("isTel", function (value, element) {
    var tel = /^\d{3,4}-?\d{7,9}$/; //电话号码格式010-12345678   
    return this.optional(element) || (tel.test(value));
}, "请输入有效的电话号码");

//联系电话(手机/电话皆可)验证   
jQuery.validator.addMethod("isPhone", function (value, element) {
    var length = value.length;
    var mobile = /(^(13|15|18)\d{9}$)|(^0(([1,2]\d)|([3-9]\d{2}))\d{7,8}$)/;
    var tel = /^\d{3,4}-?\d{7,9}$/;
    return this.optional(element) || (tel.test(value) || mobile.test(value));
}, "请输入有效的电话号码");

//身份证验证
jQuery.validator.addMethod("isIDCard", function (value, element) {
    return this.optional(element) || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}, "请输入正确的身份证号码");

//上传文件大小检查
jQuery.validator.addMethod("checkUploadSize", function (value, element, param) {
    if (element.files[0] == undefined) return true; //如果没有上传图片就不检测了
    var fileSize = element.files[0].size;
    var maxSize = param * 1024 * 1024;
    if (fileSize > maxSize) { return false; } else { return true; }
}, "请上传小于{0}M的图片");