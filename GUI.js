
var gameOver = false;
var controlsActivated = false;

//Kolla om startskärmen ska upp. jämför url, inte den bästa lösningen..
function checkRefresh()
{
    //hämta url
    var url = window.location.href;
    console.log("URL : " + url);
    var playagain = url.split('?',2)
    console.log(playagain[1]);
    return playagain[1];
} 

function initialize_GUI(){
    // för loading screen
    $('#loading').hide();
    $('#WebGL-container').show();
    $('#stopwatch').css('margin-left', window.innerWidth*0.43);
    $('#coins').css('margin-left', window.innerWidth*0.14);
    $('#coins').css('margin-top', window.innerHeight*0.04);

    $('#healthBar').css('margin-left', window.innerWidth*0.075);
    $('#healthBar').css('margin-top', window.innerHeight*0.15);
    
    //kollar om man klickat på playagain
    if(checkRefresh() != 'playagain'){
         startGameScreen();  
    }else
    {
        activateControls();
        startTimer();
    }
}
var activateControls = function(){

    controlsActivated = true;
}

function endGame(id, totalCoins){

        // stop loop
        window.cancelAnimationFrame(id);

        $('#WebGL-container').css('opacity', '1').fadeTo(500, 0.8)
        var time = $('#timer span').html();

        // show results
        $('#result #time').html(time);
        $('#result #totalcoins').html(totalCoins);

        $('#gameOverScreen').css('height', window.innerHeight/2);
        $('#gameOverScreen').css('width', window.innerWidth/2);
        $('#gameOverScreen').css('margin-top', window.innerHeight/4);
        $('#gameOverScreen').css('margin-left', window.innerWidth/4);
        $('#gameOverScreen').css('opacity', '0').fadeTo(500, 0.8)

        //restart page
        $('a').click(function(){
           //sätter url till playagain
            if(checkRefresh() != 'playagain'){
                location.href = location.href+'?playagain'; 
               console.log(location.href);
                location.reload();
            }else{
                location.reload();
                 console.log(location.href  +  "1");
            }
        });

        gameOver = true;

}

function startGameScreen(){

        $('#WebGL-container').css('opacity', '1').fadeTo(2000, 0.8)
 
        $('#startGameScreen').css('height', window.innerHeight/1.8);
        $('#startGameScreen').css('width', window.innerWidth/2);
        $('#startGameScreen').css('margin-top', window.innerHeight/8);
        $('#startGameScreen').css('margin-left', window.innerWidth/4);
        $('#startGameScreen #options').css('width', window.innerWidth/3);

        $('#startGameScreen').css('opacity', '0').fadeTo(2000, 0.8)

        //gameOver = true; 

}


//ta bort startscreen
function playGame()
    {
        activateControls();
        gameOver = false;
        startTimer();
         // stop loop
      
        $('#WebGL-container').css('opacity', '1').fadeTo(500, 1);
        //var time = $('#timer span').html();

        // show results
       // $('#result #time').html(time);
        //$('#result #totalcoins').html(totalCoins);

/*      Behövs inte??
        $('#startGameScreen').css('height', window.innerHeight/2);
        $('#startGameScreen').css('width', window.innerWidth/2);
        $('#startGameScreen').css('margin-top', window.innerHeight/4);
        $('#startGameScreen').css('margin-left', window.innerWidth/4);
        $('#startGameScreen #options').css('width', window.innerWidth/3);*/
    
        $('#startGameScreen').css('display', 'none');
        //return false; varför return false funktion kallas aldrig på förutom i index?
    }


/// FÖR TIMERN ////
//////////////////
/////////////////
function pad(number, length) {

    var str = '' + number;
    while (str.length < length) {str = '0' + str;}

    return str;
}

function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);

    // return span tag instead of current time 
    if(gameOver)
        return $('#timer span').html();

    return (min > 0 ? pad(min, 2) : "0") + "'" + pad(sec, 2) + "''" + hundredths;

}


function startTimer() {

    var $stopwatch, // Stopwatch element on the page
        incrementTime = 70, // Timer speed in milliseconds
        currentTime = 0, // Current time in hundredths of a second

        updateTimer = function() {
            $stopwatch.html(formatTime(currentTime));
            currentTime += incrementTime / 10;

        },
        init = function() {

            $stopwatch = $('#stopwatch');
            this.Timer = $.timer(updateTimer, incrementTime, true);
        };

    this.resetStopwatch = function() {
        currentTime = 0;
        this.Timer.stop().once();
    };
    $(init);
};

