function loadDoc(param) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       console.log("OKEE")
      }
    };
    // console.log("cek rute:",rute+param)
    xhttp.open("GET", param, true);
    xhttp.send();
}

function keProximity()
{
  window.location.href = '/proximity.html';
}



