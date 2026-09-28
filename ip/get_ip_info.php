<?php
// IP lookup backend for the YTools IP Information Viewer.
// Accepts ?ip=<IPv4 | IPv6 | hostname> and returns proxycheck.io data as JSON,
// plus the resolved IP and reverse DNS (PTR) name.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function fail($message, $status = 400) {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}

$query = trim($_GET['ip'] ?? '');
if ($query === '') {
    fail('Please enter an IP address or hostname.');
}
if (strlen($query) > 253) {
    fail('That input is too long to be an IP address or hostname.');
}

$ip = $query;
$resolvedFrom = null;

if (!filter_var($query, FILTER_VALIDATE_IP)) {
    $hostPattern = '/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i';
    if (!preg_match($hostPattern, $query)) {
        fail("\"$query\" is not a valid IP address or hostname. Try something like 8.8.8.8 or example.org.");
    }
    $resolved = gethostbyname($query);
    if ($resolved === $query) {
        fail("Could not find an IP address for the hostname \"$query\".", 404);
    }
    $ip = $resolved;
    $resolvedFrom = $query;
}

if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
    fail("$ip is a private or reserved address (e.g. a home or office network), so there is no public information about it.");
}

// The API key lives outside public_html so it can never be served as text.
// Create it with:  echo 'YOUR-KEY' > ~/proxycheck.key && chmod 600 ~/proxycheck.key
// Without a key proxycheck.io still works, with a lower daily limit.
$apiKey = getenv('PROXYCHECK_KEY');
if (!$apiKey) {
    $keyFile = dirname(__DIR__, 2) . '/proxycheck.key';
    if (is_readable($keyFile)) {
        $apiKey = trim(file_get_contents($keyFile));
    }
}

// $ip has passed FILTER_VALIDATE_IP, so it is safe to place in the URL path.
$apiUrl = "https://proxycheck.io/v2/$ip?vpn=1&asn=1&risk=1" . ($apiKey ? '&key=' . urlencode($apiKey) : '');

$context = stream_context_create([
    'http' => [
        'method'        => 'GET',
        'timeout'       => 8,
        'ignore_errors' => true,
        'header'        => "User-Agent: YTools-IPViewer/2.0 (https://ytools.toolforge.org/ip/)\r\n",
    ],
]);

$response = @file_get_contents($apiUrl, false, $context);
if ($response === false) {
    fail('The IP information service did not respond. Please try again in a moment.', 502);
}

$data = json_decode($response, true);
if (!is_array($data) || !in_array($data['status'] ?? '', ['ok', 'warning'], true)) {
    $reason = $data['message'] ?? 'unknown error';
    fail("The IP information service returned an error: $reason", 502);
}

// proxycheck.io keys results by IP; it may normalise IPv6, so fall back to the first result.
$result = $data[$ip] ?? null;
if ($result === null) {
    foreach ($data as $value) {
        if (is_array($value) && isset($value['proxy'])) {
            $result = $value;
            break;
        }
    }
}
if ($result === null) {
    fail('No information was returned for this address.', 502);
}

$ptr = @gethostbyaddr($ip);

$result['ip'] = $ip;
$result['query'] = $query;
$result['resolved_from'] = $resolvedFrom;
$result['hostname'] = ($ptr && $ptr !== $ip) ? $ptr : null;
$result['version'] = filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) ? 6 : 4;

echo json_encode($result);
