angular.module('App.ideaBtn', [])

.directive('ideaButton', ['Ideas', '$state', 'DisplayGif', function(Ideas, $state, DisplayGif) {
  return {
    link: function($scope, e, attr) {
      // Gets idea and flags controller for more info to show
      $scope.getIdea = function() {
        Ideas.getIdea($scope.filter)
        .then(function(idea) {
          $scope.data = idea.data;
          $scope.idea = idea.data.display;
          $scope.moreInfo = true;
          $scope.sideBtns = true;
          $scope.eventList = false;
          $scope.changeClass();
          $scope.button = "Next";
          $scope.yelpResults = '';
          $scope.wikiResults = '';
        });
      }
      // Gives the Idea display the ability to be clicked
      $scope.changeClass = function() {
        if ($scope.class === "noInfo") {
          $scope.class = "getInfo";
        }
      }
      // Will populate with API data, using dummy data now
      $scope.getList = function(e) {
        if ($scope.moreInfo) {

          $scope.eventList = true;
          $scope.moreInfo = false; // The moreInfo area should not be clickable after clicked
          Ideas.getYelp($scope.data.yelpSearch)
          .then(function(resp) {
            $scope.yelpResults = resp.data;
            DisplayGif.endGif();
            // Animates list when data loads
            $('.listWrapper').css("opacity", "0").show();
            $('.listWrapper ').animate({'max-height': "1000px"}, 300, 'linear', function () {
              $('.listWrapper').animate({opacity: "1"}, 300);
              $('.get-idea-btn').show();
            });
          });
          Ideas.getWiki($scope.data.wikiSearch)
          .then(function(resp) {
            $scope.wikiResults = resp.data;
          });
          $('.get-idea-btn').hide();
          DisplayGif.startGif();


          // $state.go('list', {id:$scope.idea});
          // console.log('Needs to populate list');
        }
      }
      // Allows directive to track filter value that is passed using getIdea()
      var menu = document.getElementById('filterMenu');
      menu.addEventListener('change', function(e) {
        $scope.filter = e.target.value;
      })
    }
  }

}])
