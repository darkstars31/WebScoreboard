

var socket = io(silmarillion.remoteServer +":"+silmarillion.port);	

var audioBuzzer = new Audio('buzzer.mp3');

	var clockValue = 0;
	var timer = null;
	var clientListDOM = $('#clientList'),
		input = $('input:text'),
		inputTooltip = $('#input-tooltip'),
		roomCodeElement = document.getElementById('roomCode'),
		homeTeamScore = document.getElementById('homeTeamScore'),
		awayTeamScore = document.getElementById('awayTeamScore'),
		clock = document.getElementById('clock');

	socket.emit('scoreboard', {});

	socket.on('roomCode', response => {
		console.log(response);
		roomCodeElement.innerHTML = response.roomCode;
	});

	socket.on('contorllerConnected', () => { roomCodeElement.parentElement.hidden = true});

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

	function calculateClock() {
		var style = ""
		var seconds = clockValue % 60 > 0 ? clockValue % 60 : 00;
		var minutes = clockValue > 59 ? Math.floor(clockValue / 60) : 00;
		if(minutes < 1 ){
			style = "color: red;"
		} else {
			style = "";
		}
		clock.style = style;
		clock.innerHTML = minutes.toString().padStart(2, '0') + ":" + seconds.toFixed(0).toString().padStart(2,'0');
	}

	function clockInterval() {
		return setInterval(() => {
			clockValue -= 1;
			calculateClock();
			if(clockValue < 0){
				clearInterval(timer);
				audioBuzzer.play();
			}
		}, 1000);
	}
  
  function sendChatMessageToServer () {
				socket.emit('datain', { 'input' : input.val()});
				input.val('');
  }