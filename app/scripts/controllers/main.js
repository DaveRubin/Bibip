'use strict';

/**
 * @ngdoc function
 * @name bibiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bibiApp
 */
angular.module('bibiApp')
  .controller('MainCtrl', function ($scope,$window,$interval) {

    $scope.mobile = false;
    $scope.bibips = 1234567;
    $scope.degree = 0;
    $scope.eye = {x:0,y:0};
    $scope.pressed = false;
    $scope.animating= false;
    $scope.hairImage = 1;
    $scope.direction = 'down';

    var sounds = [];
    var lastPlayedIndex  = 0;
    var eyesDistance = 5;
    var elipseRatio = 0.7;
    var centerPosition = {
      x:0,y:0
    };
    var mouseDistance = {x:0,y:0};

    var playing = 0;

    function updateCenter() {
      centerPosition.x  = $window.innerWidth/2;
      centerPosition.y = $window.innerHeight/2;
      var isMobile = $window.innerWidth < $window.innerHeight;
      if (isMobile != $scope.mobile) {
        $scope.mobile = isMobile;
        console.log(isMobile);
      }
    }

    function loadSounds() {
      for (var i = 0; i < 7; i++) {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', "/sounds/bip"+i+".wav");
        sounds.push(audioElement);
      }
    }

    angular.element($window).bind('resize', function () {
      updateCenter();
    });

    $scope.OnMouseMove = function($event) {
      mouseDistance.x = $event.clientX -centerPosition.x;
      mouseDistance.y = $event.clientY-centerPosition.y;
      var degree = -Math.atan2(mouseDistance.x,mouseDistance.y);
      $scope.degree = degree/(Math.PI/180);
      $scope.eye.x = -Math.sin(degree)*eyesDistance;
      $scope.eye.y = Math.cos(degree)*eyesDistance*elipseRatio;

      var base = -22.5;
      degree = $scope.degree +180;
      if (degree > base + 360 || degree< base+ 45)        {$scope.direction = "down";}
      else if (degree > base+45  && degree < base+ 90 )   {$scope.direction = "top_right";}
      else if (degree > base+90  && degree < base+ 135 )  {$scope.direction = "right";}
      else if (degree > base+135 && degree < base+ 180 )  {$scope.direction = "down_right";}
      else if (degree > base+180 && degree < base+ 225 )  {$scope.direction = "top";}
      else if (degree > base+225 && degree < base+ 270 )  {$scope.direction = "down_left";}
      else if (degree > base+270 && degree < base+ 315 )  {$scope.direction = "left";}
      else if (degree > base+315 && degree < 360 )       {$scope.direction = "top_left";}

      console.log(degree + " , " + $scope.direction );
    };

    function playHair() {
      $scope.hairImage = 1;
      var times = 10;
      var j = 1;
      $scope.animating = true;
      playing++;
      $interval(function () {
        if (j!= times) {
          j++;
          if (j>2) {
            $scope.hairImage = j%2 + 2;
          }
          else {
            $scope.hairImage = j;
          }
        }
        else {
          playing--;
          if (playing == 0) {
            $scope.animating = false;
          }
        }
        console.log(" my j :"+$scope.hairImage);
      }, 100, times)
    }

    $scope.OnMouseClick = function(pressed) {
      $scope.pressed = pressed;
      if (pressed) {
        $scope.bibips++;
        sounds[lastPlayedIndex].load();
        lastPlayedIndex = Math.floor(Math.random()*sounds.length);
        sounds[lastPlayedIndex].play();
        playHair();
      }
    };

    updateCenter();

    loadSounds();

  });
