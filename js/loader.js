/**
 * [PreLoader Clase de tipo object notation que controla la carga inicial de la app]
 * @type {Object}
 */
var PreLoader = function(_preloader, _content, _legend) {
    this.preloader = _preloader;
    this.content = _content;
    this.legend = _legend;

};
/**
 * [setPreloader Setter del id del DIV que funciona como preloader]
 * @param {[string]} _preloader [id del DIV preloader]
 */
PreLoader.prototype.setPreloader = function(_preloader) {
    this.preloader = _preloader;
};
/**
 * [getPreloader Getter del id del div #preloader]
 * @return {[string]} [description]
 */
PreLoader.prototype.getPreloader = function() {
    return this.preloader;
};
/**
 * [setContent Setter del id del DIV que funciona como contenedor de SAPUI5]
 * @param {[string]} _content [description]
 */
PreLoader.prototype.setContent = function(_content) {
    this.content = _content;
};
/**
 * [getContent Getter del id del div #content]
 * @return {[string]} [description]
 */
PreLoader.prototype.getContent = function() {
    return this.content;
};
PreLoader.prototype.setLegend = function(_legend) {
    this.legend = _legend;
};
PreLoader.prototype.getLegend = function() {
    return this.legend;
};
PreLoader.prototype.detectBackButton = function() {
    document.addEventListener('backbutton', function(e) {

        console.log(sap.ui.getCore().AppContext.Navigation.detail);
        if (sap.ui.getCore().AppContext.Navigation.detail) {
            console.log("Detalle ON");

            sap.ui.getCore().AppContext.Navigation.detail = false;
            sap.ui.getCore().AppContext.Navigation.back();

        } else {
            console.log("Detalle OFF");
            window.history.go(-1);

        }
        console.log(sap.ui.getCore().AppContext);

        //console.log(e);
        /*if (confirm("Press a button!")) {
            alert("You pressed OK!");
            navigator.app.exitApp();
        } else {
            alert("You pressed Cancel!");
        }*/
    }, false);
};
PreLoader.prototype.start = function() {
    var currentClass, promiseSAPUI5, promiseMaps, logonSMP, promiseLogin, promiseNetwork;
    currentClass = this;


    promiseSAPUI5 = this.addLibrary("resources/sap-ui-core.js", true);
    //promiseMaps = this.addLibrary("https://maps.googleapis.com/maps/api/js", false);

    promiseSAPUI5
        .then(function(response) {/*
            sap.ui.getCore().AppContext = new Object();
            sap.ui.getCore().AppContext.Navigation = {};
            sap.ui.getCore().AppContext.Navigation.detail = false;*/
            //Carga de archivo de configuracion 
            var config = new sap.ui.model.resource.ResourceModel({
                bundleUrl: "config/config.properties"
                    //bundleName:"a_es"
                    ,
                bundleLocale: "es_MX"
            });



            //sap.ui.getCore().AppContext.Config = config;
            //Carga de Logon
            // jQuery.sap.require("js.kapsel.Logon");
            //logonSMP = new sap.ui.kapsel.Logon();

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

                setTimeout(function() {
                    currentClass.hideLoader();
                }, 2000);
                currentClass.createShell("AO", "com.gentera");



                /*setTimeout(function() {
                    currentClass.hideLoader();
                }, 2000);
                document.addEventListener("deviceready", currentClass.detectBackButton, false);*/

                /**
                 * Código comentado para hito del lunes,
                 * una vez liberada la versión del lunes favor de
                 * utilizar ya el promiseLogin
                 */

                /*promiseLogin = logonSMP.start();
                promiseLogin.then(function(context) {
                    currentClass.successLogon(context);
                }, function(error) {
                    currentClass.errorLogon(error)
                });*/

                //currentClass.createShell("AO", "com.gentera");
            } else {
                setTimeout(function() {
                    currentClass.hideLoader();
                }, 2000);
                currentClass.createShell("AO", "com.gentera");
            }
        }).catch(function(error) {
            console.log(error);
        });
};
PreLoader.prototype.successLogon = function(context) {
    var currentClass = this;
    //*************************************
    currentClass.monitorNetwork();
    //*************************************
    var pushNotifications, userToUpperCase;
    //this.createShell("AO", "com.gentera");
    sap.ui.getCore().AppContext.applicationContext = context;
    jQuery.sap.require("js.kapsel.Push");
    pushNotifications = new sap.ui.kapsel.Push();
    pushNotifications.registerForPush();

    ///** Test Rest*//
    var sAuthStr, sAppCID, sAppEndpoint, smpServerProtocol;
    var oMetadata;
    //se pasa el nombre de usuario a mayusculas para consumo de servicios
    userToUpperCase = sap.ui.getCore().AppContext.applicationContext.registrationContext.user.toUpperCase();
    sap.ui.getCore().AppContext.applicationContext.registrationContext.user = userToUpperCase;
    sap.ui.getCore().AppContext.Promotor = sap.ui.getCore().AppContext.applicationContext.registrationContext.user;
    smpServerProtocol = sap.ui.getCore().AppContext.applicationContext.registrationContext.https ? "https" : "http";
    sap.ui.getCore().AppContext.applicationContext.igwEndpointURL = smpServerProtocol + "://" + sap.ui.getCore().AppContext.applicationContext.registrationContext.serverHost + ":" + sap.ui.getCore().AppContext.applicationContext.registrationContext.serverPort + "/" + sap.ui.getCore().AppContext.Config.getProperty("appIdIGW");
    ////////////////////////////////////////////////////////////////////////
    sAuthStr = "Basic " + btoa(sap.ui.getCore().AppContext.applicationContext.registrationContext.user + ":" + sap.ui.getCore().AppContext.applicationContext.registrationContext.password);
    sAppCID = sap.ui.getCore().AppContext.applicationContext.applicationConnectionId;
    jQuery.sap.require("js.kapsel.Rest");
    sAppEndpoint = sap.ui.getCore().AppContext.applicationContext.applicationEndpointURL;

    //gateway services
    sap.ui.getCore().AppContext.myRest = new sap.ui.mw.Rest(sAppEndpoint, true, sAuthStr, sAppCID, false);

    //integration gateway services
    var oPath = smpServerProtocol + "://" + sap.ui.getCore().AppContext.applicationContext.registrationContext.serverHost + ":" + sap.ui.getCore().AppContext.applicationContext.registrationContext.serverPort + "/" + sap.ui.getCore().AppContext.Config.getProperty("appIdIGW");
    sap.ui.getCore().AppContext.oRest = new sap.ui.mw.Rest(oPath, true, sAuthStr, sAppCID, false);
    //Meter con promise openStore's, en el then se manda a createShell
    //--------------------------------------
    //Abrir Local Store de Kapsel
    var offlineStoreGw, offlineStoreIGw, promiseOfflineKapsel, currentClass, promiseArray;
    currentClass = this;

    var objectRequGw = {
        "PostalCodes": "/PostalCodeSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",
        //"LoanRequests":"/LoanRequestSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",//ACTUALMENTE PIDE $expand=CustomerSet
        "LoanGuarantees": "/IndividualLoanGuaranteeSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",
        "LoanRequests": "/LoanRequestSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'&$expand=IndividualLoanGuaranteeSet", //&$expand=CustomerSet",//SOLO PARA INVESTIGACIÓN
        "ChMedDispersions": "/ChannelMediumDispersionSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",
        //"PreLoanRequests":"/PreLoanRequestSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'"//ACTUALMENTE PIDE &$expand=CustomerSet
        "PreLoanRequests": "/PreLoanRequestSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",
        "Customers": "/CustomerSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'&$expand=AddressSet,PhoneSet,ImageSet,EmployerSet,PersonalReferenceSet",
        "Insurance": "/InsuranceSet?$filter=collaboratorID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'&$expand=InsuranceBeneficiarySet,InsuranceModalitySet"
    };
    var objectRequIGw = {
        "Notifications": "/NotificationsSet?$filter=promoterID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",
        "Pendings": "/PendingsPromoterSet?$filter=promoterID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",
        "Counters": "/NotificationsCounterSet?$filter=promoterID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'",
        "Announcements": "/AnnouncementsPromoterSet?$filter=promoterID eq '" + sap.ui.getCore().AppContext.applicationContext.registrationContext.user + "'"
    };

    jQuery.sap.require("js.kapsel.Store");
    offlineStoreGw = new sap.ui.kapsel.Store("GWLocalStore", objectRequGw, sap.ui.getCore().AppContext.applicationContext.applicationEndpointURL);
    console.log(offlineStoreGw);
    offlineStoreIGw = new sap.ui.kapsel.Store("IGWLocalStore", objectRequIGw, sap.ui.getCore().AppContext.applicationContext.igwEndpointURL);
    console.log(offlineStoreIGw);
    Promise.all([offlineStoreGw.start(), offlineStoreIGw.start()]).then(
        function() {
            sap.ui.getCore().AppContext.offlineStoreGw = offlineStoreGw;
            sap.ui.getCore().AppContext.offlineStoreIGw = offlineStoreIGw;
            currentClass.successOfflineKapsel();
        },
        function(error) {
            currentClass.errorOfflineKapsel(error);
        }
    );
    //--------------------------------------
};
PreLoader.prototype.successOfflineKapsel = function() {
    sap.OData.applyHttpClient(); //Offline OData calls can now be made against datajs
    console.log("====================== Store is OPEN. ======================");
    this.createShell("AO", "com.gentera");
};
PreLoader.prototype.errorOfflineKapsel = function(error) {
    console.log("--------------------- errorOfflineKapsel: " + JSON.stringify(error));
};
PreLoader.prototype.errorLogon = function(error) {

        console.log("error: " + JSON.stringify(error));
    }
    /**
     * [monitorNetwork - monitoreo del estatus de red online/offline]
     * @return {[type]} [description]
     */
