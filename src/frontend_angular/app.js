var webApp=angular.module("webApp",["ui.router","ui.bootstrap","smart-table","ngAnimate","toastr","restangular","ui.calendar"]);webApp.constant("USERS_ROLES",{administrateur:"administrateur",planificateur:"planificateur",enseignant:"enseignant"}),webApp.constant("AUTH_EVENTS",{loginSuccess:"auth-loginSuccess",loginFailed:"auth-loginFailed",logoutSuccess:"auth-logoutSuccess",sessionTimeout:"auth-sessionTimeout",notAuthenticated:"auth-notAuthenticated",notAuthorized:"auth-notAuthorized"}),webApp.config(["toastrConfig",function(e){angular.extend(e,{positionClass:"toast-bottom-right",maxOpened:1})}]),webApp.config(["$httpProvider",function(e){e.interceptors.push(["$injector",function(e){return e.get("AuthInterceptor")}])}]),webApp.run(["$rootScope","$state","Authentification","AUTH_EVENTS",function(e,n,t,o){e.$on("$stateChangeStart",function(n,i){if("activation"!==i.name){var a=i.data.authorizedRoles;t.isAuthorized(a)||(n.preventDefault(),t.isAuthenticated()?e.$broadcast(o.notAuthorized):e.$broadcast(o.notAuthenticated))}}),e.getClass=function(e){return n.current.name===e?"actif":""},e.logout=function(){t.logout()}}]),webApp.run(["$rootScope","$state","Authentification","AUTH_EVENTS",function(e,n,t,o){e.$on("$stateChangeStart",function(n,i){if("activation"!=i.name||"annee"!=i.name){var a=i.data.authorizedRoles;t.isAuthorized(a)||(n.preventDefault(),t.isAuthenticated()?e.$broadcast(o.notAuthorized):e.$broadcast(o.notAuthenticated))}}),e.getClass=function(e){return n.current.name==e?"actif":""},e.logout=function(){t.logout()}}]),webApp.config(["$stateProvider","$urlRouterProvider","RestangularProvider","USERS_ROLES",function(e,n,t,o){t.setBaseUrl("http://10.0.0.5/gpci/backend"),n.otherwise("/"),e.state("accueil",{url:"/",templateUrl:"views/accueil.html",data:{authorizedRoles:[o.administrateur,o.planificateur,o.enseignant]}}).state("annee",{url:"/annee",templateUrl:"views/public/listeAnnee.html",controller:"PlanAnneeController"}).state("activation",{url:"/activation/:id/:token",templateUrl:"views/activation.html",controller:"ActivationController",resolve:{id:["$stateParams",function(e){return e.id}],token:["$stateParams",function(e){return e.token}]}}).state("profil",{url:"/profil",templateUrl:"views/profil.html",controller:"ProfilController",data:{authorizedRoles:[o.administrateur,o.planificateur,o.enseignant]}}).state("administration",{url:"/administration",templateUrl:"views/administration/administration.html",controller:"AdminController",data:{authorizedRoles:[o.administrateur]}}).state("planification",{url:"/planification",templateUrl:"views/planification/navigation.html",controller:"planificationController",data:{authorizedRoles:[o.planificateur]}}).state("planification.classes",{url:"/classes",templateUrl:"views/planification/listeClasses.html",controller:"PlanClassesController",data:{authorizedRoles:[o.planificateur]}}).state("planification.matieres",{url:"/matieres",templateUrl:"views/planification/matieres.html",controller:"PlanMatieresController",data:{authorizedRoles:[o.planificateur]}}).state("planification.enseignants",{url:"/enseignants",templateUrl:"views/planification/listeEnseignants.html",controller:"PlanEnseignantsController",data:{authorizedRoles:[o.planificateur]}}).state("planification.calendar",{url:"/periodes/:id",templateUrl:"views/planification/calendar.html",controller:"PlanCalendar",resolve:{id:["$stateParams",function(e){return e.id}]},data:{authorizedRoles:[o.planificateur]}}).state("enseignement",{url:"/enseignement",templateUrl:"views/enseignement/navigation.html",data:{authorizedRoles:[o.enseignant]}}).state("enseignement.cours",{url:"/cours",templateUrl:"views/enseignement/cours.html",controller:"EnsCoursController",data:{authorizedRoles:[o.enseignant]}}).state("enseignement.indisponibilites",{url:"/indisponibilites",templateUrl:"views/enseignement/indisponibilites.html",controller:"indisposController",data:{authorizedRoles:[o.enseignant]}}).state("enseignement.calendar",{url:"/calendar",templateUrl:"views/enseignement/calendar.html",controller:"EnsCalendarController",data:{authorizedRoles:[o.enseignant]}})}]),webApp.controller("ActivationController",["$scope","serviceActivation","id","token",function(e,n,t,o){e.user={},e.user.id=t,e.activation={},n.Activation(t,o).then(function(n){1==n?e.activation.message="Votre compte a bien été activé":e.activation.message="Il y a eu un problème lors de l'activation"},function(){e.activation.message="Il y a eu un problème lors de l'activation"}),e.submit=function(t){n.SetFirstPassword(t).then(function(n){1==n&&(e.creationMdp=!0),e.form.message="Le mot de passe a été créé correctement, vous pouvez vous connectez avec le lien en haut à droite"})}}]),webApp.controller("loginController",["$scope","$state","$uibModalInstance","$window","Authentification",function(e,n,t,o,i){if(e.user={},e.form={},e.error=!1,e.submit=function(){return e.submitted=!0,e.form.$invalid?void(e.error=!0):void e.login(e.user)},e.login=function(o){e.error=!1,i.login(o,function(e){t.close(),e&&n.go(e.home)},function(){e.errorMessage="Le serveur n'a pas accepté vos identifiants",e.error=!0})},o.sessionStorage.userData)try{var a=JSON.parse(o.sessionStorage.userData);e.login(a)}catch(r){}}]),webApp.controller("mainController",["$scope","$rootScope","$uibModal","Authentification","Session","AUTH_EVENTS","USERS_ROLES",function(e,n,t,o,i,a,r){e.navCollapsed=!0,e.modalShown=!1;var s=function(){if(!e.modalShown){e.modalShown=!0;var n=t.open({templateUrl:"modals/login.html",controller:"loginController",backdrop:"static"});n.result.then(function(){e.modalShown=!1})}},c=function(){e.currentUser=i},u=function(){alert("Zone non autorisé")};e.login=function(){s()},e.logout=function(){o.logout()},e.currentUser=null,e.userRoles=r,e.isAuthorized=o.isAuthorized,n.$on(a.notAuthorized,u),n.$on(a.notAuthenticated,s),n.$on(a.sessionTimeout,s),n.$on(a.logoutSuccess,s),n.$on(a.loginSuccess,c)}]),webApp.controller("ProfilController",["$scope","$rootScope","profilService","Session","themes",function(e,n,t,o,i){e.emails={},e.passwords={},e.isSavedEmail=!1,e.isSavingEmail=!1,e.isSavingPassword=!1,e.isSavedPassword=!1,e.user=o,e.saveEmail=function(){e.isSavingEmail=!0,t.changeEmail(e.emails).then(function(){e.isSavingEmail=!1,e.isSavedEmail=!0},function(n){e.isSavingEmail=!1,e.errorEmail=n})},e.savePassword=function(){e.isSavingPassword=!0,t.changePassword(e.passwords).then(function(){e.isSavingPassword=!1,e.isSavedPassword=!0},function(n){e.isSavingPassword=!1,e.errorPassword=n})},e.changeTheme=function(e){i.select(e)},e.changeButton=function(e){i.selectButton(e)}}]),webApp.filter("unique",function(){return function(e,n){var t,o={},i=e.length,a=[];for(t=0;i>t;t+=1)o[e[t][n]]=e[t];for(t in o)a.push(o[t]);return a}}),webApp.factory("serviceActivation",["Restangular",function(e){return{Activation:function(n,t){return e.one("activation",n).one("token",t).get()},SetFirstPassword:function(n){return e.all("set_firstpassword").post(n)}}}]),webApp.factory("helper",function(){return{getObjectFromArray:function(e,n,t){var o=e.filter(function(e){return e[n]==t});return o?o[0]:null},deleteObjectFromArray:function(e,n,t){return e.filter(function(e){return e[n]!=t})},getObjectFromDateInArray:function(e,n,t){var o=e.filter(function(e){return moment(e[n]).isSame(t,"day")});return o?o[0]:null},getPeriodFromDateInArray:function(e,n){var t=e.filter(function(e){return moment(n).isBetween(e.start,e.end)});return t?t[0]:null}}}),webApp.factory("initializers",["matieresService","classesService","enseignantsService",function(e,n,t){function o(){e.updateList(),n.updateList(),t.updateList()}return{planification:o}}]),webApp.factory("serviceMatieres",["Restangular",function(e){return{getMatieres:function(){return e.all("matieres").getList()}}}]),webApp.factory("notifService",["toastr",function(e){function n(){e.clear(),e.info("Sauvegarde en cours...")}function t(){e.clear(),e.success("Sauvegarde terminée!")}function o(){e.clear(),e.info("Suppression en cours...")}function i(){e.clear(),e.success("Suppression terminée!")}function a(){e.clear(),e.info("Envoi des assignations en cours...")}function r(){e.clear(),e.success("Assignations envoyées!")}function s(n){e.clear(),e.error(n,"Erreur")}return{saving:n,saved:t,deleting:o,deleted:i,error:s,sending:a,sent:r}}]),webApp.factory("profilService",["$q","Restangular",function(e,n){return{changePassword:function(t){return e(function(e,o){n.one("changePassword").doPOST(t).then(function(){e("ok")},function(){o("Il y a eu un probl�me sur le serveur")})})},changeEmail:function(t){return e(function(e,o){n.one("changeEmail").doPOST(t).then(function(){e("ok")},function(){o("Il y a eu un probl�me sur le serveur")})})}}}]),webApp.factory("serviceRoles",["Restangular",function(e){return{getRoles:function(){return e.all("roles").getList()}}}]),webApp.service("Session",["$rootScope","USERS_ROLES",function(e,n){return this.create=function(n){this.user=n.name,this.firstName=n.firstName,this.lastName=n.lastName,this.roles=n.roles,this.token=n.token,this.home=n.home,this.id=n.id,this.email=n.email,this.theme=n.theme,e.theme=n.theme},this.destroy=function(){this.user=null,this.firstName=null,this.lastName=null,this.roles=null,this.token=null,this.home=null,this.id=null,this.email=null,this.theme=null},this}]),webApp.factory("themes",["$rootScope","$state","notifService","Restangular",function(e,n,t,o){function i(n){t.saving(),o.all("theme").post({theme:n}).then(function(){t.saved(),e.theme=n},function(){t.error("Votre choix n'a pas été sauvegardé")})}return e.themes={cerulean:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css",cosmo:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cosmo/bootstrap.min.css",cyborg:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cyborg/bootstrap.min.css",darkly:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/darkly/bootstrap.min.css",flatly:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/flatly/bootstrap.min.css",journal:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/journal/bootstrap.min.css",lumen:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css",paper:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/paper/bootstrap.min.css",readable:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/readable/bootstrap.min.css",sandstone:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/sandstone/bootstrap.min.css",simplex:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/simplex/bootstrap.min.css",slate:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/slate/bootstrap.min.css",spacelab:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/spacelab/bootstrap.min.css",superhero:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/superhero/bootstrap.min.css",united:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/united/bootstrap.min.css",yeti:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/yeti/bootstrap.min.css"},{select:i}}]),webApp.controller("AdminDetails",["$scope","$timeout","$uibModalInstance","adminService","personne","serviceRoles","Restangular",function(e,n,t,o,i,a,r){function s(){e.$watch(function(){return e.personne.firstName},function(){void 0!=e.personne.firstName&&void 0!=e.personne.lastName&&u()},!0),e.$watch(function(){return e.personne.lastName},function(){void 0!=e.personne.firstName&&void 0!=e.personne.lastName&&u()},!0),e.$watch(function(){return e.formRoles},function(n){e.personne.roles=[],angular.forEach(e.formRoles,function(n,t){n&&e.personne.roles.push(c(t))})},!0)}function c(n){for(var t=0;t<e.roles.length;t++)if(e.roles[t].id==n)return e.roles[t]}function u(){e.personne.login=e.personne.firstName.substring(0,1).toLowerCase()+e.personne.lastName.toLowerCase()}e.personne={},e.roles={},e.formRoles={},e.creation=!i,a.getRoles().then(function(n){e.roles=n}),-1===i?(e.creation=!0,s()):(o.getOne(i.id).then(function(n){r.copy(n,e.personne),angular.forEach(n.roles,function(n){e.formRoles[n.id]=!0},this)}),s()),e.creation?e.personne=o.getNew():o.getOne(i.id).then(function(n){e.personne=n}),e.save=function(){e.personne.toDelete=!1,t.close(e.personne)},e.remove=function(){e.personne.toDelete=!0,t.close(e.personne)},e.cancel=function(){t.dismiss("Annuler")}}]),webApp.controller("AdminController",["$scope","$uibModal","Restangular","adminService",function(e,n,t,o){function i(){o.updateList().then(function(){o.getList().then(function(n){t.copy(n,e.personnes),e.personnesView=[].concat(e.personnes)})})}e.personnes=[],o.getList().then(function(n){e.personnes=n,e.personnesView=[].concat(e.personnes)}),i(),e.openDetails=function(t){e.personne=t;var a=n.open({animation:!0,templateUrl:"modals/personnesDetails.html",controller:"AdminDetails",size:"md",resolve:{personne:function(){return e.personne}}});a.result.then(function(n){n.toDelete?e.remove(n):o.save(n).then(function(){i()})})},e.remove=function(e){o.remove(e).then(function(){i()})},e.changeState=function(e){o.getOne(e.id).then(function(n){n.enabled="1"==e.enabled?0:1,n.save(),i()})}}]),webApp.controller("EnsCalendarController",["$scope","ensCalendarService",function(e,n){e.calendarConfig=n.calendarConfig,e.eventSources=n.eventSources}]),webApp.controller("EnsCoursController",["$scope","Session","ensCours","Restangular",function(e,n,t,o){function i(){t.getCours().then(function(n){angular.forEach(n,function(e){e.periode=8==moment(e.start).hour()?"matin":"après-midi",e.date=moment(e.start).format("DD-MM-YYYY")}),o.copy(n,e.cours),e.coursView=[].concat(e.cours)})}e.id=n.id,e.cours=[],i()}]),webApp.controller("indisposController",["$scope","ensCalendarService","indispoService",function(e,n,t){function o(){t.getServerIndispos().then(function(){e.isLoading=!1},function(){e.error="Il y a eu une erreur avec le serveur."})}e.isLoading=!0,e.error="",e.isModified=t.listModified(),e.calendarConfig=n.calendarConfig,e.eventSource=[],o(),e.addPeriod=function(){t.openPeriodeModal()},e.saveChanges=function(){t.updateIndispos()},e.cancelChanges=function(){o()},e.$watch(function(){return t.listModified()},function(n,o){n!==o&&(e.isModified=t.listModified())})}]),webApp.controller("periodeModal",["$scope","indispo","$uibModalInstance",function(e,n,t){e.indispo=n,n.isNew||(e.indispo.start=moment(e.indispo.start).startOf("day").toDate(),e.indispo.end=moment(e.indispo.end).startOf("day").toDate()),e.pickerDateDebut={opened:!1},e.pickerDateFin={opened:!1},e.openPickerDebut=function(){e.pickerDateDebut.opened=!0},e.openPickerFin=function(){e.pickerDateFin.opened=!0},e.save=function(){e.indispo.start=moment(e.indispo.start).hour(8).format("YYYY-MM-DD HH:mm:ss"),e.indispo.end=moment(e.indispo.end).hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss"),e.indispo.toSave=!0,t.close(e.indispo)},e["delete"]=function(){e.indispo.toSave=!1,t.close(e.indispo)},e.dismiss=function(){t.dimiss("cancel")}}]),webApp.controller("planificationController",["initializers",function(e){e.planification()}]),webApp.controller("PlanAnneeController",["$scope","$uibModal","$http","classesService","weekService",function(e,n,t,o,i){e.current_classes=[],e.next_classes=[],o.getCurrentNextList("current").then(function(n){e.current_classes=n,e.classesView=[].concat(e.current_classes)}),o.getCurrentNextList("next").then(function(n){e.next_classes=n,e.next_classesView=[].concat(e.next_classes)}),e.year="",e.nextyear="",e.week=[],i.getList("current").then(function(n){e.week=n,e.weekView=[].concat(e.week)}),e.nextweek=[],i.getList("next").then(function(n){e.nextweek=n,e.nextweekView=[].concat(e.nextweek)}),t({method:"GET",url:"http://10.0.0.5/gpci/backend/plan/years/current"}).then(function(n){e.year=n.data.year},function(e){}),t({method:"GET",url:"http://10.0.0.5/gpci/backend/plan/years/next"}).then(function(n){e.nextyear=n.data.year},function(e){})}]),webApp.factory("adminService",["$q","notifService","Restangular",function(e,n,t){function o(){return e(function(e,n){t.all("admin/personnes").getList().then(function(n){u=[].concat(n),e()},function(){n()})})}function i(){return e(function(e,n){u?e(u):(console.log(u),o().then(function(){e(u)}))})}function a(n){return e(function(e,o){t.one("admin/personnes",n).get().then(function(n){e(n)},function(){o()})})}function r(){return t.one("admin/personnes")}function s(t){return e(function(e,o){n.saving(),t.save().then(function(){n.saved(),e()},function(e){n.error(e.data.message),o()})})}function c(t){return e(function(e,o){n.deleting(),t.remove().then(function(){n.deleted(),e()},function(e){n.error(e.data.message),o()})})}var u=[];return{updateList:o,getList:i,getOne:a,getNew:r,save:s,remove:c}}]),webApp.factory("ensCalendarService",["uiCalendarConfig","indispoService",function(e,n){function t(e){var n="";return e.forEach(function(e){n+=e.nom+" "}),n}var o=function(e,t){if(!t.hasClass("fc-other-month")&&moment(e).isAfter(moment().startOf("day")))switch(t.hasClass("clickable")||t.addClass("clickable"),t.empty(),t.css("position","relative"),n.checkDayForIndispo(e)){case 1:t.append('<p class="day-text"><strong>Journée</strong></p>'),t.css("background-color","#FF4136");break;case 2:t.append('<p class="day-text"><strong>Matin</strong></p>'),t.css("background-color","#FFDC00");break;case 3:t.append('<p class="day-text"><strong>Après-midi</strong></p>'),t.css("background-color","#FF851B");break;case 4:t.append('<p class="day-text"><strong>Période</strong></p>'),t.css("background-color","#AAAAAA");break;case 0:t.append('<p class="day-text"><strong>Disponible</strong></p>'),t.css("background-color","#2ECC40")}},i=function(e,t,i){var a=n.checkDayForIndispo(e);4!==a?(n.changeIndispoType(e),o(e,$(this))):n.openPeriodeModal(e)},a={googleCalendarId:"fr.french#holiday@group.v.calendar.google.com",googleCalendarApiKey:"AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",className:"gcal-event",currentTimezone:"Europe/Paris"},r={url:"http://10.0.0.5/gpci/backend/public/cours",color:"green",className:"coursEvent",eventDataTransform:function(e){return{id:e.id,title:e.matiere.nom,enseignant:void 0!=e.user?e.user.firstName+" "+e.user.lastName:"",classes:t(e.classes),start:e.start,end:e.end,assignationSent:e.assignationSent}}},s=[a,r],c=function(e,n,t){"agendaWeek"==t.type&&n.hasClass("coursEvent")&&(n.find(".fc-content").append("<p>"+e.enseignant+"</p>"),n.find(".fc-content").append("<p>"+e.classes+"</p>"))},u={calendarIndispos:{height:540,editable:!1,header:{left:"title",right:"today prev,next"},weekends:!1,weekNumbers:!0,dayRender:o,dayClick:i,minTime:"08:00:00",maxTime:"17:30:00",dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]},calendarCours:{height:540,editable:!1,header:{left:"title",center:"month,agendaWeek",right:"today prev,next"},weekends:!1,weekNumbers:!0,eventRender:c,minTime:"08:00:00",maxTime:"17:30:00",dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]}};return{calendarConfig:u,eventSources:s}}]),webApp.factory("ensCours",["Restangular",function(e){return{getCours:function(){return e.all("ens/cours").getList()}}}]),webApp.factory("indispoService",["$q","$uibModal","helper","Restangular","uiCalendarConfig","notifService",function(e,n,t,o,i,a){function r(){return e(function(e,n){o.all("ens/indispo").getList().then(function(n){d=[].concat(n.plain()),f=!1,i.calendars.indisposCalendar.fullCalendar("prev"),i.calendars.indisposCalendar.fullCalendar("next"),e(!0)},function(){n(!1)})})}function s(e){var n=0,o=t.getObjectFromDateInArray(d,"start",e);return o?n=o.toDelete?0:8===moment(o.start).hour()&&17===moment(o.end).hour()&&moment(o.start).isSame(o.end,"day")?1:8===moment(o.start).hour()&&12===moment(o.end).hour()?2:13===moment(o.start).hour()&&17===moment(o.end).hour()?3:4:t.getPeriodFromDateInArray(d,e)&&(n=4),n}function c(e){var n=t.getObjectFromDateInArray(d,"start",e);if(n)n.isModified=!0,n.toDelete?(n.start=moment(n.start).hour(8).format("YYYY-MM-DD HH:mm:ss"),n.toDelete=!1):8===moment(n.start).hour()&&17===moment(n.end).hour()?n.end=moment(n.end).hour(12).minutes(15).format("YYYY-MM-DD HH:mm:ss"):8===moment(n.start).hour()&&12===moment(n.end).hour()?(n.start=moment(n.start).hour(13).minutes(15).format("YYYY-MM-DD HH:mm:ss"),n.end=moment(n.end).hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss")):13===moment(n.start).hour()&&17===moment(n.end).hour()&&(n.toDelete=!0,n.isModified=!1);else{var o={};o.start=e.hour(8).format("YYYY-MM-DD HH:mm:ss"),o.end=e.hour(17).minutes(30).format("YYYY-MM-DD HH:mm:ss"),o.isModified=!0,d.push(o)}f=!0}function u(){var n=[];d.forEach(function(e){e.isModified&&n.push(o.all("ens/indispo").post(e)),e.toDelete&&n.push(o.one("ens/indispo",e.id).remove())}),a.saving(),e.all(n).then(function(){return r(),f=!1,a.saved(),!0},function(){return r(),f=!1,a.error("Un problème avec le serveur a empeché la sauvegarde"),!1})}function l(e){var i=e?t.getPeriodFromDateInArray(d,e):{isNew:!0},a=n.open({animation:!0,templateUrl:"modals/indispos/periodeModal.html",controller:"periodeModal",size:"md",resolve:{indispo:function(){return Object.create(i)}}});a.result.then(function(e){e.toSave?o.all("ens/indispo").post(e).then(function(){r()}):o.one("ens/indispo",e.id).remove().then(function(){r()})},function(){})}var d=[],f=!1;return{getIndispos:function(){return d},listModified:function(){return f},getServerIndispos:r,checkDayForIndispo:s,changeIndispoType:c,updateIndispos:u,openPeriodeModal:l}}]),webApp.factory("Authentification",["$rootScope","$window","Session","AUTH_EVENTS","Restangular",function(e,n,t,o,i){var a={};return a.login=function(a,r,s){i.all("login").post(a).then(function(i){if(i){var a=i;n.sessionStorage.userData=JSON.stringify(a),t.create(a),e.$broadcast(o.loginSuccess),r(a)}},function(){e.$broadcast(o.loginFailed),s()})},a.isAuthenticated=function(){return!!t.user},a.isAuthorized=function(e){angular.isArray(e)||(e=[e]);var n=!1;return a.isAuthenticated()&&angular.forEach(t.roles,function(t){-1!==e.indexOf(t)&&(n=!0)}),n},a.logout=function(){i.one("logout").doPOST(),t.destroy(),n.sessionStorage.removeItem("userData"),n.location.reload()},a}]),webApp.factory("AuthInterceptor",["$rootScope","$q","Session","AUTH_EVENTS",function(e,n,t,o){return{responseError:function(t){return e.$broadcast({401:o.notAuthenticated,403:o.notAuthorized,419:o.sessionTimeout,440:o.sessionTimeout}[t.status],t),n.reject(t)}}}]),webApp.factory("planCalendarService",["uiCalendarConfig","$uibModal","coursService","enseignantsService",function(e,n,t,o){function i(e){var n="";return e.forEach(function(e){n+=e.nom+" "}),n}var a=function(e,n,t){"agendaWeek"===t.type?(n.hasClass("coursContainer")&&moment(e.start).isAfter(moment().startOf("day"))&&(n.find(".fc-bg").append("<div>"+e.description+"</div>"),n.addClass("clickable")),n.hasClass("coursEvent")&&(n.find(".fc-content").append("<p>"+e.enseignant+"</p>"),n.find(".fc-content").append("<p>"+e.classes+"</p>"))):n.hasClass("coursContainer")&&n.css("display","none"),0==e.assignationSent&&n.css("backgroundColor","#FF851B")},r=function(i,a,r){if("agendaWeek"===r.type&&moment(i.start).isAfter(moment().startOf("day"))){var s=n.open({animation:!0,templateUrl:"modals/coursDetails.html",controller:"CoursDetails",size:"md",resolve:{event:function(){return i}}});s.result.then(function(n){n.toDelete?t.remove(n).then(function(){o.updateList(),e.calendars.planCalendar.fullCalendar("removeEventSource",u),e.calendars.planCalendar.fullCalendar("addEventSource",u)}):t.save(n).then(function(){o.updateList(),e.calendars.planCalendar.fullCalendar("removeEventSource",u),e.calendars.planCalendar.fullCalendar("addEventSource",u)})})}},s=function(){var n=e.calendars.planCalendar.fullCalendar("getView");t.sendAssignations(n.intervalStart.format(),n.intervalEnd.format()).then(function(){e.calendars.planCalendar.fullCalendar("removeEventSource",u),e.calendars.planCalendar.fullCalendar("addEventSource",u)})},c={calendar:{height:540,editable:!1,customButtons:{sendMail:{text:"Envoyer mails d'assignations",click:s}},header:{left:"title, sendMail",center:"month,agendaWeek",right:"today prev,next"},weekends:!1,weekNumbers:!0,eventRender:a,eventClick:r,minTime:"08:00:00",maxTime:"17:30:00",defaultView:"agendaWeek",dayNames:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],dayNamesShort:["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],monthNames:["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]}},u={url:"http://10.0.0.5/gpci/backend/plan/cours",color:"green",className:"coursEvent",eventDataTransform:function(e){return{id:e.id,title:e.matiere.nom,enseignant:void 0!=e.user?e.user.firstName+" "+e.user.lastName:"",classes:i(e.classes),start:e.start,end:e.end,assignationSent:e.assignationSent}}},l=[{start:"8:00",end:"12:15",dow:[1,2,3,4,5],className:"coursContainer",description:"Rajouter un cours"},{start:"13:15",end:"17:30",dow:[1,2,3,4,5],className:"coursContainer",description:"Rajouter un cours"}],d={googleCalendarId:"fr.french#holiday@group.v.calendar.google.com",googleCalendarApiKey:"AIzaSyAbOYkIfOWcqCnHEs_Mlf0JuT0HJ8TVq1M",className:"gcal-event",currentTimezone:"Europe/Paris"},f=[u,d,l];return{config:c,feed:f}}]),webApp.factory("classesService",["$q","notifService","Restangular",function(e,n,t){function o(){return e(function(e,n){t.all("plan/classe").getList().then(function(n){angular.forEach(n,function(e){e.annee=e.start.substr(0,4)+"/"+e.end.substr(0,4)}),d=[].concat(n.plain()),e()},function(){n()})})}function i(n){return e(function(e,o){t.one("plan/current_next_classe",n).getList().then(function(n){angular.forEach(n,function(e){e.annee=e.start.substr(0,4)+"/"+e.end.substr(0,4)}),d=[].concat(n.plain()),e()},function(){o()})})}function a(){return e(function(e,n){o().then(function(){e(d)})})}function r(n){return e(function(e,t){i(n).then(function(){e(d)})})}function s(n){return e(function(e,o){t.one("plan/classe",n).get().then(function(n){n.annee=n.start.substr(0,4)+"/"+n.end.substr(0,4),n.start=moment(n.start).startOf("day").toDate(),n.end=moment(n.end).startOf("day").toDate(),n.id_Users=Number(n.id_Users),e(n)},function(){o()})})}function c(){return t.one("plan/classe")}function u(t){return e(function(e,o){n.saving(),t.save().then(function(){n.saved(),e()},function(e){n.error(e),o()})})}function l(t){return e(function(e,o){n.deleting(),t.remove().then(function(){n.deleted(),e()},function(e){n.error(e.data.message),o()})})}var d=[];return{updateList:o,getList:a,updateCurrentNextList:i,getCurrentNextList:r,getOne:s,getNew:c,save:u,remove:l}}]),webApp.factory("coursService",["$q","Restangular","notifService",function(e,n,t){function o(t){return e(function(e,o){n.one("plan/cours",t).get().then(function(n){n.id_Users=Number(n.id_Users),n.id_Matieres=Number(n.id_Matieres),e(n)},function(){o()})})}function i(){return n.one("plan/cours")}function a(n){return e(function(e,o){t.saving(),n.save().then(function(){t.saved(),e()},function(e){t.error(e.data.message),o()})})}function r(n){return e(function(e,o){t.deleting(),n.remove().then(function(){t.deleted(),e()},function(e){t.error(e.data.message),o()})})}function s(o,i){return e(function(e,a){t.sending(),n.one("plan/cours").customGET("assignation",{start:o,end:i}).then(function(){t.sent(),e()},function(e){t.error(e.data.message),a()})})}return{getOne:o,getNew:i,save:a,remove:r,sendAssignations:s}}]),webApp.factory("enseignantsService",["$q","notifService","Restangular",function(e,n,t){function o(){return e(function(e,n){t.all("plan/enseignant").getList().then(function(n){angular.forEach(n,function(e){e.fullName=e.firstName+" "+e.lastName}),s=[].concat(n),e()},function(){n()})})}function i(){return e(function(e,n){s?e(s):o().then(function(){e(s)})})}function a(n){return e(function(e,o){t.one("plan/enseignant",n).get().then(function(n){e(n)},function(){o()})})}function r(t){return e(function(e,o){n.saving(),t.save().then(function(){n.saved(),e()},function(e){n.error(e.data.message),o()})})}var s=[];return{updateList:o,getList:i,getOne:a,save:r}}]),webApp.factory("matieresService",["$q","notifService","Restangular",function(e,n,t){function o(){return e(function(e,n){t.all("plan/matiere").getList().then(function(n){u=[].concat(n),e()},function(){n()})})}function i(){return e(function(e,n){u?e(u):o().then(function(){e(u)})})}function a(n){return e(function(e,o){t.one("plan/matiere",n).get().then(function(n){e(n)},function(){o()})})}function r(){return t.one("plan/matiere")}function s(t){return e(function(e,o){n.saving(),t.save().then(function(){n.saved(),e()},function(e){n.error(e.data.message),o()})})}function c(t){return e(function(e,o){n.deleting(),t.remove().then(function(){n.deleted(),e()},function(e){n.error(e.data.message),o()})})}var u=[];return{updateList:o,getList:i,getOne:a,getNew:r,save:s,remove:c}}]),webApp.factory("weekService",["$q","notifService","Restangular",function(e,n,t){function o(n){return e(function(e,o){t.one("plan/weeks",n).getList().then(function(n){a=[].concat(n.plain()),e()},function(){o()})})}function i(n){return e(function(e,t){o(n).then(function(){e(a)})})}var a=[];return{updateList:o,getList:i}}]),webApp.controller("PlanCalendar",["$scope","planCalendarService",function(e,n){e.config=n.config,e.feed=n.feed}]),webApp.controller("CoursDetails",["$scope","$uibModalInstance","helper","coursService","enseignantsService","matieresService","classesService","event",function(e,n,t,o,i,a,r,s){function c(){e.$watch(function(){return e.cours.id_Matieres},function(n,t){n!==t&&(e.enseignants=[],angular.forEach(e.enseignantsBase,function(n){u(n)&&e.enseignants.push(n)}))},!0),e.$watch(function(){return e.formClasses},function(n){e.cours.classes=[],angular.forEach(e.formClasses,function(n,o){n&&e.cours.classes.push(t.getObjectFromArray(e.classes,"id",o))})},!0)}function u(n){return e.cours.id_Matieres?!!t.getObjectFromArray(n.matieres,"id",e.cours.id_Matieres):!0}function l(n){angular.forEach(n,function(n){n.id==e.cours.id_Users?(n.indisponible=!1,n.viewName=n.fullName+" (choix actuel)"):t.getPeriodFromDateInArray(n.indisponibilite,s.start)?(n.indisponible=!0,n.viewName=n.fullName+" (indisponible)"):t.getPeriodFromDateInArray(n.cours,s.start)?(n.indisponible=!0,n.viewName=n.fullName+" (déjà assigné)"):(n.indisponible=!1,n.viewName=n.fullName)})}e.matieres=[],e.enseignantsBase=[],e.enseignants=[],e.classes=[],e.formClasses={},a.getList().then(function(n){e.matieres=n}),r.getList().then(function(n){e.classes=n}),e.creation=!s.title,e.creation?(e.cours=o.getNew(),e.cours.start=s.start.format(),e.cours.end=s.end.format(),i.getList().then(function(n){l(n),e.enseignantsBase=[].concat(n),e.enseignants=[].concat(e.enseignantsBase),c()})):o.getOne(s.id).then(function(n){e.cours=n,e.cours.title=n.matiere?n.matiere.nom:"",e.cours.title+=n.user?" | "+n.user.lastName:"",angular.forEach(n.classes,function(n){e.formClasses[n.id]=!0},this),i.getList().then(function(n){l(n),e.enseignantsBase=[].concat(n),e.enseignants=[].concat(e.enseignantsBase),c()})}),e.save=function(){e.cours.toDelete=!1,n.close(e.cours)},e["delete"]=function(){e.cours.toDelete=!0,n.close(e.cours)},e.cancel=function(){n.dismiss()}}]),webApp.controller("PlanClassesController",["$scope","$uibModal","classesService",function(e,n,t){function o(){t.updateList().then(function(){t.getList().then(function(n){e.classes=n,e.classesView=[].concat(e.classes)})})}e.classes=[],t.getList().then(function(n){e.classes=n,e.classesView=[].concat(e.classes)}),e.openClasse=function(i){e.classe=i;var a=n.open({animation:!0,templateUrl:"modals/classesDetails.html",controller:"ClasseDetails",size:"md",resolve:{classe:function(){return e.classe}}});a.result.then(function(e){e.toDelete?t.remove(e).then(function(){o()}):t.save(e).then(function(){o();
})})},e["delete"]=function(e){t.remove(e).then(function(){o()})}}]),webApp.controller("ClasseDetails",["$scope","$timeout","$uibModalInstance","classesService","enseignantsService","classe",function(e,n,t,o,i,a){i.getList().then(function(n){e.enseignants=n}),e.pickerDateDebut={opened:!1},e.pickerDateFin={opened:!1},e.openPickerDebut=function(){e.pickerDateDebut.opened=!0},e.openPickerFin=function(){e.pickerDateFin.opened=!0},e.creation=!a,e.creation?e.classe=o.getNew():o.getOne(a.id).then(function(n){e.classe=n}),e.save=function(){e.classe.toDelete=!1,t.close(e.classe)},e.remove=function(){e.classe.toDelete=!0,t.close(e.classe)},e.cancel=function(){t.dismiss()}}]),webApp.controller("PlanEnseignantsController",["$scope","$uibModal","helper","enseignantsService",function(e,n,t,o){function i(){o.updateList().then(function(){o.getList().then(function(n){e.enseignants=n,e.enseignantsView=[].concat(e.enseignants)})})}e.enseignants=[],e.matieres=[],e.showMatieresTable=!1,o.getList().then(function(n){e.enseignants=n,e.enseignantsView=[].concat(e.enseignants)}),e.selectedEnseignant={},e.select=function(n){e.selectedEnseignant=t.getObjectFromArray(e.enseignants,"id",n.id),e.showMatieresTable=!0},e.removeMatiere=function(n){e.selectedEnseignant.matieres=t.deleteObjectFromArray(e.selectedEnseignant.matieres,"id",n),e.selectedEnseignant.save(),i()},e.showAddForm=function(){var t=n.open({animation:!0,templateUrl:"modals/listeMatieres.html",controller:"EnseignantsMatieresController",size:"lg",windowClass:"container-fluid",resolve:{enseignant:function(){return e.selectedEnseignant}}});t.result.then(function(e){o.save(e).then(function(){i()})})}}]),webApp.controller("EnseignantsMatieresController",["$scope","$uibModalInstance","helper","matieresService","enseignant",function(e,n,t,o,i){e.matieres=[],e.enseignant=i,o.getList().then(function(n){e.matieres=n,e.matieresView=[].concat(e.matieres)}),e.add=function(n){t.getObjectFromArray(e.enseignant.matieres,"id",n)||e.enseignant.matieres.push(n)},e.save=function(){n.close(e.enseignant)},e.cancel=function(){n.dismiss()}}]),webApp.controller("PlanMatieresController",["$scope","$uibModal","matieresService",function(e,n,t){function o(){t.updateList().then(function(){t.getList().then(function(n){e.matieres=n,e.matieresView=[].concat(e.matieres)})})}e.matieres=[],t.getList().then(function(n){e.matieres=n,e.matieresView=[].concat(e.matieres)}),e.open=function(i){e.matiere=i;var a=n.open({animation:!0,templateUrl:"modals/matieresDetails.html",controller:"MatiereDetails",size:"md",resolve:{matiere:function(){return e.matiere}}});a.result.then(function(n){n.toDelete?e.remove(n):t.save(n).then(function(){o()})})},e.remove=function(e){t.remove(e).then(function(){o()})}}]),webApp.controller("MatiereDetails",["$scope","$timeout","$uibModalInstance","matieresService","matiere",function(e,n,t,o,i){e.matiere={},e.creation=!i,e.creation?e.matiere=o.getNew():o.getOne(i.id).then(function(n){e.matiere=n}),e.save=function(){e.matiere.toDelete=!1,t.close(e.matiere)},e.remove=function(){e.matiere.toDelete=!0,t.close(e.matiere)},e.cancel=function(){t.dismiss("Annuler")}}]);