var socket = io(silmarillion.remoteServer +":"+silmarillion.port);	


	var clientListDOM = $('#clientList'),
		input = $('input:text'),
		inputTooltip = $('#input-tooltip');

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

  
  function sendChatMessageToServer () {
				socket.emit('datain', { 'input' : input.val()});
				input.val('');
  }