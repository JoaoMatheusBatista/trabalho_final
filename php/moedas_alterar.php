<?php
    require 'banco.php';
    //isset vai procurar a variável, vai devolver verdadeiro ou falso
    if (!isset($_GET['id_moedas']) ||!isset($_GET['base']) || !isset($_GET['valor']) || !isset($_GET['data'])){
        echo 'Erro! base, valor e o Id da moeda são obrigatórios!';
        exit(); //vai encerrar o código, para por aqui
    }

    $id_moedas = $_GET['id_moedas'];
    $base = $_GET['base'];
    $valor = $_GET['valor'];
    $data = $_GET['data'];

    $sql = "UPDATE moedas
            SET base = :base, valor = :valor, data = :data
            WHERE id_moedas = :id_moedas"; //dois pontos significa parâmetros para o SQL

    $qry = $con->prepare($sql); //prepare valida se o comando sql está escrito corretamente
    $qry->bindParam(':id_moedas', $id_moedas, PDO::PARAM_STR);
    $qry->bindParam(':base', $base, PDO::PARAM_STR); //define os parâmetros, o PDO PARAM vai informar que é string
    $qry->bindParam(':valor', $valor, PDO::PARAM_STR);
    $qry->bindParam(':data', $data, PDO::PARAM_STMT);
    $qry->execute();

    $num = $qry->rowCount(); //devolve o numero de registros da query
    echo $num;
?>