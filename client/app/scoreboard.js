

var socket = io(silmarillion.remoteServer +":"+silmarillion.port, {
	options: {
		reconnection : true
	}
});	

var audioBuzzer = new Audio('buzzer.mp3');

	var clockValue = 0;
	var homePossession = true;
	var timer = null;
	var clientListDOM = $('#clientList'),
		input = $('input:text'),
		inputTooltip = $('#input-tooltip'),
		roomCodeElement = document.getElementById('roomCode'),
		homeTeamScore = document.getElementById('homeTeamScore'),
		awayTeamScore = document.getElementById('awayTeamScore'),
		clock = document.getElementById('clock'),
		period = document.getElementById('period'),
		possession = document.getElementById('poss');

	socket.emit('scoreboard', {});

	socket.on('roomCode', response => {
		console.log(response);
		roomCodeElement.innerHTML = response.roomCode;
	});

	socket.on('controllerConnected', () => { roomCodeElement.parentElement.hidden = true});

	socket.on('homeTeamScore', response => {
		console.log(response);
		homeTeamScore.innerHTML = parseInt(homeTeamScore.innerHTML) + response.points;
	});

	socket.on('awayTeamScore', response => {
		console.log(response);
		awayTeamScore.innerHTML = parseInt(awayTeamScore.innerHTML) + response.points;
	});

	socket.on('changeTime', response => {
		console.log(response);
		clockValue += response.time;
		calculateClock();
	});

	socket.on('startClock', response => {
		if(response.value){
			timer = clockInterval();
		} else {
			clearInterval(timer);
		}
	});

	socket.on('changePeriod', response => {
		period.innerHTML = parseInt(period.innerHTML) + response.value;
	});

	socket.on('changePossession', response => {

		homePossession = !homePossession
		possession.innerHTML = homePossession ? "<-- POSS" : "POSS -->";
	});

	function calculateClock() {
		var milli = (clockValue % 1) * 100;
		var seconds = clockValue % 60 > 0 ? Math.floor(clockValue % 60) : 00;
		var minutes = clockValue > 59 ? Math.floor(clockValue / 60) : 00;
		
		if(minutes < 1 && clockValue > 0){
			clock.style = "color: red;"
			clock.innerHTML = seconds.toString().padStart(2, '0') + ":" + milli.toFixed(0).toString().padStart(2,'0');
		} else {
			clock.style = "";
			clock.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toFixed(0).toString().padStart(2,'0');
		}
	}

	function clockInterval() {
		return setInterval(() => {
			clockValue -= .01;
			calculateClock();
			if(clockValue < 0){
				clearInterval(timer);
				blinkTimer();
				audioBuzzer.play();
			}
		}, 10);
	}

  function blinkTimer () {
	  var blinkTimer = setInterval(() => {
		  if(clock.style.visibility == "hidden"){
			clock.style.visibility = "visible";
		  } else {
			  clock.style.visibility = "hidden"
		  }
	  }, 500);
	  setTimeout(() => {
		  clearInterval(blinkTimer);
	  }, 5000)
  }
  
  function sendChatMessageToServer () {
				socket.emit('datain', { 'input' : input.val()});
				input.val('');
  }