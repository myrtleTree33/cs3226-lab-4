<?php
header("Access-Control-Allow-Origin: *");

$nn = (int)$_GET['n'];
$mm = (int)$_GET['m'];

function array_rand_guarantee($arr, $min, $max) {
    $result = [];
    while(count($result) == 0 || $result[0] === NULL) {
        $result = array_rand($arr, rand($min,$max));
    }
    return $result;
}

function gen_soln($n, $m) {
    $matches = [];
    $mRange = range(0,$m - 1);
    for ($i = 0; $i < $n; $i++) {
        $rightKeys = array_rand_guarantee($mRange, 1, $m);
        for ($h = 0; $h < count($rightKeys); $h++) {
            $score = rand(0,100);
            $matches[] = array($i, $mRange[$rightKeys[$h]], $score);
        }
    }

    $result = [];
    $result['N'] = (int)$n;
    $result['M'] = (int)$m;
    $result['E'] = $matches;


    return json_encode($result);
}

echo(gen_soln($nn,$mm));
?>
