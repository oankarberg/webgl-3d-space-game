
var gameOver = false;
var controlsActivated = false;
var gameRunning = false;
var score;


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

    $('#healthBar').css('margin-left', window.innerWidth*0.37);
    $('#healthBar').css('margin-top', window.innerHeight*0.05);
    
    //kollar om man klickat på playagain
    if(checkRefresh() != 'playagain'){
         startGameScreen();  
    }else
    {
        //0.5sek delay innan countdown
        setTimeout(function(){
            //3, 2, 1
            showCountDown();
        }, 1000);

        //aktiverar kontroller på 2.3 sek delay
        setTimeout(function(){
            activateControls();
            startTimer();

            if(!muted)
                toggleInGameMusic();
        }, 2800);

    }
}
var activateControls = function(){
    gameRunning = true;
    controlsActivated = true;
}

var displayNextLevel = function(levelSpeed){

    $('#level').css('height', window.innerHeight/1.8);
  
    $('#level').css('margin-top', window.innerHeight/8);
    $('#level').css('margin-left', window.innerWidth/4);
    $('#level').css('opacity', '0').fadeTo(2000, 0.3)
  
    $('#level #hlvl').animate({fontSize:'50em', width:'5000px', textAlign:'center'},3000,

        function(){ // callback, detta utförs när animationen är klar

            $('#level #hlvl').css('font-size', '4em');
            $('#level #hlvl').css('width', '30px');
            $('#level').css('display', 'none');

    }); 

    $('#level #lvl').html(levelSpeed);

}



function endGame(id, totalCoins){

    gameRunning = false;

    playSound('fail');

    if(!muted)
        toggleInGameMusic();

    setTimeout(function(){
        playSound('gameOver');
    }, 300);

    setTimeout(function(){
        if(!muted)
            toggleStartMusic();
    }, 1000);

    // för att nå variabeln globalt i filen
    score = totalCoins;

    //kan bara submitta om man fått mer än en coin... f
    if(score >= 1)
        $('#highScoreField').show();

    // stop loop
    window.cancelAnimationFrame(id);

    $('#WebGL-container').css('opacity', '1').fadeTo(500, 0.8)
    var time = $('#timer span').html();

    // show results
    $('.someInfo #time').html(time);
    $('.someInfo #totalcoins').html(totalCoins);

    $('#gameOverScreen').css('height', 300);
    $('#gameOverScreen').css('width', 830);
    $('#gameOverScreen').css('margin-top', window.innerHeight/4);
    $('#gameOverScreen').css('margin-left', window.innerWidth/4);
    $('#gameOverScreen').css('opacity', '0').fadeTo(500, 0.8)

    //restart page
    $('#playAgainButton').click(function(){
       //sätter url till playagain
        if(checkRefresh() != 'playagain'){
            location.href = location.href+'?playagain'; 
            console.log(location.href);
            location.reload();
        }else{
            location.reload(); 
        }
    });

    //restart page på ENTER 
    $(document).keypress(function(e) {
    if(e.which == 13) {
        //sätter url till playagain
        if(checkRefresh() != 'playagain'){
            location.href = location.href+'?playagain'; 
            console.log(location.href);
            location.reload();
        }else{
            location.reload();
             
        }
    }
});

    gameOver = true;

}

function startGameScreen(){

    if(!muted)
        toggleStartMusic();

    $('#WebGL-container').css('opacity', '1').fadeTo(2000, 0.8)

    $('#startGameScreen').css('height', 380);
    $('#startGameScreen').css('width', 830);
    $('#startGameScreen').css('margin-top', window.innerHeight/8);
    $('#startGameScreen').css('margin-left', window.innerWidth/4);
    $('#startGameScreen #options').css('width', window.innerWidth/3);
    $('#startGameScreen #spaceshipdiv').css('height', window.innerHeight/2.5);

    $('#startGameScreen').css('opacity', '0').fadeTo(2000, 0.8)

    //gameOver = true; 

}

var muteMusic = function(){

    if(gameRunning)
        toggleInGameMusic();

    else
        toggleStartMusic();

    if(!muted){
        $('#mute').html('<img id = "volume" src = "images/volume-mute.png">');
        muted = true;
    }
    else{
        $('#mute').html('<img id = "volume" src = "images/volume-max.png">');
        muted = false;
    }


}

//about
var about = function(){

    alert("Made by Nova, Ogge, Kängen, Yosuf och Runkebaum")
}

//ta bort startscreen
function playGame()
{
    
    //0.5sek delay innan countdown
    setTimeout(function(){

        if(!muted)
            toggleStartMusic();
        //3, 2, 1
        showCountDown();

    }, 500);

    //aktiverar kontroller på 2.3 sek delay
    setTimeout(function(){

        if(!muted)
            toggleInGameMusic();
        activateControls();
        startTimer();
    }, 2300);

    gameOver = false;

    $('#WebGL-container').css('opacity', '1').fadeTo(500, 1);
    $('#startGameScreen').css('display', 'none');
       
}

//Hyffsat hårdkodad!

function showCountDown(){

    playCountDownSound();

    $('#countDown').css('margin-top', window.innerHeight/3);

    $('#countDown').animate({ opacity: 0 }, 0);
    $('#countDown').animate({ opacity: 0.6}, 200);
    $('#countDown').css('opacity', '0.6').fadeTo(350, 0);


    setTimeout(function(){

        $('#countDown').animate({ opacity: 0 }, 0);
        $('#countDown').animate({ opacity: 0.6}, 200);

        $('#countDown').css('opacity', '0.6').fadeTo(350, 0);
    }, 100);

    setTimeout(function(){

        $('#countDown').animate({ opacity: 0 }, 0);
        $('#countDown').animate({ opacity: 0.6 }, 200);

        $('#countDown').css('opacity', '0.6').fadeTo(350, 0);
    }, 200);

    setTimeout(function(){

        $('#countDown').show();
        $('#countDown').animate({ opacity: 0 }, 0);
        $('#countDown').animate({ opacity: 0.6 }, 500);

        $('#countDown').css('opacity', '0.6').fadeTo(350, 0);
    
    }, 300);

    setTimeout(function(){$('#countDown').html('<h1 id ="countDownH">2</h1>');}, 600);
    setTimeout(function(){$('#countDown').html('<h1 id ="countDownH">1</h1>');}, 1200);


    setTimeout(function(){

        $('#countDown').css('background-color', 'green');
        $('#countDown').html('<h1 id ="countDownH">GO!</h1>');

    }, 1800);

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

function sendHighscore(){

    var name = $('#playerNameField').val();

    if($.trim(name) != ''){

        $.post('php/send_highscore.php', {name: name, score : score}, function(data){
        
            $('#feedbackInput').html(data);

        });
    }

    else
        $('#feedbackInput').html("You have to enter a name");

}

function viewHighscores(){

    $('.someInfo').html("");
    $('.someInfo').append('<table style = "border-collapse:collapse; margin-top:10px;"><tr><td width ="600"><p style = "color:lightblue;">Player</p></td> <td><p style = "color:lightblue;" > Score</p></td></tr>');

    $.getJSON("php/get_highscores.php",function(result){
        
        if(result.length === 0){

            $('.someInfo').append('<p>No highscores to show</p>');
            return;

        }


        for(var i = 0; i < 5; i++){ // i < result.length för hela

            $('.someInfo').append("<tr ><td style = 'padding-top:5px;' width = '600'><p>" + (i + 1)  + '. ' + result[i].name + 
                                  '</td><td><p>' + result[i].score + '</p></td></tr>');
        }

        $('.someInfo').append('</table>');

    });

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

