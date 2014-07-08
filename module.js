var benchPressApp = angular.module('benchPressApp',['ngRoute', 'ngAnimate']); //[] is for dependancies. aka to inject data from another module


//************FACTORIES*************************


benchPressApp.factory('templateFactory', function($http){

	//make function getSynonym() to store common synonyms for each test we use.
	

	var factory = {};

	factory.getDays = function() {
		return $http.get('getDays.php', { data: {} });
		//returns json data from getBenches.php
	};

	factory.getBenches = function() {
		return $http.get('getBenches.php', { data: {} });
		//returns json data from getBenches.php
	};

	factory.getEmployees = function() {

		//change to ajax call that puls employeesjson data from benchtime database users table
		return $http.get('getEmployees.php', { data: {} });
	};


	return factory; //return factory and data into wherever factory is injected.

});


//**********************************************



//**************CONTROLLERS*********************
	

//could define another controller with controllers.othercontroller = function($scope) {etc}



benchPressApp.controller('templateController', function($scope, $rootScope, templateFactory, $location, $http) {  //add controller to the controllers object. add factory data.


	init();

	function init() {

		if (!$rootScope.days) {
			templateFactory.getDays().success(function(data) {
				$rootScope.days = data;
			});
		}

		if (!$rootScope.benches) {
			templateFactory.getBenches().success(function(data) {
				$rootScope.benches = data;
			});
		}
		if (!$rootScope.employees) {
			templateFactory.getEmployees().success(function(data) {
				$rootScope.employees = data;
			});
		}
		
		if (!$rootScope.startTime) {
			$rootScope.startTime = '09:00';
		}
		if (!$rootScope.endTime) {
			$rootScope.endTime = '17:00';
		}
		if (!$rootScope.breakTime) {
			$rootScope.breakTime = 30;
		}
		if (!$rootScope.employeeBenches) {
			$scope.employeeBenches = [];
		}

	}

	function checkAll() {
		//write code to check all boxes
	}

	function removeFromArray(array, value) {
		var index = array.indexOf(value);
		var newArray = array.splice(index, 1);
		return newArray;
	}

	function addBenchToDays(bench) {
		var days = $rootScope.days;
		var numDays = days.length;
		var benchDays = bench.days;
		var numBenchDays = benchDays.length;

		for (i=0; i<numDays; i++) {
			for (j=0; j<numBenchDays; j++) {
				if (days[i].name == benchDays[j]) {
					days[i].benches.push(bench);
				}
			}
		}
	}

	function removeBenchFromDays(bench) {
		var days = $rootScope.days;
		var numDays = days.length;

		for (i=0; i<numDays; i++) {
			var benchArray = days[i].benches;
			var numBenches = benchArray.length;
			for (j=0; j<numBenches; j++) {
				if (benchArray[j].name == bench.name) {
					benchArray.splice(j,1);
				}
			}
		}
	}

	function updateBenchInDays(bench) {
		var days = $rootScope.days;
		var numDays = days.length;

		for (i=0; i<numDays; i++) {
			var benchArray = days[i].benches;
			var numBenches = benchArray.length;
			for (j=0; j<numBenches; j++) {
				if (benchArray[j].name == bench.name) {
					benchArray[j] = bench;
				}
			}
		}
	}

	function updateDays() {
		var benchData = $scope.days;
		$http.post('updateDays.php', benchData).
		    success(function(data, status, headers, config) {
		    	//success callback
		    }).
		    error(function(data, status, headers, config) {
		      window.alert('error')
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
	}

	function updateBenches() {
		var benchData = $scope.benches;
		$http.post('updateBenches.php', benchData).
		    success(function(data, status, headers, config) {
		    	//success callback
		    }).
		    error(function(data, status, headers, config) {
		      window.alert('error')
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
	}

	function updateEmployees() {
		var employeeData = $scope.employees;
		$http.post('updateEmployees.php', employeeData).
		    success(function(data, status, headers, config) {
		    	//success callback
		    }).
		    error(function(data, status, headers, config) {
		      window.alert('error:' + status + ', ' + jsonData)
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
	}

	//watch values (check for changes to them and updates root scope)

	$scope.$watch('startTime', function(newValue) {
		$rootScope.startTime = newValue;
	});

	$scope.$watch('endTime', function(newValue) {
		$rootScope.endTime = newValue;
	});

	$scope.$watch('breakTime', function(newValue) {
		$rootScope.breakTime = newValue;
	});

	$scope.$watch('newBench', function(newValue) {
		$rootScope.newBench = newValue;
	});

	$scope.$watch('newEmployee', function(newValue) {
		$rootScope.newEmployee = newValue;
	});

	$scope.$watch('employeeBenches', function(newValue) {
		$rootScope.employeeBenches = newValue;
	});

	$scope.$watch('employees', function(newValue) {
		$rootScope.employees = newValue;
	});

	$scope.addBench = function(){ 
		if ($scope.newBench.name.trim() !='' && (
			$scope.newBench.monday ||
			$scope.newBench.tuesday ||
			$scope.newBench.wednesday ||
			$scope.newBench.thursday ||
			$scope.newBench.friday ||
			$scope.newBench.saturday ||
			$scope.newBench.sunday) && 
			$scope.startTime &&
			$scope.endTime &&
			$scope.breakTime
		) {

				var bench = {
					name: $scope.newBench.name,
					mon: $scope.newBench.monday,
					tues: $scope.newBench.tuesday,
					wed: $scope.newBench.wednesday,
					thurs: $scope.newBench.thursday,
					fri: $scope.newBench.friday,
					sat: $scope.newBench.saturday,
					sun: $scope.newBench.sunday,
					startTime: $scope.startTime,
					endTime: $scope.endTime,
					breakTime: $scope.breakTime,
					button: '',
					employees: []
				}

				bench.getHours = function() {
					function minToHours(min) {
						var hours = min/60;
						return hours;
					}

					var startArray = this.startTime.split(':');
					var startHour = parseInt(startArray[0]);
					var startMin = parseInt(startArray[1]);
					var startHours = startHour + minToHours(startMin);

					var endArray = this.endTime.split(':');
					var endHour = parseInt(endArray[0]);
					if (endHour<startHour) {
						endHour += 24;
					}
					var endMin = parseInt(endArray[1]);
					var endHours = endHour + minToHours(endMin);

					var breakTime = minToHours(this.breakTime);

					var totalHours = endHours - startHours - breakTime;

					return totalHours.toFixed(2);
				}

				bench.getDays = function() {
					var myDays =[];
					if (this.sun) {
						myDays.push('Sunday');
					}
					if (this.mon) {
						myDays.push('Monday');
					}
					if (this.tues) {
						myDays.push('Tuesday');
					}
					if (this.wed) {
						myDays.push('Wednesday');
					}
					if (this.thurs) {
						myDays.push('Thursday');
					}
					if (this.fri) {
						myDays.push('Friday');
					}
					if (this.sat) {
						myDays.push('Saturday');
					}
					return myDays;
				}

				bench.hours = bench.getHours();
				bench.days = bench.getDays();

				addBenchToDays(bench);

				$scope.benches.push(bench);
				$scope.newBench.name = '';
				$('#newBench').focus();

				updateBenches();
				updateDays();
		}
	}

	$scope.deleteBench = function(bench) {
		var benches = $rootScope.benches;
		benches = removeFromArray(benches, bench);

		var employees = $rootScope.employees;
		var numEmployees = employees.length;
		for (i=0; i<numEmployees; i++) {
			var employeeBenches = employees[i].benches;
			var numBenches = employeeBenches.length;
			for (j=0; j<numBenches; j++) {
				if (employeeBenches[j] == bench.name) {
					employeeBenches.splice(j,1);
				}
			}
		}
		removeBenchFromDays(bench);
		updateBenches();
		updateDays();
	}

	$scope.selectBench = function(bench) {
		$rootScope.selectedBench = bench;
		$location.path('/selectedBench');
	}

	$scope.selectEmployee = function(employee) {
		$rootScope.selectedEmployee = employee;
		$location.path('/selectedEmployee');
	}

	$scope.pushBench = function(bench) {

		//add code to remove class when changing pages

		if (bench.button == 'pressed') {
			var employeeBenches = $scope.employeeBenches;
			var index= employeeBenches.indexOf(bench);
			employeeBenches.splice(index, 1);
			bench.button = '';

		}
		else {
			$scope.employeeBenches.push(bench);
			bench.button = 'pressed';
		}
	}

	$scope.addEmployee = function() {
		if (($scope.newEmployee.name.trim() != '') && ($scope.newEmployee.hours > 0)) {

			var employeeBenchNames = [];

			var employeeBenches = $scope.employeeBenches;
			var length = employeeBenches.length;

			for (k=0; k<length; k++) {
				employeeBenchNames.push(employeeBenches[k].name);
			}

			var employee = {
				name: $scope.newEmployee.name,
				hours: $scope.newEmployee.hours,
				benches: employeeBenchNames
			};

			$rootScope.employees.push(employee);
			
			for (i=0; i<length; i++) {
				employeeBenches[i].employees.push(employee);
				
			}

			$scope.newEmployee = {};
			var numBenches = $scope.benches.length;
			for (j=0; j<numBenches; j++) {
				$scope.benches[j].button = '';
			}
			$scope.employeeBenches = [];
			$('#newEmployee').focus();
			updateEmployees();
			updateBenches();
			updateDays();
		}
	}

	$scope.deleteEmployee = function(employee) {
		var employees = $rootScope.employees;
		employees = removeFromArray(employees, employee);

		var myBenches = employee.benches;
		var length = myBenches.length;
		var allBenches = $rootScope.benches;
		var allLength = allBenches.length;

		//remove deleted employee from benches they were on
		for (i=0; i<length; i++){
			for (j=0; j<allLength; j++) {
				if (myBenches[i] == allBenches[j].name) {
					var myEmployees = allBenches[j].employees;
					var employeesLength = myEmployees.length;
					for (k=0; k<employeesLength; k++) {
						if (myEmployees[k].name == employee.name) {
							myEmployees.splice(k,1);
							updateBenchInDays(allBenches[j]);
							break;
						}
					}
				}
			}
		}
		updateBenches();
		updateEmployees();
		updateDays();

	}

	$scope.algorithmFilter = function(test) {
		var testsSelected = $scope.testsSelected;
		if (testsSelected.indexOf(test) > -1) {
			return true;
		}
		else {
			return false;
		}
	}


	$scope.posTestFilter = function (microbe, posQuery) { 

		function arrayToLower(array) {
			var lowerArray = [];
			for (var i= 0, L=array.length; i<L; i++) {
				lowerArray[i] = array[i].toLowerCase();
			}
			return lowerArray;
		}


	    console.log(arguments.length);
        if (!$scope.posQuery) { //displays all entries if no query
        	$rootScope.posQuery = ''; //sets rootscope back to nothing when there is no query
        	return true;
        }


        $rootScope.posQuery = $scope.posQuery; //keeps query when shifting between views


        var queryArray = $scope.posQuery.split(' ');
        var posArray = arrayToLower(microbe.pos);

	    for (i=0; i<queryArray.length; i++) {
	    	var matchesone = false;

	    	if (microbe.name.toLowerCase().indexOf(queryArray[i].toLowerCase()) > -1 || //checks if query is found in name or gs
	    		microbe.gs.toLowerCase().indexOf(queryArray[i].toLowerCase()) > -1) {
	    		matchesone = true;
	    	}

	    	for (j=0; j<posArray.length; j++) { //checks if query is found in positive tests, and changes matchesone to true if found.
	    		if (posArray[j].indexOf(queryArray[i].toLowerCase()) > -1) {
	    			matchesone = true;
	    			break;
	    		}
	    	}

	    	if (!matchesone) {
	    		return false; //does not display item if it doesnt match at least one query.
	    	}
	    }
        return  true; //displays query if it matches all queries.
    };

    $scope.negTestFilter = function (microbe, negQuery) { 

		function arrayToLower(array) {
			var lowerArray = [];
			for (var i= 0, L=array.length; i<L; i++) {
				lowerArray[i] = array[i].toLowerCase();
			}
			return lowerArray;
		}


	    console.log(arguments.length);
        if (!$scope.negQuery) { //displays all entries if no query
        	$rootScope.negQuery = ''; //sets rootscope back to nothing when there is no query
        	return true;
        }


        $rootScope.negQuery = $scope.negQuery; //keeps query when shifting between views


        var queryArray = $scope.negQuery.split(' ');
        var posArray = arrayToLower(microbe.neg);

	    for (i=0; i<queryArray.length; i++) {
	    	var matchesone = false;

	    	if (microbe.name.toLowerCase().indexOf(queryArray[i].toLowerCase()) > -1 || //checks if query is found in name or gs
	    		microbe.gs.toLowerCase().indexOf(queryArray[i].toLowerCase()) > -1) {
	    		matchesone = true;
	    	}

	    	for (j=0; j<posArray.length; j++) { //checks if query is found in negative tests, and changes matchesone to true if found.
	    		if (posArray[j].indexOf(queryArray[i].toLowerCase()) > -1) {
	    			matchesone = true;
	    			break;
	    		}
	    	}

	    	if (!matchesone) {
	    		return false; //does not display item if it doesnt match at least one query.
	    	}
	    }
        return  true; //displays query if it matches all queries.
    };
}); //add controllers to module
	
//************************************************

//*************ROUTES*****************************

benchPressApp.config(function($routeProvider) {
	$routeProvider
		.when('/',
			{
				controller: 'templateController',
				templateUrl: 'view-addBenches.html'
			})
		.when('/selectedBench', 
			{
				controller: 'templateController',
				templateUrl: 'view-selectedBench.html'
			})
		.when('/employees',
			{
				controller: 'templateController',
				templateUrl: 'view-employees.html'
			})
		.when('/selectedEmployee',
			{
				controller: 'templateController',
				templateUrl: 'view-selectedEmployee.html'
			})
		.when('/buildSchedule',
			{
				controller: 'templateController',
				templateUrl: 'view-buildSchedule.html'
			})
		//add route where '/isolateName' goes to view where data from that isolate is displayed.
		.otherwise({ redirectTo: '/' });
});