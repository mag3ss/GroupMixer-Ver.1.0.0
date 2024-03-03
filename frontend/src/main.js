import './style.css';
import './app.css';

var resultArray = [];
// Declare resultArray as a global variable
document.addEventListener('DOMContentLoaded', function () {
  const menuButton1 = document.getElementById("groupMaker");
  const menuButton2 = document.getElementById("colorWheel");
  
  const menu1 = document.getElementById("rightside");
  const menu2 = document.getElementById("rightside2");
  
  menuButton1.addEventListener('click', function () {
    if (menu1.style.display === "none" || menu1.style.display === "") {
      menu1.style.display = "flex";
      menu2.style.display = "none";
      console.log("Window 1 visible, Window 2 hidden");
    }
  });
  
  menuButton2.addEventListener('click', function () {
    if (menu2.style.display === "none" || menu2.style.display === "") {
      menu1.style.display = "none";
      menu2.style.display = "flex";
      console.log("Window 2 visible, Window 1 hidden");
    }
  });

  var button = document.getElementById('skapaNamnLista');
  var listCollection = document.querySelector('.list-collection');


  button.addEventListener('click', function () {
    var inputString = document.getElementById('namnLista').value;
    resultArray = splitString(inputString);
    listCollection.innerHTML = '';

    resultArray.forEach(function (string) {
      var listItem = document.createElement('div');
      listItem.className = 'list-item';
      listItem.textContent = string;
      listCollection.appendChild(listItem);

      // Right-click to delete
      listItem.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        resultArray = resultArray.filter(item => item !== string);

        // Check if listItem is a child of listCollection before removing
        if (listItem.parentNode === listCollection) {
          listCollection.removeChild(listItem);
        }

        // Check if listCollection has only one child, then remove the container
        if (listCollection.childNodes.length === 1) {
          var parentContainer = listCollection.parentNode;
          if (parentContainer && parentContainer.childNodes.length === 1) {
            parentContainer.parentNode.removeChild(parentContainer);
          }
        }

        console.log(resultArray);
      });

      // Double left-click to edit
      var clicks = 0;
      var timeout;
      listItem.addEventListener('click', function () {
        clicks++;
        if (clicks === 1) {
          timeout = setTimeout(function () {
            clicks = 0;
          }, 300);
        } else if (clicks === 2) {
          clearTimeout(timeout);
          clicks = 0;

          var newName = prompt('Enter a new name:', string);
          if (newName !== null) {
            resultArray[resultArray.indexOf(string)] = newName;
            listItem.textContent = newName;
            console.log(resultArray);
          }
        }
      });
    });
    console.log(resultArray);
  });

  document.getElementById('createGroup').addEventListener('click', function() {
    var grupperValue = document.getElementById('grupper').value;
    var leftSide = document.getElementById('bottomRight');
    leftSide.innerHTML = '';

    // Make a copy of resultArray
    var workingArray = resultArray.slice();

    // Shuffle the workingArray
    workingArray = shuffleArray(workingArray);

    // Calculate the total number of div children
    var totalDivs = workingArray.length;

    // Calculate the number of containers needed
    var numContainers = Math.ceil(totalDivs / grupperValue);

    // Calculate the number of div children in the last container
    var lastContainerSize = totalDivs % grupperValue || grupperValue;

    for (var i = 0; i < numContainers; i++) {
      var container = document.createElement('div');
      container.className = 'left-divcontainer'; // Change to 'left-divContainer' class for styling

      // Calculate the number of div children in the current container
      var containerSize = (i === numContainers - 1) ? lastContainerSize : grupperValue;

      // Select div children from shuffled workingArray
      var containerStrings = workingArray.splice(0, containerSize);

      containerStrings.forEach(function(str) {
        var div = document.createElement('div');
        div.className = 'child';
        div.textContent = str;
        container.appendChild(div);

        // Right-click to delete
        div.addEventListener('contextmenu', function (event) {
          event.preventDefault();
          resultArray = resultArray.filter(item => item !== str);

          // Check if div is a child of container before removing
          var parentContainer = div.parentNode;
          if (parentContainer === container) {
            container.removeChild(div);
            if (container.childNodes.length === 0) {
              leftSide.removeChild(container);
            }
          }});
        // Double left-click to edit
        var clicks = 0;
        var timeout;
        div.addEventListener('click', function () {
          clicks++;
          if (clicks === 1) {
            timeout = setTimeout(function () {
              clicks = 0;
            }, 300);
          } else if (clicks === 2) {
            clearTimeout(timeout);
            clicks = 0;

            var newName = prompt('Enter a new name:', str);
            if (newName !== null) {
              resultArray[resultArray.indexOf(str)] = newName;
              div.textContent = newName;
              console.log(resultArray);
            }
          }
        });
      });

      leftSide.appendChild(container);
    }
  });

  function splitString(inputString) {
    var resultArray = [];
    var currentWord = '';

    for (var i = 0; i < inputString.length; i++) {
      var currentChar = inputString[i];

      if (/[a-zA-Z]/.test(currentChar)) {
        currentWord += currentChar;
      } else {
        if (currentWord.length > 0) {
          resultArray.push(currentWord);
          currentWord = '';
        }
      }
    }

    if (currentWord.length > 0) {
      resultArray.push(currentWord);
    }

    return resultArray;
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
});