<?php
$apiKey = "API_KEY"; // Replace with your actual API key
$ipAddress = $_GET['ip'];

$url = "https://ipinfo.io/{$ipAddress}?token={$apiKey}";

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curl);
curl_close($curl);

header('Content-Type: application/json');
echo $response;
?>

