<?php
	$img = $_POST['imgBase64'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$fileData = base64_decode($img);
	//saving
	$fileName = $_POST['imgFileName'];
	if ($fileName == "") $fileName = 'empty';
	$fileName = 'obstacleImages/' . $fileName . '.png';
	file_put_contents($fileName, $fileData);
?>