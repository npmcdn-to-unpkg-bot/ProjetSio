//Dans ce fichier on va mettre en place les différents controllers qui seront liés à la view
// Il faut voir ça comme des sections de codes seulement accessibles dans la zone html où elles sont déclarées

// Un paramètre qui reviendra constamment est $scope, il faut le voir comme un "sac à variables" que l'on va
// par suite utiliser dans notre html 


//controller du modal de login
webApp.controller('loginController',
	function($scope, $state, $modalInstance, $window, Authentification ) {
	$scope.user = {};
	$scope.form = {};
	$scope.error = false;
	
	//fonction qui vérifie si le form est valide
	$scope.submit = function() {
		$scope.submitted = true;
		if (!$scope.form.$invalid) {
			$scope.login($scope.user);
		} else {
			$scope.error = true;
			return;
		}
	};

	//Fonction utilisant la fonction login de la factory authenfication
	$scope.login = function(user) {
		$scope.error = false;
		Authentification.login(user, function(user) {
			//2ème paramètre = fonction de succès
			$modalInstance.close();
			if (user)
			$state.go(user.home);
		}, function(err) {
			//3ème paramètre fonction d'echec
			console.log("error");
			$scope.error = true;
		});
	};
	
	// Check au début si l'utilisateur a déjà une sesssion en cours (au cas d'un refresh)
	if ($window.sessionStorage["userData"]) {
		try {
		var user = JSON.parse($window.sessionStorage["userData"]);
		$scope.login(user);	
		} catch (error) {}		
	}

});
	
//Ce controller utilise le service AdminList pour récupérer une liste des utilisateurs du serveur
webApp.controller('AdminList',
	function ($scope, $filter, adminPersonnes, $modal, Restangular) {
		
		$scope.personnes = [];
		adminPersonnes.getPersonnes().then(function(personnes){
			Restangular.copy(personnes,$scope.personnes);
			$scope.personnesView = [].concat($scope.personnes);
		});
		
		$scope.openDetails = function(personne) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.personne = personne;
			
			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"modals/administration.details.html",
				controller: "AdminDetails",
				size: "md",
				resolve: {
					personne: function(){
						return $scope.personne;
					}
				}
			});
			
			modalDetails.result.then(function(creation){
				if (creation === 1){
					adminPersonnes.getPersonnes().then(function(personnes){
						Restangular.copy(personnes,$scope.personnes);
						$scope.personnesView = [].concat($scope.personnes);
					});
				}
			});
		};
		
		$scope.remove = function(personne){
			personne.remove().then(function(){
				var index = $scope.personnes.indexOf(personne);
      			if (index > -1)
				  $scope.personnes.splice(index, 1);
			})
		}
	});


//Ce controller utilise le service AdminList ainsi que le service pré-installé $filter ET le paramètre passé par l'URL
// pour récupérer un utilisateur en particulier
webApp.controller('AdminDetails',
	function($scope, adminPersonnes, Restangular, personne, $modalInstance){	
		
		$scope.personne = personne;
		$scope.creation = false;
			
		if (personne === -1)
		{
			$scope.creation = true;
			$scope.personne = {};
		}
		else
		{
			adminPersonnes.getPersonne(personne.id).then(function(personne){
				Restangular.copy(personne,$scope.personne);
			});
		}
			
		$scope.save = function (personne) {
			if ($scope.creation === true)
			{
				adminPersonnes.postPersonne(personne)
				$modalInstance.close(1)
			}			
			else
			{
				personne.save();
				$modalInstance.close(0)
			}			
		};
		
		$scope.cancel = function () {
			$modalInstance.dismiss('Annuler');
		};
		
	});

	
webApp.controller('PlanController',
	function($scope,planService, Restangular){
		
		$scope.personnes = [];
		
		var personnes = planService.getPersonnes();
		personnes.getList().then(function(personnes){
			Restangular.copy(personnes,$scope.personnes);
		});
	});

