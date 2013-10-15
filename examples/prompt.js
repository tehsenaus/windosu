
var windosu = require('../lib/windosu');
var prompt = require('prompt');

prompt.start();

prompt.get([{					
	name: 'r',
	description: 'Invoke windosu?'
}], function (ans) {

	var cmd = "cmd /C hello.cmd";
	windosu.exec(cmd).then(function () {

//		setTimeout(function () {

		prompt.get([{					
			name: 'r',
			description: 'Did that work?'
		}], function () {

			console.log('All done!');

		});

//	}, 1000);

	})


});


