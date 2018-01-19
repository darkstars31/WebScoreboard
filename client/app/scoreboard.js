var socket = io(silmarillion.remoteServer +":"+silmarillion.port);	

	var clientListDOM = $('#clientList'),
		input = $('input:text'),
		inputTooltip = $('#input-tooltip'),
		roomCodeElement = document.getElementById('roomCode'),
		homeTeamScore = document.getElementById('homeTeamScore');
		awayTeamScore = document.getElementById('awayTeamScore');

	socket.emit('scoreboard', {});

	socket.on('roomCode', response => {
		console.log(response);
		roomCodeElement.innerHTML = response.roomCode;
	});

	socket.on('contorllerConnected', () => { roomCodeElement.hidden = true});

	socket.on('homeTeamScore', response => {
		console.log(response);
		homeTeamScore.innerHTML = parseInt(homeTeamScore.innerHTML) + response.points;
	});

	socket.on('awayTeamScore', response => {
		console.log(response);
		awayTeamScore.innerHTML = parseInt(awayTeamScore.innerHTML) + response.points;
	});
  
  function sendChatMessageToServer () {
				socket.emit('datain', { 'input' : input.val()});
				input.val('');
  }