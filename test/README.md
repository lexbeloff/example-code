# Шаблон

> Шаблон для спецпроектов lifehacker.ru на основе https://github.com/vuejs-templates/webpack

## Иструкция по использованию

``` bash
# установить зависимости
yarn install

# запустить локальный сервер localhost:8080
yarn dev

# собрать продакшен билд с минификацией
yarn build

# собрать продакшен билд и посмотреть отчет
yarn build --report

# запустить юнит-тесты
yarn unit

# запустить e2e-тесты
yarn e2e

# запустить все тесты
yarn test
```

## Конфигурация

  - index.php Заполнить мета-теги для шеринга
  - settings.js Заполнить значения конфигурации

## Как залить на продакшен сервер

 - ssh username@special.lifehacker.ru
 - cd /srv/www/lifehacker.ru/htdocs/special
 - git clone git@bitbucket.org:devhacker/MY_PROJECT_NAME.git
 
## Как залить изменения на продакшен сервер

 - ssh username@special.lifehacker.ru
 - cd /srv/www/lifehacker.ru/htdocs/special/MY_PROJECT_NAME
 - git fetch && git pull
 
 
## Тестовый сервер для спецпроектов

  - ssh username@lifebeta.ru
  - cd /srv/www/lifebeta.ru/htdocs/special
  - Дальше аналогично продакшен серверу

Подробнее: [гайд](http://vuejs-templates.github.io/webpack/) && [документация vue-loader](http://vuejs.github.io/vue-loader).
