(function (window) {
    //获取URL参数
    window.getQueryParam = function (name) {
        var regex = RegExp('[?&]' + name + '=([^&]*)');
        var match = regex.exec(location.search) || regex.exec(path);
        return match && decodeURIComponent(match[1]);
    };
    //获取URL参数类是指定&分割的字符串
    window.getQueryParam = function (name, queryString) {
        var match = RegExp(name + '=([^&]*)').exec(queryString || location.search);
        return match && decodeURIComponent(match[1]);
    };
})(window);
