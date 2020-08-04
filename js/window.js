window.onload=function() {
  document.getElementById("Finish").click();
  document.getElementById("Link").focus();
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    try {
      var url = tabs[0].url;
    }
    catch {
      var url = "";
    }
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
  //url cant start with "javascript:"
  if (string.trim().substring(0, 11) != "javascript:") {
    try {
      new URL(string);
    } catch (_) {
      return false;
    }

    return true;

  }

  else {
    return false;
  }
}


//Takes out the < and > characters from a string to prevent input fields from doing any stupid tricks with HTML.
//We also filter out the 'javascript:' prefix just to be safe.
function filter(string) {
  if (string.trim().substring(0, 11) == "javascript:") {
    var given = string.replace("javascript:", "");
  }

  else {
    var given = string;
  }
  var modifyOne = given.replace(new RegExp('>', 'g'), '');
  var modifyTwo = modifyOne.replace(new RegExp('<', 'g'), '');
  return modifyTwo;
}

//Thx stack overflow lol
//When called on a Date object, will return a YYYY-MM-DD string based on the date.
Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
        ].join('-');
};


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

var days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};

function changePrettyDate() {
  var prettyDate = document.getElementById("prettyDate");
  var date = document.getElementById("Date").value;
  //
  // var d = new Date(document.getElementById("Date").value);
  date = getMDY(date);
  var correctD = new Date(Date.UTC(date.year, date.month-1, date.day+1));
  var dateString = days[correctD.getDay()] + ", " + months[date.month] + " " + date.day + " ";
  prettyDate.innerHTML = dateString;
}

function changeTitle() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //If the url/titles are not valid, set them to blank and handle them accordingly (set favicon image and title field to blank.)
    try {
      var title = tabs[0].title;
      var url = tabs[0].url;
    }
    catch {
      var title = "";
      var url = "";
    }
    document.getElementById("LinkLabel").innerHTML = filter(title);
    if (url != "") {
      var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url;
    }
    else {
      var favicon = "";
    }
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

  var editingFlag = false; //A boolean flag to use later
  var itemChanged = 0;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = filter(document.getElementById("Name").value);
    var date = document.getElementById("Date").value;
    //Date formatting
    var month = parseInt(date.slice(5,7));
    var day = parseInt(date.slice(8,10));
    var year = parseInt(date.slice(0,4));
    var correctD = new Date(Date.UTC(year, month-1, day+1));
    var dateString = days[correctD.getDay()] + ", " + months[month] + " " + day + " ";
    var link = document.getElementById("Link").value;
    var items = document.getElementsByClassName('item');
    var textBoxes = [document.getElementById('Link'), document.getElementById('Date'), document.getElementById('Name')];
    var editLabel = document.getElementById('editLabel');

    // //Handle the submission separately if we are in editing mode.
    // if (editingFlag == true) {
    //
    //
    //   // itemChanged.remove();
    //
    //
    // }


    if (name != '') {                                                                                                   //EDIT: turns out ids CAN have spaces, u just have to put quotes around the id. Well guess what too bad I am so not going to go through the entire thing just to not okokokokokokok
      if (isUrl(link)==false) {                                                                                         //inject date into id lol. ids cant have spaces so we replace the spaces with "ok", then we replace the oks with spaces again when we want to decode.
        var added = '<li id=' + '"' + name + '">' + '<div class=item id=item nm=' + '"' + name + '">' + name +': ' + '<label class=dateStr id="' + correctD + '">' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' +  '&nbsp&nbsp' + '<button type=button class=edit>Edit</button>' + '<div>' + '</li>';
        // chrome.storage.local.set({'tasklist': list.innerHTML});
        // localStorage.setItem('tasklist', list.innerHTML);
      }
      else {
      // localStorage.setItem('tasklist', list.innerHTML);
      // chrome.storage.local.set({'tasklist': list.innerHTML});
        var added = '<li id=' + '"' + name + '">' + '<div class=item id=item nm=' + '"' + name + '">' + '<a target="_blank" href=' + link + '>' + name + '</a>' +': ' + '<label class=dateStr id="' + correctD + '">' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '&nbsp&nbsp' +'<button type=button class=edit>Edit</button>' + '<div>' + '</li>';
      // localStorage.setItem('tasklist', list.innerHTML);
      }



      if (editingFlag == true) {
        //Revert visual changes.
        editLabel.style.display = 'none';
        textBoxes.forEach(function(box) {
          box.style.backgroundColor = '#ffffff';
        });

        var itemsAsArray = Array.prototype.slice.call(items);
        itemsAsArray.forEach(function(item) {
          item.style.backgroundColor = '#ffffff';
        });
        document.getElementById('Finish').innerHTML = 'Finish';
        // document.getElementById(name).style.opacity = 0;
        localStorage.setItem('tasklist', list.innerHTML);

        var itemString = itemChanged.outerHTML;
        var current = localStorage.getItem('tasklist');
        var replaceHtml = current.replace(itemString, added);

        console.log(itemString);
        console.log(added);
        console.log(replaceHtml);
        list.innerHTML = replaceHtml;

        var name = filter(document.getElementById("Name").value);
        console.log(name);
        document.getElementById(name).style.backgroundColor = '#42f557';
        // document.getElementById("myDIV").style.transition = "all 0.35s";
        setTimeout(function() {document.getElementById(name).style.backgroundColor = '#ffffff'; localStorage.setItem('tasklist', list.innerHTML);}, 250);
        editingFlag = false;
      }
      else {
          list.innerHTML += added;
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





    var editButtons = document.getElementsByClassName('edit');



    //Yes, I use single and double quotes interchangably!
    console.log(editButtons);
    for (var i = 0; i < editButtons.length; i += 1) {
      var button = editButtons[i];
      button.addEventListener('click', function () {
        //Making the (Editing) h2 visible and turn the text boxes green.
        editLabel.style.display = 'inline-block';
        textBoxes.forEach(function(box) {
          box.style.backgroundColor = '#5af558';
        });
        console.log(this);
        itemChanged = this.parentElement.parentElement;
        //Extracting the assignment info that the person selected to edit.
        console.log(this.parentElement.children);
        var placeDate = new Date();
        var placeName = this.parentElement.parentElement.id;
        for (child of this.parentElement.children) {
          if (child.tagName == "LABEL") {
            placeDate = child.id;
          }
        }

        console.log("EXTRACTED INFO:");
        console.log(placeDate);
        console.log(placeName);
        console.log("END");

        //Autofill the date and name values with the pre existing ones for that assignment.
        var pDate = new Date(placeDate);
        var dStr = pDate.yyyymmdd();
        console.log(dStr);
        document.getElementById('Date').value = dStr;
        document.getElementById('Name').value = placeName;

        this.parentElement.style.backgroundColor = '#5af558';
        document.getElementById('Finish').innerHTML = 'Finish Editing';
        editingFlag = true;

      });
    }





    tills = document.getElementsByClassName("daysTill");

    dates = document.getElementsByClassName("dateStr");
    len = tills.length;

    //Format assignment due date colors based on due dates.
    for (var i = 0; i < len; i += 1) {
      var today = new Date();
      var dateInfo = dates[i].id;
      // var dateInfo = originalID; //.replace(/ok/g, ' ');
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
