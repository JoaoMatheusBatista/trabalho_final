<?php
    require 'banco.php';
    //isset vai procurar a variável, vai devolver verdadeiro ou falso
    if (!isset($_GET['base']) || !isset($_GET['valor']) || !isset($_GET['data'])){
        echo 'Erro! base valor e data são obrigatórios.';
        exit(); //vai encerrar o código, para por aqui
    }

    $base = $_GET['base'];
    $valor = $_GET['valor'];
    $data = $_GET['data'];

    $sql = "INSERT INTO moedas(base, data, valor)
            VALUES (:base, :data, :valor)"; //dois pontos significa parâmetros para o SQL

    $qry = $con->prepare($sql); //prepare valida se o comando sql está escrito corretamente
    $qry->bindParam(':base', $base, PDO::PARAM_STR); //define os parâmetros, o PDO PARAM vai informar que é string
    $qry->bindParam(':valor', $valor, PDO::PARAM_STR);
    $qry->bindParam(':data', $data, PDO::PARAM_STR);
    $qry->execute();

    $num = $qry->rowCount(); //devolve o numero de registros da query
    echo $num;

?>