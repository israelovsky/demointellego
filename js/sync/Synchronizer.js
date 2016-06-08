
(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.sync.Synchronizer");
    jQuery.sap.require("sap.ui.base.Object");
    jQuery.sap.require("js.db.Pouch");

    sap.ui.base.Object.extend('sap.ui.sync.Synchronizer', {
        constructor: function(_dataDB, _syncDB) {
            var oSchemaDB;

            this.dataDBName = _dataDB;
            this.syncDBName = _syncDB;

            jQuery.sap.require("js.helper.Dictionary");
            jQuery.sap.require("js.helper.Schema");

            oSchemaDB = new sap.ui.helper.Schema();

            this.dataDB = new sap.ui.db.Pouch(_dataDB);
            this.dataDB.setSchema(oSchemaDB.getDataDBSchema());
            this.syncDB = new sap.ui.db.Pouch(_syncDB);
            this.syncDB.setSchema(oSchemaDB.getSyncDBSchema());

        }
    });


    sap.ui.sync.Synchronizer.prototype.isNetworkError = function(_result) {
        if (_result === 0 || _result === 503 || _result === 404) {
            return true;
            
        }else{
            return false;
        }
    }

    sap.ui.sync.Synchronizer.prototype.sync = function(_oRouter) {

        var oCustomerRequestSync, oLoanRequestSync,oInsuranceSync,aConfirmingQueues,bdLoader;

        aConfirmingQueues = new Array();
        this.resultsOK = 0;
        this.resultsError = 0;
        this.resultsTotal = 0;
        this.StatusCodeError=0;
        this.bHasStatusCodeError=false;
        this.businessError = 0;
        this.bHasBusinessError = false;
        jQuery.sap.require("js.sync.loanRequest.LoanRequestSynchronizer");
        jQuery.sap.require("js.sync.customer.CustomerSynchronizer");
        jQuery.sap.require("js.sync.insurance.InsuranceSynchronizer");

        oCustomerRequestSync = new sap.ui.sync.Customer(this.dataDBName, this.syncDBName);
        oLoanRequestSync = new sap.ui.sync.LoanRequest(this.dataDBName, this.syncDBName);
        oInsuranceSync = new sap.ui.sync.Insurance(this.dataDBName, this.syncDBName);

        // (1) quita proxy kapsel
        if (sap.OData) {
            sap.OData.removeHttpClient();
        }
        // (2) consulta notificaciones y (3) confirmar Queues y borrar de PouchDB
        bdLoader = sap.ui.getCore().byId("bdLoaderDashboard");
        bdLoader.setText("Sincronizando...");
        bdLoader.open();

        oCustomerRequestSync.confirmQueue()
            .then(function(result) {
                    if (result === "BUSINESSERROR") {
                        this.bHasBusinessError = true;
                    }
                    else{
                        if(this.isNetworkError(result)){
                            this.bHasStatusCodeError=true;
                        }
                    }

                    console.log("#1# Customer - confirmQueue - FINALIZADO");
                    oLoanRequestSync.confirmQueue()
                        .then(function(result) {
                            if (result === "BUSINESSERROR") {
                                this.bHasBusinessError = true;
                            }
                            else{
                                if(this.isNetworkError(result)){
                                    this.bHasStatusCodeError=true;
                                }
                            }

                            console.log("#2# LoanRequest - confirmQueue - FINALIZADO");
                            oCustomerRequestSync.sendQueue()
                                .then(function(result) {
                                    this.resultsOK = this.resultsOK + result.resultsOK;
                                    this.resultsError = this.resultsError + result.resultsError;
                                    this.resultsTotal = this.resultsTotal + result.resultsTotal;
                                    this.businessError = this.businessError + result.businessError;
                                    console.log("#3# Customer - sendQueue - FINALIZADO");
                                    oLoanRequestSync.sendQueue()
                                        .then(function(result) {
                                            this.resultsOK = this.resultsOK + result.resultsOK;
                                            this.resultsError = this.resultsError + result.resultsError;
                                            this.resultsTotal = this.resultsTotal + result.resultsTotal;
                                            this.businessError = this.businessError + result.businessError;
                                            console.log("#4# LoanRequest - sendQueue - FINALIZADO");

                                            oInsuranceSync.sendQueue()
                                                .then(function(_bdLoader, _oRouter, result) {
                                                    this.resultsOK = this.resultsOK + result.resultsOK;
                                                    this.resultsError = this.resultsError + result.resultsError;
                                                    this.resultsTotal = this.resultsTotal + result.resultsTotal;
                                                    console.log("#5# Insurance - sendQueue - FINALIZADO");
                                                    console.log("#Envios concluidos");

                                                    if (sap.OData) {

                                                        ///// Hacer refresh de los stores
                                                        console.log("#Haciendo refresh de los stores#");

                                                        sap.ui.getCore().AppContext.offlineStoreGw.refreshStore().then(
                                                            function(_bdLoader, _oRouter, result) {

                                                                console.log("#GW store refreshed#");

                                                                sap.ui.getCore().AppContext.offlineStoreIGw.flushStore().then(
                                                                    function(result) {

                                                                        console.log("#GW store flushed#");
                                                                        sap.ui.getCore().AppContext.offlineStoreIGw.refreshStore().then(

                                                                            function(_bdLoader, _oRouter, result) {
                                                                                console.log("#IGW store refreshed#");
                                                                                oCustomerRequestSync.confirmQueue().then(function(result) {
                                                                                    if (result === "BUSINESSERROR") {
                                                                                        this.bHasBusinessError = true;
                                                                                    }
                                                                                    else{
                                                                                        if(this.isNetworkError(result)){
                                                                                            this.bHasStatusCodeError=true;
                                                                                        }
                                                                                    }

                                                                                    console.log("#6# Customer - REconfirmQueue - FINALIZADO");
                                                                                    oLoanRequestSync.confirmQueue().then(function(result) {
                                                                                        if (result === "BUSINESSERROR") {
                                                                                            this.bHasBusinessError = true;
                                                                                        }
                                                                                        else{
                                                                                            if(this.isNetworkError(result)){
                                                                                                this.bHasStatusCodeError=true;
                                                                                            }
                                                                                        }

                                                                                        console.log("#7# LoanRequest - REconfirmQueue - FINALIZADO");

                                                                                        sap.OData.applyHttpClient();
                                                                                        _bdLoader.close();


                                                                                        console.log("Total:" + this.resultsTotal);
                                                                                        console.log("OK:" + this.resultsOK);
                                                                                        console.log("Error:" + this.resultsError);
                                                                                        console.log("BusinessError" + this.businessError);

                                                                                        sap.ui.getCore().AppContext.sElementsThatRequireSyncAgain = this.resultsError;



                                                                                        if (this.resultsError > 0 ||  this.bHasBusinessError == true  || this.businessError > 0){
                                                                                            _oRouter.navTo("SyncErrorQueue", {}, false);
                                                                                            if(this.bHasStatusCodeError === true){
                                                                                                setTimeout(function(){
                                                                                                    sap.m.MessageToast.show("El servicio no se encuentra disponible. Intente de nuevo más tarde.");
                                                                                                },1500);
                                                                                                
                                                                                            }

                                                                                        } else {
                                                                                            if(this.bHasStatusCodeError === true){
                                                                                                setTimeout(function(){
                                                                                                    sap.m.MessageToast.show("El servicio no se encuentra disponible. Intente de nuevo más tarde.");
                                                                                                },1500);
                                                                                                
                                                                                            }
                                                                                            else{
                                                                                                sap.m.MessageToast.show("La sincronización se realizó correctamente.");
                                                                                            }

                                                                                            
                                                                                        }
																						document.dispatchEvent(new Event("LoadCounters"));
                                                                                        sap.ui.getCore().AppContext.bAlreadyInSync = false;

                                                                                    }.bind(this, _bdLoader, _oRouter));

                                                                                }.bind(this, _bdLoader, _oRouter));

                                                                            }.bind(this, _bdLoader, _oRouter)
                                                                        );
                                                                    }.bind(this, _bdLoader, _oRouter)
                                                                );

                                                            }.bind(this, _bdLoader, _oRouter)
                                                        ).catch(function(_bdLoader, _oRouter, error) {
                                                            console.log("Error al realizar la actualización de los stores: " + error)
                                                            sap.OData.applyHttpClient();
                                                            _bdLoader.close();
                                                            _oRouter.navTo("SyncErrorQueue", {}, false);
                                                            sap.ui.getCore().AppContext.bAlreadyInSync = false;	
															document.dispatchEvent(new Event("LoadCounters"));															
                                                        }.bind(this, _bdLoader, _oRouter))
                                                    } else {
                                                        _bdLoader.close();
                                                        _oRouter.navTo("SyncErrorQueue", {}, false);
                                                        sap.ui.getCore().AppContext.bAlreadyInSync = false;
														document.dispatchEvent(new Event("LoadCounters"));
                                                    }
                                                }.bind(this, bdLoader, _oRouter)) //Insurance - sendQueue
                                        }.bind(this)) //LoanRequest - sendQueue
                                }.bind(this)) //Customer - sendQueue
                        }.bind(this)) //LoanRequest - confirmQueue
                }.bind(this) //Customer - confirmQueue

            ).catch(function(_bdLoader, _oRouter, error) {
                console.log("Master Error: " + error)
                if (sap.OData) {
                    sap.OData.applyHttpClient();
                    _bdLoader.close();
                }

                _oRouter.navTo("SyncErrorQueue", {}, false);
                sap.ui.getCore().AppContext.bAlreadyInSync = false;
				document.dispatchEvent(new Event("LoadCounters"));
                console.log("Error al realizar el envio de peticiones:" + error)

            }.bind(this, bdLoader, _oRouter));

        // (4) actualizar stores
        // (5) activar proxy

    };

})();
