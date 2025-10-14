<?php
// proxy_sa1.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain; charset=utf-8");

// ضع هنا رابط الـ sa1.css الكامل
$target = "http://express.genral.xyz:8080/sa1.css?token=0e305931d4f73025efe7b5febd57d38d";

// إعداد User-Agent (بعض السيرفرات ترفض طلبات بدون UA)
$opts = [
  "http" => [
    "method" => "GET",
    "header" => "User-Agent: Mozilla/5.0 (compatible)\r\n",
    "timeout" => 10
  ]
];
$ctx = stream_context_create($opts);

// جلب المحتوى وإرساله كما هو
$txt = @file_get_contents($target, false, $ctx);
if ($txt === false) {
  http_response_code(502);
  echo "Error fetching remote resource.";
  exit;
}

echo $txt;
