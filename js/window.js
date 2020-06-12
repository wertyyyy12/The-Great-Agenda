document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById("Date").valueAsDate = new Date();


});
var form = document.getElementById("aInfo");

var list = document.getElementById("taskList");
var months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};
document.addEventListener("keypress", function onEvent(event) {
  if (event.key === "Enter") {
    document.getElementById("Link").value = getSelectionText();
  }
});

 // var removeButtons = document.getElementsByTagName("button");
 // var buttonsCount = removeButtons.length;
 // for (var i = 0; i <= buttonsCount; i += 1) {
 //     removeButtons[i].onclick = function(e) {
 //         alert(this.id);
 //     };
 // }​

form.addEventListener('submit', function (event) {
  event.preventDefault();
  var name = document.getElementById("Name").value;
  var date = document.getElementById("Date").value;
  var d = new Date(document.getElementById("Date").valueAsDate);
  //Date formatting
  var month = d.getMonth()+1;
  var day = d.getDate()+1;
  var year = d.getFullYear();
  var dateString = months[month] + " " + day + ", " + year;
  var link = document.getElementById("Link").value;
  //Remove button formatting
  //Some slick string manipulation to get the link tag to work correctly
  if (name != '') {
  list.innerHTML += '<li id=' + name + '>' + '<a href=' + link + ">" + name + "</a>" +": " + dateString +  ' ' + '<button onclick=remove(this.id) type=button class=REMOVE id=' + name + '>' + 'X' + '</button>' + '</li>';
  }
  document.getElementById("Name").value = "";

  localStorage.setItem('tasklist', list.innerHTML);
  clear();

}, true);

function clear() {
  localStorage.clear();
}

function remove(Name) {
  console.log(document.getElementById(Name));
  document.getElementById(Name).remove();
  //Save the string again after we modify it
  localStorage.setItem('tasklist', list.innerHTML);
}




var saved = localStorage.getItem('tasklist');

if (saved) {
	list.innerHTML = saved;
};
