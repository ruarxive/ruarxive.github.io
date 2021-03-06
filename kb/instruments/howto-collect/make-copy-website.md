---
sidebar_position: 2
---

# Как создать цифровой архив сайтов

Есть разные способы сохранения копии сайта, как готовые интерфейсы приложений, так и утилиты (CLI) для скачивания через командную строку.


## HTTrack

HTTrack — это бесплатное (GPL, libre/ free software) и простое в использовании приложение, которое позволяет загрузить веб-сайт в локальный каталог, получая HTML-код страниц, изображения и другие файлы с сервера на ваш компьютер. Есть режим рекурсивной выгрузки всех страниц.

HTTrack упорядочивает относительную ссылочную структуру оригинального сайта. Приложение имеет GUI и работает под Windows, MacOSX, Linux.

Для использования приложения не нужна специальная техническая подготовка и навыки программирования, однако это приложение также работает и с командной строки ([гайд пользователям](http://www.httrack.com/html/fcguide.html)).

## Утилиты командной строки (CLI)

Самые популярные утилиты командной строки для создания архива сайта — это [Wget](https://www.gnu.org/software/wget/) и [Wpull](https://github.com/ArchiveTeam/wpull).


### Wget

Wget — это пакет свободного программного обеспечения для извлечения файлов с помощью HTTP, HTTPS, FTP и FTPS и других наиболее широко используемых интернет-протоколов. Это неинтерактивный инструмент командной строки, поэтому его можно легко вызывать из скриптов, терминалов и т.д.

Wget имеет множество функций, облегчающих получение больших файлов или зеркалирование целых сайтов в Интернете или FTP, в том числе:

- Может возобновлять прерванную загрузку, используя REST и RANGE.
- Может использовать подстановочные карты в именах файлов и рекурсивного зеркалирования каталогов.
- Опционально преобразует абсолютные ссылки в загруженных документах в относительные так, что загруженные документы могут ссылаться друг на друга локально.
- Поддерживает HTTP-прокси.
- Поддерживает HTTP cookies.
- Поддерживает постоянные HTTP-соединения.
- Неавторизованная / фоновая работа скрипта.
- Использует локальные временные метки файлов для определения необходимости повторной загрузки документов при зеркалировании

Wget распространяется под лицензией GNU General Public License.


### Wpull

Wpull — это Wget-совместимый (или ремейк/клон/замена/альтернатива) веб-загрузчик и краулер.
Краулер — это интернет-бот, который систематически просматривает интернет и обычно используется поисковыми системами для веб-индексации.
Веб-краулеры копируют страницы для обработки поисковой системой, которая индексирует загруженные страницы, чтобы пользователи могли осуществлять более эффективный поиск. Краулеры могут проверять гиперссылки и HTML-код. Они также могут использоваться для веб-скреппинга и программирования на основе данных.

Примечательные особенности Wpull:

- Написан на Python и доступен к модификации.
- Интегрируется с PhantomJS и youtube-dl (экспериментально).

![Commands Wpull](/images/image7.png)​

У этих утилит есть режим рекурсивной выгрузки всех страниц, он задается опцией “-r”.
В самом простом варианте достаточно выполнить команду, подобную этой.
