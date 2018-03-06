// Wait for the page to load first

var element;
var socket = io.connect('http://127.0.0.1:8080');
var id_annotation = -1;
var text;
var sexist;

socket.on('entree', function(data) {
        var elt = JSON.parse(data);
        id_annotation = elt.id;
        if (id_annotation == null){id_annotation=-1;}
        console.log(id_annotation);
        text = elt.txt;
        //update the prompted text
        document.getElementById("textToAnno").textContent = text; 
   });

window.onload = function() {

  
  var i = 0;
  var mot;
  var drop = document.getElementById("hiddenDrop")
  var nextBtn = document.getElementById("nextButton");

  nextBtn.onclick = function() {
    console.log(id_annotation);
    socket.emit('nouvelleAnnotation', JSON.stringify({ id: id_annotation, sexist: sexist }));
    
    i += 1;
    // Replace the button so the :active is no longer in effect.
    var old = nextBtn;
    var newbtn = old;
    old.replaceWith(newbtn);
    // Button cannot be clicked unless "sexist"/"notsexist" has been clicked
    nextBtn.classList.add("notActive");
    // Selection button back to their normal state
    sexistBtn.style.backgroundColor = "#4CAF50";
    notSexistBtn.style.backgroundColor = "#4CAF50";
    drop.classList.add("hidden");

    
    return false;
  }

  var sexistBtn = document.getElementById("sexist");
  var notSexistBtn = document.getElementById("notSexist");

  sexistBtn.onclick = function() {
    sexistBtn.style.backgroundColor = "#087f23";
    notSexistBtn.style.backgroundColor = "#4CAF50";
    nextBtn.classList.remove("notActive");
    drop.classList.remove("hidden");
    sexist = 1;
 
    return false;
  }

  notSexistBtn.onclick = function() {
    notSexistBtn.style.backgroundColor = "#087f23";
    sexistBtn.style.backgroundColor = "#4CAF50";
    nextBtn.classList.remove("notActive");
    sexist = 0;
    return false;
  }
  
  
}
