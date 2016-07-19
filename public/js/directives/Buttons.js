angular.module('App.ideaBtn', [])

.directive('ideaButton', ['Ideas', '$state', 'DisplayGif', 'SuggestionFactory', function(Ideas, $state, DisplayGif, SuggestionFactory) {
  return {
    link: function($scope, e, attr) {
      // Gets idea and flags controller for more info to show
      $scope.getIdea = function() {
        $scope.generateRandomIdea($scope.filter, function(idea) {
          $scope.data = idea;
          $scope.idea = idea.display;
          $scope.moreInfo = true;
          $scope.hasSuggestions = true;
          $scope.changeClass();
          $scope.button = "Next";
          $scope.yelpResults = '';
          $scope.wikiResults = '';
        });
      };
      // Gives the Idea display the ability to be clicked
      $scope.changeClass = function() {
        if ($scope.class === "noInfo") {
          $scope.class = "getInfo";
        }
      };
      // Will populate with API data, using dummy data now
      $scope.getList = function(e) {
        if ($scope.moreInfo && $scope.hasSuggestions) {
          $scope.eventList = true;
          $scope.moreInfo = false; // The moreInfo area should not be clickable after clicked
          $scope.timeout = true;

          Ideas.getYelp($scope.data.yelpSearch)
          .then(function(resp) {
            $scope.yelpResults = resp.data;
            DisplayGif.endGif();
            $scope.timeout = false;
            $scope.dropdown = true;
            var maxHeight = ((Ideas.queryData.count) * 200);
            $('.listWrapper').css("opacity", "0").show();
            $('.listWrapper ').animate({'max-height': maxHeight+'px'}, 300, 'linear', function () {
              $('.listWrapper').animate({opacity: "1"}, 300);
            });
          });
          Ideas.getWiki($scope.data.wikiSearch)
          .then(function(resp) {
            $scope.wikiResults = resp.data;
          });
          $('.get-idea-btn').hide();
          DisplayGif.startGif();
        }
        else {
          $scope.dropdown = false;
          $scope.eventList = false;
          $scope.moreInfo = true;
          $('.get-idea-btn').show();
          $('.listWrapper').css("opacity", "0").hide();
        }
      };
      function resetValues() {
        $scope.class = 'noInfo';
        $scope.moreInfo = false;
        $scope.hasSuggestions = false;
        $scope.eventList = false;
        $scope.dropdown = false;
      }
      $scope.generateRandomIdea = function (category, callback) {
        if (category === 'Random!') {
          if (Object.keys($scope.suggestionList).length === 0) {
            callback({display: "Suggestion List Exhausted", yelpSearch: "", wikiSearch: "Decision-making"});
            resetValues();
            return;
          }
          var categories = Object.keys($scope.suggestionList);
          category = categories[Math.floor(Math.random() * Object.keys($scope.suggestionList).length)];
        }
        if ($scope.suggestionList[category] === undefined) {
          callback({display: "No more suggestions in this category", yelpSearch: "", wikiSearch: "Decision-making"});
          resetValues();
        } else {
          var random = Math.floor(Math.random() * $scope.suggestionList[category].length);
          var suggestion = $scope.suggestionList[category][random];
          $scope.suggestionList[category].splice(random, 1);
          if ($scope.suggestionList[category].length === 0) {
            delete $scope.suggestionList[category];
          }
          callback(suggestion);
        }
      };
      var sidebarItems = document.getElementsByClassName('sidebar-list-item');
      for (var i = 0; i < sidebarItems.length; i++) {
        sidebarItems[i].addEventListener('click', function(e) {
          $scope.filter = e.target.text;
        });
      }
      document.getElementById('result-count').addEventListener('change', function(e) {
        Ideas.queryData.count = e.target.value;
      });
    }
  };

}]);
