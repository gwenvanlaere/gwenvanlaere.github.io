/** @format */
// h> onload
// o> helper functions
// l> variables
// w> PHP
// s> options & input
// l> main search
/*intersection Observer*/
// l> playlist
// r> event listeners
/*drag & drop*/
// w> audio player
// r> audio event listeners
// h> player layout
// s> local storage
// y> equalizer

// h> ======================================================================================
// h> ======================================= onload =======================================
// h> ======================================================================================
window.onload = async function () {
    toggleLoader();
    //<demo> await getOrUpdateCovers('getCovers');
    await loadFolders();
    await wait(300);
    resetCurrentList();
    displayAllPlaylists();
    await wait(500);
    audio.volume = 0.5;
    songlist.firstElementChild.classList.toggle('playing');
    loadEqualizer();
    //<demo> checkTotalTracks();
    toggleLoader();
};
// o> ======================================================================================
// o> ================================== helper functions ==================================
// o> ======================================================================================
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const backToTop = (elem, position) => (elem.scrollTop = position);
const handleErrors = (response) => (response.ok ? response : alert(response));

async function loadFolders() {
    fetch('./files/allTracksPHP.json', { cache: 'no-cache' })
        .then(handleErrors)
        .then((response) => response.json())
        .then((blob) => (masterArray = [...blob]));
}
const toggleLoader = () => document.querySelector('#loader').classList.toggle('showing');
const toggleCover = () => document.querySelector('#showCover').classList.toggle('showing');

// l> ======================================================================================
// l> ====================================== variables =====================================
// l> ======================================================================================
const root = document.documentElement;
const songlist = document.querySelector('#songlist');
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const matches = document.querySelector('.matches');
const sizePlaylist = document.querySelector('.sizePlaylist');
const playlist = document.querySelector('#playlist');
const clearSearches = document.querySelector('#clearSearches');
const addAllBtn = document.querySelector('#addAll');
const allSelects = Array.from(document.querySelectorAll('.select'));
const wrapper = document.querySelector('.wrapper');
const infoList = document.querySelector('.infoList');
const playlistButtons = document.querySelector('.playlistButtons');
const createPlaylistBtn = document.querySelector('#createPlaylist');
const playlistInput = document.querySelector('#playlistInput');
const allPlaylists = document.querySelector('#allPlaylists');
const playlistHeader = document.querySelector('.playlistHeader');

// h> ======================================================================================
// h> ================================== global variables ==================================
// h> ======================================================================================

let filteredList = [];
let currentList = [];
let displayedList = [];
let shuffleList = [];
let searchValue = '';
let songPlaying = {};
let masterArray = [];
let logArray = [];
//<demo> let coverArray = [];
let coverArray = ['MLiR - People_Front Cover.jpg'];

// w> ======================================================================================
// w> ======================================== PHP ========================================
// w> ======================================================================================

const checkTotalTracks = async () => {
    const number =
        (await callServer('totalSongs').then((number) => number.text())) || alert(`Sorry, something went wrong...`);
    number != masterArray.length &&
    confirm(
        `Some songs were recently added or removed from the directory...\n(${masterArray.length} --> ${number})\nWould you like to update the current data?`
    )
        ? postCallToServer()
        : '';
};
const postCallToServer = async () => {
    alert('Creating a new file... ');
    toggleLoader();
    response = await callServer('updateJSON')
        .then((response) => response.json())
        .then(({ deleted, added }) => {
            Object.values(deleted).forEach((item) => {
                const info = item.split('| ');
                log(`${info[1]} removed from '${info[0]}'`, 'red');
            });
            log(`total deleted: ${Object.values(deleted).length}`, 'red');

            Object.values(added).forEach((item) => {
                const info = item.split('| ');
                log(`${info[1]} added to '${info[0]}'`, 'green');
            });
            log(`total added: ${Object.values(added).length}`, 'green');

            return `Deleted: ${Object.values(deleted).length} tracks\nAdded: ${
                Object.values(added).length
            } tracks\nSee logging for details...`;
        });
    toggleLoader();
    alert(response || `Sorry, something went wrong...`);
    response && (await getOrUpdateCovers('updateCovers'));
    await loadFolders();
    await wait(300);
    songlist.firstElementChild.classList.toggle('playing');
};
const getOrUpdateCovers = async (option) => {
    //* 'getCovers': get covers => [0] array covers in dir [1] no number or zero
    //* 'updateCovers': make new JPEGs => [0] array covers in dir [1] number updated covers
    await callServer(option)
        .then((response) => response.json())
        .then((json) => {
            coverArray = [...json[0]];
            if (json[1] > 0) {
                alert(`${json[1]} new covers were added to the cover art folder`);
            }
        });
};

async function callServer(command) {
    return await fetch('./get-data.php', {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', cache: 'no-cache' },
        body: JSON.stringify(command),
    }).then(handleErrors);
}

//<demo>document.querySelector('#folders').onclick = () => getOrUpdateCovers('updateCovers');

