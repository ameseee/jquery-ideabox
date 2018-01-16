function IndexCard(title, body, id) {
  this.title = title;
  this.body = body;
  this.quality = 'swill';
  this.id = id || Date.now();
}

function updateTitle() {
  const $updatedTitle = $(this).parent().find('h3').text();
  const id = $(this).parent().prop('id');
  const specificCard = JSON.parse(localStorage.getItem(id));
  specificCard.title = $updatedTitle;
  localStorage.setItem(id, JSON.stringify(specificCard));
}

function updateBody() {
  const $updatedBody = $(this).parent().find('.card-text').text();
  const id = $(this).parent().prop('id');
  const specificCard = JSON.parse(localStorage.getItem(id));
  specificCard.body = $updatedBody;
  localStorage.setItem(id, JSON.stringify(specificCard));
}

function build(newIndexCard) {
  const newTitle = newIndexCard.title;
  const newBody = newIndexCard.body;
  const newQuality = newIndexCard.quality;
  const newId = newIndexCard.id;
  $('.bottom-container').prepend(`<article id="${newId}" class="card">
     <h3 class="card-title" contenteditable="true">${newTitle}</h3>
     <div class="delete"></div>
     <p class="card-text" contenteditable="true">${newBody}</p>
     <div class="up-vote"></div>
     <div class="down-vote"></div>
     <p class="quality">quality: <span id="quality-text">${newQuality}</span></p>
   </article>`);
  $('.card-title').on('blur', updateTitle);
  $('.card-text').on('blur', updateBody);
}

function populateDOM(toDisplay) {
  toDisplay.forEach(item => build(item));
}

function populateIndexCardArray() {
  const objectKeys = Object.keys(localStorage);
  const toDisplay = objectKeys.map(uniqueId => JSON.parse(localStorage[uniqueId]));

  populateDOM(toDisplay);
}

populateIndexCardArray();

function saveBtnOn() {
  $('.save-btn').attr('disabled', false);
}

$('#idea-info').on('input', saveBtnOn);

function addIndexCardToLocalStorage(newIndexCard) {
  const stringifiedIndexCard = JSON.stringify(newIndexCard);
  localStorage.setItem(newIndexCard.id, stringifiedIndexCard);
}

function clearInputFields() {
  $('#idea-title').val('');
  $('#idea-info').val('');
  $('.save-btn').attr('disabled', true);
}

function clickSave(e) {
  e.preventDefault();
  const title = $('#idea-title').val();
  const body = $('#idea-info').val();
  const newIndexCard = new IndexCard(title, body);
  build(newIndexCard);
  addIndexCardToLocalStorage(newIndexCard);
  clearInputFields();
}

$('.save-btn').on('click', clickSave);

function deleteIdea() {
  $(this).parent().remove();
  localStorage.removeItem($(this).parent().prop('id'));
}

$('.bottom-container').on('click', '.delete', deleteIdea);

function downVote() {
  const $quality = $(this).parent().find('span').text();
  const id = $(this).parent().prop('id');
  const specificCard = JSON.parse(localStorage.getItem(id));
  if ($quality === 'genius') {
    $(this).parent().find('span').text('plausible');
    specificCard.quality = 'plausible';
    localStorage.setItem(id, JSON.stringify(specificCard));
  } else if ($quality === 'plausible') {
    $(this).parent().find('span').text('swill');
    specificCard.quality = 'swill';
    localStorage.setItem(id, JSON.stringify(specificCard));
  }
}

$('.bottom-container').on('click', '.down-vote', downVote);

function upVote() {
  const $quality = $(this).parent().find('span').text();
  const id = $(this).parent().prop('id');
  const specificCard = JSON.parse(localStorage.getItem(id));
  if ($quality === 'swill') {
    $(this).parent().find('span').text('plausible');
    specificCard.quality = 'plausible';
    localStorage.setItem(id, JSON.stringify(specificCard));
  } else if ($quality === 'plausible') {
    $(this).parent().find('span').text('genius');
    specificCard.quality = 'genius';
    localStorage.setItem(id, JSON.stringify(specificCard));
  }
}

$('.bottom-container').on('click', '.up-vote', upVote);

// tryng to get this to work right now
function runSearch() {
  const searchedChar = $(this).val().toUpperCase();
  const objectKeys = Object.keys(localStorage);
  const toSearch = objectKeys.map(uniqueId => JSON.parse(localStorage[uniqueId]));

  const searchedArray = toSearch.filter((newIndexCard) => {
    return newIndexCard.title.toUpperCase().includes(searchedChar) || newIndexCard.body.toUpperCase().includes(searchedChar);
  });

  $('.bottom-container').empty();
  for (let i = 0; i < searchedArray.length; i++) {
    build(searchedArray[i]);
  }
}

$('.search').on('keyup', runSearch);
