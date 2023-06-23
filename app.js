{
  var actionClickNote = false
  var clicked = undefined
  var listData = []
}

function getUrlApi() {
  var apiNote = 'http://localhost:8080/note/api/v1'

  function returnApi() {
    return apiNote
  }

  return returnApi
}

const apiNote = getUrlApi()

function getDataToApi() {
  fetch(apiNote())
    .then(response => response.json())
    .then(value => {
      listData = value
      renderData(value)
    })
}

function addNote(data) {
  var options = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  }
  fetch(apiNote(), options)
    .then(response => response.json())
    .then(value => {
      listData = [value, ...listData]
      renderNewData(value)
    })
}

function updateNote(id, data) {
  if (id) {
    var options = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }
    fetch(apiNote() + `/${id}`, options)
      .then(response => response.json())
      .then(value => {
        listData = value
        renderData(value)
      })
  }
}

function removeNote(id) {
  event.stopPropagation()

  var options = {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    }
  }
  fetch(apiNote() + `/${id}`, options)
    .then(response => response.json())
    .then(value => {
      listData.splice(listData.findIndex(e => e['id'] === id), 1)
      removeElementData(id)
    })
}

function renderData(value) {
  var htmls = value.map((e) => {
    return `
      <div class="ngancach"></div>
      <div id="box-title-${e.id}" class="box-title" onmouseover='hover(${e.id})' onmouseout='unHover(${e.id})' onclick='clickShowNote(${e.id})'>
        <div class="content">
          <span class="span-title">${e.title === '' ? 'Không có tiêu đề' : e.title}</span>
          <div class="span-time-and-content">
            <span class="span-time">${convertTime(e.time)}</span>
            <span class="span-content">${e.content === '' ? 'Không có nội dung' : e.content}</span>
          </div>
        </div>
        <div id="button-close-${e.id}" class="button-close">
          <button type="button" class="btn-close" aria-label="Close" onclick='removeNote(${e.id})'></button>
        </div>
      </div>
    `
  })

  document.querySelector('#l-title').innerHTML = htmls.join('')
  changeColor(undefined, clicked)
}

function renderNewData(value) {
  document.querySelector('#l-title').innerHTML = `
    <div class="ngancach"></div>
    <div id="box-title-${value.id}" class="box-title" onmouseover='hover(${value.id})' onmouseout='unHover(${value.id})' onclick='clickShowNote(${value.id})'>
      <div class="content">
        <span class="span-title">${value.title === '' ? 'Không có tiêu đề' : value.title}</span>
        <div class="span-time-and-content">
          <span class="span-time">${convertTime(value.time)}</span>
          <span class="span-content">${value.content === '' ? 'Không có nội dung' : value.content}</span>
        </div>
      </div>
      <div id="button-close-${value.id}" class="button-close">
        <button type="button" class="btn-close" aria-label="Close" onclick='removeNote(${value.id})'></button>
      </div>
    </div>
  ` + document.querySelector('#l-title').innerHTML

  clickShowNote(value.id)
}

function removeElementData(id) {
  var element = document.querySelector(`#box-title-${id}`)
  element.previousElementSibling.remove()
  element.remove()
  checkNoteRemove(id)
}

function checkNoteRemove(id) {
  if (id === clicked) {
    document.querySelector('#input-title').value = ''
    document.querySelector('#content-show-content').value = ''

    var titleAll = document.querySelector('.title-all')
    titleAll.style.animationName = 'resize2-box-title';

    var showContent = document.querySelector('.show-content')
    showContent.style.display = 'none';
    showContent.style.animationName = 'resize2-show-content';

    clicked = undefined
  }
}

function hoverAdd() {
  document.querySelector('.icon-add').style.width = '23px';
  document.querySelector('.icon-add').style.height = '23px';
}

function unHoverAdd() {
  document.querySelector('.icon-add').style.width = '25px';
  document.querySelector('.icon-add').style.height = '25px';
}

function clickAddNote() {
  dataNew = {
    title: '',
    content: '',
    time: new Date()
  }
  addNote(dataNew)
}

function clickShowNote(id) {
  if (clicked && clicked === id) {
    changeColor(clicked, id)
    clicked = id
    var titleAll = document.querySelector('.title-all')
    titleAll.style.animationName = 'resize2-box-title';

    var showContent = document.querySelector('.show-content')
    showContent.style.display = 'none';
    showContent.style.animationName = 'resize2-show-content';

    clicked = undefined
  } else if (id) {
    
    changeColor(clicked, id)
    clicked = id

    var titleAll = document.querySelector('.title-all')
    titleAll.style.animationName = 'resize1-box-title';

    var showContent = document.querySelector('.show-content')
    showContent.style.display = 'block';
    showContent.style.animationName = 'resize1-show-content';

    var element = listData.find(e => e['id'] === id)

    let data = {
      title: element['title'],
      content: element['content']
    }

    document.querySelector('#input-title').value = data.title
    document.querySelector('#content-show-content').value = data.content
    
    document.querySelector('#input-title').focus()
  }
}

function hover(id) {
  if (id) {
    document.querySelector(`#button-close-${id}`).style.display = 'flex'
    document.querySelector(`#box-title-${id}`).style.backgroundColor = '#f1f1f1e3'
  }
}

function unHover(id) {
  document.querySelector(`#button-close-${id}`).style.display = 'none'
  if (id !== clicked) {
    document.querySelector(`#box-title-${id}`).style.backgroundColor = '#ffffff'
  }
}

function changeColor(id, idNew) {
  if (id) {
    document.querySelector(`#box-title-${id}`).style.backgroundColor = '#ffffff'
  }
  if (idNew) {
    document.querySelector(`#box-title-${idNew}`).style.backgroundColor = '#f1f1f1e3'
  }
}

function convertTime(time) {
  var res = new Date(time)
  return `[${res.getHours()}:${res.getMinutes()} ${res.getUTCDate()}/${res.getMonth() + 1}/${res.getUTCFullYear()}]`
}

(function configInput() {
  var inputTitle = document.querySelector('#input-title')
  var inputContent = document.querySelector('#content-show-content')

  inputTitle.oninput = function() {
    var data = {
      title: inputTitle.value,
      content: inputContent.value
    }
    updateNote(clicked, data)
  }
  
  inputContent.oninput = function() {
    var data = {
      title: inputTitle.value,
      content: inputContent.value
    }
    updateNote(clicked, data)
  }
})()

function start() {
  getDataToApi()
}

start()