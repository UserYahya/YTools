<?php
header('Content-Type: application/json');

if (isset($_GET['ip'])) {
    $ip = $_GET['ip'];
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        echo json_encode(['error' => 'Invalid IP address.']);
        exit;
    }
    // The proxycheck.io key lives outside public_html (~/proxycheck.key on Toolforge), never in the repository.
    $keyFile = dirname(__DIR__, 2) . '/proxycheck.key';
    $apiKey = getenv('PROXYCHECK_KEY') ?: (is_readable($keyFile) ? trim(file_get_contents($keyFile)) : '');

    $apiUrl = "https://proxycheck.io/v2/" . $ip . "?vpn=1&asn=1" . ($apiKey ? "&key=" . urlencode($apiKey) : "");

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => [
                'User-Agent: PHP'
            ]
        ]
    ]);

    $response = file_get_contents($apiUrl, false, $context);

    if ($response !== false) {
        $data = json_decode($response, true);
        if (isset($data['status']) && $data['status'] === "ok") {
            echo json_encode($data[$ip]);
        } else {
            echo json_encode(['error' => 'Error occurred while fetching data.']);
        }
    } else {
        echo json_encode(['error' => 'Error occurred while fetching data.']);
    }
} else {
    echo json_encode(['error' => 'No IP address provided.']);
}
?>
