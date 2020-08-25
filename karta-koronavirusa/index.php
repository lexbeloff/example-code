<?php

// Здесь идет формирование контента мета-тегов
// На основе $_SERVER['REQUEST_URI']
// Для проектов, где роутинг и для каждой страницы / урла должны быть свои мета-данные

// Например
$req_uri = $_SERVER['REQUEST_URI']; // Например, получим '/special/pik/article/17'

// Если мета-данные статичны, просто заполняем руками

$title = 'Карта распространения коронавируса';
$title_soc = $title;
$description_soc = $description;
$description = 'Узнайте, сколько человек в разных странах заболели, вылечились или умерли от COVID-19.';
$image = 'https://lifehacker.ru/special/karta-koronavirusa/dist/share.jpg';
$canonical = 'https://lifehacker.ru/special/karta-koronavirusa';

if ($_GET['share']) {
  $title = $_GET['title'];
  $title_soc = $_GET['title'];
  $description = $_GET['description'] ? $_GET['description'] : $description;
  $description_soc = $_GET['description'] ? $_GET['description'] : $description_soc;
  $image = $_GET['image'] ? $_GET['image'] : $image;
  $canonical="https://lifehacker.ru/special/karta-koronavirusa";
}

$metas = [
    '[TITLE]' => $title,
    '[TITLE_SOC]' => $title_soc,
    '[DESCRIPTION]' => $description,
    '[DESCRIPTION_SOC]' => $description_soc,
    '[IMAGE]' => $image,
    '[CANONICAL_URL]' => $canonical,
];

// Получаем содержимое dist/index.html

$index_file = file_get_contents(__DIR__ . '/dist/index.html');

// Делаем замену плейсхолдеров

foreach ($metas as $key => $value)
    $index_file = str_replace($key, $value, $index_file);

echo $index_file;

exit;

// чтобы увидеть плейсхолдеры, см. исходный файл index.html в корне проекта
