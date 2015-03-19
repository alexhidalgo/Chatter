angular.module('app.controllers', ['firebase'])
.controller('LoginCtrl', function($scope, $rootScope, $firebase, $ionicLoading, $ionicModal, $state) {

	var ref = new Firebase('https://dazzling-fire-5775.firebaseio.com');

	$ionicModal.fromTemplateUrl('templates/signup.html',  {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.login = function(user) {
		// if(user.username !== ""){
		// 	console.log("This is the username" + user);
		// 	$rootScope.username = user.username;
		// 	console.log($rootScope.username);
		// 	$state.go('chat');
		// 	$scope.username = "";
		// }

		// .then(function(authData) {
		// 		console.log("Logged in as: " + authData.uid);
		// 		ref.child("users").child(authData.uid).once('value', function(snapshot) {
		// 			var val = snapshot.val();
		// 			console.log(val);
		// 			//To Update AngularJS $scope either use $apply or $timeout
		// 			$scope.apply(function() {
		// 				$rootScope.displayName = val;
		// 			});
		// 		});
		// 		$ionicLoading.hide();
		// 		$state.go('chat');
		// 	}).catch(function(error) {
		// 		alert("Authentication failed " + error.message);
		// 		$ionicLoading.hide();
		// 	});


		if(user && user.email && user.password) {
			$ionicLoading.show({
				template: 'Signing In...'
			});
			ref.authWithPassword({
		  email: user.email,
		  password: user.password
			}, function(error, authData) {
				console.log("This is a login error" + error);
				console.log("This is the payload" + authData.uid);
				ref.child("users").child(authData.uid).once('value', function(snapshot) {
					var val = snapshot.val();
					// To Update AngularJS $scope either use $apply or $timeout
					$scope.$apply(function () {
						$rootScope.username = val;
					});
			});
			$ionicLoading.hide();
			$state.go('chat');
			// $scope.modal.hide();
			});
		}
	};
	$scope.createUser = function(user) {
		console.log('test');
		if(user && user.username && user.email && user.password) {
			$ionicLoading.show({
				template: 'Signing Up...'
			});

			ref.createUser({
				email: user.email,
				password: user.password,
			}, function(error, dataAuth) {
				ref.child("users").child(dataAuth.uid).set({
					email: user.email,
					displayName: user.username
				});
				console.log("This is the error" + error);
				console.log("This is the payload: " + dataAuth);
				$ionicLoading.hide();
				$scope.modal.hide();
			});
		} else {
			alert("Please fill in all details");
		}
	};
})
.controller('ChatCtrl', function($scope, $state, $firebaseArray, $firebase, $ionicLoading, $rootScope) {

	var ref = new Firebase('https://dazzling-fire-5775.firebaseio.com');
	var postRef = ref.child("posts");
	var list = $firebaseArray(ref);

	ref.on('value', function(snapshot) {
		var data = snapshot.val();
		$scope.chats = data;
		console.log($scope.chats);

	}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		});

	$scope.logout = function() {
		$ionicLoading.show({
			templates: "Signing out..."
		});
		ref.unauth();
		$state.go('login');
		$ionicLoading.hide();
		// console.log($rootScope.username);
		// $rootScope.username = "";
		// console.log($rootScope.username);

		console.log("Success logout");
	};
	$scope.send = function(message) {
		ref.push({ username: $rootScope.username,
			message: message,
			createdAt: Firebase.ServerValue.TIMESTAMP });
		$scope.message = "";
	};
});
