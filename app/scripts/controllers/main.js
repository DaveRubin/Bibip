'use strict';

/**
 * @ngdoc function
 * @name bibiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bibiApp
 */


angular.module('bibiApp')
  .controller('MainCtrl', function ($scope,$window,$interval,$http) {

    var api = "http://bibipnetanyahu.org/server/api.php?endpoint=counter";
    var bufferBeeps = 0;
    $scope.loaded = false;
    $scope.color = 'color1';
    $scope.mobile = false;
    $scope.bibips = 0;
    $scope.degree = 0;
    $scope.eye = {x:0,y:0};
    $scope.pressed = false;
    $scope.animating = false;
    $scope.hairImage = 1;
    $scope.direction = 'right';

    function LoadBeeps() {
      $http.get(api).then(function (response) {
        //console.log(response.data.counter);
        //only update if it increments
        if ($scope.bibips < response.data.counter) {
          $scope.bibips = response.data.counter;
        }
        if (!$scope.loaded ) {
          $interval(function(){$scope.loaded = true;
          },1500,1);
        }
      });
    }

    $interval(function () {
        if (bufferBeeps>0) {
          //console.log("sending beeps" + bufferBeeps);
          bufferBeeps = 0;
          var Indata = {'i': bufferBeeps};
          $.post(api, Indata)
            .done(function( data ) {
              //console.log( data );
            });
        }
    }, 1500);

    $interval(LoadBeeps,3000);

    var promise;
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

    $('html').bind('touchmove', function(e) {
      if ($scope.mobile) {
        if (!$scope.pressed) {
          $scope.OnMouseClick(true);
          $interval(function(){
            $scope.OnMouseClick(false);
          },700,1);
        }
        $scope.OnMouseMove(e.originalEvent.touches[0]);
      }
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
      else if (degree > base+45  && degree < base+ 90 )   {$scope.direction = "down_left";}
      else if (degree > base+90  && degree < base+ 135 )  {$scope.direction = "right";}
      else if (degree > base+135 && degree < base+ 180 )  {$scope.direction = "top_left";}
      else if (degree > base+180 && degree < base+ 225 )  {$scope.direction = "top";}
      else if (degree > base+225 && degree < base+ 270 )  {$scope.direction = "top_right";}
      else if (degree > base+270 && degree < base+ 315 )  {$scope.direction = "left";}
      else if (degree > base+315 && degree < 360 )       {$scope.direction = "down_right";}
      if($scope.mobile && !$scope.$$phase) {
        $scope.$digest();
      }
      //console.log(degree + " , " + $scope.direction );
    };

    function playHair() {
      $scope.hairImage = 1;
      var times = 8;
      var j = 1;
      //select new hair color
      var index = Math.floor(Math.random()*7)+1;
      $scope.animating = true;
      $scope.color = 'color'+index;

      if (promise!=null) {
        $interval.cancel(promise);
      }

      promise = $interval(function () {
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
          $scope.animating = false;
          $scope.color = '';
        }
      }, 100, times)
    }

    $scope.OnMouseClick = function(pressed) {
      $scope.pressed = pressed;
      if (pressed) {
        $scope.bibips++;
        sounds[lastPlayedIndex].load();
        lastPlayedIndex = Math.floor(Math.random()*sounds.length);
        sounds[lastPlayedIndex].play();
        bufferBeeps++;
        playHair();
      }
    };

    updateCenter();
    loadSounds();
    LoadBeeps();

  });
