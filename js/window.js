var first = false;
window.onload = function() {
  // document.getElementById('Name').value = 'abcdefgK';
  console.log("load");
  // document.getElementById("aInfo").addEventListener('submit', function() {
  //   event.preventDefault();
  // });
  // setTimeout(function() {
  //   document.getElementById("aInfo").submit()
  // }, 250);
  first = true;
  document.getElementById("DONEDONE").click();
  document.getElementById("Name").value = localStorage.getItem('nameField');
  if (document.getElementById("Name").value == "") {
    document.getElementById("Name").style["border-bottom"] = "2px solid red";
  }
  // document.getElementById("aInfo").submit();
  console.log('otherload');
  // document.getElementById('abcdefgK').remove();
  document.getElementById("Name").focus();

};


//Get month, day, and year given a date in input form (ex: 2005-9-12)
//Acess with .month, .day, and .year properties of returned object
function getMDY(d) {
  var month = parseInt(d.slice(5, 7));
  var day = parseInt(d.slice(8, 10));
  var year = parseInt(d.slice(0, 4));

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

  } else {
    return false;
  }
}


//Takes out the < and > characters from a string to prevent input fields from doing any stupid tricks with HTML.
//We also filter out the 'javascript:' prefix just to be safe.
function filter(string) {
  var given = string.replace("javascript:", "");
  if (given.substring(given.length - 3, given.length) == '.js') {
    given = given.slice(0, -3);
  }

  var blackListedCharacters = ['>', '<', '"', "'", '`', ';'];
  var finished = given;
  for (character of blackListedCharacters) {
    finished = finished.replace(new RegExp(character, 'g'), '');
  }
  return finished;
}

//Thx stack overflow lol
//When called on a Date object, will return a YYYY-MM-DD string based on the date.
Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
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
  var correctD = new Date(Date.UTC(date.year, date.month - 1, date.day + 1));
  var dateString = days[correctD.getDay()] + ", " + months[date.month] + " " + date.day + " ";
  prettyDate.innerHTML = dateString;
}

function changeTitle() {
  chrome.tabs.query({
    active: true,
    highlighted: true
  }, tabs => {
    console.log(tabs);
    //If the url/titles are not valid, set them to blank and handle them accordingly (set favicon image and title field to blank.)
    try {

      var title = tabs[0].title;
      var url = tabs[0].url;
    } catch {
      var title = "";
      var url = "";
    }
    document.getElementById("LinkLabel").innerHTML = filter(title);
    if (url != "") {
      var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url;
    } else {
      var favicon = "";
    }
    document.getElementById("FAVICON").setAttribute("src", favicon);
  });
}

function changeTitleExtUrl(url) {

  document.getElementById("LinkLabel").innerHTML = "";
  document.getElementById("FAVICON").setAttribute("src", "");

  if (url != "") {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); //Async as shown by last parameter
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) { //check if status == complete
        var htmlResponse = xhr.responseText;

        var title = filter(htmlResponse.match("<title>(.*?)</title>")[1]);
        document.getElementById("LinkLabel").innerHTML = title;
        if (url != "") {
          var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url;
        } else {
          var favicon = "";
        }
        document.getElementById("FAVICON").setAttribute("src", favicon);
        return title;
      }
    }
    xhr.send();
  } else {
    document.getElementById("LinkLabel").innerHTML = "";
    document.getElementById("FAVICON").setAttribute("src", "");
  }



}
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function checkIfMarked(listChildren) {
  var marked = false;
  listChildren.forEach(function(child) {
    if (child.innerHTML == 'Unmark') {
      marked = true;
    }
  });

  return marked;
}

function resetForm() {
  chrome.tabs.query({
    active: true,
    highlighted: true
  }, tabs => {
    var url = tabs[0].url;
    document.getElementById("Link").value = url;
    // use `url` here inside the callback because it's asynchronous!
  });
  changeTitle();
  document.getElementById("Date").valueAsDate = new Date();
  changePrettyDate();
  document.getElementById("Name").value = "";
}



