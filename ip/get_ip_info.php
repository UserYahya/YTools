<?php
header('Content-Type: application/json');

if (isset($_GET['ip'])) {
    $ip = $_GET['ip'];
    $apiKey = "API_KEY"; // Replace with your actual API key

    $apiUrl = "https://proxycheck.io/v2/" . $ip . "?vpn=1&asn=1&key=" . $apiKey;

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
