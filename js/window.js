window.onload=function(){
  document.getElementById("Finish").click();
  document.getElementById("Link").focus();
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var url = tabs[0].url;
    document.getElementById("Link").value = url;
  });
};

function isUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }

  return true;
}

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

function changePrettyDate() {
  var prettyDate = document.getElementById("prettyDate");
  var date = document.getElementById("Date").value;
  var d = new Date(document.getElementById("Date").value);
  //Date formatting
  var month = parseInt(date.slice(5,7));
  var day = parseInt(date.slice(8,10));
  var year = parseInt(date.slice(0,4));
  var dateString = months[month] + " " + day + " ";
  prettyDate.innerHTML = dateString;
}

function changeTitle() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var title = tabs[0].title;
    var url = tabs[0].url;
    document.getElementById("LinkLabel").innerHTML = title;
    var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url
    document.getElementById("FAVICON").setAttribute("src", favicon);
  });
}
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

document.addEventListener("DOMContentLoaded", function(event) {
  changeTitle();
  document.getElementById("Date").valueAsDate = new Date();
  var form = document.getElementById("aInfo");
  var list = document.getElementById("taskList");
  changePrettyDate();
  function handleKeys(e) {
    //Space key pressed
    if (e.keyCode == 32) {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var url = tabs[0].url;
        document.getElementById("Link").value = url;
        // use `url` here inside the callback because it's asynchronous!
      });
    }
    //Backspace pressed
    if (e.keyCode == 8) {
      document.getElementById("Link").value = ' ';
    }
  }

  document.getElementById("Link").addEventListener("keydown", handleKeys);
  document.getElementById("Date").addEventListener('change', changePrettyDate);
  document.getElementById("Link").addEventListener('change', function () {
    if (isUrl(document.getElementById("Link").value)==false) {
      document.getElementById("LinkLabel").innerHTML = '';
      document.getElementById("FAVICON").setAttribute("src", '');
    }
    else {
      changeTitle();
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = document.getElementById("Name").value;
    var date = document.getElementById("Date").value;
    //Date formatting
    var month = parseInt(date.slice(5,7));
    var day = parseInt(date.slice(8,10));
    var year = parseInt(date.slice(0,4));
    var correctD = new Date(Date.UTC(year, month, day+1));
    console.log(correctD);
    var dateString = months[month] + " " + day + " ";
    var link = document.getElementById("Link").value;
    //Number of days left calculation

    //Remove button formatting
    //Some slick string manipulation to get the link tag to work correctly
    if (name != '') {
      if (isUrl(link)==false) {
        list.innerHTML += '<li id=' + name + '>' + '<div class=item id=item>' + name +': ' + '<label class=dateStr id=' + String(correctD).replace(/ /g, 'ok') + '>' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '<div>' + '</li>';
        localStorage.setItem('tasklist', list.innerHTML);
      }
      else {
      localStorage.setItem('tasklist', list.innerHTML);
      list.innerHTML += '<li id=' + name + '>' + '<div class=item id=item>' + '<a target="_blank" href=' + link + '>' + name + '</a>' +': ' + '<label class=dateStr id=' + String(correctD).replace(/ /g, 'ok') + '>' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '<div>' + '</li>';
      }
      document.getElementById("Name").value = "";
      document.getElementById("Link").value = "";
      document.getElementById("Link").focus();
    }
    localStorage.setItem('tasklist', list.innerHTML);
    buttons = document.getElementsByClassName('Remove');
    numB = buttons.length;
    for (var i = 0; i < numB; i += 1) {
        buttons[i].addEventListener('click', function () {
          lists = document.getElementsByTagName('li');
          //target is the li element
          var target = this.parentElement.parentElement;
          target.style.opacity = '0';
          setTimeout(function(){target.remove(); localStorage.setItem('tasklist', list.innerHTML);}, 250);
//          this.parentElement.parentElement.remove();
          //localStorage.setItem('tasklist', list.innerHTML);
        });
    }

    tills = document.getElementsByClassName("daysTill");
    dates = document.getElementsByClassName("dateStr");
    len = tills.length;

    for (var i = 0; i < len; i += 1) {
      var today = new Date();
      var originalID = dates[i].id;
      var dateInfo = originalID.replace(/ok/g, ' ');
      var storedDate = new Date(dateInfo);
      //console.log(storedDate);
      tills[i].innerHTML = dateDiffInDays(today, storedDate);
    }



  //localStorage.clear();

  });

  var saved = localStorage.getItem('tasklist');
  if (saved) {
  	list.innerHTML = saved;
  };
});
