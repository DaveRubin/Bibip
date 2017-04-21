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
    $scope.bibips = 1234567;
    $scope.degree = 0;
    $scope.eye = {x:0,y:0};
    $scope.pressed = false;
    $scope.hairImage = "/images/hair/0.png";
    var sounds = [];
    var lastPlayedIndex  = 0;

    var eyesDistance = 5;
    var elipseRatio = 0.7;
    var centerPosition = {
      x:0,y:0
    };
    var mouseDistance = {x:0,y:0};

    function updateCenter() {
      centerPosition.x  = $window.innerWidth/2;
      centerPosition.y = $window.innerHeight/2;
      console.log(centerPosition);
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
    };

    function playHair() {
      var j = 0;
      $interval(function () {
        j++;
        $scope.hairImage = "/images/hair/"+j+".png"
        // console.log(" my j :"+j);
      }, 20, 5)
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
