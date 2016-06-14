# jQuery IFrame AJAX

[![NPM version](http://img.shields.io/npm/v/jquery-iframe-ajax.svg?style=flat)](https://www.npmjs.org/package/jquery-iframe-ajax)
![Bower version](http://img.shields.io/bower/v/jquery-iframe-ajax.svg?style=flat)

Library provides transport to emulate AJAX via hidden iframe. In the first place necessary for AJAX uploading files to older browsers do not support the XMLHttpRequest 2.

Demo: http://paulzi.ru/jquery-iframe-ajax/

[Russian readme](https://github.com/paulzi/jquery-iframe-ajax/blob/master/README.ru.md)

## Install

Install via NPM
```sh
npm install jquery-iframe-ajax
```

Install via Bower
```sh
bower install jquery-iframe-ajax
```

Or install manually.

## Usage

Include library on page after jQuery:

```html
<script src="/bower_components/jquery/dist/jquery.min.js">
<script src="/bower_components/jquery-iframe-ajax/dist/jquery-iframe-ajax.min.js">
```

Now you can upload files via iframe transport:

```js
$(document).on('click', function () {
    $.ajax({
        url:    '/path/to/handler',
        method: 'post',
        iframe: true,
        data:   { additional: 'value' },
        files:  $('.form input[type="file"]')
    })
        .done(function (data) {
            alert(data);
        });
});
```

You can also send the existing form with all files and fields:

```js
$(document).on('click', function () {
    $.ajax({
        url:    '/path/to/handler',
        method: 'post',
        iframe: true,
        data:   { additional: 'value' },
        form:   $('.form')
    })
        .done(function (data) {
            alert(data);
        });
});
```

## Options

- `iframe` - enable iframe transport
- `files` - array of `input[type="file"]` or jQuery object with similar elements (using if `form` option is not set)
- `form` - form or jQuery object with form (option `files` will be ignored)
- `iframeOnSubmit` - callback after iframe form submit

## Response handling

By default, the iframe does not provide information about the response, such as:

- HTTP code
- HTTP status text
- Content-Type of response
- Headers

But you can emulate this support by wrapping the content in the tag `<textarea>`:
```html
<textarea data-status="403" data-status-text="Forbidden" data-content-type="text/json">
{"status": "Auth required"}
</textarea>
```

List of `textarea` attributes:

- `data-status` *(int)* - **(required)** HTTP code of response
- `data-status-text` *(string)* - HTTP response short description (see: HTTP Reason-Phrase)
- `data-content-type` *(string)* - Content-Type of response (it is override value in headers)
- `data-headers` *(plain object or string)* - List of header
 
**Note**: the real response code for iframe must be 200 for the correct processing of the contents `textarea`.

## Detect IFrame transport

If the request was sent via IFrame, then further transferred POST parameter `X-Requested-With = IFrame` (that param, not header!).

That way you can have different responding depending on transport:

```php
$response = json_encode(['status' => 'ok']);
if (!empty($_POST['X-Requested-With']) && $_POST['X-Requested-With'] === 'IFrame') {
    echo "<textarea data-status="200" data-status-text="OK" data-content-type="text/json">{$content}</textarea>";
} else {
    header("Content-Type: text/json");
    echo $content;
}
```

## Requirements

- jQuery 1.7+

## Browser support

Tested with browsers:

- Internet Explorer 7+
- Chrome 7+
- Firefox 3+
- Opera 15+
- Safari 5+
- Android Browser 2.2+
- iOS Safari ?
