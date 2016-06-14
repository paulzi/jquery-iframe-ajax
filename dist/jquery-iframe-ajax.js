/**
 * jQuery IFrame AJAX
 * @see https://github.com/paulzi/jquery-iframe-ajax
 * @license MIT (https://github.com/paulzi/jquery-iframe-ajax/blob/master/LICENSE)
 * @version 1.0.1
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root.jQuery);
  }
}(this, function ($) {

'use strict';

var pluginName     = 'jqueryIframeAjax';
var styleHidden    = 'position: absolute; z-index: -1000; width: 0; height: 0; overflow: hidden; border: none;';
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
$.ajaxTransport('+*', function(options) {

    if (!options.iframe) {
        return;
    }

    var $iframe;

    return {
        send: function (headers, complete) {
            var i;
            var id = pluginName + '-' + $.now();
            $iframe = $('<iframe name="' + id + '" style="' + styleHidden + '">');

            // get form
            var $form;
            if (options.form) {
                $form = $(options.form);
            } else {
                $form = $('<form>').attr('style', styleHidden).appendTo(document.body);
                if (options.files) {
                    $form.attr('enctype', 'multipart/form-data');
                }
            }
            var form = $form[0];

            // save old attributes
            var old = {
                action: form.action,
                method: form.method,
                target: form.target
            };

            // set new attribute
            $form.prop({
                action:  options.url,
                method:  options.method,
                target:  id
            });

            // adding params
            var params = [];
            var data = options.data || '';
            if (data && typeof data !== "string") {
                data = $.param(data, options.traditional);
            }
            data = $.merge([['X-Requested-With', 'IFrame']], deserialize(data));
            for (i = 0; i < data.length; i++) {
                params.push(
                    $('<input type="hidden">')
                        .attr('name', data[i][0])
                        .val(data[i][1])
                        .appendTo($form)
                );
            }

            // adding files
            var helpers = [];
            if (options.files) {
                var $file, $helper;
                for (i = 0; i < options.files.length; i++) {
                    $file = $(options.files[i]);
                    $helper = $file.clone().data(pluginName, $file);
                    helpers.push($helper);
                    $file.replaceWith($helper);
                    $file.appendTo($form);
                }
            }

            // load handler
            $iframe.one('load', function () {
                $iframe.one('load', function () {
                    try {
                        var doc = this.contentWindow ? this.contentWindow.document : (this.contentDocument ? this.contentDocument : this.document);
                        var root = doc.body ? doc.body : doc.documentElement;
                        var $textarea = $(root).find('textarea[data-status]');
                        var status = parseInt($textarea.data('status') || 200, 10);
                        var statusText = $textarea.data('statusText') || 'OK';
                        var type = $textarea.data('contentType');
                        var headers = $textarea.data('headers') || null;
                        if (headers && typeof headers === 'object') {
                            var list = [];
                            $.each(headers, function (k, v) {
                                list.push(k + ': ' + v);
                            });
                            headers = list.join("\r\n");
                        }
                        if (type) {
                            type = "Content-Type: " + type;
                            headers = headers ? type + "\r\n" + headers : type;
                        }
                        var content;
                        if ($textarea.size()) {
                            content = {text: $textarea.val()};
                        } else {
                            content = {
                                html: root.innerHTML,
                                text: root.textContent || root.innerText
                            };
                        }
                        $iframe.remove();
                        complete(status, statusText, content, headers);
                    } catch (e) {
                        $iframe.remove();
                        complete(0, 'IFrame error');
                    }
                });

                var submitHandler = function () {
                    var i;
                    form.submit();
                    $form.prop(old);
                    for (i = 0; i < helpers.length; i++) {
                        helpers[i].replaceWith(helpers[i].data(pluginName));
                    }
                    if (!options.form) {
                        $form.remove();
                    } else {
                        for (i = 0; i < params.length; i++) {
                            params[i].remove();
                        }
                    }
                    if (options.iframeOnSubmit) {
                        options.iframeOnSubmit();
                    }
                };

                if (options.form) {
                    setTimeout(submitHandler, 1);
                } else {
                    submitHandler();
                }
            });

            $(document.body).append($iframe);
        },


        abort: function () {
            $iframe.off('load');
            $iframe.remove();
        }
    };
});

}));
