const $card = $('.card');
const $ideaTitle = $('#idea-title');
const $ideaBody = $('#idea-info');
let $qualityText;
const indexCardArray = [];

const IndexCard = function (title, body, id) {
  this.title = title;
  this.body = body;
  this.quality = 'swill';
  this.id = id || Date.now();
};

$('.save-btn').on('click', clickSave);
$('.bottom-container').on('click', '.up-vote', upVote);
$('.bottom-container').on('click', '.down-vote', downVote);
$ideaBody.on('input', saveBtnOn);
$('.search').on('keyup', runSearch);

populateIndexCardArray();
// populateDOM();

function populateIndexCardArray() {
  const objectKeys = Object.keys(localStorage);
  const toDisplay = objectKeys.map(uniqueId => JSON.parse(localStorage[uniqueId]));

  populateDOM(toDisplay);
}

function populateDOM(toDisplay) {
  toDisplay.forEach(item => build(item))
}

function saveBtnOn() {
  $('.save-btn').attr('disabled', false);
}

function clickSave (e) {
  e.preventDefault();
  let title = $ideaTitle.val();
  let body = $ideaBody.val();
  let newIndexCard = new IndexCard(title, body);
  build(newIndexCard);
  indexCardArray.push(newIndexCard);
  addIndexCardToLocalStorage(newIndexCard);
  clearInputFields();
}

function build(newIndexCard) {
  let newTitle = newIndexCard.title;
  let newBody = newIndexCard.body;
  let newQuality = newIndexCard.quality;
  let newId = newIndexCard.id;
  $('.bottom-container').prepend(
    `<article id="${newId}" class="card">
     <h3 class="card-title" contenteditable="true">${newTitle}</h3>
     <div class="delete"></div>
     <p class="card-text" contenteditable="true">${newBody}</p>
     <div class="up-vote"></div>
     <div class="down-vote"></div>
     <p class="quality">quality: <span id="quality-text">${newQuality}</span></p>
   </article>`
  );
  $('.card-title').on('blur', updateTitle);
  $('.card-text').on('blur', updateBody);
}

function addIndexCardToLocalStorage(newIndexCard) {
  let stringifiedIndexCard = JSON.stringify(newIndexCard);
  localStorage.setItem(newIndexCard.id, stringifiedIndexCard);
}

function clearInputFields() {
  $ideaTitle.val('');
  $ideaBody.val('');
  $('.save-btn').attr('disabled', true);
}

$('.bottom-container').on('click', '.delete', function () {
  $(this).parent().remove();
  localStorage.removeItem($(this).parent().prop('id'));
});

function downVote() {
  let $changeQuality = $(this).parent().find('span').text();
  let id = $(this).parent().prop('id');
  let specificCard = JSON.parse(localStorage.getItem(id));
  if ($changeQuality === 'genius') {
    $(this).parent().find('span').text('plausible');
    specificCard.quality = 'plausible';
    localStorage.setItem(id, JSON.stringify(specificCard));
  } else if ($changeQuality === 'plausible') {
    $(this).parent().find('span').text('swill');
    specificCard.quality = 'swill';
    localStorage.setItem(id, JSON.stringify(specificCard));
  }
}

function upVote() {
  let $changeQuality = $(this).parent().find('span').text();
  let id = $(this).parent().prop('id');
  let specificCard = JSON.parse(localStorage.getItem(id));
  if ($changeQuality === 'swill') {
    $(this).parent().find('span').text('plausible');
    specificCard.quality = 'plausible';
    localStorage.setItem(id, JSON.stringify(specificCard));
  } else if ($changeQuality === 'plausible') {
    $(this).parent().find('span').text('genius');
    specificCard.quality = 'genius';
    localStorage.setItem(id, JSON.stringify(specificCard));
  }
}

function updateBody() {
  let $updatedBody = $(this).parent().find('.card-text').text();
  let id = $(this).parent().prop('id');
  let specificCard = JSON.parse(localStorage.getItem(id));
  specificCard.body = $updatedBody;
  localStorage.setItem(id, JSON.stringify(specificCard));
}

function updateTitle() {
  let $updatedTitle = $(this).parent().find('h3').text();
  let id = $(this).parent().prop('id');
  let specificCard = JSON.parse(localStorage.getItem(id));
  specificCard.title = $updatedTitle;
  localStorage.setItem(id, JSON.stringify(specificCard));
}

function runSearch() {
  let search = $(this).val().toUpperCase();
  let searchedArray = indexCardArray.filter(function (newIndexCard) {
    return newIndexCard.title.toUpperCase().includes(search) || newIndexCard.body.toUpperCase().includes(search);
  });
  $('.bottom-container').empty();
  for (let i = 0; i < searchedArray.length; i++) {
    build(searchedArray[i]);
  }
}
