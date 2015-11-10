var meanTodo = angular.module('meanTodo', []); // Ni idea de que es el array

// Main Controller
function mainController($scope, $http) {
	$scope.formData = {};
	
	// get all tasks and show them
	$http.get('/api/todos')
		.success(function(data) {
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		
	// createTodo controller	
	$scope.createTodo = function() {
		var categories = $scope.formData.categories.split(',');
		var length = categories.length;
		$scope.formData.categories = [];
		
		for (var index = 0; index < length; index++) {
			var element = categories[index];
			$scope.formData.categories.push({
				name : element
			});
		}
		
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clean data so the user is ready to enter another one
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	// deleteTodo controller
	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
}