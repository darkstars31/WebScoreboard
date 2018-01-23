var socket = io(silmarillion.remoteServer +":"+silmarillion.port);	

	var isClockOn = false;
	var clientListDOM = $('#clientList'),
		input = $('input:text'),
		inputTooltip = $('#input-tooltip'),
		timer = $('#timer');

	var roomCode = prompt("Please Enter the room code for your scoreboard");
	socket.emit('controller', { roomCode: roomCode});

	function homeTeamChangeScore(score) {
		console.log('h');
		socket.emit('changeScore', { team: "home", change: score});
	}

	function awayTeamChangeScore(score) {
		console.log('a');
		socket.emit('changeScore', { team: "away", change: score});
	}

  
	function addTime(time) {
		console.log('t');
		socket.emit('changeTimer', { time: time});
	}

	function startClock() {
		isClockOn = !isClockOn;
		isClockOn ? timer.html("Pause") : timer.html("Start");
		socket.emit('startClock', { value: isClockOn});
	}

	function changePeriod(value){
		socket.emit('changePeriod', { value: value});
	}

	function changePossession(){
		socket.emit('changePossession', {});
	}

  function sendChatMessageToServer () {
				socket.emit('datain', { 'input' : input.val()});
				input.val('');
  }