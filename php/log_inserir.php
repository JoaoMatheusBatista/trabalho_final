<?php
    require 'banco.php';
    //isset vai procurar a variável, vai devolver verdadeiro ou falso
    if (!isset($_GET['numeroregistros'])){
        echo 'Erro! dados insuficientes';
        exit(); //vai encerrar o código, para por aqui
    }

    $numeroregistros = $_GET['numeroregistros'];

    $sql = "INSERT INTO log (numeroregistros)
            VALUES (:numeroregistros)"; //dois pontos significa parâmetros para o SQL

    $qry = $con->prepare($sql); //prepare valida se o comando sql está escrito corretamente
    $qry->bindParam(':numeroregistros', $numeroregistros, PDO::PARAM_STR);
    $qry->execute();

    $num = $qry->rowCount(); //devolve o numero de registros da query
    echo $num;
?>