// s> ======================================================================================
// s> ================================== options & input ===================================
// s> ======================================================================================
function populateOptions(array, elem, name) {
    const options = new Set();
    array.map((song) => song[name] && options.add(song[name]));
    const htmlString = Array.from(options)
        .sort()
        .map((option) => {
            let count = array.filter((x) => x[name] === option);
            return `<li><a data-value="${option}" data-count="${count.length}">${option}</a></li>`;
        })
        .join('');
    removeChildrenExcept(elem, 1);
    elem.insertAdjacentHTML('beforeend', htmlString);
}

function handleSelect(e) {
    songlist.innerHTML = '';
    const selected = e.target.dataset.value;
    const option = e.currentTarget.dataset.name;
    filteredList = filteredList.filter((item) => item[option] && item[option].toString() === selected);
    // updaten van main search en aside options filteren
    displayedList = [...filteredList];
    displaySongs(displayedList.splice(0, 16));
    allSelects.forEach((select) => populateOptions(filteredList, select, select.dataset.name));
    root.style.setProperty('--scrollwidth-playlist', '0%');
    createObserver();
}

function removeChildrenExcept(elem, number) {
    while (elem.children.length > number) {
        elem.removeChild(elem.lastChild);
    }
}
function log(message, color = 'normal') {
    logArray.push([message, color]);
    const loggingList = document.querySelector('#loggingList');
    loggingList.innerHTML = '';
    const htmlString = logArray
        .slice(-4)
        .map((log) => {
            return `
            <li class="${log[1]}">${log[0]}</li>
        `;
        })
        .join('');
    loggingList.insertAdjacentHTML('afterbegin', htmlString);
}
function showAllLogs() {
    const logAllList = document.querySelector('#logAllList');
    logAllList.innerHTML = '';
    const htmlString = logArray
        .map((log) => {
            return `
            <li class="${log[1]}">${log[0]}</li>
        `;
        })
        .join('');
    logAllList.insertAdjacentHTML('afterbegin', htmlString);
}

// l> ======================================================================================
// l> ==================================== main search =====================================
// l> ======================================================================================
const displaySongs = (songs) => {
    const htmlString = songs
        .map((song) => {
            let favorite = isSongInFavorites(song); // returns index or -1
            let htmlClass;
            let title = song.title.split(/[()]/);
            let remix = title[1] || song.album;
            const artists = splitArtistsHtml(song.artist);

            songPlaying && song.filename === songPlaying.filename ? (htmlClass = 'song playing') : (htmlClass = 'song');
            favorite !== -1 ? (htmlClass += ' favorite') : '';

            let imageSrc = coverArray.find((cover) => cover.includes(song.filename)) || '404_not_found.jpg';
            // let imageSrc = '404_not_found.jpg';

            return `
            <li class="${htmlClass}" data-path="${song.filename}" data-folder="${song.folder}">
                <h2 class="track">${title[0]}</h2>
                <p>${artists}</a></p>
                <p title="${song.filename}" class="remix">${remix}</p>
                <div class="songFlip">
                <button type="button" class="favoriteBtn" title="Add to favorites"><span class="material-icons in-song favorites">favorite</span></button>
                <button type="button" class="playBtn" title="Play"><span class="material-icons in-song">play_arrow</span></button>
                <button type="button" class="playlistBtn" title="Add to playlist"><span data-layout="${song.folder}" class="material-icons in-song">playlist_add</span></button>
                </div>
                <img src="./covers/${imageSrc}" onerror="this.onerror=null;this.src='./covers/404_not_found.jpg';" class="coverImage" alt="cover ${song.artist} ${song.title}">
            </li>
        `;
        })
        .join('');
    songlist.insertAdjacentHTML('beforeend', htmlString);
    updateResultsOrMatches();
    createObserver();
};
function splitArtistsHtml(string) {
    return string.includes(', ')
        ? string
              .split(', ')
              .map((artist) => `<a class="artist" href="#">${artist}</a>`)
              .join(', ')
        : `<a class="artist" href="#">${string}</a>`;
}

function updateResultsOrMatches() {
    if (searchValue === '') {
        matches.innerHTML =
            songlist.childElementCount + displayedList.length === masterArray.length
                ? `All ${masterArray.length} tracks`
                : `${songlist.childElementCount + displayedList.length} from ${masterArray.length} tracks`;
    } else {
        matches.innerHTML =
            currentList.length === 1
                ? `${currentList.length} match for <span>${searchValue}</span>`
                : filteredList.length === currentList.length
                ? `${currentList.length} matches for <span>${searchValue}</span>`
                : `${filteredList.length} from ${currentList.length} matches for <span>${searchValue}</em>`;
        log(`Update matches: ${currentList.length} results`);
    }
    root.style.setProperty('--scrollwidth-playlist', '0%');
}

function handleSearch(string, args) {
    // remove all songs from list
    songlist.innerHTML = '';
    searchValue = string;
    backToTop(songlist, 0);
    // find match in main music array
    string = string.toLowerCase();
    let list = new Set();
    // filter with multiple arguments
    masterArray.filter((el) => args.map((arg) => (el[arg]?.toLowerCase().includes(string) ? list.add(el) : '')));
    // list (Set) becomes current list
    currentList = [...list];
    filteredList = [...list];
    displayedList = [...currentList];
    if (list.size === 0) {
        updateResultsOrMatches();
    }
    list.size && displaySongs(displayedList.splice(0, 16));
    allSelects.forEach((select) => populateOptions(Array.from(list), select, select.dataset.name));
    searchInput.value = '';
    log(`Searching for '${string}'`);
}

