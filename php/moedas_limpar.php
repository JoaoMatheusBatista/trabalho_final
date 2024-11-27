<?php
    require 'banco.php';

    $sql = "DELETE FROM moedas";

    $qry = $con->prepare($sql);
    $qry->execute();
    $num = $qry->rowCount(); 
    echo $num;

?>