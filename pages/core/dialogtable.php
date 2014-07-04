<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>انتخاب آیتم مورد نظر</title>
<SCRIPT Language = "JavaScript"> 
	function simpleDialog(msg) { 
		features = 'toolbar=no, location=no, directories=no, status=no, menubar=no, ' +
   					'scrollbars=no, resizable=no, width=600, height=400' 
		dlg = window.open ("","Dialog",features) 
		//-------------------- Window Content ------------------------------
		dlg.document.write ("<HTML><BODY bgColor='black' text='white'>") 
		dlg.document.write ("<H2><CENTER>",msg,"</CENTER></H2>") 
		dlg.document.write ("<FORM><CENTER>") 
		dlg.document.write ("<INPUT type='button' value='OK' onClick = 'self.close()'>") 
		dlg.document.write ("</CENTER></FORM></BODY></HTML>") 
		dlg.document.close()
	} 
</SCRIPT>
</head>

<body>
	<script>simpleDialog("Hello");</script>
</body>
</html>