function fromArrayGetSongWithKey(array, query, key) {
    return array.find((song) => song[key] === query);
}

//********************** intersection Observer **********************
let prevRatio = 0.0;

function createObserver() {
    let options = {
        root: songlist,
        rootMargin: '0px',
        threshold: 0,
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(songlist.lastElementChild);
}
function handleIntersect(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > prevRatio) {
            chopDisplayList(observer, displayedList, 16);
            observer.unobserve(entry.target);
        }
        prevRatio = entry.intersectionRatio;
    });
}
//******************* einde intersection Observer ********************

function chopDisplayList(observer, array, number) {
    if (array.length === 0) {
        return;
    }
    array.length < number ? displaySongs(array.splice(0, array.length)) : displaySongs(array.splice(0, number));
}

function resetCurrentList() {
    currentList = masterArray;
    filteredList = masterArray;
    displayedList = masterArray;
    allSelects.forEach((select) => populateOptions(currentList, select, select.dataset.name));
    searchValue = '';
    updateResultsOrMatches();
    handleSearch('', ['artist']);
}

function showEverythingFrom(query) {
    handleSearch(query, ['artist', 'title', 'mixartist']);
}

// l> ======================================================================================
// l> ====================================== playlist ======================================
// l> ======================================================================================

const playListSet = new Set();

const addToPlaylist = (array) => {
    let matches = array.map((el) => masterArray.find((song) => song.filename.includes(el.filename)));
    matches.forEach((match) => playListSet.add(match));
    updatePlaylist(playListSet);
    log(`Update playlist`);
};
const removeFromPlaylist = (song) => {
    playListSet.forEach((elem) => elem.filename === song && playListSet.delete(elem));
    updatePlaylist(playListSet);
};

function clearPlaylist() {
    playListSet.clear();
    updatePlaylist(playListSet);
    log(`Clear playlist`, 'red');
}

function updatePlaylist(list, myPlaylist = '') {
    !Array.isArray(list) && (list = Array.from(list));
    const htmlString = list
        .map((song) => {
            let htmlClass;
            songPlaying && song.filename === songPlaying.filename
                ? (htmlClass = 'playlistSongs playing')
                : (htmlClass = 'playlistSongs');
            return `
            <li class="${htmlClass}" ${myPlaylist && `data-playlist="${myPlaylist}"`} data-path="${
                song.filename
            }" data-folder="${song.folder}" data-selected="false">
                <p draggable="true" class="playSong draggable">${song.artist} - ${song.title}</p>
                <div class="myPlaylistButtons">
                <span>${song.duration}</span>
                <button type="button" class="removeBtn" title="Remove from playlist">&#10006;</button>                            
                </div>
            </li>
        `;
        })
        .join('');
    playlist.innerHTML = htmlString;
    sizePlaylist.innerHTML = `${myPlaylist && `<span id="thisPlaylist">${myPlaylist}</span>`}${list.length} tracks`;
}
playlistInput.onkeyup = (e) => e.code === 'Enter' && handleCreatePlaylist();

// r> ======================================================================================
// r> ================================== event listeners ===================================
// r> ======================================================================================
searchButton.addEventListener('click', () => handleSearch(searchInput.value, ['artist', 'title', 'mixartist']));
searchInput.addEventListener('keydown', function (e) {
    if (e.code === 'Enter') {
        handleSearch(searchInput.value, ['artist', 'title', 'mixartist']);
        searchInput.value = '';
    }
});
clearSearches.addEventListener('click', () => resetCurrentList());
songlist.addEventListener('click', async function (e) {
    switch (e.target.className) {
        case 'artist':
            e.preventDefault();
            handleSearch(e.target.textContent, ['artist', 'title', 'mixartist']);
            break;
        case 'track':
            playSongs(e.target.closest('li'));
            break;
        case 'remix':
            console.log('remix remix remix');
            break;
        case 'songFlip':
            //only one list item can be active at the same time
            let currentActive = document.querySelector('.active');
            currentActive?.classList.toggle('active');
            currentActive?.querySelectorAll('button').forEach((button) => (button.disabled = true));
            if (currentActive && currentActive === e.target.parentElement) {
                e.target.parentElement.classList.toggle('active');
            }
            e.target.parentElement.classList.toggle('active');
            e.target.querySelectorAll('button').forEach((button) => (button.disabled = false));
            break;
        case 'favoriteBtn':
            handleFavorites(e);
            break;
        case 'playBtn':
            playSongs(e.target.closest('li'));
            break;
        case 'playlistBtn':
            addToPlaylist([{ filename: e.target.closest('li').getAttribute('data-path') }]);
            break;
        case 'coverImage':
            const coverLarge = document.querySelector('#coverLarge');
            coverLarge.src = '';
            coverLarge.src = e.target.src.includes('404_not_found.jpg')
                ? await fetchBandsintown(e.target.closest('li').querySelector('.artist').textContent)
                : e.target.src;
            coverLarge.alt = e.target.alt;
            toggleCover();
            log(`Show cover art`);
            break;
        default:
            break;
    }
});
songlist.onscroll = () => {
    const total = filteredList.length;
    const displayed = displayedList.length;
    const width = (((total - displayed) / total) * 100).toFixed(2) + '%';
    root.style.setProperty('--scrollwidth-playlist', width);
};
document.querySelector('#hideCover').onclick = () => toggleCover();

