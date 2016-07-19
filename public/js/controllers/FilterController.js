angular.module('App.filterCtrl', [])

.controller('FilterController', ['$scope', '$state', 'Ideas', function($scope, $state, Ideas) {
  // sidebar menu button
  $scope.filters = ['Random!',
                    'Little Gifts',
                    'Fun Activities',
                    'Quick Trips',
                    'What to Eat'
                   ];
  $scope.activeFilter = 'Random!';
  $scope.setActive = function(filter) {
    $scope.activeFilter = filter;
    $scope.header = "☰ " + $scope.activeFilter;
  };
  $scope.header = "☰ " + $scope.activeFilter;
  $scope.resultCount = 5;
  $scope.location = '';
  $scope.changeLocation = function(loc) {
    if (parseInt(loc) && loc.length === 5) {
      Ideas.queryData.location = $scope.location;
      document.getElementById("location-form").reset();
    }
  }
  // when ☰ Menu is clicked, showSidebar gets fired; click again and hideSidebar will fire
  // $scope.showSidebar = showSidebar();
  var toggle = true;

  $scope.showSidebar = function() {
    if (toggle) {
      toggle = false;
      $('.list').slideDown(200);

    } else {
      toggle = true;
      $('.list').slideUp(200);
    }
  };

  $scope.loadSignup = function() {
    $state.go('signup');
  }

  // $scope.hideSidebar = hideSidebar();
}]);
