<?php
// The ipinfo.io token lives outside public_html (~/ipinfo.key on Toolforge), never in the repository.
$keyFile = dirname(__DIR__, 2) . '/ipinfo.key';
$apiKey = getenv('IPINFO_TOKEN') ?: (is_readable($keyFile) ? trim(file_get_contents($keyFile)) : '');

header('Content-Type: application/json');

$ipAddress = $_GET['ip'] ?? '';
if (!filter_var($ipAddress, FILTER_VALIDATE_IP)) {
    echo json_encode(['error' => 'Invalid IP address.']);
    exit;
}

$url = "https://ipinfo.io/{$ipAddress}" . ($apiKey ? '?token=' . urlencode($apiKey) : '');

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curl);
curl_close($curl);

echo $response;
?>