addAllBtn.addEventListener('click', () => addToPlaylist(filteredList));
document.querySelector('#slideLoggingMenuBtn').onclick = () =>
    document.querySelector('.loggingDisplay').classList.toggle('showing');
document.querySelector('#showAllLoggingBtn').onclick = () => {
    const logAllList = document.querySelector('#logAllList');
    if (logAllList.classList.contains('showing')) {
        logAllList.classList.remove('showing');
    } else {
        logAllList.classList.add('showing');
        showAllLogs();
    }
};

playlist.addEventListener('click', function (e) {
    switch (e.target.className) {
        case 'removeBtn':
            const song = e.target.closest('li').getAttribute('data-path');
            const playlist = e.target.closest('li').getAttribute('data-playlist');
            playlist ? removeFromMyPlaylist(song, playlist) : removeFromPlaylist(song);
            log(
                `Remove '${e.target.closest('li').firstElementChild.innerText}' from playlist${
                    playlist ? ` '${playlist}'` : ''
                }`,
                'red'
            );
            break;
        case 'addSongToPlaylist':
            //handleSongToPlaylist();
            break;
        default:
            break;
    }
});

playlist.addEventListener('dblclick', function (e) {
    if (e.target.className === 'playSong draggable') {
        playListState = true;
        playSongs(e.target.closest('li'));
    }
});
document
    .querySelectorAll('[name="folder"]')
    .forEach((button) => (button.onchange = () => handleSearch(button.value, ['folder'])));

allPlaylists.addEventListener('click', function (e) {
    switch (e.target.className) {
        case 'deletePlaylist':
            handleDeletePlaylist(e.target.getAttribute('data-playlist'));
            break;
        case 'playlistLink':
            showPlaylistSongs(e.target.innerText);
            log(`Show playlist`);
        default:
            break;
    }
});

infoList.addEventListener('click', function (e) {
    switch (e.target.className) {
        case 'artist':
            e.preventDefault();
            showEverythingFrom(e.target.textContent);
            break;
        case 'album':
            e.preventDefault();
            handleSearch(e.target.textContent, ['album']);
            break;
        case 'label':
            e.preventDefault();
            handleSearch(e.target.textContent, ['label']);
            break;
        case 'genre':
            e.preventDefault();
            handleSearch(e.target.textContent, ['genre']);
            break;
        case 'mixartist':
            e.preventDefault();
            showEverythingFrom(e.target.textContent);
            break;
        default:
            break;
    }
});

allSelects.forEach((select) =>
    select.addEventListener('click', function (e) {
        e.target.dataset.value === 'default'
            ? handleSearch(searchValue, ['artist', 'title', 'mixartist'])
            : handleSelect(e);
    })
);

playlistButtons.addEventListener('click', function (e) {
    switch (e.target.id) {
        case 'showPlaylist':
            playlistHeader.classList.toggle('showing');
            break;
        case 'clearPlaylist':
            clearPlaylist();
            break;
        case 'thisPlaylist':
            updatePlaylist(playListSet);
            break;
        default:
            break;
    }
});

// ************************* drag & drop ****************************
playlist.addEventListener('click', function (e) {
    if (e.ctrlKey) {
        if (e.target.closest('li').getAttribute('data-selected') === 'false') {
            e.target.closest('li').style.color = 'limegreen';
            e.target.closest('li').setAttribute('data-selected', 'true');
        } else {
            e.target.closest('li').style.color = 'var(--boxLineColor)';
            e.target.closest('li').setAttribute('data-selected', 'false');
        }
    }
});

playlist.addEventListener('dragstart', function (e) {
    let transferObject = { thisHtml: e.target.closest('li').outerHTML, selected: [] };
    playlistHeader.classList.add('showing');
    e.target.style.color = 'limegreen';

    const songs = Array.from(playlist.querySelectorAll('li'));
    selected = songs
        .filter((song) => song.getAttribute('data-selected') === 'true')
        .map((song) => song.getAttribute('data-path'));

    !selected.length && selected.push(e.target.closest('li').getAttribute('data-path'));
    transferObject.selected = selected;
    e.dataTransfer.setData('text', JSON.stringify(transferObject));
});

playlist.addEventListener('dragend', function (e) {
    e.target.style.color = 'var(--boxLineColor)';
    const songs = Array.from(playlist.querySelectorAll('li'));
    const selected = songs
        .filter((song) => song.getAttribute('data-selected') === 'true')
        .forEach((song) => {
            song.setAttribute('data-selected', 'false');
            song.style.color = 'var(--boxLineColor)';
        });
});
playlist.addEventListener('dragend', (e) => e.dataTransfer.dropEffect === 'move' && e.target.closest('li').remove());

