
var startMusicOn = false;
var inGameMusicOn = false;

//loopar
function toggleStartMusic(){

	if(!startMusicOn){

		myAudio = new Audio('sound/POL-rocket-station-short.wav'); 
		myAudio.volume = 0.5;

		myAudio.addEventListener('ended', function() {
		    this.currentTime = 0;
		    this.play();
		}, false);
		myAudio.play();

		startMusicOn = true;
	}

	else{

		myAudio.pause();
		myAudio.currentTime = 0;
		startMusicOn = false;
	}

}

function toggleInGameMusic(){

	if(!inGameMusicOn){

		myAudio = new Audio('sound/POL-twin-turbo-short.wav'); 
		myAudio.volume = 0.5;

		myAudio.addEventListener('ended', function() {
		    this.currentTime = 0;
		    this.play();
		}, false);
		myAudio.play();

		inGameMusicOn = true;
	}

	else{

		myAudio.pause();
		myAudio.currentTime = 0;
		inGameMusicOn = false;
	}

}

function playCountDownSound(){

	var sound = document.getElementById('start');
	sound.volume = 0.6;
	sound.play();

}

function playSound(sound){

	document.getElementById(sound).play();
}



