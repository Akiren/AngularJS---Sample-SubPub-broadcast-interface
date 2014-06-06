//SAMPLE SUBPUB WRAPPER for the default AngularJS SP implemented broadcast subpub design pattern


//SUB PUB INTERFACE
var subPubApp = angular.module('subPubInterface',[]);
subPubApp.factory('subPubInterface',function($rootScope){

    //Private Notification Methods
    //These are the Strongly Typed methods all widgets will use to communicate / listen
    var _NAME_SELECTED_ = '_NAME_SELECTED_';

    // publish event
    var publishNameSelected = function(item){
        $rootScope.$broadcast(_NAME_SELECTED_, {item: item});
    }

    // subscribe to event
    var subscribeToNameSelected = function ($scope, handler) {
        $scope.$on(_NAME_SELECTED_, function (event, message) {
            handler(message.item);
        });
    };

    // return the publicly accessible methods
    return {
        publishNameSelected: publishNameSelected,
        subscribeToNameSelected: subscribeToNameSelected
    };
});



var autonomousWidget1 = angular.module('myDir',['subPubInterface']);
autonomousWidget1.directive('myDir',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/widget1.html',
        controller: 'autonomousWidget1Controller'
    }
});
autonomousWidget1.controller('autonomousWidget1Controller', function($scope,subPubInterface) {
    $scope.name = 'default Name';

    // Handler that will execute upon subscribed Name Selected Event
    var nameChangeDataHandler = function(item) {
        $scope.name = item;
    };

    //Subscribe to strongly typed Name Selected Event
    subPubInterface.subscribeToNameSelected($scope,nameChangeDataHandler);

});



var autonomousWidget2 = angular.module('myDir2',['subPubInterface']);
autonomousWidget2.directive('myDir2',function(){
    return {
        restrict:'AE',
        templateUrl:'templates/widget2.html',
        controller:'autonomousWidget2Controller'

    }
});
autonomousWidget2.controller('autonomousWidget2Controller', function($scope,subPubInterface) {
    $scope.updateCheckbox = function(data){

        //Publish Current Selected Name
        subPubInterface.publishNameSelected(data);
    }
});

//Inject both Autonomous widgets into the main app
var app = angular.module('myApp',['myDir','myDir2']);