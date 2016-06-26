
var app = angular.module('paymentApp', ['ui.bootstrap']);


  app.controller('Controller', function($scope, $uibModal){

    $scope.open = function(supplier){
      $scope.supplier = supplier

    var modalInstance = $uibModal.open({
      templateUrl: 'modalContent.html',
      controller: 'modalData',
      resolve: {
        data: function () {
          return $scope.supplier;
                }
              }
            });
        };
  });

  app.controller('modalData', function($scope, data, $uibModalInstance){
    $scope.supplier = data;

    $scope.cancel = function(){
      $uibModalInstance.dismiss('cancel');
    };
  });

  app.controller('listData', function($scope, $http) {
    $scope.query = "";
    $scope.suppliers = [];
    $scope.totalItems = 250;
    $scope.currentPage = 1;
    $scope.maxSize = 4;

    $http.get("http://test-api.kuria.tshdev.io/").success(function(response){
      $scope.suppliers = response.payments;
    });

    $scope.searchSuppliers = function(){
      $scope.suppliers = [];

      $http.get("http://test-api.kuria.tshdev.io/?query=" + $scope.query + "&rating=" + $scope.rating).success(function(response){
        $scope.suppliers = response.payments;
        $scope.total = response.pagination.total;
        $scope.totalItems = $scope.total * 5;
        $scope.currentPage = 1;
      });
    };

    $scope.resetSuppliers = function(){

      $http.get("http://test-api.kuria.tshdev.io/").success(function(response){
        $scope.suppliers = response.payments;
        $scope.query = "";
        $scope.rating = "";
        $scope.totalItems = response.pagination.total * 5;
        $scope.currentPage = 1;
      });
    };

    $scope.pageChanged = function() {
      $scope.suppliers = [];

      $http.get("http://test-api.kuria.tshdev.io/?page=" + $scope.currentPage + "&query=" + $scope.query + "&rating=" + $scope.rating).success(function(response){
        $scope.suppliers = response.payments;
      });
    };
});

app.directive('poundRating', function(){
  return {
    restrict: 'E',
    template: '<ul>' +
        '  <li ng-repeat="icon in icons" ng-class="{filled: icon.filled}" class="rate-icon">' +
        '    <i class="rate-text">£</i>' +
        '  </li>' +
        '</ul>',
    scope: {
      ratingValue: '=ngModel',
          },
    link: function(scope, element, attributes) {
      scope.max = 5;
      scope.icons = [];
      for (var i = 0; i < scope.max; i++) {
        scope.icons.push({
          filled: i < scope.ratingValue
        });
      }
    }
  };
});
