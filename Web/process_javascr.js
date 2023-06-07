
function process(){
	
	$.ajax({
		type: "POST",
		url: "muhaha.php",
		data: {
			a: "hans",
			b: "Wurst"
		}
	}).done(function(o) {
		alert(o);
	});
}

function init(){
	document.getElementById('probability').value = 5;
	document.getElementById('withDiagonale').checked = true;
}
