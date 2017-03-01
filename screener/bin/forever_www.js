var forever = require('forever-monitor');

var child = new(forever.Monitor)('www', {
    max: 3,
    silent: true,
    options: []
});

child.on('exit', function() {
    console.log('app.js has exited after 3 restarts');
});

child.start();
