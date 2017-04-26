app.controller('AboutCtrl', ['$scope', function($scope) {}]);

/*
app.controller('AboutCtrl', ['$scope', function($scope) {
    var vm = this;
    vm.enabled = false;
    vm.data = [];
    vm.MyData = {
        x: '0',
        y: '0'
    }

    var prevSecond = -1;
    var video = null;
    var overlay = null;
    var count = 0;

    vm.Start = function() {
        var prediction = webgazer.getCurrentPrediction();
        if (prediction) {
            var x = prediction.x;
            var y = prediction.y;
        }

        if (prediction) {
            var newData = { x: prediction.x, y: prediction.y };
            vm.data.push(newData);
            //$scope.$apply();
        }
    }

    vm.Stop = function() {
        webgazer.end();
    }

    // vm.GetStyle = function(){
    // 	return {
    // 		'top': 
    // 	}
    // }

    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            //console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            //console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */

            var second = Math.floor((clock / 1000) % 1000);
            if (second !== prevSecond) {
                console.log(second);
                prevSecond = second;
                if (data) {
                	count++;
                	if(count === 5){
                		video.style.display = 'none';
                		overlay.style.display = 'none';
                	}
                	vm.MyData.x = data.x + 'px';
                	vm.MyData.y = data.y + 'px';
                    var newData = { x: data.x, y: data.y };
                    vm.data.push(newData);
                    $scope.$apply();
                }
            }


            ///if (data && vm.enabled) {
            // if (data) {
            //     var newData = { x: data.x, y: data.y };
            //     vm.data.push(newData);

            //     $scope.$apply();
            // }
        })
        .begin()
        .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */


/*

    var width = 320;
    var height = 240;
    var topDist = '0px';
    var leftDist = '0px';


    var setup = function() {

        video = document.getElementById('webgazerVideoFeed');
        video.style.display = 'block';
        video.style.position = 'absolute';
        video.style.top = topDist;
        video.style.left = leftDist;
        video.width = width;
        video.height = height;
        video.style.margin = '0px';

        webgazer.params.imgWidth = width;
        webgazer.params.imgHeight = height;

        overlay = document.createElement('canvas');
        overlay.id = 'overlay';
        overlay.style.position = 'absolute';
        overlay.width = width;
        overlay.height = height;
        overlay.style.top = topDist;
        overlay.style.left = leftDist;
        overlay.style.margin = '0px';


        document.body.appendChild(overlay);



        // var overlay = document.createElement('canvas');
        // document.body.appendChild(overlay);



        // var width = 320;
        // var height = 240;
        // webgazer.params.imgWidth = width;
        // webgazer.params.imgHeight = height;


        var cl = webgazer.getTracker().clm;

        function drawLoop() {
            requestAnimFrame(drawLoop);

            overlay.getContext('2d').clearRect(0, 0, width, height);
            if (cl.getCurrentPosition()) {
                cl.draw(overlay);
            }

        }
        drawLoop();
    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady, 100);

}]);

window.onbeforeunload = function() {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}
*/