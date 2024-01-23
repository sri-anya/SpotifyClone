//global variables
let currentSong = new Audio();
let songs;
let currFolder;

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

async function getSongs(folder) {

    console.log('folder',folder);
    
    document.querySelector(".songList ul").innerHTML = "";
    currFolder = folder
    let a = await fetch(`${folder}`);
    // let a = await fetch(`http://127.0.0.1:3000/${folder}`);
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }


    }



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

    return songs;

}


//playMusic

const playMusic = (track, pause = false) => {
    console.log(track,currFolder)
    currentSong.src = `${currFolder}` + track;
    if (!pause) {


        currentSong.play();
        play.src = "assets/images/pause.svg";

    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}


async function displayAlbums() {
    let a = await fetch(`songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    let cardContainerSection = document.querySelector(".cardContainer section")

    for (let index = 0; index < Array.from(anchors).length; index++) {
        const e = Array.from(anchors)[index];


        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]

            //Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log('response',response.cover);
            
            cardContainerSection.innerHTML += `<div data-folder=${response.dataFolder} class="card">
        <div class="playButton">
            <img src=${response.cover} alt="">
        </div>
        <img src="https://i.scdn.co/image/ab67706f0000000254473de875fea0fd19d39037" alt="">
        <h3>${response.title}</h3>
        <p>${response.description}</p>
    </div>`
        }
    }

    //Load the playlist whenever playlist card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {
            
            songs =await getSongs(`songs/${item.currentTarget.dataset.folder}/`)
            
            playMusic(songs[0]);

        })
    })
}

async function main() {



    //Get the list of all the songs

    await getSongs("songs/PopRising/");

    playMusic(songs[0], true);

    //Display all the albums on the page
    displayAlbums();

    // Attach an event Listener to play, next and previous
   

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
    document.querySelector(".seekbar").addEventListener("click", (e) => {
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

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("assets/images/mute.svg", "assets/images/volume.svg")
        }
    })

    //Add event listener to mute the track
    document.querySelector(".volume img").addEventListener("click", (e)=>{
        
        
        if (e.target.src.includes("/assets/images/volume.svg")){
            e.target.src = e.target.src.replace("/assets/images/volume.svg" ,"/assets/images/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
            
        }
        else{
            e.target.src = e.target.src.replace("/assets/images/mute.svg" ,"/assets/images/volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;

        }

    })



}
main()