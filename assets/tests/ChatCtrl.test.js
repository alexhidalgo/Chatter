describe('ChatCtrl', function() {
	var $scope;
	var ChatCtrl;

	beforeEach(module('app.controllers'));

	beforeEach(inject(function($rootScope, $controller, $injector) {
		// $scope = $rootScope.$new();

	}));
	it('should send a message object', function() {
		$scope.send({});
		expect($scope.messages).to.equal(null);
	})

})
