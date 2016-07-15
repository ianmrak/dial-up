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
