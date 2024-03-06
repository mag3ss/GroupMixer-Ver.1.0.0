import './style.css';
import './app.css';

document.addEventListener('DOMContentLoaded', function () {
  var resultArray = [];
  var listCollection = document.querySelector('.list-collection');
  var leftSide = document.getElementById('bottomRight');

  document.getElementById('skapaNamnLista').addEventListener('click', function () {
    var inputString = document.getElementById('namnLista').value;
    resultArray = splitString(inputString);
    renderList();
  });

  listCollection.addEventListener('click', function (event) {
    var clickedElement = event.target;
    var string = clickedElement.textContent;

    if (event.button === 0) {
      // Left-click (edit)
      handleEditClick(string, clickedElement);
    } else if (event.button === 2) {
      // Right-click (delete)
      handleDeleteClick(string, clickedElement);
    }
  });

  leftSide.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    var clickedElement = event.target;
    var string = clickedElement.textContent;

    if (event.button === 2 && clickedElement.className === 'child') {
      // Right-click on child div within container
      var container = clickedElement.parentNode;
      handleDeleteClick(string, clickedElement);
      // Check if container has no children, then remove it
      if (container.childNodes.length === 1) {
        leftSide.removeChild(container);
      }
    } else if (event.button === 2 && clickedElement.className === 'group-name') {
      // Right-click on group name
      var container = clickedElement.parentNode;
      handleDeleteClick(string, clickedElement);
      // Check if container has no children, then remove it
      if (container.childNodes.length === 1) {
        leftSide.removeChild(container);
      }
    }
  });

  leftSide.addEventListener('dblclick', function (event) {
    var clickedElement = event.target;
    var string = clickedElement.textContent;

    if (clickedElement.className === 'group-name') {
      // Double left-click on group name
      handleGroupEditClick(clickedElement);
    } else if (clickedElement.className === 'child') {
      // Double left-click on child name
      handleEditClick(string, clickedElement);
    }
  });

  document.getElementById('createGroup').addEventListener('click', function () {
    var grupperValue = document.getElementById('grupper').value;
    // leftSide.innerHTML = '';

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
      container.className = 'left-divcontainer';

      // Create a div for the group name
      var groupNameDiv = document.createElement('div');
      groupNameDiv.className = 'group-name';
      groupNameDiv.textContent = 'Group ' + (i + 1);
      container.appendChild(groupNameDiv);

      // Calculate the number of div children in the current container
      var containerSize = (i === numContainers - 1) ? lastContainerSize : grupperValue;

      // Select div children from shuffled workingArray
      var containerStrings = workingArray.splice(0, containerSize);

      containerStrings.forEach(function (str) {
        var div = document.createElement('div');
        div.className = 'child';
        div.textContent = str;
        container.appendChild(div);
      });

      leftSide.appendChild(container);
    }
  });

  document.getElementById('copy').addEventListener('click', function () {
    var clipboardText = '';

    document.querySelectorAll('.left-divcontainer').forEach(function (groupContainer) {
      var groupName = groupContainer.querySelector('.group-name').textContent;
      clipboardText += groupName + '\n';

      groupContainer.querySelectorAll('.child').forEach(function (child) {
        clipboardText += child.textContent + '\n';
      });

      clipboardText += '\n'; // Empty line between groups
    });

    copyToClipboard(clipboardText);
    console.log('Copied to clipboard:', clipboardText);
  });

  function handleGroupEditClick(groupNameElement) {
    var newName = prompt('Enter a new name:', groupNameElement.textContent);
    if (newName !== null) {
      groupNameElement.textContent = newName;
    }
  }

  function handleEditClick(string, clickedElement) {
    var newName = prompt('Enter a new name:', string);
    if (newName !== null) {
      if (clickedElement.className === 'child') {
        // Update the text content of the child div
        clickedElement.textContent = newName;
      } else if (clickedElement.className === 'group-name') {
        // Update the text content of the group name div
        clickedElement.textContent = newName;
      }
      resultArray[resultArray.indexOf(string)] = newName;
      renderList();
      console.log(resultArray);
    }
  }

  function handleDeleteClick(string, clickedElement) {
    // Handle right-click to delete
    resultArray = resultArray.filter(item => item !== string);

    // Remove the specific child div within the container or list item
    clickedElement.parentNode.removeChild(clickedElement);

    // Re-render the list and containers to reflect the changes
    renderList();
    console.log(resultArray);
  }

  function renderList() {
    listCollection.innerHTML = '';
    resultArray.forEach(function (string) {
      var listItem = document.createElement('div');
      listItem.className = 'list-item';
      listItem.textContent = string;
      listCollection.appendChild(listItem);
    });
  }

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

  function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
});


