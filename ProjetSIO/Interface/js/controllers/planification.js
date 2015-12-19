webApp.controller('PlanClassesController',
	function($scope, planClasses, Restangular, $modal){
		
		$scope.classes = [];
		
		updateTable();
		
		$scope.openDetails = function (classe) {
			//Il faut mettre l'idList dans $scope pour qu'il soit accessible dans resolve:
			$scope.classe = classe;

			var modalDetails = $modal.open({
				animation: true,
				templateUrl: "modals/classesDetails.html",
				controller: "ClasseDetails",
				size: "md",
				resolve: {
					classe: function () {
						return $scope.classe;
					}
				}
			});

			modalDetails.result.then(function () {
				updateTable();
			});
		};
		
		function updateTable() {
			planClasses.getClasses().then(function(classes){
			$scope.classes = classes;
			angular.forEach(classes,function(element){
				element.annee = element.dateDebut.substr(0,4) + "/" + element.dateFin.substr(0,4);
			})
			$scope.classesView = [].concat($scope.classes);
			})
		}
	});

webApp.controller('ClasseDetails',
	function($scope, planClasses, Restangular, $modalInstance, classe){
		
		$scope.classe = {};
		$scope.pickerDateDebut = false;
		$scope.pickerDateFin = false;
			
		if (classe === -1) 
		{
			$scope.creation = true;
		}
		else
		{
			planClasses.getClasse(classe.id).then(function (classe){
				Restangular.copy(classe,$scope.classe);
				$scope.classe.annee = $scope.classe.dateDebut.substr(0,4) + "/" + $scope.classe.dateFin.substr(0,4);
			});
		}
		
		$scope.openDatePicker = function(i){
			if (i==1)
			{
				$scope.pickerDateDebut = true;
			}
			else
			{
				$scope.pickerDateFin = true;
			}
		}
		
		
		
		$scope.save = function (classe) {
			if ($scope.creation === true) {
				planClasses.postClasse(classe);
				$modalInstance.close();
			}
			else {
				classe.save();
				$modalInstance.close();
			}
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('Annuler');
		};
	});
	
webApp.controller('PlanEnseignantsController',
	function($scope, planEnseignants, Restangular, $modal){
		
		$scope.enseignants = [];
		$scope.matieres = [];
		$scope.showMatieresTable = false;		
		
		updateTable();	
		
		$scope.selectedEnseignant = {};
		
		$scope.select = function(enseignant){
			planEnseignants.getEnseignant(enseignant.id).then(function(ens){
				Restangular.copy(enseignant,$scope.selectedEnseignant);
				$scope.matieresView = [].concat($scope.selectedEnseignant.matieres);
				$scope.showMatieresTable = true;
			})		
		};
		
		$scope.removeMatiere = function(id){
			// A mettre dans une helper class?
			for (var i = 0; i < $scope.selectedEnseignant.matieres.length; i++) {
				if ($scope.selectedEnseignant.matieres[i].id == id) {
					$scope.selectedEnseignant.matieres.splice(i,1);
				}
			}
			$scope.selectedEnseignant.save();
			updateTable();
		};
		
		$scope.showAddForm = function() {
			var modalDetails = $modal.open({
				animation : true,
				templateUrl:"modals/listeMatieres.html",
				controller: "ListeMatieresController",
				size: "lg",
				windowClass: "container-fluid",
				resolve:  {
					enseignant : function(){
						return $scope.selectedEnseignant;
					}
				}		
			});
			
			modalDetails.result.then(function(matieres){
				$scope.selectedEnseignant.matieres = [];
				angular.copy(matieres,$scope.selectedEnseignant.matieres);
				$scope.selectedEnseignant.save();
				updateTable();
			})
		};
		
		function updateTable(){
			planEnseignants.getEnseignants().then(function(enseignants){		
			angular.forEach(enseignants,function(element){
				if (element.enabled == 1){
					element.enabled = true;
				}
				else{
					element.enabled = false;
				}
			})
			Restangular.copy(enseignants,$scope.enseignants);
			$scope.enseignantsView = [].concat($scope.enseignants);
			});
		};
		
	});

webApp.controller('ListeMatieresController',
	function($scope, $modalInstance, matieres, enseignant){
		
		$scope.matieres = [];
		$scope.matieresChoix = [];
		$scope.nom = enseignant.firstName + " " + enseignant.lastName;
		
		angular.copy(enseignant.matieres,$scope.matieresChoix);
		
		matieres.getMatieres().then(function(matieres){
			angular.copy(matieres,$scope.matieres);
			$scope.matieresView = [].concat($scope.matieres);
		})
		
		$scope.add = function(matiere) {
			if(!containsObject(matiere,$scope.matieresChoix))
			{
				$scope.matieresChoix.push(matiere);
			}				
		}
		
		$scope.save = function(){
			$modalInstance.close($scope.matieresChoix)
		}
		
		$scope.cancel = function(){
			$modalInstance.dismiss('Annuler');
		}
		
		//A mettre dans un service avec toutes les helpers classes
		function containsObject(obj, list){
			var bool = false;
			angular.forEach(list,function(element){
				//check sur l'id
				if (element.id == obj.id)
				{
					bool = true;
				}				
			});
			return bool;
		}
		
	});
	
webApp.controller('PlanCalendarClasses',
	function($scope, planClasses, Restangular){
		$scope.classes =  [];
		planClasses.getClasses().then(function(classes){		
			Restangular.copy(classes,$scope.classes);
		});
	});
	
webApp.controller('PlanCalendar',
	function($scope,$compile,uiCalendarConfig, Restangular, planCours, id){

		// calendrier google pour les jours fériés
		$scope.eventsGoogle = {
			googleCalendarId: 'fr.french#holiday@group.v.calendar.google.com',
			googleCalendarApiKey: 'AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M',
			className: 'gcal-event',
			currentTimezone: 'Europe/Paris'
		};
		
		// évènements pris de la BDD
		$scope.events = {
			url: (id == -1 ?'http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours' : 'http://guilaumehaag.ddns.net/SIO/PPEBackend/plan/cours/' + id)
		};
		
		$scope.contraintes = [
		{
			title: "Pause déjeuner",
			start: '12:15:00',
			end: '13:15:00',
			color: 'gray',
			rendering: 'background',
			dow: [1,2,3,4,5]
		}];
		
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
			if (event.title === "Programmation")
				element.find('.fc-title').append("<br/>Michel Diemer<br/>SIO2"); 
			$compile(element)($scope);
		};
		
		/* config object */
		$scope.uiConfig = {
			calendar:{
				height: 540,
				editable: false,
				header:{
					left: 'title',
					center: 'month,agendaWeek',
					right: 'today prev,next'
				},
				weekends : false,
				weekNumbers : true,
				eventRender: $scope.eventRender,
				minTime: "08:00:00",
				maxTime: "17:30:00",
				//slotDuration: "04:00:00",
				dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
				dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
				monthNames: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
			}
		};

		/* event sources array*/
		$scope.eventSources = [$scope.events,$scope.eventsGoogle,$scope.contraintes];
});
	
webApp.controller('InfoPlanificateurController',
	function($scope){
		//TODO :
	});