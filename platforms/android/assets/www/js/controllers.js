angular.module('app.controllers', ['firebase', 'ngMessages'])
.controller('LoginCtrl', function($scope, $rootScope, $firebase, $ionicLoading, $ionicModal, $state, $ionicScrollDelegate) {

	var ref = new Firebase('https://dazzling-fire-5775.firebaseio.com');

	$scope.user = {
		email: "",
		password: "",
		username: "",
		avatar: "doug"
	};

	$ionicModal.fromTemplateUrl('templates/signup.html',  {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.login = function(user) {
		if(user && user.email && user.password) {
			$ionicLoading.show({
				template: 'Signing In...'
			});
			ref.authWithPassword({
		  email: user.email,
		  password: user.password
			}, function(error, dataAuth) {
				if(error === null) {
					ref.child("users").child(dataAuth.uid).once('value', function(snapshot) {
						var val = snapshot.val();
						console.log('user', val);
						// To Update AngularJS $scope either use $apply or $timeout
						$scope.$apply(function () {
							$rootScope.username = val;
						});
					});
					console.log("Success error. Start logging in. This is the payload", dataAuth.uid);
					setTimeout(function() {
			    	$ionicScrollDelegate.scrollBottom([true]);
					},10);
					user.email = "";
					user.password = "";
					$state.go('chat');
					$ionicLoading.hide();
				} else {
					console.log("Problem with authentication: " + error);
					$ionicLoading.hide();
					alert(error);
					//add ng-messages
				}
			});
		} else {
			alert("Empty email or password");
			//add ng-message alerts
		}
	};

	$scope.createUser = function(user) {
		console.log('start createUser function');
		//function onUserCreated(err, dataAuth) {

		//}
		//function onUsernameSet(dataAuth) {

		//}
		//function onLogin(dataAuth) {

		//}
		if(user && user.username && user.email && user.password && user.avatar) {
			$ionicLoading.show({
				template: 'Signing Up...'
			});
			ref.createUser({
				email: user.email,
				password: user.password,
			}, function(error, dataAuth) {
				if(error === null) {
					ref.child("users").child(dataAuth.uid).once('value', function(snapshot) {
						var val = snapshot.val();
						console.log('user', val);
					});
					ref.child("users").child(dataAuth.uid).set({
						email: user.email,
						username: user.username,
						avatar: user.avatar
					}, function() {
						console.log('avatar and username set');
						ref.authWithPassword({
							email: user.email,
							password: user.password
						}, function(error, authData) {
								if(error === null) {
									console.log("LOGIN Success error. Start logging in.", authData.uid);
									ref.child("users").child(dataAuth.uid).once('value', function(snapshot) {
										var val = snapshot.val();
										console.log('user', val);
										// To Update AngularJS $scope either use $apply or $timeout
										$scope.$apply(function () {
											$rootScope.username = val;
										});
									});
									user.email = "";
									user.password = "";
									$state.go('chat');
									$ionicLoading.hide();
									$scope.modal.hide();
									setTimeout(function() {
							    	$ionicScrollDelegate.scrollBottom([true]);
									},10);
								} else {
									console.log("Problem with authentication: " + error);
									$ionicLoading.hide();
									alert("Problem with authentication: " + error);
									//add ng-messages
								}
						});
					});

					} else if(error.code == "EMAIL_TAKEN") {
						alert(error);
						$ionicLoading.hide();
					} else {
						alert(error);
						console.log("This is the error" + error);
						$ionicLoading.hide();
					}
				});
		} else {
			alert("Please fill in all details");
		}
	};

	$scope.cancelSignup = function() {
		$scope.user.username = "";
		$scope.user.email = "";
		$scope.user.password = "";
		console.log("cancel signup form");
		$scope.modal.hide();
	};
})
.controller('ChatCtrl', function($scope, $filter, $state, $firebaseArray, $firebase, $ionicLoading, $rootScope, $ionicScrollDelegate) {

	var ref = new Firebase('https://dazzling-fire-5775.firebaseio.com');

	$scope.message = {
		message: ""
	};

	ref.on('value', function(snapshot) {
		var data = snapshot.val();
		$ionicScrollDelegate.scrollBottom([true]);
		//check data to make sure it has all the necessary atributes. Try lodash or angular filter.
		$scope.chats = data;
		console.log("This is the data for the chats listener", data);

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
		$rootScope.username = "";
		$scope.message.message = "";
		console.log("Success logout");
	};
	$scope.send = function(message) {
		ref.push({ username: $rootScope.username,
			message: message,
			createdAt: Firebase.ServerValue.TIMESTAMP });
		$scope.message = "";
	};
});
