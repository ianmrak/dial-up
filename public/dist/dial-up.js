angular.module('App',
[
  'App.navbar',
  'App.sidebar',
  'App.footer',
  'App.gifService',
  'App.eventList',
  'App.ideaCtrl',
  'App.ideaService',
  'App.ideaBtn',
  'App.listCtrl',
  // 'App.signUpCtrl',
  'App.sidebarCtrl',
  'ngAnimate',
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/getidea');
  $stateProvider
  .state('home', {
    url: '/getidea',
    templateUrl: 'views/main.html',
    controller: 'IdeaController'
  })
  // routing for old view swap - not to be used with new look
    .state('home.list', {
      url: '/{searchTerm}',
      templateUrl: 'views/list.html',
      controller: 'ListController'
    })
});

// angular.module('App.animateIdea', [])

// // Not working, elements were only animating on the first click
// .directive('animateIdea', function() {
//   function animateModelChangeLink(scope, element, attrs){

//     function modelChanged(newVal, oldVal){
//       console.log(newVal, oldVal)
//       if(newVal !== oldVal){
//         element[0].classList.add('test');
//       }
//     }
//     scope.$watch(function(){ return attrs.model; }, modelChanged);
//   }

//   return {
//     restrict: 'A',
//     link: animateModelChangeLink
//   };
// })

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
        }
      }
      // Allows directive to track filter value that is passed using getIdea()
      // var menu = document.getElementById('filterMenu');
      // menu.addEventListener('change', function(e) {
      //   $scope.filter = e.target.value;
      // })
      var sidebarItems = document.getElementsByClassName('sidebar-list-item');
      for (var i = 0; i < sidebarItems.length; i++) {
        sidebarItems[i].addEventListener('click', function(e) {
          $scope.filter = e.target.text;
        })
      }
    }
  }

}])

angular.module('App.eventList', [])

.directive('eventList', ['Ideas', '$state', function(Ideas, $state) {
  return {
    restrict: 'E',
    templateUrl: 'views/list.html',
  }
}])

angular.module('App.footer', [])

.directive('bottomBar', ['Ideas', '$state', function(Ideas, $state) {
  return {
    restrict: 'E',
    templateUrl: 'views/footer.html'
  }
}])

angular.module('App.navbar', [])

.directive('navigation', ['Ideas', '$state', function(Ideas, $state) {
  return {
    restrict: 'E',
    templateUrl: 'views/navbar.html'
  }
}])

angular.module('App.sidebar', [])

.directive('sidepanel', ['Ideas', '$state', function(Ideas, $state) {
  return {
    restrict: 'E',
    templateUrl: 'views/sidebar.html',
  }
}])

angular.module('App.ideaCtrl', [])

.controller('IdeaController', ['$scope', 'Ideas', function($scope, Ideas) {
  // Default data on page load - changes occur in Buttons directive
  $scope.idea = "In Need of Some Spontaneity?";
  $scope.button = "Get Some!";
  $scope.filter = 'Random!';
  // These 4 dictate whether more information can be shown
  $scope.class = 'noInfo';
  $scope.moreInfo = false;
  $scope.eventList = false;
}])

angular.module('App.listCtrl', [])

// Not working at the moment - switching over to list directive to stay on same page
.controller('ListController', ['$scope', 'Ideas', function($scope, Ideas) {
  $scope.data = {};
  $scope.idea = Ideas.currentIdea.data;
  $scope.data.events = [{
    name: 'Mountain Biking',
    cost: '$$',
    description: 'Biking, on a mountain'
  }]
}])

angular.module('App.sidebarCtrl', [])

.controller('SidebarController', ['$scope', function($scope) {
  // sidebar menu button
  $scope.sidebarBtn = "☰ Menu";
  $scope.filters = ['Random!',
                    'Little Gifts',
                    'Fun Activities',
                    'Quick Trips',
                    'What to Eat'
                   ];
  $scope.activeFilter = 'Random!';
  $scope.setActive = function(filter) {
    $scope.activeFilter = filter;
  }
  // when ☰ Menu is clicked, showSidebar gets fired; click again and hideSidebar will fire
  // $scope.showSidebar = showSidebar();
  // $scope.hideSidebar = hideSidebar();
}]);

// angular('App.signUpCtrl', function() {
  
// })
angular.module('App.gifService', [])

.service('DisplayGif', function() {
  function startGif() {
    $('.spinner').show();
  }

  function endGif() {
    $('.spinner').hide();
  }

  return {
    startGif: startGif,
    endGif: endGif
  };
})

angular.module('App.ideaService', [])

.factory('Ideas', ['$http', function($http) {
  // Storage for idea - need more for API data
  var currentIdea = {
    data: null
  };

  var getIdea = function(filter) {
    return $http({
      method: 'POST',
      url:'/api/getIdea',
      data: {category:filter}
    })
    .then(function(resp) {
      currentIdea.data = resp.data;
      return resp;
    })
  }
  var getYelp = function(suggestion) { // include location, resultCount
    return $http({
      method: 'POST',
      url: '/api/yelpDetails',
      data: {
        suggestion: suggestion //, 
        // location: location,
        // resultCount: resultCount
      }
    })
    .then(function(resp) {
      return resp;
    })
  }

  var getWiki = function(suggestion) {
    return $http({
      method: 'POST',
      url: '/api/wikiDetails',
      data: {suggestion: suggestion}
    })
    .then(function(resp) {
      return resp;
    })
  }

  return {
    currentIdea: currentIdea,
    getIdea: getIdea,
    getYelp: getYelp,
    getWiki: getWiki
  }
}])
