// Lista de canciones
const songs = [
    {
        title: 'Duele un Montón Despedirme De Ti',
        artist: 'Aitana',
        src: '../music-app/canciones/Duele un Montón Despedirme De Ti.mp3',
    },
    {
        title: 'Mango y Ron',
        artist: 'Desconocido',
        src: 'canciones/Mango y Ron.mp3',
    },
];

// Elementos del DOM
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeBar = document.getElementById('volume-bar');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');
const songCards = document.querySelectorAll('.song-card');
const likeBtn = document.querySelector('.like-btn');

let currentSongIndex = 0;
let isPlaying = false;
let isLiked = false;

// Cargar canción
function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    updateActiveCard(index);
}

// Actualizar tarjeta activa
function updateActiveCard(index) {
    songCards.forEach((card, i) => {
        card.style.border = i === index ? '2px solid #ff2d55' : '2px solid transparent';
    });
}

// Reproducir / Pausar
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.className = 'fa-solid fa-play';
    } else {
        audio.play();
        playBtn.className = 'fa-solid fa-pause';
    }
    isPlaying = !isPlaying;
}

// Cambiar canción
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        audio.play();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        audio.play();
    }
}

// Actualizar barra de progreso
function updateProgress() {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
}

// Formatear tiempo
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Establecer progreso
function setProgress(e) {
    const value = e.target.value;
    const time = (value / 100) * audio.duration;
    audio.currentTime = time;
}

// Event listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
progressBar.addEventListener('input', setProgress);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

// Volumen
volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Clic en tarjetas
songCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (currentSongIndex === index && isPlaying) {
            togglePlay();
        } else {
            currentSongIndex = index;
            loadSong(index);
            audio.play();
            playBtn.className = 'fa-solid fa-pause';
            isPlaying = true;
        }
    });
});

// Like
likeBtn.addEventListener('click', () => {
    isLiked = !isLiked;
    likeBtn.classList.toggle('liked');
});

// Cargar primera canción
loadSong(0);

// Teclas rápidas
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    }
    if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextSong();
    }
    if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevSong();
    }
});