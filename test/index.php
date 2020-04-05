<?php

// Здесь идет формирование контента мета-тегов
// На основе $_SERVER['REQUEST_URI']
// Для проектов, где роутинг и для каждой страницы / урла должны быть свои мета-данные

// Например
// $req_uri = $_SERVER['REQUEST_URI']; // Например, получим '/special/pik/article/17'


// Пример
//if (strpos($req_uri, 'article/17') !== false) {
//    // Данные для article/17
//      $title = '17';
//      $description = '17';
//      $share_image_url = '17.jpg';
//} elseif (strpos($req_uri, 'article/18') !== false) {
//    // Данные для article/18
//      $title = '18';
//      $description = '18';
//      $share_image_url = '18.jpg';
//} else {
//  По умолчанию
//}

// Если мета-данные статичны, просто заполняем руками

$title = 'Готовы жить в 2040 году с искусственным интеллектом и роботами? Сейчас узнаем!';
$description = 'В наших домах уже есть роботы, которые замешивают тесто или моют пол. И датчики движения, включающие свет, когда мы заходим в комнату. А что если в будущем роботы возьмут на себя все задания, которые мы не любим? А искусственный интеллект сможет настроить яркость лампочки, если ваши глаза устали? Пройдите тест и узнайте, готовы ли вы к такому повороту событий.';
$description_soc = 'Пока вы листаете ленту, учёные вовсю работают над интернетом вещей и искусственным интеллектом. Проверьте, насколько далека ваша жизнь от технологий и легко ли вам будет жить в 2040 году среди новых умных устройств.';
$image = 'https://lifebeta.ru/special/test-belov/dist/static/img/sharing.jpg';
$canonical_url = 'https://lifebeta.ru/special/test-belov/';

$metas = [
    '[TITLE]' => $title,
    '[DESCRIPTION]' => $description,
    '[DESCRIPTION_SOC]' => $description_soc,
    '[SHARE_IMAGE_URL]' => $image,
];

// Получаем содержимое build/index.html

$index_file = file_get_contents(__DIR__ . '/dist/index.html');

// Делаем замену плейсхолдеров

foreach ($metas as $key => $value)
    $index_file = str_replace($key, $value, $index_file);

echo $index_file;

exit;

// чтобы увидеть плейсхолдеры, см. исходный файл index.html в корне проекта