var activeTab = 0;
document.addEventListener("DOMContentLoaded", function(event) {
  //Autofill url of open tab
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, tabs => {
    try {
      activeTab = tabs[0];
      var url = tabs[0].url;
    } catch {
      var url = "";
    }
    document.getElementById("Link").value = url;
  });
  changeTitle();
  // document.getElementById("Finish").click();
  document.getElementById("Date").valueAsDate = new Date();
  date = getMDY(document.getElementById("Date").value);
  var form = document.getElementById("aInfo");
  var list = document.getElementById("taskList");
  changePrettyDate();

  function handleKeys(e) {
    //Space key pressed
    if (e.keyCode == 32) {
      chrome.tabs.query({
        active: true,
        highlighted: true
      }, tabs => {
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
  document.getElementById("Name").addEventListener("change", function() {
    if (document.getElementById("Name").value == "") {
      document.getElementById("Name").style["border-bottom"] = "2px solid red";
    } else {
      document.getElementById("Name").style["border-bottom"] = "2px solid green";
    }

    localStorage.setItem('nameField', document.getElementById("Name").value);
  });
  document.getElementById("Date").addEventListener('change', changePrettyDate);
  document.getElementById("Link").addEventListener('change', function() {
    if (isUrl(document.getElementById("Link").value) == false) {
      console.log('tf are u doing my guy');
      document.getElementById("LinkLabel").innerHTML = '';
      document.getElementById("FAVICON").setAttribute("src", '');
    } else {
      console.log(activeTab.url);
      console.log(document.getElementById("Link").value);
      if (activeTab.url == document.getElementById("Link").value) {
        console.log('regular title change');
        changeTitle();
      } else {
        console.log('ext;')
        changeTitleExtUrl(document.getElementById("Link").value);
      }

    }
  });

  function clr() {
    chrome.notifications.clear('tst');
  }

  var editingFlag = false; //A boolean flag to use later
  var itemChanged = 0;
  // var bg = 0; //A flag that tells us the color of the item BEFORE changes are made to the background color.
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var name = filter(document.getElementById("Name").value).trim();
    var date = document.getElementById("Date").value;
    //Date formatting
    var month = parseInt(date.slice(5, 7));
    var day = parseInt(date.slice(8, 10));
    var year = parseInt(date.slice(0, 4));
    var correctD = new Date(Date.UTC(year, month - 1, day + 1));
    var dateString = days[correctD.getDay()] + ", " + months[month] + " " + day + " ";
    var link = document.getElementById("Link").value;
    var items = document.getElementsByClassName('item');
    var textBoxes = [document.getElementById('Link'), document.getElementById('Date'), document.getElementById('Name')];
    var editLabel = document.getElementById('editLabel');
    var cancel = document.getElementById("Cancel");

    console.log(link);

    function setVisualtoNormal() {
      //Reverts any visual changes caused by edit button
      editLabel.style.display = 'none';
      textBoxes.forEach(function(box) {
        box.style.backgroundColor = '#ffffff';
      });

      var itemsAsArray = Array.prototype.slice.call(items);
      itemsAsArray.forEach(function(item) {
        var children = Array.prototype.slice.call(item.children);
        // console.log(marked);
        switch (checkIfMarked(children)) {
          case false:
            item.style.backgroundColor = '#ffffff';
            break;
          case true:
            item.style.backgroundColor = '#00f2ce';
        }
      });
      // console.log(itemChanged);
      // itemChanged.backgroundColor = '#ffffff';
      cancel.style.display = 'none';

      document.getElementById('DONEDONE').innerHTML = 'Finish';
    }
    var duplicateName = false;
    for (item of items) {
      if (item.parentElement.id == name) {
        duplicateName = true;
      } else {
        duplicateName = false;
      }
    }
    if (name != '') { //EDIT: turns out ids CAN have spaces, u just have to put quotes around the id. Well guess what too bad I am so not going to go through the entire thing just to not okokokokokokok
      if (!duplicateName) {
        if (isUrl(link) == false) {
          //The class of the li element tells whether the li is 'marked' or not                                                                                      //inject date into id lol. ids cant have spaces so we replace the spaces with "ok", then we replace the oks with spaces again when we want to decode.
          var added = '<li id=' + '"' + name + '">' + '<div class=item id=item>' + '<span id="nameBox">' + name + ': ' + '</span>' + '<label class=dateStr id="' + correctD + '">' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '&nbsp&nbsp' + '<button type=button class=edit>Edit</button>' + '&nbsp&nbsp' + '<button type=button class=mark>Mark</button>' + '<div>' + '</li>';
        } else {
          var added = '<li id=' + '"' + name + '">' + '<div class=item id=item>' + '<span id="nameBox">' + '<a target="_blank" href=' + link + '>' + name + '</a>' + '</span>' + ': ' + '<label class=dateStr id="' + correctD + '">' + dateString + '</label>' + '<strong>(<label class=daysTill>' + '</label>)</strong>' + '&nbsp' + '<button type=button class=Remove id=' + name + '>' + 'X' + '</button>' + '&nbsp&nbsp' + '<button type=button class=edit>Edit</button>' + '&nbsp&nbsp' + '<button type=button class=mark>Mark</button>' + '<div>' + '</li>';
        }

        //Change innerhtml of mark button to 'unmark' if the button was previously marked before editingFlag
        // console.log(itemChanged.children);
        if (editingFlag == true) {
          // document.getElementById(name).style.opacity = 0;
          localStorage.setItem('tasklist', list.innerHTML);

          if (checkIfMarked(Array.prototype.slice.call(itemChanged.children[0].children))) {
            added = added.replace('<button type=button class=mark>Mark</button>', '<button type=button class=mark>Unmark</button>');
            console.log(added);

          }

          var itemString = itemChanged.outerHTML;
          var current = localStorage.getItem('tasklist');
          var replaceHtml = current.replace(itemString, added);
          list.innerHTML = replaceHtml;

          setVisualtoNormal();
          editingFlag = false;
        } else {
          list.innerHTML += added;
        }
        document.getElementById("Name").value = "";
        document.getElementById("Link").value = "";
        document.getElementById("Name").focus();
        resetForm();
      } else {
        document.getElementById("Name").style["border-bottom"] = "2px solid red";
        setTimeout(function() {
          document.getElementById("Name").style["border-bottom"] = "2px solid green";
        }, 1000);
      }
    } //her her her
    else {
      if (link != "") {
        // name =
      }
    }


    // localStorage.setItem('tasklist', list.innerHTML);
    // chrome.storage.local.set({'tasklist': list.innerHTML});
    //REMOVE BUTTON (X)
    buttons = document.getElementsByClassName('Remove');
    numB = buttons.length;
    for (button of buttons) {
      button.addEventListener('click', function() {
        lists = document.getElementsByTagName('li');
        //target is the li element
        var target = this.parentElement.parentElement;
        target.style.opacity = '0';
        setTimeout(function() {
          target.remove();
          localStorage.setItem('tasklist', list.innerHTML);
        }, 250);
        //          this.parentElement.parentElement.remove();
        //localStorage.setItem('tasklist', list.innerHTML);
      });
    }

    cancel.addEventListener('click', function() {
      setVisualtoNormal();
      resetForm();
      editingFlag = false;
    });



    var editButtons = document.getElementsByClassName('edit');



    //Yes, I use single and double quotes interchangably!
    //EDIT BUTTON
    for (button of editButtons) {
      // var button = editButtons[i];
      button.addEventListener('click', function() {
        //Reverting visual changes in case someone pressed a different edit assignment first.
        itemChanged = this.parentElement.parentElement;
        setVisualtoNormal();
        //Making the (Editing) h2 visible and turn the text boxes green.
        editLabel.style.display = 'inline-block';
        textBoxes.forEach(function(box) {
          box.style.backgroundColor = '#5af558';
        });
        cancel.style.display = 'inline-block';


        //Extracting the assignment info that the person selected to edit.
        var placeDate = new Date();
        var placeLink = '';
        var placeName = this.parentElement.parentElement.id;
        console.log(this.parentElement.children);
        for (child of this.parentElement.children[0].children) {
          if (child.tagName == "A") {
            placeLink = child.href;
            console.log(placeLink);
          }
        }

        for (child of this.parentElement.children) {
          if (child.tagName == "LABEL") {
            placeDate = child.id;
          }
        }


        //Autofill the date and name values with the pre existing ones for that assignment.
        var pDate = new Date(placeDate);
        var dStr = pDate.yyyymmdd();
        document.getElementById('Date').value = dStr;
        changePrettyDate();
        document.getElementById('Name').value = placeName;
        document.getElementById('Link').value = placeLink;
        console.log(placeLink);
        changeTitleExtUrl(placeLink);
        // changeTitle();
        // changePrettyDate();

        this.parentElement.style.backgroundColor = '#5af558';
        document.getElementById('DONEDONE').innerHTML = 'Finish Editing';
        editingFlag = true;
      });
    }



    //MARK BUTTON
    var markButtons = document.getElementsByClassName('mark');
    for (markButton of markButtons) {
      // var markButton = markButtons[i];
      markButton.addEventListener('click', function() {
        //We use the buttons innerHTML property as our boolean flag.

        switch (this.innerHTML) {
          case 'Mark':
            this.parentElement.style.backgroundColor = '#00f2ce';
            this.innerHTML = 'Unmark';
            break;
          case 'Unmark':
            this.parentElement.style.backgroundColor = '#ffffff';
            this.innerHTML = 'Mark';
        }
        console.log(this.parentElement.parentElement.class);
        console.log(this.parentElement.parentElement);
        localStorage.setItem('tasklist', list.innerHTML);

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
      } else if (remainingDays == 0) {
        items[i].style.color = "DarkRed";
        items[i].style.fontWeight = 900;
        tills[i].innerHTML = 'TODAY';
        tills[i].style.color = "red";
      } else if (remainingDays < 0) {
        items[i].style.color = "red";
        items[i].style.fontWeight = 900;
        tills[i].innerHTML = 'OVERDUE';
        tills[i].style.color = "red";
      }

    }

    //Hide right click contextmenu so that right click scrolling is actually usable.
    document.addEventListener('contextmenu', event => event.preventDefault());

    links = document.getElementsByTagName('a');
    var scroll = 0; //FLAGS WHOHOOO
    for (item of items) {
      item.addEventListener("mousedown", function(event) {
        // console.log(item);
        var width = this.children[0].offsetWidth;
        // this.children[0].style.transform = 'translateX(-1000px)';
        //Handle the autoscroll on right click feature.
        var splits = Math.ceil(width / 1160) + 1;
        if (event.button == 2) {
          if (scroll == splits) {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
            scroll = 0;
          } else {
            window.scrollTo({
              top: 0,
              left: window.scrollX + (width / splits),
              behavior: 'smooth'
            });
            scroll = scroll + 1;
          }
          if (window.scrollX >= width) {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
            scroll = 0;
          }

        }
      });
    }

    console.log(first);

    if (!first) {
      localStorage.setItem('nameField', '');
    }

    if (first) {
      first = false;
    }
    // chrome.storage.local.set({'tasklist': list.innerHTML});
    localStorage.setItem('tasklist', list.innerHTML);
  });


  if (localStorage.getItem('tasklist')) {
    list.innerHTML = localStorage.getItem('tasklist');
  }

});