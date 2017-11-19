# FreeRO Trader
Набор модулей написанных на Typescript / Javascript для сбора статистики с игрового сервера Ragnarok FreeRO

## Структура
* /packages/irc - модуль сбора статистики с IRC чата
* /packages/tg - модуль взаимодействия с игроками по средствам Telegram
* /packages/www - модуль HTTP бэкенда
* /packages/www-client - простенький клиент для предыдущего пункта :3

## TODO
* Вынести /packages/*/src/db/* в отдельный модуль /packages/db что значительно уменьшит количество повторяемого кода