webApp.controller('PlanClassesController',
	function($scope){
		//TODO :
	});
	
webApp.controller('PlanEnseignantsController',
	function($scope, planService, Restangular){
		
		$scope.personnes = [];
		
		var personnes = planService.getPersonnes();
		personnes.getList().then(function(personnes){
			Restangular.copy(personnes,$scope.personnes);
		});
	});

webApp.controller('PlanMatieresController',
	function($scope, personne, matieres, $modal){
		$scope.personne = personne;
		
		$scope.matieres = matieres;
		$scope.showAddForm = function(idList) {

			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"view/planification.enseignants.matieres.details.html",
				controller: "MatieresDetailsController",
				size: "lg",
				resolve: {
					personne : function(){
						return $scope.personne;
					},
					matieres : function(){
						return $scope.matieres;
					}
				}
			})
		};
	});

webApp.controller('MatieresDetailsController',
	function($scope,personne,matieres){
		$scope.personne = personne;
		$scope.matieres = matieres;
	});
	
webApp.controller('PlanPeriodesController',
	function($scope,$compile,uiCalendarConfig){
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		
		/* event source that pulls from google.com */
		$scope.eventSource = {
				googleCalendarId: 'fr.french#holiday@group.v.calendar.google.com',
				googleCalendarApiKey: 'AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M',
				className: 'gcal-event',           // an option!
				currentTimezone: 'Europe/Paris' // an option!
		};
		
		/* évènements pris de la BDD */
		$scope.events = [];
		
		/* event source that calls a function on every view switch */
		$scope.eventsF = function (start, end, timezone, callback) {
		var s = new Date(start).getTime() / 1000;
		var e = new Date(end).getTime() / 1000;
		var m = new Date(start).getMonth();
		var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
		callback(events);
		};
	
		$scope.calEventsExt = {
		color: '#f00',
		textColor: 'yellow',
		events: [ 
			{type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
			{type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
			{type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
			]
		};
		/* alert on eventClick */
		$scope.alertOnEventClick = function( date, jsEvent, view){
			$scope.alertMessage = (date.title + ' was clicked ');
		};
		/* alert on Drop */
		$scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
		$scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
		};
		/* alert on Resize */
		$scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
		$scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
		};
		/* add and removes an event source of choice */
		$scope.addRemoveEventSource = function(sources,source) {
		var canAdd = 0;
		angular.forEach(sources,function(value, key){
			if(sources[key] === source){
			sources.splice(key,1);
			canAdd = 1;
			}
		});
		if(canAdd === 0){
			sources.push(source);
		}
		};
		/* add custom event*/
		$scope.addEvent = function() {
		$scope.events.push({
			title: 'Open Sesame',
			start: new Date(y, m, 28),
			end: new Date(y, m, 29),
			className: ['openSesame']
		});
		};
		/* remove event */
		$scope.remove = function(index) {
		$scope.events.splice(index,1);
		};
		/* Change View */
		$scope.changeView = function(view,calendar) {
		uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
		};
		/* Change View */
		$scope.renderCalender = function(calendar) {
		if(uiCalendarConfig.calendars[calendar]){
			uiCalendarConfig.calendars[calendar].fullCalendar('render');
		}
		};
		/* Render Tooltip */
		$scope.eventRender = function( event, element, view ) { 
			element.attr({'tooltip': event.title,
						'tooltip-append-to-body': true});
			$compile(element)($scope);
		};
		/* config object */
		$scope.uiConfig = {
		calendar:{
			height: 450,
			editable: true,
			header:{
			left: 'title',
			center: '',
			right: 'today prev,next'
			},
			eventClick: $scope.alertOnEventClick,
			eventDrop: $scope.alertOnDrop,
			eventResize: $scope.alertOnResize,
			eventRender: $scope.eventRender,
			dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
			dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
			monthNames: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
		}
		};

		/* event sources array*/
		$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
		$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
});
	
webApp.controller('InfoPlanificateurController',
	function($scope){
		//TODO :
	});