//** drop zone playlist **
allPlaylists.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});
allPlaylists.addEventListener('dragenter', function (e) {
    if (e.target.className === 'playlistItem') {
        e.preventDefault();
        Array.from(e.target.children).forEach((elem) => (elem.style.pointerEvents = 'none'));
        e.target.style.color = 'limegreen';
        e.target.style.backgroundColor = '#0accf92b';
        e.target.style.height = '3.8vh';
    }
});
allPlaylists.addEventListener('dragleave', function (e) {
    if (e.target.className === 'playlistItem') {
        e.preventDefault();
        Array.from(e.target.children).forEach((elem) => (elem.style.pointerEvents = 'all'));
        e.target.style.color = 'var(--boxLineColor)';
        e.target.style.backgroundColor = 'transparent';
        e.target.style.height = '3vh';
    }
});
allPlaylists.addEventListener('drop', function (e) {
    if (e.target.className === 'playlistItem') {
        e.preventDefault();
        const playlistName = e.target.firstElementChild.innerText;
        playlist.querySelectorAll('li').forEach((item) => (item.style.borderTop = 'none'));

        const transferObject = JSON.parse(e.dataTransfer.getData('text'));
        const data = transferObject.selected;
        handleSongToPlaylist(playlistName, data);
        log(`Added ${data.length} song(s) to playlist '${playlistName}'`, 'green');
    }
});

//** drop zone move up down **
playlist.addEventListener('dragover', function (e) {
    if (e.target.className === 'playSong draggable') {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        Array.from(e.target.children).forEach((elem) => (elem.style.pointerEvents = 'none'));
        e.target.closest('li').style.borderTop = '1px solid var(--boxLineColor)';
    }
});
playlist.addEventListener('dragenter', function (e) {
    if (e.target.className === 'playSong draggable') {
        e.preventDefault();
        Array.from(e.target.children).forEach((elem) => (elem.style.pointerEvents = 'none'));
        e.target.closest('li').style.borderTop = '1px solid var(--boxLineColor)';
    }
});
playlist.addEventListener('dragleave', function (e) {
    if (e.target.className === 'playSong draggable') {
        e.preventDefault();
        Array.from(e.target.children).forEach((elem) => (elem.style.pointerEvents = 'all'));
        e.target.closest('li').style.borderTop = 'none';
    }
});
playlist.addEventListener('drop', function (e) {
    if (e.target.className === 'playSong draggable') {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text'));
        e.target.closest('li').insertAdjacentHTML('beforebegin', data.thisHtml);
        playlist.querySelectorAll('li').forEach((item) => (item.style.borderTop = 'none'));
        log(`Moved song ${data.selected}`);
    }
});

// w> ======================================================================================
// w> ==================================== audio player ====================================
// w> ======================================================================================
//*===================== player variables =====================*/
const playPauseBtn = document.getElementById('play-button');
const audioPlayerContainer = document.getElementById('audio-player-container');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const outputContainer = document.getElementById('volume-output');
const muteBtn = document.getElementById('mute-button');
const repeatBtn = document.getElementById('repeat-button');
const previousBtn = document.getElementById('previous-button');
const nextBtn = document.getElementById('next-button');
const shuffleBtn = document.getElementById('shuffle-button');
const audioCover = document.querySelector('.audio-cover');

//*===================== player states =====================*/
let playState = 'pause';
let muteState = 'unmute';
let repeatState = false;
let playListState = false;
let shuffleState = false;
let rAF = null;

const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    audioPlayerContainer.style.setProperty(
        '--seek-before-width',
        `${(seekSlider.value / seekSlider.max).toFixed(4) * 100}%`
    );
    rAF = requestAnimationFrame(whilePlaying);
};

function play(button) {
    !audio.src.includes('.mp3') && playSongs(document.querySelector('.playing'));

    const playIcon = '<span class="material-icons">play_arrow</span>';
    const pauseIcon = '<span class="material-icons">pause</span>';
    const infoSlider = document.querySelector('.audio-down');
    playPauseBtn.innerHTML = '';
    if (button && playState === 'play') {
        audio.pause();
        cancelAnimationFrame(rAF);
        cancelAnimationFrame(rAF2);
        clearCanvas();
        infoSlider.classList.remove('sliding');
        wrapper.className = 'wrapper';
        playPauseBtn.insertAdjacentHTML('beforeend', playIcon);
        playState = 'pause';
        return;
    } else {
        audio.play();
        requestAnimationFrame(whilePlaying);
        requestAnimationFrame(FrameLooper);
        wrapper.className = 'wrapper spinning';
        infoSlider.classList.add('sliding');
        playPauseBtn.insertAdjacentHTML('beforeend', pauseIcon);
        playState = 'play';
    }
}
playPauseBtn.addEventListener('click', (e) => play(e));

