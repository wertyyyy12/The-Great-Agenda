document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById("Date").valueAsDate = new Date();



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
  list.innerHTML += '<li id=' + name + 'LIS' + '>' + '<a href=' + link + '>' + name + '</a>' +': ' + dateString + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '</li>';
  }

  console.log(document.getElementById(name));
  buttons = document.getElementsByClassName('Remove');
  numB = buttons.length;
  for (var i = 0; i < numB; i += 1) {
      buttons[i].addEventListener('click', function () {
        lists = document.getElementsByTagName('li');
//        console.log(lists.getElementById(this.id));
        document.getElementById(this.id).parentElement.remove();
      });
  }
  document.getElementById("Name").value = "";
  localStorage.setItem('tasklist', list.innerHTML);
  clear();

});

function clear() {
  localStorage.clear();
}

function remove() {
  console.log(document.getElementById(name));
  document.getElementById(name).remove();
}

var saved = localStorage.getItem('tasklist');

if (saved) {
	list.innerHTML = saved;
};
});
