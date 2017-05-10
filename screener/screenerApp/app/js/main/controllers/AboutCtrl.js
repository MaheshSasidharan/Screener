// app.controller('AboutCtrl', ['$scope', function($scope) {}]);
app.controller('AboutCtrl', ['$scope', '$timeout', function($scope, $timeout) {
    
}]);

// app.controller('AboutCtrl', ['$scope', '$timeout', function($scope, $timeout) {
//     var vm = this;
//     vm.enabled = false;
//     vm.data = [];
//     vm.MyData = {
//         x: '0',
//         y: '0'
//     }
//     vm.ClickArea = {
//         status: '',
//         clicked: ''
//     }
//     vm.GazeGrid = {
//         row: 3,
//         col: 3,
//         gridData: [],
//         gridVal: 1,
//         bShow: false,
//         bShowGridStatBox: false,
//         bShowGridStats: false,
//         PopulateGrid: function() {
//             for (var i = 0; i < this.row; i++) {
//                 this.gridData[i] = [];
//                 for (var j = 0; j < this.col; j++) {
//                     this.gridData[i].push(this.gridVal++);
//                 }
//             }
//         },
//         ShowHideGrid: function(sType) {
//             if (sType === 'show') {
//                 this.bShow = true;
//             } else { // hide
//                 this.bShow = false;
//             }
//         },
//         nSelectedGridNum: null,
//         left: null,
//         top: null,
//         width: null,
//         height: null,
//         nPositionRow: null,
//         nPositionCol: null,
//         arrPredictedGaze: [],
//         CalcGridPostion: function() {
//             var that = this;
//             $timeout(function() {
//                 //var myElement = angular.element(document.querySelector('#GazeGrid tr:first-child td:first-child'));
//                 var myElement = angular.element(document.querySelectorAll('#GazeGrid tr td'));
//                 var viewportOffset = myElement[that.nSelectedGridNum - 1].getBoundingClientRect();
//                 that.left = viewportOffset.left;
//                 that.top = viewportOffset.top;
//                 that.height = viewportOffset.height;
//                 that.width = viewportOffset.width;
//                 console.log(that);
//             }, 100);
//         },
//         CalcGridChildArea: function() {
//             var nChild = this.nSelectedGridNum;
//             if (nChild > this.row * this.col || nChild <= 0) {
//                 alert('This grid is not present');
//             }
//             var nPositionRow = 0,
//                 nPositionCol = 0;
//             // Get Row Position
//             do {
//                 nPositionRow++;
//             } while ((nPositionRow <= this.row) && nChild > (this.row * nPositionRow))
//             // Get Col Position
//             do {
//                 nPositionCol++;
//             } while ((nPositionCol <= this.col) && nChild > (((nPositionRow - 1) * this.row) + nPositionCol))
//             console.log("Child: " + nChild + " Row: " + nPositionRow + " Col:" + nPositionCol);

//             this.nPositionRow = nPositionRow;
//             this.nPositionCol = nPositionCol;
//         },
//         CalculateMainGaze: function() {
//             var that = this;
//             var rightX = 0,
//                 rightY = 0,
//                 rightXY = 0;
//             this.arrPredictedGaze.forEach(function(oP) {
//                 if (oP.x >= that.left && oP.x <= that.left + that.width) {
//                     rightX++;
//                 }
//                 if (oP.y >= that.top && oP.y <= that.top + that.height) {
//                     rightY++;
//                 }
//                 if (oP.x >= that.left && oP.x <= that.left + that.width) {
//                     if (oP.y >= that.top && oP.y <= that.top + that.height) {
//                         rightXY++;
//                     }
//                 }
//             });

//             var nTotalPredCount = this.arrPredictedGaze.length;
//             console.log("Correct X: " + rightX + " out of " + nTotalPredCount + ". Percentage: " + (rightX / nTotalPredCount));
//             console.log("Correct Y: " + rightY + " out of " + nTotalPredCount + ". Percentage: " + (rightY / nTotalPredCount));
//             console.log("Correct BOTH: " + rightXY + " out of " + nTotalPredCount + ". Percentage: " + (rightXY / nTotalPredCount));