muteBtn.addEventListener('click', () => {
    if (muteState === 'unmute') {
        muteState = 'mute';
        audio.muted = true;
        muteBtn.innerHTML = '<span class="material-icons">volume_off</span>';
        log(`Mute: On`, 'blue');
    } else {
        muteState = 'unmute';
        audio.muted = false;
        muteBtn.innerHTML = '<span class="material-icons"> volume_up </span>';
        log(`Mute: Off`, 'blue');
    }
});
repeatBtn.addEventListener('click', () => {
    if (repeatState === false) {
        repeatState = true;
        audio.loop = true;
        repeatBtn.classList.toggle('active');
        log(`Repeat: On`, 'blue');
    } else {
        repeatState = false;
        audio.loop = false;
        repeatBtn.classList.toggle('active');
        log(`Repeat: Off`, 'blue');
    }
});

shuffleBtn.addEventListener('click', () => {
    if (shuffleState === false) {
        shuffleState = true;
        shuffleBtn.classList.toggle('active');
        playRandomSong();
        log(`Shuffle: On`, 'blue');
        log(`Shuffling ${shuffleList.length} tracks`);
    } else {
        shuffleState = false;
        shuffleList.length = 0;
        shuffleBtn.classList.toggle('active');
        log(`Shuffle: Off`, 'blue');
    }
});

const showRangeProgress = (rangeInput) => {
    if (rangeInput === seekSlider)
        audioPlayerContainer.style.setProperty(
            '--seek-before-width',
            ((rangeInput.value / rangeInput.max) * 100).toFixed(2) + '%'
        );
};

seekSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});

//** Implementation of the functionality of the audio player */

const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('current-time');

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
};
const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
};
const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
};
const displayBufferedAmount = () => {
    if (audio.buffered && audio.buffered.length > 0) {
        const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
        audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
    }
};
if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

function playRandomSong() {
    let currentSong = document.querySelector('.playing');
    if (shuffleList.length === 0) {
        shuffleList = [...currentSong.closest('ul').children];
    }
    let randomNr = Math.floor(Math.random() * shuffleList.length);
    let randomSong = shuffleList[randomNr];
    shuffleList.splice(randomNr, 1);
    playSongs(randomSong);
}

function playNextSong(direction) {
    if (shuffleState === true) {
        playRandomSong();
        return;
    }
    let currentSong = document.querySelector('.playing');
    if (!currentSong) {
        playListState ? playSongs(playlist.firstElementChild) : playSongs(songlist.firstElementChild);
        return;
    }
    currentSong.classList.remove('playing');
    if (direction === 'forward') {
        let nextSong = currentSong.nextElementSibling;
        if (!nextSong) {
            playListState ? playSongs(playlist.firstElementChild) : playSongs(songlist.firstElementChild);
            return;
        } else {
            nextSong.classList.add('playing');
            playSongs(nextSong);
        }
    } else {
        let previousSong = currentSong.previousElementSibling;
        if (!previousSong) {
            playSongs(currentSong);
            return;
        } else {
            previousSong.classList.add('playing');
            playSongs(previousSong);
        }
    }
}
async function updatePlayerInfo(song) {
    infoList.children.length && removeChildrenExcept(infoList, 0);
    /*** images ***/
    let imageSrc = coverArray.find((cover) => cover.includes(song.filename)) || '404_not_found.jpg';
    root.style.setProperty('--playing-cover', `url("../covers/${imageSrc}") no-repeat`);

    let audioFreq =
        coverArray.find((cover) => cover.includes(`${song.filename}_audio_freq`)) ||
        '../covers/MLiR - People_audio_freq.png';
    //let audioFreq = 'MLiR - People_audio_freq.png';
    root.style.setProperty('--audio-freq', `url("../covers/${audioFreq}") no-repeat`);
    /*** info ***/
    const artists = splitArtistsHtml(song.artist);
    let mixartist = '';
    song.mixartist
        ? (mixartist = `<p><a title="mixartist" class="mixartist">${song.mixartist}</a></p>`)
        : (mixartist = '');
    let title = song.title.split(/[()]/);
    let remix = title[1] || '';
    const htmlString = `
    <div>
        <p class="artist">${artists}</p>
        <p class="track">${title[0]}</p>
        <p><span>${remix}</span></p>
        <p><a class="genre">${song.genre}</a></p>
    </div><div>
        <p><a title="album" class="album">${song.album}</a></p>
        <p><a title="publisher" class="publisher">${song.publisher}</a></p>                
        ${mixartist}
        <p><span title="year">${song['year']}</span></p>
    </div>
    `;
    infoList.insertAdjacentHTML('beforeend', htmlString);
    log(`Update song info`);
}
function playSongs(song) {
    const playingSongs = document.querySelectorAll('.playing');
    playingSongs.forEach((playingSong) => playingSong.classList.toggle('playing'));
    song.classList.toggle('playing');
    //<demo> const source = song.getAttribute('data-path');
    const source = 'MLiR - People';
    //<demo> const folder = song.getAttribute('data-folder');
    const folder = 'demo';
    audio.src = `./SKIVN/${folder}/${source}.mp3`;

    cancelAnimationFrame(rAF);
    cancelAnimationFrame(rAF2);
    clearCanvas();
    play();
    songPlaying = fromArrayGetSongWithKey(masterArray, source, 'filename');
    updateInfoSlider(songPlaying);
    updatePlayerInfo(songPlaying);

    if (!songPlaying.artist || !songPlaying.title) {
        log(`Play: #N/A - ${songPlaying.filename}`, 'error');
    } else {
        log(`Play: ${songPlaying.artist} - ${songPlaying.title}`, 'blue');
    }
    addToPlaylist([{ filename: source }]);
}
function updateInfoSlider(song) {
    const htmlString = `<span>  track |</span> ${song.artist} - ${song.title}  
    <span>  album |</span> ${song.album} 
    <span>  label |</span> ${song.label}...`;
    document.querySelector('#info-slider').innerHTML = htmlString;
    document.querySelector('#info-slider2').innerHTML = htmlString;
}
function skipInSong(direction) {
    const event = new Event('change');
    seekSlider.value = direction === 'forward' ? Number(seekSlider.value) + 10 : Number(seekSlider.value) - 10;
    seekSlider.dispatchEvent(event);
}

