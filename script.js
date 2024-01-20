//global variables
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();


    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }


    }
    return songs;
}


//playMusic

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {


        currentSong.play();
        play.src = "assets/images/pause.svg";

    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function main() {



    //Get the list of all the songs

    songs = await getSongs();
    console.log(songs);
    playMusic(songs[0], true)

    //List all the songs in the library
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert"src="assets/images/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Song Artist</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class = "invert" src="assets/images/playSong.svg" alt="">
        </div></li>`;

    }

    //Attach an event Listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((ele) => {

        ele.addEventListener("click", element => {

            playMusic(ele.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })

    // Attach an event Listener to play, next and previous
    console.log(play);

    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/images/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "assets/images/playSong.svg"
        }
    })

    //Listen for time Update event
    currentSong.addEventListener("timeupdate", (a) => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        //seekbar movement
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    //Add and event Listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-130%"
    })


    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


}
main()