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

async function main() {
    //Get the list of all the songs

    let songs = await getSongs();
    console.log(songs);

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

    
}
main()