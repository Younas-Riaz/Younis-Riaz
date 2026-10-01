<?php
/**
 * Product Comparison Engine Endpoint (PHP + MySQL)
 * Calculates multi-dimensional differences and evaluates Smart Score dynamically
 */

require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$ids = isset($input['ids']) ? $input['ids'] : [];

if (empty($ids) || !is_array($ids)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please provide an array of product IDs to compare.']);
    exit();
}

$inQuery = implode(',', array_fill(0, count($ids), '?'));
$stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id IN ($inQuery)");
$stmt->execute($ids);
$products = $stmt->fetchAll();

if (empty($products)) {
    http_response_code(404);
    echo json_encode(['error' => 'No products found.']);
    exit();
}

foreach ($products as &$p) {
    $priceStmt = $pdo->prepare("SELECT pp.*, ps.name as platform_name FROM product_prices pp JOIN product_sources ps ON pp.source_id = ps.id WHERE pp.product_id = ?");
    $priceStmt->execute([$p['id']]);
    $p['platforms'] = $priceStmt->fetchAll();

    $specStmt = $pdo->prepare("SELECT spec_name, spec_value FROM product_specifications WHERE product_id = ?");
    $specStmt->execute([$p['id']]);
    $p['specs'] = $specStmt->fetchAll();
}

// Find winner with highest smart_score
usort($products, function($a, $b) {
    return $b['smart_score'] - $a['smart_score'];
});

$winner = $products[0];

echo json_encode([
    'status' => 'success',
    'comparison_count' => count($products),
    'winner' => [
        'id' => $winner['id'],
        'title' => $winner['title'],
        'smart_score' => $winner['smart_score'],
        'reason' => $winner['smart_reason']
    ],
    'products' => $products
]);
