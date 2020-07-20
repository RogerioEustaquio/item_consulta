<?
/*
Examples file

To test any of the functions, just change the 0 to a 1.
*/

//error_reporting(E_ALL ^ E_NOTICE);

include (dirname(__FILE__) . "/../src/adLDAP.php");
try {
    $adldap = new adLDAP($options);
}
catch (adLDAPException $e) {
    echo $e;
    exit();   
}
//var_dump($adldap);

echo ("<pre>\n");

// authenticate a username/password
if (1) {

	$user = $adldap->user()->find(false, 'description', '71167021134');
	var_dump($user[0]);

	if(count($user[0]) > 0){
		$resultDisabled = $adldap->user()->enable($user[0]);
		var_dump($resultDisabled);
	}
}



?>