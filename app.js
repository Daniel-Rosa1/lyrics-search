const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const fetchData = async url =>{
  const response = await fetch(url)
  return await response.json()
}

const getMoreSongs = async url => {
  const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)
  
  insertSongsIntoPage(data)
}

const inserNextAndPrevButton = ({prev, next}) => {
  prevAndNextContainer.innerHTML = `
    ${prev ? `<button class="btn" onClick="getMoreSongs('${prev}')">Anteriores</button>` : ''}
    ${next ? `<button class="btn" onClick="getMoreSongs('${next}')">Próximas</button>` : ''}
    `
}

const insertSongsIntoPage = ({data, prev, next}) =>{
  songsContainer.innerHTML = data.map(({artist: {name}, title}) => `
  <li class="song">
    <span class="song-artist"><strong>${name}</strong> - ${title}</span>
    <button class="btn" data-artist="${name}" data-song-title="${title}">
    Ver letra</button>
  </li>
  `).join("")

  if(prev || next) {
    inserNextAndPrevButton({prev , next})
    return
  }

  prevAndNextContainer.innerHTML = ''
}

const fechSongs = async term =>{
  const data = await fetchData(`${apiURL}/suggest/${term}`)
  insertSongsIntoPage(data)
}

const handleFormSubmit = event => {
  event.preventDefault()

  const searchTerm = searchInput.value.trim()
  searchInput.value = ''
  searchInput.focus()

  if(!searchTerm){
    songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
    return
  }
  
  fechSongs(searchTerm)
}

form.addEventListener('submit', handleFormSubmit)

const insertLyricsIntoPage = ({lyrics, artist, songTitle}) => {
  songsContainer.innerHTML = `
    <li class="lyrics-container">
      <h2><strong>${songTitle}</strong> - ${artist}</h2>
      <p class="lyrics">${lyrics}</p>
    </li>
  `
}

const fetchLyrics = async (artist, songTitle) =>{
  const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`)
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
  insertLyricsIntoPage({lyrics, artist, songTitle})
}

const handleSongsContainerClick = event =>{
  const clickedElement = event.target

  if(clickedElement.tagName === 'BUTTON'){
    const artist = clickedElement.getAttribute("data-artist")
    const songTitle = clickedElement.getAttribute('data-song-title')

    prevAndNextContainer.innerHTML = ''
    fetchLyrics(artist, songTitle)
  }
}

songsContainer.addEventListener('click', handleSongsContainerClick )