// r> ======================================================================================
// r> =============================== audio event listeners ================================
// r> ======================================================================================

audio.addEventListener('ended', () => playNextSong('forward'));
audio.addEventListener('progress', displayBufferedAmount);
nextBtn.addEventListener('click', () => playNextSong('forward'));
previousBtn.addEventListener('click', () => playNextSong());
document.querySelector('#seek-forward-button').addEventListener('click', () => skipInSong('forward'));
document.querySelector('#seek-back-button').addEventListener('click', () => skipInSong());

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if (!audio.paused) {
        cancelAnimationFrame(rAF);
    }
});
seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
    if (!audio.paused) {
        requestAnimationFrame(whilePlaying);
    }
});
audio.addEventListener('timeupdate', () => {
    seekSlider.value = Math.floor(audio.currentTime);
});

// h> ======================================================================================
// h> =================================== player layout ====================================
// h> ======================================================================================

const volumeCircle = document.querySelector('.audio-volume');
volumeCircle.addEventListener('click', (e) => (e.currentTarget === e.target ? calculateDegrees(e) : ''));

function angle(center, p1) {
    var p0 = {
        x: center.x,
        y:
            center.y -
            Math.sqrt(
                Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x) +
                    Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y)
            ),
    };
    return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
}

function calculateDegrees(e) {
    // find middle of the play button circle
    const { x, y, width, height } = playPauseBtn.getBoundingClientRect();
    const middle = { x: x + width / 2, y: y + height / 2 };
    const coords = { x: e.clientX, y: e.clientY };
    const degrees = angle(middle, coords);
    const percentage = Math.ceil(degrees / 3.6);
    root.style.setProperty('--volume-percentage', `${percentage}%`);
    root.style.setProperty('--volume-percentage', `${percentage + 2}%`);
    outputContainer.textContent = percentage;
    audio.volume = percentage / 100;
}

// s> ======================================================================================
// s> =================================== local storage ====================================
// s> ======================================================================================
// functie bij onload die favorites checkt + add class song favorite
// functie die favorites local storage bijwerkt

//************************ Favorites **********************/
Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key));
};
function checkFavorite(song) {
    let myFavorites = localStorage.getObj('favorites') || [];
    const index = findIndexOfSongInArray(myFavorites, song.filename, 'filename');
    if (index === -1) {
        myFavorites.push(song);
        log(`Add '${song.filename}' to Favorites`, 'green');
    } else {
        myFavorites.splice(index, 1);
        log(`Remove '${song.filename}' from Favorites`, 'red');
    }
    localStorage.setObj('favorites', myFavorites);
}
function findIndexOfSongInArray(array, query, key) {
    const check = (obj) => obj[key] === query;
    return array.findIndex(check);
}
function isSongInFavorites(song) {
    let myFavorites = localStorage.getObj('favorites') || [];
    return findIndexOfSongInArray(myFavorites, song.filename, 'filename');
}
function handleFavorites(e) {
    const favoriteSong = e.target.closest('li');
    const favoriteInfo = fromArrayGetSongWithKey(masterArray, favoriteSong.getAttribute('data-path'), 'filename');
    favoriteSong.classList.toggle('favorite');
    checkFavorite(favoriteInfo);
}

//************************ Playlists **********************/

function handleCreatePlaylist() {
    const naamPlaylist = playlistInput.value;
    if (!naamPlaylist) {
        playlistInput.focus();
        return;
    }
    const response = confirm(`Creating new playlist '${naamPlaylist}'. Continue?`);
    if (!response) {
        playlistInput.focus();
        return;
    }
    if (localStorage.getObj('playlists')) {
        const index = findIndexOfSongInArray(localStorage.getObj('playlists'), naamPlaylist, 'name');
        if (index !== -1) {
            alert('Oops! This playlist exists already. \nBe more creative!');
            playlistInput.focus();
            return;
        }
    }
    playlistInput.blur();
    makeNewPlaylist(naamPlaylist);
    playlistInput.value = '';
}
function handleDeletePlaylist(playlist) {
    let response = confirm(`Are you sure you want to delete playlist '${playlist}'.`);
    if (!response) {
        return;
    }
    const myPlaylists = localStorage.getObj('playlists');
    const index = findIndexOfSongInArray(myPlaylists, playlist, 'name');
    myPlaylists.splice(index, 1);
    localStorage.setObj('playlists', myPlaylists);
    displayAllPlaylists();
    log(`Remove playlist '${playlist}'`, 'red');
}

