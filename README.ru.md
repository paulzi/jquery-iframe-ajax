# jQuery IFrame AJAX

[![NPM version](http://img.shields.io/npm/v/jquery-iframe-ajax.svg?style=flat)](https://www.npmjs.org/package/jquery-iframe-ajax)
![Bower version](http://img.shields.io/bower/v/jquery-iframe-ajax.svg?style=flat)

Библиотека предоставляет транспорт для эмулирования AJAX через скрытый iframe. Это в превую очередь необходимо для загрузки файлов на сервер через браузеры, которые не поддерживают XMLHttpRequest 2.

Демо: https://paulzi.ru/misc/github/jquery-iframe-ajax/

[English readme](https://github.com/paulzi/jquery-iframe-ajax/)

## Установка

Установка через NPM
```sh
npm install jquery-iframe-ajax
```

Установка через Bower
```sh
bower install jquery-iframe-ajax
```

Или установите вручную.

## Использование

Подключите библиотеку на страницу после jQuery:

```html
<script src="/bower_components/jquery/dist/jquery.min.js">
<script src="/bower_components/jquery-iframe-ajax/dist/jquery-iframe-ajax.min.js">
```

Теперь вы можете загружать файлы на сервер через iframe:

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

Также можно отправить существующую форму со всеми полями и файлами:

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

## Обработка ответов

По-умолчанию iframe не предоставляет подробную информацию об ответе, такую как:

- HTTP код
- HTTP текст статуса
- Content-Type ответа
- Headers (Заголовки)

Но Вы можете эмулировать поддержку этого, путём оборачивания контента тэгом `<textarea>`:
```html
<textarea data-status="403" data-status-text="Forbidden" data-content-type="text/json">
{"status": "Auth required"}
</textarea>
```

Список атрибутов `textarea`:

- `data-status` *(int)* - **(обязательный)** HTTP код ответа
- `data-status-text` *(string)* - HTTP текст статуса (смотрите: HTTP Reason-Phrase)
- `data-content-type` *(string)* - Content-Type ответа (данный атрибут переопределит значение в headers)
- `data-headers` *(plain object or string)* - Список заголовков
 
**Внимание**: реальный HTTP-код ответа для iframe-транспорта должен быть равен 200 для корректной обработки тэга `textarea`.

## Параметры

- `iframe` - задействует iframe транспорт
- `files` - массив элементов `input[type="file"]` или jQuery объект с такими же элементами (используется, если опция `form` не задана)
- `form` - форма или jQuery объект с формой (опция `files` будет игнорирована)
- `iframeOnSubmit` - callback после отправки iframe-формы

## Определение IFrame транспорта

Если запрос был отправлен через iframe-транспорт, в качестве POST-параметра будет отправлен `X-Requested-With = IFrame` (именно параметр, а не заголовок!).

Таким образом вы можете выдавать ответ в зависимости от транспорта:

```php
$response = json_encode(['status' => 'ok']);
if (!empty($_POST['X-Requested-With']) && $_POST['X-Requested-With'] === 'IFrame') {
    echo "<textarea data-status="200" data-status-text="OK" data-content-type="text/json">{$content}</textarea>";
} else {
    header("Content-Type: text/json");
    echo $content;
}
```

## Требования

- jQuery 1.7+

## Поддержка браузерами

Поддержка была протестирована в следующих браузерах:

- Internet Explorer 7+
- Chrome 7+
- Firefox 3+
- Opera 15+
- Safari 5+
- Android Browser 2.2+
- iOS Safari ?
