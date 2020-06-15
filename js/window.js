window.onload=function(){
  document.getElementById("Finish").click();
  document.getElementById("Link").focus();
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var url = tabs[0].url;
    document.getElementById("Link").value = url;
    // use `url` here inside the callback because it's asynchronous!
  });
  // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  //   var url = tabs[0].url;
  //   document.getElementById("Link").value = url;
  //   // use `url` here inside the callback because it's asynchronous!
  // });
};

function isUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }

  return true;
}

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
  function handleKeys(e) {
    //Space key pressed
    if (e.keyCode == 32) {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var url = tabs[0].url;
        document.getElementById("Link").value = url;
        // use `url` here inside the callback because it's asynchronous!
      });
    }

    if (e.keyCode == 8) {
      document.getElementById("Link").value = '';
    }
  }

  document.getElementById("Link").addEventListener("keydown", handleKeys);


  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = document.getElementById("Name").value;
    var date = document.getElementById("Date").value;
    var d = new Date(document.getElementById("Date").valueAsDate);
    //Date formatting
    var month = d.getMonth()+1;
    var day = d.getDate()+1;
    var year = d.getFullYear();
    var dateString = months[month] + " " + day + " ";
    var link = document.getElementById("Link").value;
    //Remove button formatting
    //Some slick string manipulation to get the link tag to work correctly
    if (name != '') {
      if (isUrl(link)==false) {
        list.innerHTML += '<li id=' + name + '>' + name +': ' + dateString + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '</li>';
        localStorage.setItem('tasklist', list.innerHTML);
      }
      else {
      list.innerHTML += '<li id=' + name + '>' + '<a target="_blank" href=' + link + '>' + name + '</a>' +': ' + dateString + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '</li>';
      localStorage.setItem('tasklist', list.innerHTML);
      }
    }
    localStorage.setItem('tasklist', list.innerHTML);
    console.log(document.getElementById(name));
    buttons = document.getElementsByClassName('Remove');
    numB = buttons.length;
    for (var i = 0; i < numB; i += 1) {
        buttons[i].addEventListener('click', function () {
          lists = document.getElementsByTagName('li');
          this.parentElement.remove();
          localStorage.setItem('tasklist', list.innerHTML);
        });
    }
    document.getElementById("Name").value = "";
    document.getElementById("Name").focus();
  //localStorage.clear();

  });

  var saved = localStorage.getItem('tasklist');
  if (saved) {
  	list.innerHTML = saved;
  };
});
