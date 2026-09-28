<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if (isset($_GET['ip'])) {
    $ip = $_GET['ip'];
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        echo json_encode(['error' => 'Invalid IP address']);
        exit;
    }
    // The ipcheck key lives outside public_html (~/ipcheck.key on Toolforge), never in the repository.
    $keyFile = dirname(__DIR__, 2) . '/ipcheck.key';
    $apiKey = getenv('IPCHECK_KEY') ?: (is_readable($keyFile) ? trim(file_get_contents($keyFile)) : '');
    $apiUrl = "https://ipcheck.toolforge.org/index.php?ip={$ip}&api=true&key=" . urlencode($apiKey);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // Follow redirects
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0'); // Set User-Agent header

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } elseif ($httpCode != 200) {
        // Separate headers and body
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        echo json_encode([
            'error' => 'API request failed with response code ' . $httpCode,
            'headers' => $headers,
            'body' => $body
        ]);
    } else {
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $body = substr($response, $headerSize);
        echo $body;
    }

    curl_close($ch);
} else {
    echo json_encode(['error' => 'IP address not provided']);
}
?>