//             return {
//                 rightX: rightX,
//                 rightY: rightY,
//                 rightXY: rightXY,
//                 nTotalPredCount: nTotalPredCount
//             }
//         },
//         SetRowCol: function(r, c) {
//             this.row = r;
//             this.col = c;
//             console.log("ROWs --" + r + " COLs --" + c);
//         }
//     }
//     vm.Stats = {
//         rightX: 0,
//         rightY: 0,
//         rightXY: 0,
//         nTotalPredCount: 0,
//         rightXPer: 0,
//         rightXPer: 0,
//         rightXYPer: 0,
//     }
//     var bGridStareModeOn = false;

//     /*
//     vm.GazeGrid.SetRowCol(3,3);
//     vm.GazeGrid.CalcGridChildArea(2);
//     vm.GazeGrid.CalcGridChildArea(3);
//     vm.GazeGrid.CalcGridChildArea(5);
//     vm.GazeGrid.CalcGridChildArea(7);


//     vm.GazeGrid.SetRowCol(5,4);
//     vm.GazeGrid.CalcGridChildArea(2);
//     vm.GazeGrid.CalcGridChildArea(7);
//     vm.GazeGrid.CalcGridChildArea(17);
//     */


//     var prevSecond = -1;
//     var video = null;
//     var overlay = null;
//     var count = 0;

//     var arrClickPoints = [];
//     var arrClickPointIndexes = [4, 0, 3, 6, 7, 4, 1, 2, 5, 8, 4];
//     //arrClickPointIndexes = [4, 0, 3, 4]; // for testing
//     var arrClickPointIndexesIndex = 0;

//     vm.Start = function() {
//         var prediction = webgazer.getCurrentPrediction();
//         if (prediction) {
//             var x = prediction.x;
//             var y = prediction.y;
//         }

//         if (prediction) {
//             var newData = { x: prediction.x, y: prediction.y };
//             vm.data.push(newData);
//             //$scope.$apply();
//         }
//     }

//     vm.Play = function() {
//         webgazer.resume();
//     }
//     vm.Pause = function() {
//         webgazer.pause();
//     }
//     vm.Resume = function() {
//         webgazer.resume();
//     }
//     vm.Stop = function() {
//         webgazer.end();
//     }

//     vm.MyCustomCallback = function() {
//         vm.StartCustomTestData();
//     }

//     vm.StartCustomTestData = function() {
//         var size = {
//             width: window.innerWidth || document.body.clientWidth,
//             height: window.innerHeight || document.body.clientHeight
//         }
//         var boxWidth = 150,
//             boxHeight = 150;

//         var xDelta = Math.floor((size.width - boxWidth) / 10);
//         var yDelta = Math.floor((size.height - boxHeight) / 5);

//         var delay = -300;
//         for (var y = 0; y <= size.height; y = y + yDelta) {
//             for (var x = 0; x <= size.width; x = x + xDelta) {
//                 delay = delay + 300;
//                 (function(modifiedX, modifiedY) {
//                     setTimeout(function() {
//                         vm.MyData.x = modifiedX + 'px';
//                         vm.MyData.y = modifiedY + 'px';
//                         webgazer.addMouseEventListeners_Custom(modifiedX, modifiedY);
//                         $scope.$apply();
//                     }, delay);
//                 })(x, y);
//             }
//         }
//     }

//     vm.Helper = {
//         Init: function() {
//             this.PrepareClickPointArray();
//             this.ClickAreaOnClick();
//             vm.GazeGrid.PopulateGrid();
//             //vm.GazeGrid.ShowHideGrid('hide');
//         },
//         TempInit: function() {
//             //vm.ClickArea.status = '';
//             //webgazer.ShowHideGazeGot('hide');
//             vm.GazeGrid.ShowHideGrid('show');
//             vm.GazeGrid.nSelectedGridNum = 6;
//             vm.GazeGrid.CalcGridPostion();
//         },
//         GetNextClickPoint: function() {
//             // Manage class of ClickArea
//             this.ClassOfClickArea();

