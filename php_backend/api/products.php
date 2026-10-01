<?php
/**
 * Product Retrieval & Filtering API Endpoint
 * Handles search keywords, categories, price range, brand, sorting, and pagination
 */

require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $q = isset($_GET['q']) ? trim($_GET['q']) : '';
    $category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;
    $min_price = isset($_GET['min_price']) ? floatval($_GET['min_price']) : 0;
    $max_price = isset($_GET['max_price']) ? floatval($_GET['max_price']) : 999999;
    $sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'smart_score';

    $sql = "SELECT p.*, c.name AS category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.lowest_price >= :min_price AND p.lowest_price <= :max_price";

    $params = [
        ':min_price' => $min_price,
        ':max_price' => $max_price,
    ];

    if (!empty($q)) {
        $sql .= " AND (p.title LIKE :q OR p.brand LIKE :q OR p.description LIKE :q)";
        $params[':q'] = "%{$q}%";
    }

    if ($category_id > 0) {
        $sql .= " AND p.category_id = :cat_id";
        $params[':cat_id'] = $category_id;
    }

    // Sort order
    if ($sort === 'price_asc') {
        $sql .= " ORDER BY p.lowest_price ASC";
    } elseif ($sort === 'price_desc') {
        $sql .= " ORDER BY p.lowest_price DESC";
    } elseif ($sort === 'rating_desc') {
        $sql .= " ORDER BY p.average_rating DESC";
    } else {
        $sql .= " ORDER BY p.smart_score DESC";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    // Fetch multi-store prices for each product
    foreach ($products as &$product) {
        $priceStmt = $pdo->prepare("SELECT pp.*, ps.name as platform_name 
                                    FROM product_prices pp 
                                    JOIN product_sources ps ON pp.source_id = ps.id 
                                    WHERE pp.product_id = ?");
        $priceStmt->execute([$product['id']]);
        $product['platforms'] = $priceStmt->fetchAll();

        // Specifications
        $specStmt = $pdo->prepare("SELECT spec_name, spec_value FROM product_specifications WHERE product_id = ?");
        $specStmt->execute([$product['id']]);
        $product['specs'] = $specStmt->fetchAll();
    }

    echo json_encode([
        'status' => 'success',
        'count' => count($products),
        'products' => $products
    ]);
}
