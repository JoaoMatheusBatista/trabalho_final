<?php
    require 'banco.php';
    //isset vai procurar a variável, vai devolver verdadeiro ou falso
    if (!isset($_GET['idlog'])){
        echo 'Erro! Dados faltando';
        exit(); //vai encerrar o código, para por aqui
    }

    $idlog = $_GET['idlog'];

    $sql = "DELETE FROM log
            WHERE idlog = :idlog"; //dois pontos significa parâmetros para o SQL

    $qry = $con->prepare($sql); //prepare valida se o comando sql está escrito corretamente
    $qry->bindParam(':idlog', $idlog, PDO::PARAM_STR);

    $qry->execute();

    $num = $qry->rowCount(); //devolve o numero de registros da query
    echo $num;

?>