//             if (arrClickPointIndexesIndex < arrClickPointIndexes.length) {
//                 return arrClickPoints[arrClickPointIndexes[arrClickPointIndexesIndex++]];
//             } else {
//                 return null;
//             }
//         },
//         ClickAreaOnClick: function() {
//             var oClickPoint = this.GetNextClickPoint();
//             if (oClickPoint) {
//                 this.InitClickArea(oClickPoint);
//             }
//         },
//         InitClickArea: function(oClickPoint) {
//             vm.MyData.x = oClickPoint.x;
//             vm.MyData.y = oClickPoint.y;
//         },
//         ClassOfClickArea: function() {
//             if (arrClickPointIndexesIndex < arrClickPointIndexes.length) {
//                 //vm.ClickArea.clicked = 'clicked';
//                 vm.ClickArea.status = 'show';
//                 $timeout(function() {
//                     vm.ClickArea.clicked = '';
//                 }, 1000);
//             } else {
//                 vm.ClickArea.status = '';
//                 //webgazer.ShowHideGazeGot('hide');
//                 //vm.GazeGrid.PopulateGrid();
//                 vm.GazeGrid.ShowHideGrid('show');
//                 this.SetGazeOnGridNumber(6);
//             }
//         },
//         SetGazeOnGridNumber: function(nNum) {
//             vm.GazeGrid.bShowGridStatBox = true;
//             vm.GazeGrid.bShowGridStats = false;
//             vm.GazeGrid.nSelectedGridNum = nNum;
//             vm.GazeGrid.CalcGridPostion();
//             vm.GazeGrid.arrPredictedGaze = [];
//             //vm.GazeGrid.CalcGridChildArea();
//             bGridStareModeOn = true;
//             webgazer.showPredictionPoints(true);
//             $timeout(function() {
//                 bGridStareModeOn = false;
//                 webgazer.showPredictionPoints(false);
//                 console.log(vm.GazeGrid.arrPredictedGaze);
//                 var result = vm.GazeGrid.CalculateMainGaze();
//                 vm.Helper.ShowResult(result);
//             }, 5000);
//         },
//         ShowResult: function(result) {
//             vm.GazeGrid.bShowGridStats = true;
//             vm.Stats.rightX = result.rightX;
//             vm.Stats.rightY = result.rightY;
//             vm.Stats.rightXY = result.rightXY;
//             vm.Stats.nTotalPredCount = result.nTotalPredCount;
//             vm.Stats.rightXPer = (result.rightX / result.nTotalPredCount) * 100;
//             vm.Stats.rightYPer = (result.rightY / result.nTotalPredCount) * 100;
//             vm.Stats.rightXYPer = (result.rightXY / result.nTotalPredCount) * 100;
//         },
//         MyCustomCallback: function() {
//             this.StartCustomTestData();
//         },
//         PrepareClickPointArray: function() {
//             var size = {
//                 width: window.innerWidth || document.body.clientWidth,
//                 height: window.innerHeight || document.body.clientHeight
//             }
//             var boxWidth = 150,
//                 boxHeight = 150;

//             var xDelta = Math.floor((size.width - boxWidth) / 2);
//             var yDelta = Math.floor((size.height - boxHeight) / 2);

//             for (var y = 0; y <= size.height; y = y + yDelta) {
//                 for (var x = 0; x <= size.width; x = x + xDelta) {
//                     arrClickPoints.push({
//                         x: x + 'px',
//                         y: y + 'px'
//                     });
//                 }
//             }
//         },
//         ShowMatrix: function() {

//         },
//         StartCustomTestData: function() {
//             var size = {
//                 width: window.innerWidth || document.body.clientWidth,
//                 height: window.innerHeight || document.body.clientHeight
//             }
//             var boxWidth = 143,
//                 boxHeight = 28;

