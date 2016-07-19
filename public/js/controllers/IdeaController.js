angular.module('App.ideaCtrl', [])

.controller('IdeaController', ['$scope', 'Ideas', 'SuggestionFactory', '$state', function($scope, Ideas, SuggestionFactory, $state) {
  // Default data on page load - changes occur in Buttons directive
  $scope.idea = "Feeling Spontaneous?";
  $scope.button = "Go!";
  $scope.filter = 'Random!';
  $scope.getLocation = function(loc) {
    if (parseInt(loc) && loc.length === 5) {
    Ideas.queryData.location = $scope.location;
    $state.go('home');
    }
  }
  $scope.location = '';
  // These dictate whether more information can be shown
  $scope.class = 'noInfo';
  $scope.moreInfo = false;
  $scope.eventList = false;
  $scope.dropdown = false;
  $scope.hasSuggestions = true;
  $scope.timeout = false;

  $scope.suggestionList = SuggestionFactory.suggestionList;


}]);