function makeNewPlaylist(name) {
    let myPlaylists = localStorage.getObj('playlists') || [];
    const newPlaylist = {
        name,
        songs: [],
    };
    myPlaylists.push(newPlaylist);
    localStorage.setObj('playlists', myPlaylists);
    displayAllPlaylists();
    log(`Create playlist '${name}'`, 'green');
}
function displayAllPlaylists() {
    let myPlaylists = localStorage.getObj('playlists') || [];
    removeChildrenExcept(allPlaylists, 0);
    const htmlString = myPlaylists
        .map((playlist) => {
            return `
        <li class="playlistItem">
            <a class="playlistLink">${playlist.name}</a>
            <span>${playlist.songs.length} tracks</span>
            <button data-playlist="${playlist.name}" type="button" class="deletePlaylist" title="Delete this playlist">Delete</button>
        </li>
        `;
        })
        .join('');
    allPlaylists.insertAdjacentHTML('beforeend', htmlString);
}

function handleSongToPlaylist(playlistName, songArray) {
    const allMyPlaylists = localStorage.getObj('playlists');
    const index = allMyPlaylists.findIndex((list) => list.name === playlistName);

    songArray.forEach((songInArray) => {
        if (!allMyPlaylists[index].songs.some((song) => song.filename === songInArray)) {
            const mySong = fromArrayGetSongWithKey(masterArray, songInArray, 'filename');
            allMyPlaylists[index].songs.push(mySong);
        }
    });

    localStorage.setObj('playlists', allMyPlaylists);
    displayAllPlaylists();
}

function showPlaylistSongs(playlistName) {
    const allMyPlaylists = localStorage.getObj('playlists');
    const index = allMyPlaylists.findIndex((list) => list.name === playlistName);
    const myPlaylist = allMyPlaylists[index].songs;
    updatePlaylist(myPlaylist, playlistName);
}

function removeFromMyPlaylist(song, playlistName) {
    const allMyPlaylists = localStorage.getObj('playlists');
    const indexPlaylist = allMyPlaylists.findIndex((list) => list.name === playlistName);
    const myPlaylist = allMyPlaylists[indexPlaylist].songs;
    const indexSong = findIndexOfSongInArray(myPlaylist, song, 'filename');

    allMyPlaylists[indexPlaylist].songs.splice(indexSong, 1);
    localStorage.setObj('playlists', allMyPlaylists);
    displayAllPlaylists();
    showPlaylistSongs(playlistName);
}

// y> ======================================================================================
// y> ===================================== equalizer ======================================
// y> ======================================================================================
let rAF2 = null;
let analyser;
let ctx;
let equalizerState = true;
//fbc_array: stores the frequency domain data in an array.
//bar_count: The number of bars to display in our canvas element.
//bar_pos: The x-axis position of the current bar being drawn to the canvas element.
//bar_width: The width of the current bar being drawn to the canvas element.
//bar_height: The height of the current bar being drawn to the canvas element.

function loadEqualizer() {
    const context = new AudioContext();
    analyser = context.createAnalyser();
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    const source = context.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(context.destination);

    FrameLooper();
}
function FrameLooper() {
    if (equalizerState === false) {
        return;
    }
    if (playState === 'pause') {
        return;
    }
    rAF2 = requestAnimationFrame(FrameLooper);

    let bar_pos;
    let bar_width;
    let bar_height;
    const fbc_array = new Uint8Array(analyser.frequencyBinCount);
    const bar_count = window.innerWidth / 12;
    analyser.getByteFrequencyData(fbc_array);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';

    ctx.beginPath();
    for (var i = 0; i < bar_count; i++) {
        ctx.lineCap = 'round';
        bar_pos = i * 4;
        bar_width = 4;
        bar_height = -(fbc_array[i] / 2);
        let random = Math.ceil(Math.random() * 255);
        ctx.fillStyle = `rgba(0, 247, 255, ${1 - (bar_height + 100) / 100})`;
        ctx.fillRect(bar_pos, canvas.height, bar_width, bar_height);
    }
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function logAll(withFn) {
    var name, fn;
    for (name in window) {
        fn = window[name];
        if (typeof fn === 'function') {
            window[name] = (function (name, fn) {
                var args = arguments;
                return function () {
                    withFn.apply(this, args);
                    return fn.apply(this, arguments);
                };
            })(name, fn);
        }
    }
}
logAll(function (name, fn) {
    //console.log('calling ' + name);
});

async function fetchBandsintown(name, events = '') {
    const artist = name.replaceAll(' ', '%20');
    events && (events = '/events');
    const appId = '6bd37f2a88147bb7bd2fe79b8847936c';
    const url = `https://rest.bandsintown.com/artists/${artist}${events}?app_id=${appId}`;
    return fetch(url)
        .then(handleErrors)
        .then((response) => response.json())
        .then((json) => json.image_url);
}