//             var xDelta = Math.floor((size.width - boxWidth) / 10);
//             var yDelta = Math.floor((size.height - boxHeight) / 5);

//             var delay = -300;
//             for (var y = 0; y <= size.height; y = y + yDelta) {
//                 for (var x = 0; x <= size.width; x = x + xDelta) {
//                     delay = delay + 300;

//                     (function(modifiedX, modifiedY) {
//                         setTimeout(function() {
//                             vm.MyData.x = modifiedX + 'px';
//                             vm.MyData.y = modifiedY + 'px';

//                             webgazer.addMouseEventListeners_Custom(modifiedX, modifiedY);

//                             $scope.$apply();
//                         }, delay);
//                     })(x, y);
//                 }
//             }
//         }
//     }

//     vm.Helper.Init();
//     //vm.Helper.TempInit();

//     webgazer.setRegression('ridge') /* currently must set regression and tracker */
//         .setTracker('clmtrackr')
//         .setGazeListener(function(data, clock) {
//             if (bGridStareModeOn) {
//                 vm.GazeGrid.arrPredictedGaze.push(data);
//             }
//             //console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
//             //console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */

//             /*
//             var second = Math.floor((clock / 1000) % 1000);
//             if (second !== prevSecond) {
//                 console.log(second);
//                 prevSecond = second;
//                 if (data) {
//                     count++;
//                     if (count === 5) {
//                         return;
//                         video.style.display = 'none';
//                         overlay.style.display = 'none';
//                     }
//                     /*
//                     vm.MyData.x = data.x + 'px';
//                     vm.MyData.y = data.y + 'px';
//                     */
//             /*
//                     var newData = { x: data.x, y: data.y };
//                     vm.data.push(newData);
//                     $scope.$apply();
//                 }
//             }
//             */

//             ///if (data && vm.enabled) {
//             // if (data) {
//             //     var newData = { x: data.x, y: data.y };
//             //     vm.data.push(newData);

//             //     $scope.$apply();
//             // }
//         })
//         .begin()
//         .showPredictionPoints(false); /* shows a square every 100 milliseconds where current prediction is */




//     var width = 320;
//     var height = 240;
//     var topDist = '50px';
//     var leftDist = '0px';


//     var setup = function() {

//         video = document.getElementById('webgazerVideoFeed');
//         video.style.display = 'block';
//         video.style.position = 'absolute';
//         video.style.top = topDist;
//         video.style.left = leftDist;
//         video.width = width;
//         video.height = height;
//         video.style.margin = '0px';

//         webgazer.params.imgWidth = width;
//         webgazer.params.imgHeight = height;

//         overlay = document.createElement('canvas');
//         overlay.id = 'overlay';
//         overlay.style.position = 'absolute';
//         overlay.width = width;
//         overlay.height = height;
//         overlay.style.top = topDist;
//         overlay.style.left = leftDist;
//         overlay.style.margin = '0px';


//         document.body.appendChild(overlay);




//         // var overlay = document.createElement('canvas');
//         // document.body.appendChild(overlay);



//         // var width = 320;
//         // var height = 240;
//         // webgazer.params.imgWidth = width;
//         // webgazer.params.imgHeight = height;


//         var cl = webgazer.getTracker().clm;

//         function drawLoop() {
//             requestAnimFrame(drawLoop);

//             overlay.getContext('2d').clearRect(0, 0, width, height);
//             if (cl.getCurrentPosition()) {
//                 cl.draw(overlay);
//             }

//         }
//         drawLoop();
//     };

//     function checkIfReady() {
//         if (webgazer.isReady()) {
//             setup();
//         } else {
//             setTimeout(checkIfReady, 100);
//         }
//     }
//     setTimeout(checkIfReady, 100);
// }]);

// window.onbeforeunload = function() {
//     //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
//     window.localStorage.clear(); //Comment out if you want to save data across different sessions 
// }
