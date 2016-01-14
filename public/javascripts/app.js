/**
 * Created by Tomek on 2015-10-25.
 */
'use strict';

var app = angular.module('miniCRM',['ngRoute','ui.router','ui.bootstrap']);
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/templates/main.html',
                controller: 'MainCtrl'
            })
            .state('adduser', {
                url: '/newUser',
                templateUrl: '/templates/adduserform.html',
                controller: 'AuthCtrl'
            })
            .state('userlist', {
                url: '/userlist',
                templateUrl: '/templates/userlist.html',
                controller: 'listUserCtrl'
            })
            .state('contact', {
                url: '/addcontact',
                templateUrl: '/templates/addcontact.html',
                controller: 'addContactCtrl'
            })
            .state('tasks', {
                url: '/tasks',
                templateUrl: '/templates/task.html',
                controller: 'addTaskCtrl'
            })
            .state('inspecttasks', {
                url: '/inspecttasks',
                templateUrl: '/templates/tasks.html',
                controller: 'inspectTaskCtrl'
            })
          /*  .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                      //  $state.go('home');
                        window.location.assign("http://localhost:3000/#/home");
                    }
                }]
            })*/
            .state('register', {
                url: '/register',
                templateUrl: '/templates/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            });

        $urlRouterProvider.otherwise('home');
    }]);
app.controller( 'ModalInstanceCtrl',function ($scope, $modalInstance,$http, items,auth) {
    $scope.User = auth.currentUser();
    $scope.ajdi=items;
    $scope.ok = function () {
        $http.put('http://localhost:3000/task',{"_id":items,"status":$scope.status,"user":$scope.User.username,"comment":$scope.comment}).success(function (data) {
        console.log(data.message);
        });
        $modalInstance.close(items);
    };

    $scope.cancel = function (items) {
        $modalInstance.dismiss('cancel');
    };
});
//
app.controller('MainCtrl', [
    '$scope',
    'auth',
    '$http',
    '$modal',
    '$log',
    function($scope, auth, $http, $modal, $log){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.User = auth.currentUser();
        console.log($scope.User);
        $scope.logOut = auth.logOut;
        $scope.tasks=[];
        $scope.ammountOfTasks;
        $scope.adminMode=false;
        $scope.employeeMode=false;
        $scope.managerMode=false;
        $scope.nowe=true;
        $scope.wRealizacji=true;
        $scope.zakonczone=true;
        $scope.zawieszone=true;
        $scope.anulowane=true;
        var alltasks=[];
        if($scope.User.accounttype==='admin')  {$scope.adminMode=true;}
        if($scope.User.accounttype==='pracownik')  {$scope.employeeMode=true;}
        if($scope.User.accounttype==='manager')  {$scope.managerMode=true;}
        if( $scope.isLoggedIn) {
            $http({
                url: 'http://localhost:3000/task',
                method: "GET",
                params: {user_name:  $scope.User.username}
            }).success(function (data) {
                $scope.tasks=data;
                console.log(data);
                $scope.ammountOfTasks= $scope.tasks.length;
            });
        } else  window.location.assign("http://localhost:3000/login.html");

        //test
        $scope.open = function (id) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return id;
                    }

                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                $http({
                    url: 'http://localhost:3000/task',
                    method: "GET",
                    params: {user_name:  $scope.User.username}
                }).success(function (data) {
                    $scope.tasks=data;
                    $scope.ammountOfTasks=   $scope.tasks.length;
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        //test
    }]);

app.controller('addUserCtrl', function($scope,$http){
          $scope.addUser= function(){
              $http.post('http://localhost:3000/user',{"name":$scope.name,"surname":$scope.surname, "login": $scope.login,"password":$scope.password}).success(function(data){

              });

          };
});

app.controller('listUserCtrl', function($scope,$http){
        $http.get('http://localhost:3000/user').success(function(data){
                $scope.users= data;
        });


});

app.controller('addContactCtrl', function($scope,$http){
    $scope.showConfirmation=false;
    $scope.showFailure=false;
    $scope.addContact= function(){
        $http.post('http://localhost:3000/contact',{"company_name":$scope.companyName,"name":$scope.name,"surname":$scope.surname, "address": $scope.adress,"phone":$scope.phone}).success(function(data){
                      console.log(data.status);
                        if(data.status=="ADDED") {
                            $scope.showConfirmation=true;}
                            else {$scope.showFailure=true;}

        });

    };
});

app.controller('addTaskCtrl', function($scope,$http){
    $http.get('http://localhost:3000/user').success(function(data){
        $scope.users= data;
    });
    $http.get('http://localhost:3000/contact').success(function(data){
        $scope.contacts= data;
    });
    $scope.addTask= function(){
        $http.post('http://localhost:3000/task',{"name":$scope.taskName,"time_limit":$scope.timeLimit,"desc":$scope.taskDesc, "assigned_contact": $scope.assignedContact,"assigned_employee":$scope.assignedEmpl}).success(function(data){
            console.log(data);


        });

    };
});

app.controller('inspectTaskCtrl', function($scope,$http,$modal){
    $http.get('http://localhost:3000/user').success(function(data){
        $scope.users= data;
    });
    $http.get('http://localhost:3000/task').success(function(data){
        $scope.allTasks= data;
    });
    $scope.filter= function(){
        $http({
            url: 'http://localhost:3000/task',
            method: "GET",
            params: {user_name:   $scope.employee}
        }).success(function (data) {
            console.log(data);
            $scope.allTasks=data;
        });
    };
    $scope.open = function (id) {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function () {
                    return id;
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            $http({
                url: 'http://localhost:3000/task',
                method: "GET",
                params: {user_name: $scope.employee}
            }).success(function (data) {
                $scope.allTasks=data;
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

app.factory('auth', ['$http', '$window', function($http, $window){
    var auth = {};
    auth.saveToken = function (token){
        $window.localStorage['mini-crm-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['mini-crm-token'];
    }
    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {username: payload.username, accounttype:payload.accounttype};
        }
    };
    auth.register = function(user){
        return $http.post('/register', user).success(function(data){

           // auth.saveToken(data.token);
        });
    };
    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };
    auth.logOut = function(){
        $window.localStorage.removeItem('mini-crm-token');
       // $state.go('login');
        window.location.assign("http://localhost:3000/login.html");
    };
    return auth;
}]);
app.controller('AuthCtrl', [
    '$scope',
    '$http',
    'auth',
    function($scope ,$http,auth){
        $scope.user = {};
        $http.get('http://localhost:3000/usertype').success(function(data){
            $scope.userType= data;
        });
        $scope.showConfirmation=false;
        $scope.showFailure=false;
        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.showFailure=true;
                $scope.showConfirmation=false;
                $scope.error = error;
            }).then(function(){
                $scope.user.username='';
                $scope.user.accounttype='';
                    $scope.showConfirmation=true;
                $scope.showFailure=false;

            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
                console.log( $scope.error);
            }).then(function(){
                //$state.go('home');
                window.location.assign("http://localhost:3000/#/home");
            });
        };
    }]);
app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }]);
