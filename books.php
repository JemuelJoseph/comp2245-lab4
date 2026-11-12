<?php

header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/db.php';

// Get the search query
$q = $_GET['q'] ?? '';

if (!is_string($q)) {
    $q = '';
}

$q = trim($q);

// Create the search pattern
$pattern = '%' . $q . '%';

$sql = 'SELECT
            books.title,
            books.author,
            books.year,
            subjects.name AS subject,
            books.copies,
            (books.copies - books.on_loan) AS available
        FROM books
        JOIN subjects ON books.subject_id = subjects.id
        WHERE (books.title LIKE :title OR books.author LIKE :author)';


$params = [
    ':title' => $pattern,
    ':author' => $pattern
];

$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT);

if (is_int($subject) && $subject >= 1) {
    $sql .= ' AND books.subject_id = :subject';
    $params[':subject'] = $subject;
}

if (isset($_GET['available']) && $_GET['available'] === '1') {
    $sql .= ' AND (books.copies - books.on_loan) > 0';
}

$sql .= ' ORDER BY books.title';

$stmt = $pdo->prepare($sql);

$stmt->execute($params);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
