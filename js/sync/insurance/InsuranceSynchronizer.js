(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.sync.Insurance");
    jQuery.sap.require("sap.ui.base.Object");
    jQuery.sap.require("js.db.Pouch");

    sap.ui.base.Object.extend('sap.ui.sync.Insurance', {
        constructor: function(_dataDB, _syncDB) {
            var oSchemaDB;

            jQuery.sap.require("js.helper.Dictionary");
            jQuery.sap.require("js.helper.Schema");
            jQuery.sap.require("js.serialize.insurance.InsuranceSerialize");

            oSchemaDB = new sap.ui.helper.Schema();

            this.dataDB = new sap.ui.db.Pouch(_dataDB);
            this.dataDB.setSchema(oSchemaDB.getDataDBSchema());
            this.syncDB = new sap.ui.db.Pouch(_syncDB);
            this.syncDB.setSchema(oSchemaDB.getSyncDBSchema());

        }
    });

    sap.ui.sync.Insurance.prototype.deleteBusinessErrorOnOK = function(_oDictionary, _oInsuranceQueueItem) {

        var oDictionary, oInsuranceQueueItem, self;
        oDictionary = _oDictionary;
        oInsuranceQueueItem = _oInsuranceQueueItem;
        self = this;


        return new Promise(function(resolveDeleteBusinessError) {
            //return function(_oDictionary, _oInsuranceQueueItem, result) {
            console.log("(1) - deleteBusinessErrorOnOK");
            console.log(_oInsuranceQueueItem.id);
            self.syncDB.getById(_oDictionary.oErrors.Insurance, _oInsuranceQueueItem.id)
                .then(function(result) { /// Confirmar si ya existe el registro del error, hacer upsert
                    if (result.BusinessErrorInsuranceSet) {
                        if (result.BusinessErrorInsuranceSet.length > 0) { // Ya existia previamente

                            self.syncDB.delete(_oDictionary.oErrors.Insurance, result.BusinessErrorInsuranceSet[0].id, result.BusinessErrorInsuranceSet[0].rev)
                                .then(function(success) {
                                    resolveDeleteBusinessError("OK");
                                });
                        } else {
                            resolveDeleteBusinessError("OK");
                        }
                    } else {
                        resolveDeleteBusinessError("OK");
                    }



                });

            /////////// Eliminar BusinessError

            console.log("Actualizacion de Enviado OK");

        });
    };

    sap.ui.sync.Insurance.prototype.retrieveBusinessErrorMessage = function(_oError) {

        var sErrorMessage, oErrorService;
        var oErrorData;
        var sMessage;

        sErrorMessage = "";

        try {

            oErrorService = JSON.parse(error);

            if (oErrorService.error.innererror.errordetails !== "undefined") {
                sErrorMessage = oErrorService.error.innererror.errordetails[0].message;
                if (sErrorMessage) {
                    if (sErrorMessage != "") {
                        sap.m.MessageToast.show("Se ha producido un error: " + sErrorMessage);
                    }
                }

            }

        } catch (catchError) {

            //// Nada debe pasar aqui, este error es solo si el mensaje de error que viene del servicio
            /// es de negocio

        }

        return sErrorMessage;
    };

    sap.ui.sync.Insurance.prototype.postUpdatedQueue = function(_oDictionary, _oInsuranceQueueItem) {

        _oInsuranceQueueItem.requestStatus = _oDictionary.oRequestStatus.BusinessError;
        return this.syncDB.post(_oDictionary.oQueues.Insurance, _oInsuranceQueueItem);
    };

    sap.ui.sync.Insurance.prototype.postBusinessError = function(_oDictionary, _oErrorData) {



        return this.syncDB.post(_oDictionary.oErrors.Insurance, _oErrorData);
    };

    sap.ui.sync.Insurance.prototype.upsertBusinessError = function(_oInsuranceQueueItem, _oDictionary, _sErrorMessage) {


        var sMessage, oErrorData, self;
        self = this;
        sMessage = "Error al enviar la solicitud '" + _oInsuranceQueueItem.requestDescription + "' : " + _sErrorMessage;

        oErrorData = {
            id: _oInsuranceQueueItem.id,
            errorDetail: sMessage,
            type: "INSURANCE"
        };

        return this.syncDB.getById(_oDictionary.oErrors.Insurance, _oInsuranceQueueItem.id).
        then(


            function(result) {

                var oBusinessError;

                if (result.BusinessErrorInsuranceSet) {

                    if (result.BusinessErrorInsuranceSet.length > 0) {

                        oBusinessError = result.BusinessErrorInsuranceSet;

                    } else {

                        oBusinessError = oErrorData;
                    }

                }


                self.postBusinessError(_oDictionary, oBusinessError).

                then(function(result) {

                    self.postUpdatedQueue(_oDictionary, _oInsuranceQueueItem)

                });


            }
        );
    };

    sap.ui.sync.Insurance.prototype.processTechnicalError = function(_oQueueItem, _oDictionary) {

        var self, _oQueueItem, oDictionary;
        self = this;

        oQueueItem = _oQueueItem;
        oDictionary = _oDictionary;

        oQueueItem.requestStatus = oDictionary.oRequestStatus.Error;
        ///:::: "RequestQueueInsurance" deberia venir del diccionario
        return this.syncDB.post(oDictionary.oQueues.Insurance, oQueueItem).then(
            self.deleteBusinessErrorOnOK(oDictionary, oQueueItem));
    };

    sap.ui.sync.Insurance.prototype.processErrors = function(oQueueItem, _oDictionary, _oError) {

        var self, oInsuranceQueueItem, oDictionary, oError;
        oQueueItem = oQueueItem;
        oDictionary = _oDictionary;
        oError = _oError

        return new Promise(function(resolveErrorProcesing) {


            var sErrorMessage;
            sErrorMessage = self.retrieveBussinessErrorMessage(oError)

            if (sErrorMessage != "") {
                /// Es un error de negocio
                self.upsertBusinessError(oQueueItem, oDictionary, sErrorMessage).then(
                    resolveErrorProcesing("BusinessError processed")
                ).catch(
                    resolveErrorProcesing("Error processing business error")
                );


            } else {
                /// Es un error tecnico
                self.processTechnicalError(oQueueItem, oDictionary, oError).then(

                    resolveErrorProcesing("Technical error processed")

                ).catch(

                    resolveErrorProcesing("Error processing technical error")

                );

            }



        });
    };

    sap.ui.sync.Insurance.prototype.consumeService = function(_oQueueElement, _oDictionary, _oPayload) {


        var oQueueElement, oDictionary, self, oPayload;
        oQueueElement = _oQueueElement;
        oDictionary = _oDictionary;
        self = this;
        oPayload = _oPayload;

        return new Promise(function(resolveConsumePromise, rejectConsumePromise) {

            sap.ui.getCore().AppContext.myRest.create(oQueueElement.requestUrl, _oPayload, true).then(
                function(result) {

                    console.log("Insurance - Peticiones enviadas: OK");
                    oQueueElement.requestStatus = oDictionary.oRequestStatus.Sent;

                    self.syncDB.post(oDictionary.oQueues.Insurance, oQueueElement).then(
                        function(result) {

                            self.deleteBusinessErrorOnOK(oDictionary, oQueueElement)
                                .then(function(result) {

                                    self.confirmQueue(_oPayload).then(
                                        function(result) {
                                            console.log("Proceso despues del envio exitoso");
                                            resolveConsumePromise("OK");

                                        }
                                    )

                                })

                        }

                    ).catch(function(error) {
                        console.log("Error en el envio " + error);
                        rejectConsumePromise("Error");

                    });

                }
            ).
            catch(function(error) {

                rejectConsumePromise(error);

            });

        });
    };

    sap.ui.sync.Insurance.prototype.createIndividualPromise = function(_oQueueElement, _oDictionary) {

        var oQueueElement, oDictionary, self;
        oQueueElement = _oQueueElement;
        oDictionary = _oDictionary;
        self = this;

        return new Promise(function(resolveSendPromise) {

            var oInsuranceSerializer;
            oInsuranceSerializer = new sap.ui.serialize.Insurance("dataDB");
            ///:::: "Insurance" deberia venir del diccionario
            console.log("(2) createIndividualPromise");
            console.log(oQueueElement.requestBodyId);
            oInsuranceSerializer.deSerialize(oQueueElement.requestBodyId)
                .then(function(payload) {
                    console.log("******** Request Armado (Insurance) *******");
                    console.log(payload);
                    delete payload["IsEntityInQueue"];

                    self.consumeService(oQueueElement, oDictionary, payload)
                        .then(
                            resolveSendPromise("OK")
                        )
                        .catch(function(error) {
                            self.processErrors(oQueueElement, oDictionary, error).then(
                                resolveSendPromise("Error: " + error)
                            ).catch(function(errorProcessError) {
                                resolveSendPromise("Error procesando errores: " + errorProcessError);
                            });

                        });
                }).catch(function(error) {

                    resolveSendPromise("Error recuperando request: " + error)

                });
        });
    };

    sap.ui.sync.Insurance.prototype.sendRequests = function(_oResult, _oDictionary) {
        var oDictionary, self, oPromises, counter, oResult;
        oDictionary = _oDictionary;
        self = this;
        oPromises = new Array(); //promesas individuales
        counter = 0;
        oResult = _oResult;
        return new Promise(function(resolve, reject) {
            var i;
            if (oResult.RequestQueueInsuranceSet.length > 0) {
                for (i = 0; i < oResult.RequestQueueInsuranceSet.length; i++) {
                    //////// For each Insurance, retrieve details and send
                    if (oResult.RequestQueueInsuranceSet[i].requestStatus != _oDictionary.oRequestStatus.Sent) {
                        oPromises.push(self.createIndividualPromise(_oResult.RequestQueueInsuranceSet[i], oDictionary));
                    }
                }
                resolve(oPromises);
            } else {
                console.log("(1)la lista de notificaciones viene vacia");
                resolve([]);
            } //resuelve promesa master
        });
    };

    sap.ui.sync.Insurance.prototype.sendQueue = function() {

        var oDictionary;
        var self;
        oDictionary = new sap.ui.helper.Dictionary();
        self = this;


        return new Promise(function(resolveMasterPromise) {

            ///////// Retrieve all insurance requests
            self.syncDB.get(oDictionary.oQueues.Insurance).then(function(result) {
                console.log("#5# Insurance - sendQueue - INICIADO");
                console.log(result);
                self.sendRequests(result, oDictionary).then(function(array) {

                        Promise.all(array).then(function() {
                            var oResults = {};
                            var i;
                            oResults.resultsOK = 0;
                            oResults.resultsError = 0;
                            oResults.resultsTotal = array.length;

                            for (i = 0; i < array.length; i++) {
                                if (array[i] == "OK") {
                                    oResults.resultsOK = oResults.resultsOK + 1;
                                } else {
                                    oResults.resultsError = oResults.resultsError + 1;
                                }

                            }
                            resolveMasterPromise(oResults);
                        });

                    })
                    .catch(function(error) {

                        var oResults = {};
                        oResults.resultsOK = 0;
                        oResults.resultsError = 0;
                        oResults.resultsTotal = 0;
                        console.log("Error general en sincronizacion de Insurance: " + error);
                        resolveMasterPromise(oResults);

                    });


            });


            ////////////// Aqui termina promesa maestra
        });
    };

    sap.ui.sync.Insurance.prototype.sendQueue111 = function() {
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        var oInsurance = {
            insuranceID: "1",
            loanRequestIdCRM: "1",
            BPIdCRM: "1",
            customerIdMD: "1",
            insuranceOptional: "",
            startDateTerm: "16-03-2016T00:00:00",
            insuranceTerm: "16-03-2018T00:00:00",
            loanRequestIdMD: "1",
            InsuranceModalitySet: "1",
            InsurancePaymentSet: "1",
        };
        return new Promise(function(resolve, reject) {
            try {
                self.confirmQueue(oInsurance).then(function(msg) {
                    console.log(msg);
                    resolve("OK");
                }).catch(function(e) {
                    resolve("NG");
                });
            } catch (e) {
                reject(e);
            }
        });
    };

    //******************************** INICIO - PROCESO SINCRONIZACIÓN ********************************
    sap.ui.sync.Insurance.prototype.confirmQueue = function(oInsurance) {
        console.log("(2) confirmQueue");
        console.log(oInsurance);
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.searchInDataDB(oInsurance).then(function(msg) {
                    console.log(msg);
                    resolve("0.1");
                }).catch(function(e) {
                    resolve("0.2");
                });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(1) verifica si existe en dataDB 
    sap.ui.sync.Insurance.prototype.searchInDataDB = function(oInsurance) {
        console.log("(1)verifica si existe en dataDB");
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.dataDB.getById(oDictionary.oTypes.Insurance, oInsurance.insuranceIdMD)
                    .then(function(oResult) {
                        if (oResult.InsuranceSet.length > 0) {
                            console.log("Seguros - SI Existe en dataDB");
                            self.deleteDataDB(oResult, oInsurance).then(function(msg) {
                                console.log(msg);
                                resolve("1.1");
                            });
                        } else {
                            console.log("Seguros - NO Existe en dataDB");
                            resolve("1.2");
                        }
                    }).catch(function(e) {
                        console.log("Error (searchInDataDB): " + e);
                        resolve("1.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(2) elimina si existe en dataDB
    sap.ui.sync.Insurance.prototype.deleteDataDB = function(oResult, oInsurance) {
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.dataDB.delete(oDictionary.oTypes.Insurance, oResult.InsuranceSet[0].id, oResult.InsuranceSet[0].rev)
                    .then(function(oResult) {
                        console.log("(2)eliminado de dataDB: OK");
                        self.searchInSyncDB(oInsurance).then(function(msg) {
                            console.log(msg);
                            resolve("2.1")
                        });
                    }).catch(function(e) {
                        console.log("(2)eliminado de dataDB: NG :: " + e);
                        resolve("2.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(3) verifica si existe en syncDB 
    sap.ui.sync.Insurance.prototype.searchInSyncDB = function(oInsurance) {
        console.log("(3)verifica si existe en syncDB");
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.syncDB.getById(oDictionary.oQueues.Insurance, oInsurance.insuranceIdMD)
                    .then(function(oResult) {
                        if (oResult.RequestQueueInsuranceSet.length > 0) {
                            console.log("Seguros - SI Existe en syncDB");
                            self.deleteSyncDB(oResult, oInsurance).then(function(msg) {
                                console.log(msg);
                                resolve("3.1");
                            });
                        } else {
                            console.log("Seguros - NO Existe en syncDB");
                            resolve("3.2");
                        }
                    }).catch(function(e) {
                        console.log("Error (searchInSyncDB): " + e);
                        resolve("3.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(4) elimina si existe en syncDB
    sap.ui.sync.Insurance.prototype.deleteSyncDB = function(oResult, oInsurance) {
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.syncDB.delete(oDictionary.oQueues.Insurance, oResult.RequestQueueInsuranceSet[0].id, oResult.RequestQueueInsuranceSet[0].rev)
                    .then(function(oResult) {
                        console.log("(4)eliminado de syncDB: OK");
                        resolve("4.1")
                    }).catch(function(e) {
                        console.log("(4)eliminado de syncDB: NG :: " + e);
                        resolve("4.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(4) actualiza estatus en syncDB en caso de existir error
    sap.ui.sync.Insurance.prototype.updateStatus = function() {};
    //******************************** FIN - PROCESO SINCRONIZACIÓN ********************************

})();
