var app = angular.module('facefight-backoffice', ['appControllers', 'appServices', 'appDirectives','ui.bootstrap','ngMap','angular-sortable-view','ngFileUpload','amChartsDirective','ngTable','angularSpinner']);
var appControllers = angular.module('appControllers', ['ui.bootstrap','angular-sortable-view']);
var appServices = angular.module('appServices', []);
var appDirectives = angular.module('appDirectives', []);
// app.directive('confirmationNeeded', function () {
//   return {
//     priority: 1,
//     terminal: true,
//     link: function (scope, element, attr) {
//       var msg = attr.confirmationNeeded || "Are you sure?";
//       var clickAction = attr.ngClick;
//       element.bind('click',function () {
//         if ( window.confirm(msg) ) {
//           scope.$eval(clickAction)
//         }
//       });
//     }
//   };
// });
// app.config(function(uiGmapGoogleMapApiProvider) {
//     uiGmapGoogleMapApiProvider.configure({
//         //    key: 'your api key',
//         v: '3.20', //defaults to latest 3.X anyhow
//         libraries: 'weather,geometry,visualization'
//     });
// })