PreLoader.prototype.monitorNetwork = function() {
    sap.ui.getCore().AppContext.isConected = false;
    jQuery.sap.require("js.device.Connection");
    var oConnection = new sap.ui.device.Connection();
	sap.ui.getCore().AppContext.oConnection=oConnection;
    console.log("#### NETWORK MONITORING STARTED ####");
    if (sap.ui.getCore().AppContext.isConected) {		
        console.log("NETWORK STATUS: ONLINE");
    } else {
		console.log("NETWORK STATUS: OFFLINE");
    }
}
PreLoader.prototype.hideLoader = function() {
    document.getElementById(this.preloader).innerHTML = "";
    document.getElementById(this.preloader).style.visibility = 'hidden';
    var el = document.querySelector('#' + this.preloader + '');
    el.parentNode.removeChild(el);
};
PreLoader.prototype.changeLegend = function(message) {
    var legendID = this.getLegend();
    console.log(message);
    console.log(legendID);
    //var test=document.getElementById("preloaderLegend");
    //console.log(test);
    document.getElementById("preloaderLegend").innerHTML = message;


}
PreLoader.prototype.createShell = function(_title, _name) {
    new sap.m.Shell("Shell", {
        title: _title,
        app: new sap.ui.core.ComponentContainer({
            name: _name
        })
    }).placeAt(this.content);

    console.log("Terminó de ejecutar el método de CreateShell");
}
PreLoader.prototype.addLibrary = function(_src, _isSAPUI5) {

    var currentScript, readyFlag, firstScript, currentClass;
    currentClass = this;
    return new Promise(function(resolve, reject) {
        try {

            setTimeout(function() {
                readyFlag = false;
                currentScript = document.createElement('script');
                currentScript.type = 'text/javascript';
                currentScript.src = _src;
                if (_isSAPUI5) {
                    currentScript.id = "sap-ui-bootstrap";
                    currentScript.setAttribute("data-sap-ui-libs", "sap.m, sap.ui.commons");
                    currentScript.setAttribute("data-sap-ui-theme", "sap_bluecrystal");
                    currentScript.setAttribute("data-sap-ui-xx-bindingSyntax", "complex");
                    currentScript.setAttribute("data-sap-ui-preload", "none");
                    currentScript.setAttribute("data-sap-ui-resourceroots", '{"com.gentera":"./","originacion":"originacion","js":"js"}');
                };
                currentScript.onload = currentScript.onreadystatechange = function() {
                    if (!readyFlag && (!this.readyState || this.readyState == 'complete')) {
                        readyFlag = true;
                        resolve("Script cargado:" + _src);

                    }
                };
                firstScript = document.getElementsByTagName('script')[0];
                firstScript.parentElement.appendChild(currentScript);

            }, 4000)


            //firstScript.parentElement.insertBefore(currentScript, firstScript);
        } catch (e) {
            reject(e);

        }


    });

};
/*PreLoader.prototype.addLibrary = function(_src, _loaderMessage, _successCallBack, _isSAPUI5) {
    this.changeLegend(_loaderMessage);
    var currentScript, readyFlag, firstScript, currentClass;
    currentClass = this;
    readyFlag = false;
    currentScript = document.createElement('script');
    currentScript.type = 'text/javascript';
    currentScript.src = _src;
    if (_isSAPUI5) {
        currentScript.id = "sap-ui-bootstrap";
        currentScript.setAttribute("data-sap-ui-libs", "sap.m, sap.ui.commons");
        currentScript.setAttribute("data-sap-ui-theme", "sap_bluecrystal");
        currentScript.setAttribute("data-sap-ui-xx-bindingSyntax", "complex");
        currentScript.setAttribute("data-sap-ui-preload", "none");
        currentScript.setAttribute("data-sap-ui-resourceroots", '{"com.gentera":"./","originacion":"originacion","js":"js"}');
    };
    currentScript.onload = currentScript.onreadystatechange = function() {
        if (!readyFlag && (!this.readyState || this.readyState == 'complete')) {
            readyFlag = true;
            if (_successCallBack) {
                _successCallBack();
            }

        }
    };
    firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentElement.insertBefore(currentScript, firstScript);
};*/
PreLoader.prototype.loginSMP = function() {};
PreLoader.prototype.addPouchDB = function(_fn) {
    this.addLibrary("js/vendor/pouchdb-5.1.0.min.js", "Cargando base de datos...", _fn);
};

PreLoader.prototype.addRelationalPouchDB = function(_fn) {
    this.addLibrary("js/vendor/pouchdb.relational-pouch.js", "Cargando entidades...", _fn);
};
PreLoader.prototype.addMaps = function(_fn) {
    return this.addLibrary("https://maps.googleapis.com/maps/api/js", false);
};

PreLoader.prototype.addSAPUI5 = function(_fn) {
    this.addLibrary("resources/sap-ui-core.js", "Cargando componentes básicos...", _fn, true);
};

(function() {
    var preloader = new PreLoader("preloader", "content", "preloaderLegend");
    preloader.start();

})();
