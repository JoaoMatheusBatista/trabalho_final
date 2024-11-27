<?php
    require 'banco.php';

    $sql = "SELECT * FROM log
            ORDER BY idlog";
    $qry = $con->prepare($sql); //prepare valida se o comando sql está escrito corretamente
    $qry->execute();

    //$num = $qry->rowCount(); devolve o numero de registros da query
    //echo $num;

    $registros = $qry->fetchAll(PDO::FETCH_OBJ); //transforma os dados da query para o tipo fetch_obj - que é um array associativo
    echo json_encode($registros); //transforma no formato json

?>