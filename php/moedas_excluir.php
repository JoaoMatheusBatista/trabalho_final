<?php
    require 'banco.php';
    //isset vai procurar a variável, vai devolver verdadeiro ou falso
    if (!isset($_GET['id_moedas'])){
        echo 'Erro! Dados faltando';
        exit(); //vai encerrar o código, para por aqui
    }

    $id_moedas = $_GET['id_moedas'];

    $sql = "DELETE FROM moedas
            WHERE id_moedas = :id_moedas"; //dois pontos significa parâmetros para o SQL

    $qry = $con->prepare($sql); //prepare valida se o comando sql está escrito corretamente
    $qry->bindParam(':id_moedas', $id_moedas, PDO::PARAM_STR);

    $qry->execute();

    $num = $qry->rowCount(); //devolve o numero de registros da query
    echo $num;

?>