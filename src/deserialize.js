var deserialize = function (s) {
    var result = [];
    var list   = s.split('&');
    var decode = function (v) {
        return decodeURIComponent(v).replace('+', ' ');
    };
    var split;
    for (var i = 0; i < list.length; i++) {
        split = list[i].split('=');
        if (split[0] !== '') {
            result.push($.map(split, decode));
        }
    }
    return result;
};