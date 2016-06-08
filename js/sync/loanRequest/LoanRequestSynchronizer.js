(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.sync.LoanRequest");
    jQuery.sap.require("sap.ui.base.Object");
    jQuery.sap.require("js.db.Pouch");

    sap.ui.base.Object.extend('sap.ui.sync.LoanRequest', {
        constructor: function(_dataDB, _syncDB) {
            var oSchemaDB;

            jQuery.sap.require("js.helper.Dictionary");
            jQuery.sap.require("js.helper.Schema");
            jQuery.sap.require("js.serialize.loanRequest.LoanRequestSerialize");

            oSchemaDB = new sap.ui.helper.Schema();

            this.dataDB = new sap.ui.db.Pouch(_dataDB);
            this.dataDB.setSchema(oSchemaDB.getDataDBSchema());
            this.syncDB = new sap.ui.db.Pouch(_syncDB);
            this.syncDB.setSchema(oSchemaDB.getSyncDBSchema());

        }
    });


    sap.ui.sync.LoanRequest.prototype.deleteBusinessError = function(sDeleteBusinessErrorID) {

        var self, oDictionary;
        self = this;
        oDictionary = new sap.ui.helper.Dictionary();
        return new Promise(function(resolve) {
            self.syncDB.getById(oDictionary.oErrors.LoanRequest, sDeleteBusinessErrorID)
                .then(function(sDeleteBusinessErrorID, oDictionary, result) { /// Confirmar si ya existe el registro del error, hacer upsert
                    if (result.BusinessErrorLoanRequestSet) {
                        if (result.BusinessErrorLoanRequestSet.length > 0) { // Ya existia previamente
                            this.syncDB.delete(oDictionary.oErrors.LoanRequest, result.BusinessErrorLoanRequestSet[0].id, result.BusinessErrorLoanRequestSet[0].rev)
                                .then(function(success) {
                                    resolve("OK");
                                });
                        } else {
                            resolve("OK");
                        }
                    } else {
                        resolve("OK");
                    }
                }.bind(self, sDeleteBusinessErrorID, oDictionary))
                .catch(function(error) {
                    console.log("Error al eliminar BusinessError " + error)
                    resolve("Error al eliminar BusinessError " + error);
                });
        });
    };

    sap.ui.sync.LoanRequest.prototype.deleteBusinessErrorOnOK = function(_oDictionary, _oRequestQueueItem, _resolveSendPromise) {

        //return function(_oDictionary, _oRequestQueueItem, result) {

        this.syncDB.getById(_oDictionary.oErrors.LoanRequest, _oRequestQueueItem.id)
            .then(function(_oRequestQueueItem, _oDictionary, result) { /// Confirmar si ya existe el registro del error, hacer upsert
                if (result.BusinessErrorLoanRequestSet) {
                    if (result.BusinessErrorLoanRequestSet.length > 0) { // Ya existia previamente

                        this.syncDB.delete(_oDictionary.oErrors.LoanRequest, result.BusinessErrorLoanRequestSet[0].id, result.BusinessErrorLoanRequestSet[0].rev)
                            .then(function(success) {
                                _resolveSendPromise("COMPLETED");
                            });
                    } else {
                        _resolveSendPromise("COMPLETED");
                    }
                } else {
                    _resolveSendPromise("COMPLETED");
                }



            }.bind(this, _oRequestQueueItem, _oDictionary))
            .catch(function(error) {

                console.log("Error al actualizar business error de la oportunidad " + error);
                resolveSendPromise("Error al actualizar business error");

            });

        /////////// Eliminar BusinessError

        console.log("Actualizacion de Enviado OK");

        //}.bind(this, _oDictionary, _oRequestQueueItem)

    };


    sap.ui.sync.LoanRequest.prototype.updateSyncQueue = function(_oRequestQueueItem) {

        var self, oDictionary;
        self = this;
        oDictionary = new sap.ui.helper.Dictionary();

        return new Promise(function(resolveUpdatePromise) {

            this.syncDB.getById(oDictionary.oQueues.LoanRequest, _oRequestQueueItem.id)
                .then(function(oDictionary, _oRequestQueueItem, result) { /// Confirmar si ya existe el registro del error, hacer upsert

                    if (result.RequestQueueLoanRequestSet) {
                        if (result.RequestQueueLoanRequestSet.length > 0) { // Ya existia previamente
                            _oRequestQueueItem.rev = result.RequestQueueLoanRequestSet[0].rev;
                        }
                    }


                    this.syncDB.post(oDictionary.oQueues.LoanRequest, _oRequestQueueItem)
                        .then(function(success) {
                            resolveUpdatePromise("OK");
                        });



                }.bind(this, oDictionary, _oRequestQueueItem)).
            catch(function(error) {

                resolveUpdatePromise("Error al eliminar la solicitud del queue: " + error);

            });

        }.bind(this));

    };


    sap.ui.sync.LoanRequest.prototype.sendQueue = function() {


        return new Promise(function(resolveMasterPromise) {

            var oDictionary;
            oDictionary = new sap.ui.helper.Dictionary();

            ///////// Retrieve all loan requests
            this.syncDB.get(oDictionary.oQueues.LoanRequest).then(function(_oDictionary, result) {

                    var i;
                    var aPromises, oPromise;
                    aPromises = new Array();
                    console.log("#4# LoanRequest - sendQueue");

                    if (result.RequestQueueLoanRequestSet.length > 0) {
                        for (i = 0; i < result.RequestQueueLoanRequestSet.length; i++) {
                            //////// For each LoanRequest, retrieve details and send

                            ///:::: "Sent" deberia venir del diccionario
                            if (result.RequestQueueLoanRequestSet[i].requestStatus != _oDictionary.oRequestStatus.Sent) {



                                //////// Generar promesas individuales


                                ///::: Aqui comienza promesa individual
                                oPromise = new Promise(function(_oLoanRequestQueueItem, resolveSendPromise, rejectDeletePromise) {

                                    ///// Deserialize
                                    var oLoanRequestSerializer;
                                    oLoanRequestSerializer = new sap.ui.serialize.LoanRequest("dataDB");
                                    ///:::: "LoanRequest" deberia venir del diccionario
                                    oLoanRequestSerializer.deSerialize(_oLoanRequestQueueItem.id, false, true)
                                        .then(
                                            function(_oRequestQueueItem, _oDictionary, result) {

                                                console.log("******** Request Armado *******");
                                                console.log(result);

                                                delete result["IsEntityInQueue"];

                                                //// Send
                                                sap.ui.getCore().AppContext.myRest.create(_oRequestQueueItem.requestUrl, result, true).then(
                                                    function(_oDictionary, _oRequestQueueItem, result) {

                                                        var oNotification;
                                                        console.log("******** Petición enviada exitosamente, actualizar Queue *******");

                                                        console.log("Enviado a servicio OK");

                                                        _oRequestQueueItem.requestStatus = _oDictionary.oRequestStatus.Sent;

                                                        if (_oRequestQueueItem.NotificationID) {

                                                            if (_oRequestQueueItem.NotificationID != "") {
                                                                oNotification = {};
                                                                oNotification.notificationID = _oRequestQueueItem.NotificationID
                                                            }
                                                        }


                                                        this.updateSyncQueue(_oRequestQueueItem).then(
                                                            function(_oDictionary, _oRequestQueueItem, oNotification, result) {

                                                                this.deleteBusinessErrorOnOK(_oDictionary, _oRequestQueueItem, resolveSendPromise);

                                                                //resolveSendPromise("COMPLETED");


                                                            }.bind(this, _oDictionary, _oRequestQueueItem, oNotification)

                                                        ).catch(function(error) {

                                                            console.log("Error en el envio " + error);

                                                            resolveSendPromise("Error");



                                                        });

                                                    }.bind(this, _oDictionary, _oRequestQueueItem)
                                                ).catch(
                                                    function(_oDictionary, _oRequestQueueItem, error) {
                                                        console.log("******** Error al enviar la petición, actualizar Queue *******: " + error);

                                                        /////// Verificar si se trata de un business error

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

                                                        //sErrorMessage = "THIS IS A TEST BUSINESS ERROR";
                                                        /////// Business Error || Log

                                                        if (sErrorMessage != "") {

                                                            sMessage = "Error al enviar la solicitud '" + _oRequestQueueItem.requestDescription + "' : " + sErrorMessage;

                                                            oErrorData = {

                                                                id: _oRequestQueueItem.id,
                                                                errorDetail: sMessage,

                                                                type: _oRequestQueueItem.productID

                                                            };




                                                            this.syncDB.getById(_oDictionary.oErrors.LoanRequest, _oRequestQueueItem.id)
                                                                .then(function(_oRequestQueueItem, _oDictionary, oErrorData, result) { /// Confirmar si ya existe el registro del error, hacer upsert


                                                                    if (result.BusinessErrorLoanRequestSet) {

                                                                        if (result.BusinessErrorLoanRequestSet.length > 0) { // Ya existia previamente
                                                                            oErrorData.rev = result.BusinessErrorLoanRequestSet[0].rev;
                                                                        }

                                                                    }



                                                                    this.syncDB.post(_oDictionary.oErrors.LoanRequest, oErrorData).then(
                                                                        function(_oRequestQueueItem, _oDictionary, success) {

                                                                            _oRequestQueueItem.requestStatus = _oDictionary.oRequestStatus.BusinessError;
                                                                            ///:::: "RequestQueueLoanRequest" deberia venir del diccionario
                                                                            this.syncDB.post(_oDictionary.oQueues.LoanRequest, _oRequestQueueItem).then(
                                                                                function(result) {

                                                                                    resolveSendPromise("BUSINESSERROR");

                                                                                });



                                                                        }.bind(this, _oRequestQueueItem, _oDictionary)
                                                                    );

                                                                }.bind(this, _oRequestQueueItem, _oDictionary, oErrorData)).catch(
                                                                    function(error) {

                                                                        resolveSendPromise(error);
                                                                    });

                                                        } else {
                                                            //// Normal processing
                                                            ///:::: "Error" deberia venir del diccionario
                                                            _oRequestQueueItem.requestStatus = _oDictionary.oRequestStatus.Error;
                                                            ///:::: "RequestQueueLoanRequest" deberia venir del diccionario
                                                            this.syncDB.post(_oDictionary.oQueues.LoanRequest, _oRequestQueueItem).then(
                                                                /////////// Eliminar BusinessError
                                                                function(_oDictionary, _oRequestQueueItem) {
                                                                    this.syncDB.getById(_oDictionary.oErrors.LoanRequest, _oRequestQueueItem.id)
                                                                        .then(function(_oRequestQueueItem, _oDictionary, result) { /// Confirmar si ya existe el registro del error, hacer upsert
                                                                            if (result.BusinessErrorLoanRequestSet) {
                                                                                if (result.BusinessErrorLoanRequestSet.length > 0) { // Ya existia previamente
                                                                                    this.syncDB.delete(_oDictionary.oErrors.LoanRequest, result.BusinessErrorLoanRequestSet[0].id, result.BusinessErrorLoanRequestSet[0].rev)
                                                                                        .then(function(success) {
                                                                                            resolveSendPromise(error);
                                                                                        });
                                                                                } else {
                                                                                    resolveSendPromise(error);
                                                                                }
                                                                            } else {
                                                                                resolveSendPromise(error);
                                                                            }

                                                                        }.bind(this, _oRequestQueueItem, _oDictionary));
                                                                }.bind(this, _oDictionary, _oRequestQueueItem)
                                                                /////////// Eliminar BusinessError

                                                            ).
                                                            catch(function(error) {

                                                                resolveSendPromise(error);

                                                            });
                                                        }



                                                    }.bind(this, _oDictionary, _oRequestQueueItem));

                                            }.bind(this, _oLoanRequestQueueItem, _oDictionary)) /// Bind para Pouch de datos
                                        .catch(function(error) {

                                            console.log("Error al Deserializar solicitud");
                                            resolveSendPromise(error);


                                        });

                                    ///::: Aqui termina promesa individual
                                }.bind(this, result.RequestQueueLoanRequestSet[i]));


                                aPromises.push(oPromise);


                            }


                        };

                        /// Fuera del For, resolver promesas

                        Promise.all(aPromises).then(
                            function(results) {

                                var oResults = {};
                                var i;
                                oResults.resultsOK = 0;
                                oResults.resultsError = 0;
                                oResults.businessError = 0;
                                oResults.resultsTotal = results.length;

                                for (i = 0; i < results.length; i++) {
                                    if (results[i] == "COMPLETED") {
                                        oResults.resultsOK = oResults.resultsOK + 1;
                                    } else {
                                        if (results[i] == "BUSINESSERROR") {
                                            oResults.businessError = oResults.businessError + 1;
                                        } else {
                                            oResults.resultsError = oResults.resultsError + 1;
                                        }
                                    }

                                }

                                resolveMasterPromise(oResults);

                            }
                        ).catch(
                            function(error) {


                            }
                        );



                    } else { /// No se obtuvieron resultados

                        var oResults = {};
                        oResults.resultsOK = 0;
                        oResults.resultsError = 0;
                        oResults.resultsTotal = 0;
                        oResults.businessError = 0;
                        resolveMasterPromise(oResults);
                        console.log("No se recuperaron resultados (No hay resultados en el Queue)");

                    }


                }.bind(this, oDictionary))
                .catch(function(error) {

                    var oResults = {};
                    oResults.resultsOK = 0;
                    oResults.resultsError = 0;
                    oResults.resultsTotal = 0;
                    oResults.businessError = 0;
                    console.log("Error general en sincronizacion de LoanRequest: " + error);
                    resolveMasterPromise(oResults);

                });

            ////////////// Aqui termina promesa maestra
        }.bind(this));

    };

    //******************************** INICIO - PROCESO SINCRONIZACIÓN ********************************
    sap.ui.sync.LoanRequest.prototype.confirmQueue = function() {
        console.log("#2# LoanRequest - confirmQueue - INICIADO");
        var self = this;
        return new Promise(function(resolve, reject) {
            console.log("(1) obtener notificaciones de tipo LoanRequest");
            sap.ui.getCore().AppContext.oRest.read("/SystemNotifications", "$filter=promoterID eq '" + sap.ui.getCore().AppContext.Promotor + "' and attended eq 'false' and objectTypeID eq '2'", true)
                //sap.ui.getCore().AppContext.oRest.read("/SystemNotifications", "", true)
                .then(function(oResult) {
                    self.checkNotifications(oResult).then(function(array) {
                        //promise all
                        Promise.all(array).then(function(results) {


                            var oRRay = results;
                            var i;
                            var bBUSINESSERROR = false;

                            for (i = 0; i < results.length; i++) {
                                if (results[i] == "BUSINESSERROR") {
                                    bBUSINESSERROR = true;
                                }
                            }

                            /// BUSINESSERROR <<<< Continuar aqui
                            if (bBUSINESSERROR) {
                                console.log("BUSINESSERROR en confirmación de solicitudes encontrado");
                                resolve("BUSINESSERROR");
                            } else {
                                resolve("OK");
                            }


                        });
                    });
                }.bind(this))
                .catch(function(oError) {
                    console.log("Error - Master Promise: " + oError);
                    resolve("Error en LoanRequest confirmQueue: " + oError);
                });
        }.bind(this));
    };
    //(1) obtener notificaciones de tipo customer
    sap.ui.sync.LoanRequest.prototype.checkNotifications = function(oResult) {
        var self = this;
        var oPromises = new Array(); //promesas individuales
        var counter = 0;
        return new Promise(function(resolve, reject) {
            if (oResult.results.length > 0) {
                oResult.results.forEach(function(entry) {
                    console.log("(2) verifica si existe id en tabla de UPDATE ERROR");
                    oPromises.push(self.checkUpdateError(oResult.results[counter]));
                    counter++;
                    if (oResult.results.length === counter) {
                        resolve(oPromises);
                    }
                }); //for 
            } else {
                console.log("(1)la lista de notificaciones viene vacia");
                resolve("Null"); //resuelve promesa master
            }
        });
    };
    //(2) verifica si existe id en tabla de update error
    sap.ui.sync.LoanRequest.prototype.checkUpdateError = function(oNotification) {
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.syncDB.getById(oDictionary.oErrors.Notification, oNotification.notificationID)
                    .then(function(oResult) {
                        if (oResult.SystemErrorNotificationSet.length === 0) {
                            console.log("NO Existe - Inicia SINCRONIZACION:");
                            self.searchInDataDB(oNotification).then(function(msg) {
                                console.log(msg);
                                resolve(msg);
                            })

                        } else {
                            console.log("SI Existe - Inicia REINTENTO de UPDATE:");
                            self.retrySync(oNotification).then(function(msg) {
                                console.log(msg);
                                resolve("2.2");
                            })
                        }

                    }).catch(function(e) {
                        console.log("Error (checkUpdateError): " + e);
                        resolve("2.2");
                    })
            } catch (e) {
                reject(e);
            }
        });
    };
    //(3) verifica si existe en dataDB 

    sap.ui.sync.LoanRequest.prototype.processErrorNotification = function(oErrorData) {


        var oDictionary;
        var self;
        oDictionary = new sap.ui.helper.Dictionary();
        self = this;

        return new Promise(function(resolve, reject) {

            self.insertErrorData(oErrorData).
            then(function(result) {

                //self.deleteFromQueue(oErrorData.id, oDictionary).then(
                resolve("OK")
                    //);

            }).catch(function(error) {
                resolve("Error al procesar notificacion con error de CRM: " + error)
            });



        });

    };


    sap.ui.sync.LoanRequest.prototype.insertErrorData = function(oErrorDataSync) {


        var oDictionary;
        var self;
        oDictionary = new sap.ui.helper.Dictionary();
        self = this;

        return new Promise(function(resolve, reject) {


            self.syncDB.getById(oDictionary.oErrors.LoanRequest, oErrorDataSync.id)
                .then(function(_oDictionary, _oErrorDataSync, result) { /// Confirmar si ya existe el registro del error, hacer upsert
                    if (result.BusinessErrorLoanRequestSet) {
                        if (result.BusinessErrorLoanRequestSet.length > 0) { // Ya existia previamente
                            _oErrorDataSync.rev = result.BusinessErrorLoanRequestSet[0].rev;
                        }
                    }
                    self.syncDB.post(_oDictionary.oErrors.LoanRequest, _oErrorDataSync).then(
                        resolve("Ok")
                    );

                }.bind(self, oDictionary, oErrorDataSync)).catch(function(error) {
                    resolve("Error al recuperar el Business Error : " + error)
                });

        });

    };


    sap.ui.sync.LoanRequest.prototype.searchInDataDB = function(oNotification) {
        console.log("(3) verifica si existe en dataDB: " + oNotification.notificationID);

        var oDictionary;
        var self;
        oDictionary = new sap.ui.helper.Dictionary();
        self = this;

        return new Promise(function(resolve, reject) {
            try {

                ///// if Notification == "OK"  :::::::::
                ///

                self.dataDB.getById(oDictionary.oTypes.LoanRequest, oNotification.objectDMID)
                    .then(function(oResult) {
                        var oErrorData;
                        if (oResult.LoanRequestSet.length > 0) {
                            console.log("SI Existe en dataDB");


                            ////// Verificar como se procesara la notificación
                            if (oNotification.message.toUpperCase() == "SOLICITUD CREADA" || oNotification.message.toUpperCase() == "SOLICITUD MODIFICADA EXITOSAMENTE") {
                                /// Camino normal

                                self.deleteDataDB(oResult, oNotification).then(function(msg) {
                                    console.log(msg);
                                    resolve("3.1");
                                });


                            } else {
                                /// Else, notification not OK  :::::::::

                                oErrorData = {

                                    id: oNotification.objectDMID,
                                    errorDetail: oNotification.message,
                                    type: oResult.LoanRequestSet[0].productID,
                                    NotificationID: oNotification.notificationID

                                };

                                self.processErrorNotification(oErrorData).then(
                                    resolve("BUSINESSERROR")
                                );



                            }
                            /// Agregar registro de error para SyncErrorQueue
                            /// Eliminar de SYNCDB


                        } else {
                            console.log("NO Existe en dataDB");
                            resolve("3.2");
                        }
                    }).catch(function(e) {
                        console.log("Error (searchInDataDB): " + e);
                        resolve("3.2");
                    });



            } catch (e) {
                reject(e);
            }
        });
    };




    //(4) elimina si existe en dataDB 
    sap.ui.sync.LoanRequest.prototype.deleteDataDB = function(oResult, oNotification) {
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                var i;
                ///// Si los customers asociados fueron insertados unicamente por la solicitud
                /// eliminar de Pouch

                if (oResult.CustomerSet) {

                    jQuery.sap.require("js.serialize.customer.CustomerSerialize");
                    var oCustomerSerializer;
                    oCustomerSerializer = new sap.ui.serialize.Customer("dataDB");

                    for (i = 0; i <= oResult.CustomerSet.length; i++) {
                        var bHasRejectionCause;
                        bHasRejectionCause = false;



                        if (oResult.CustomerSet[i]) {

                            if (oResult.CustomerSet[i].groupLoanData) {
                                if (oResult.CustomerSet[i].groupLoanData.rejectionCauseId) {
                                    if (oResult.CustomerSet[i].groupLoanData.rejectionCauseId != "") {
                                        bHasRejectionCause = true;
                                    }
                                }
                            }




                            if (oResult.CustomerSet[i].bRegisterComesFromLoanRequest || bHasRejectionCause) {
                                //////// Este customer solo fue insertado al crear la oportunidad
                                /// Ó tiene causa de rechazo, que al haber sincronizado correctamente, debe eliminar al Customer
                                /// eliminarlo
                                self.dataDB.delete(oDictionary.oTypes.Customer, oResult.CustomerSet[i].id, oResult.CustomerSet[i].rev)
                                    .catch(function(error) {
                                        console.log("Error al eliminar el Customer (Solo existe en Pouch por la asociación o tiene rejection Cause" + error);
                                    });

                            }



                        }

                        //////// Eliminar las relaciones no importando la vista del Customer

                        if (oResult.CustomerSet[i]) {
                            oCustomerSerializer.deleteCustomerLoanRelationship(oResult.CustomerSet[i].id);
                        }



                    }
                }





                self.dataDB.delete(oDictionary.oTypes.LoanRequest, oResult.LoanRequestSet[0].id, oResult.LoanRequestSet[0].rev)
                    .then(function(oResult) {
                        console.log("(4) eliminado de dataDB: OK");
                        self.searchInSyncDB(oNotification).then(function(msg) {
                            console.log(msg);
                            resolve("4.1")
                        });
                    }).catch(function(e) {
                        console.log("(4)eliminado de dataDB: NG :: " + e);
                        resolve("4.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(5) verifica si existe en syncDB
    sap.ui.sync.LoanRequest.prototype.searchInSyncDB = function(oNotification) {
        console.log("(5)verifica si existe en syncDB");
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.syncDB.getById(oDictionary.oQueues.LoanRequest, oNotification.objectDMID)
                    .then(function(oResult) {
                        if (oResult.RequestQueueLoanRequestSet.length > 0) {
                            console.log("SI Existe en syncDB");
                            self.deleteSyncDB(oResult, oNotification).then(function(msg) {
                                console.log(msg);
                                resolve("5.1");
                            });
                        } else {
                            console.log("NO Existe en syncDB");
                            resolve("5.2");
                        }
                    }).catch(function(e) {
                        console.log("Error (searchInSyncDB): " + e);
                        resolve("5.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(6) elimina si existe en syncDB
    sap.ui.sync.LoanRequest.prototype.deleteSyncDB = function(oResult, oNotification) {
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                self.syncDB.delete(oDictionary.oQueues.LoanRequest, oResult.RequestQueueLoanRequestSet[0].id, oResult.RequestQueueLoanRequestSet[0].rev)
                    .then(function(oResult) {
                        console.log("(6)eliminado de syncDB: OK");
                        self.updateAttended(oNotification).then(function(msg) {
                            console.log(msg);
                            resolve("6.1")
                        });
                    }).catch(function(e) {
                        console.log("(6)eliminado de syncDB: NG :: " + e);
                        resolve("6.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(7) actualiza estatus notificación - attended = true 
    sap.ui.sync.LoanRequest.prototype.updateAttended = function(oNotification) {
        var oBody = {};
        oBody.attended = "true"; //estatus
        var self = this;
        return new Promise(function(resolve, reject) {
            try {
                sap.ui.getCore().AppContext.oRest.update("/SystemNotifications('" + oNotification.notificationID + "')", oBody, true)
                    .then(function() {
                        console.log("(7)estatus actualizado: OK");
                        resolve("7.1");
                    }).catch(function(e) {
                        console.log("(7)estatus actualizado: NG :: " + e);
                        self.saveUpdateError(oNotification).then(function(msg) {
                            console.log(msg);
                            resolve("7.2");
                        });
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(8) guarda error de actualizar para después reintentar 
    sap.ui.sync.LoanRequest.prototype.saveUpdateError = function(oNotification) {
        var oDictionary = new sap.ui.helper.Dictionary();
        var self = this;
        var ErrorUpdate = {
            id: oNotification.notificationID
        };
        return new Promise(function(resolve, reject) {
            try {
                self.syncDB.post(oDictionary.oErrors.Notification, ErrorUpdate)
                    .then(function(oResult) {
                        console.log("(8)guardar error de actualizar: OK");
                        resolve("8.1");
                    }).catch(function(e) {
                        console.log("(8)guardar error de actualizar: NG :: " + e);
                        resolve("8.2");
                    });
            } catch (e) {
                reject(e);
            }
        });
    };
    //(3) renvio de peticiones de actualización de estatus attended ****
    sap.ui.sync.LoanRequest.prototype.retrySync = function(oNotification) {
        return new Promise(function(resolve, reject) {
            try {
                var oBody = {};
                oBody.attended = "true"; //estatus
                sap.ui.getCore().AppContext.oRest.update("/SystemNotifications('" + oNotification.notificationID + "')", oBody, true)
                    .then(function(oResult) {
                        console.log("(3)reintento - estatus actualizado: OK");
                        resolve("3.1")
                    }).catch(function(e) {
                        console.log("(3)reintento - estatus actualizado: NG :: " + e);
                        resolve("3.2")
                    })
            } catch (e) {
                reject(e);
            }
        });
    };
    //******************************** FIN - PROCESO SINCRONIZACIÓN ********************************

    sap.ui.sync.LoanRequest.prototype.retrieveErrors = function(_oDictionary) {
        return this.syncDB.get(_oDictionary.oErrors.LoanRequest);
    };


    sap.ui.sync.LoanRequest.prototype.deleteFromQueue = function(_sLoanRequestId, _oDictionary) {

        return new Promise(function(resolveDeletePromise) {

            this.syncDB.getById(_oDictionary.oQueues.LoanRequest, _sLoanRequestId)
                .then(function(_oDictionary, result) { /// Confirmar si ya existe el registro del error, hacer upsert

                    if (result.RequestQueueLoanRequestSet) {
                        if (result.RequestQueueLoanRequestSet.length > 0) { // Ya existia previamente

                            this.syncDB.delete(_oDictionary.oQueues.LoanRequest, result.RequestQueueLoanRequestSet[0].id, result.RequestQueueLoanRequestSet[0].rev)
                                .then(function(success) {
                                    resolveDeletePromise("OK");
                                });
                        } else {
                            resolveDeletePromise("OK");
                        }
                    } else {
                        resolveDeletePromise("OK");
                    }

                }.bind(this, _oDictionary)).
            catch(function(error) {

                resolveDeletePromise("Error al eliminar la solicitud del queue: " + error);

            });

        }.bind(this));

    };




})();
