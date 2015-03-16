angular.module('app.controllers', ['firebase'])
.controller('LoginCtrl', function($scope) {


})
.controller('ChatCtrl', function($scope, $state, $firebaseArray) {

	var ref = new Firebase('https://dazzling-fire-5775.firebaseio.com');
	var postRef = ref.child("posts");
	var list = $firebaseArray(ref);

	ref.on('value', function(snapshot) {
		var data = snapshot.val();
		$scope.chats = data;

	}, function (errorObject) {
			console.log("The read failed: " + errorObject.code)
		});

	$scope.logout = function() {
			$state.go('login')
		}
	$scope.send = function(message) {
		ref.push({ message: message })
		$scope.message = "";
	}
})
