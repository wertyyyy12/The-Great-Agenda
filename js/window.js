window.onload=function() {
  document.getElementById("Finish").click();
  document.getElementById("Link").focus();
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var url = tabs[0].url;
    document.getElementById("Link").value = url;
  });
};

//Get month, day, and year given a date in input form (ex: 2005-9-12)
//Acess with .month, .day, and .year properties of returned object
function getMDY(d) {
  var month = parseInt(d.slice(5,7));
  var day = parseInt(d.slice(8,10));
  var year = parseInt(d.slice(0,4));

  var finaldate = {
    'month': month,
    'day': day,
    'year': year
  }

  return finaldate;
}

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
  date = getMDY(date);
  var dateString = months[date.month] + " " + date.day + " ";
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
  date = getMDY(document.getElementById("Date").value);
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

  function clr() {
    chrome.notifications.clear('tst');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = document.getElementById("Name").value;
    var date = document.getElementById("Date").value;
    //Date formatting
    var month = parseInt(date.slice(5,7));
    var day = parseInt(date.slice(8,10));
    var year = parseInt(date.slice(0,4));
    var correctD = new Date(Date.UTC(year, month-1, day+1));
    var dateString = months[month] + " " + day + " ";
    var link = document.getElementById("Link").value;

    //Remove button formatting
    //Some slick string manipulation to get the link tag to work correctly
    if (name != '') {                                                                                                   //EDIT: turns out ids CAN have spaces, u just have to put quotes around the id. Well guess what too bad I am so not going to go through the entire thing just to not okokokokokokok
      if (isUrl(link)==false) {                                                                                         //inject date into id lol. ids cant have spaces so we replace the spaces with "ok", then we replace the oks with spaces again when we want to decode.
        list.innerHTML += '<li id=' + '"' + name + '">' + '<div class=item id=item nm=' + '"' + name + '">' + name +': ' + '<label class=dateStr id=' + String(correctD).replace(/ /g, 'ok') + '>' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '<div>' + '</li>';
        // chrome.storage.local.set({'tasklist': list.innerHTML});
        // localStorage.setItem('tasklist', list.innerHTML);
      }
      else {
      // localStorage.setItem('tasklist', list.innerHTML);
      // chrome.storage.local.set({'tasklist': list.innerHTML});
      list.innerHTML += '<li id=' + '"' + name + '">' + '<div class=item id=item nm=' + '"' + name + '">' + '<a target="_blank" href=' + link + '>' + name + '</a>' +': ' + '<label class=dateStr id=' + String(correctD).replace(/ /g, 'ok') + '>' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '<div>' + '</li>';
      // localStorage.setItem('tasklist', list.innerHTML);
      }
      document.getElementById("Name").value = "";
      document.getElementById("Link").value = "";
      document.getElementById("Link").focus();
    }
    // localStorage.setItem('tasklist', list.innerHTML);
    // chrome.storage.local.set({'tasklist': list.innerHTML});
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
    items = document.getElementsByClassName("item");
    dates = document.getElementsByClassName("dateStr");
    len = tills.length;

    for (var i = 0; i < len; i += 1) {
      var today = new Date();
      var originalID = dates[i].id;
      var dateInfo = originalID.replace(/ok/g, ' ');
      var storedDate = new Date(dateInfo);
      remainingDays = dateDiffInDays(today, storedDate);
      tills[i].innerHTML = remainingDays;
      tills[i].id = remainingDays;
      if (remainingDays == 1) {
        tills[i].style.color = "red";
      }

      else if (remainingDays == 0) {
        items[i].style.color = "DarkRed";
        items[i].style.fontWeight = 900;
        tills[i].innerHTML = 'TODAY';
        tills[i].style.color = "red";
      }

      else if (remainingDays < 0) {
        items[i].style.color = "red";
        items[i].style.fontWeight = 900;
        tills[i].innerHTML = 'OVERDUE';
        tills[i].style.color = "red";
      }

    }

    // chrome.storage.local.set({'tasklist': list.innerHTML});
    localStorage.setItem('tasklist', list.innerHTML);
  });

  // chrome.storage.local.get(['tasklist'], function(saved) {
  //   if (saved.tasklist) {
  //   	list.innerHTML = saved.tasklist;
  //   }
  //
  // });
  if (localStorage.getItem('tasklist')) {
  list.innerHTML = localStorage.getItem('tasklist');
  }
});
