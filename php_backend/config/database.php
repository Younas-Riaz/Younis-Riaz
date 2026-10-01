<?php
/**
 * Smart E-Commerce Product Comparison Website
 * BSCS Final Year Project (Session 2023-2027)
 * Database Connection Configuration (PDO with UTF-8 support)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db_name = 'smart_ecommerce';
$username = 'root';
$password = ''; // Default XAMPP/WAMP password is empty

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db_name};charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please ensure MySQL is running in XAMPP/WAMP and smart_ecommerce.sql has been imported.',
        'details' => $e->getMessage()
    ]);
    exit();
}
