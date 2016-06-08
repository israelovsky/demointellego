(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.db.Synchronizer");
    jQuery.sap.require("sap.ui.base.Object");
    jQuery.sap.require("js.db.Pouch");

    sap.ui.base.Object.extend('sap.ui.db.Synchronizer', {
        constructor: function(_dataPouchDB, _oRest) {
            this.oDB = new sap.ui.db.Pouch("dbSync");
            this.setSchema();
            //this.oRest = _oRest;
            //this.oDB = _dataPouchDB;
            //this.prueba = 1;
        },
    });

    sap.ui.db.Synchronizer.prototype.oTypes = {

        Customer: "Customer",
        LoanRequest: "LoanRequest",
        Insurance: "Insurance",
        LoanRequestCustomerRelation: "LoanRequestCustomerRelation",
        InsuranceLoanRequestRelationSet: "InsuranceLoanRequestRelationSet"

    };

    sap.ui.db.Synchronizer.prototype.oMethods = {

        POST: "POST",
        PUT: "PUT",
        GET: "GET"

    };


    sap.ui.db.Synchronizer.prototype.oQueues = {

        Customer: "RequestQueueCustomer",
        LoanRequest: "RequestQueueLoanRequest",
        Insurance: "RequestQueueInsurance"

    };

    sap.ui.db.Synchronizer.prototype.setSchema = function() {
        var oSchema;
        oSchema = [{
            singular: "RequestQueueCustomer",
            plural: "RequestQueueCustomerSet"
        }, {
            singular: "RequestQueueLoanRequest",
            plural: "RequestQueueLoanRequestSet"
        }, {
            singular: "RequestQueueInsurance",
            plural: "RequestQueueInsuranceSet"
        }, {
            singular: "LoanRequestCustomerRelation",
            plural: "LoanRequestCustomerRelationSet"
        }, {
            singular: "InsuranceLoanRequestRelation",
            plural: "InsuranceLoanRequestRelationSet"

        }];

        this.oDB.oDB.setSchema(oSchema);
    };

    sap.ui.db.Synchronizer.prototype.oRequestStatus = {

        Initial: "Initial",
        Sent: "Sent",
        Error: "Error",
        BusinessError: "BusinessError"

    };



    sap.ui.db.Synchronizer.prototype.postRequest = function(_oType, _sId, _sRequestMethod, _sRequestURL) {


        var oRequest = {
            requestMethod: _sRequestMethod,
            requestUrl: _sRequestURL,
            requestBodyId: _sId,
            requestStatus: this.oRequestStatus.Initial,
            requestConfirmed: false,
            // PouchDB id
            id: _sId
                // PouchDB id
        };

        if (_oType == this.oTypes.LoanRequest) {
            this.post(this.oQueues.LoanRequest, oRequest).then(function(result) {
                var Ax;
            }).catch(function(error) {
                var Ay;

            });
        }



    };


    sap.ui.db.Synchronizer.prototype.sendRequestQueue = function(_oType) {

        var i;
        var oPouchData;

        oPouchData = new sap.ui.db.Pouch("requestData1");
        oPouchData.setSchema();


        ///////// Retrieve all loan requests
        this.getByType(_oType).then(function(result) {


            if (result.RequestQueueLoanRequestSet) {

                if (result.RequestQueueLoanRequestSet.length > 0) {
                    for (i = 0; i < result.RequestQueueLoanRequestSet.length; i++) {
                        //////// For each LoanRequest, retrieve details and send

                        if (result.RequestQueueLoanRequestSet[i].requestStatus != this.oRequestStatus.Sent) {

                            ///// Deserialize
                            oPouchData.DeSerialize(oPouchData.oTypes.LoanRequest, result.RequestQueueLoanRequestSet[i].requestBodyId)
                                .then(function(_oRequestQueueItem) {

                                    var oRequestQueueItem = _oRequestQueueItem; /// Closure para item actual


                                    return function(result) {

                                            console.log("******** Request Armado *******");
                                            console.log(result);

                                            //// Send

                                            sap.ui.getCore().AppContext.myRest.create(oRequestQueueItem.requestUrl, result, true).then(
                                                function(result) {
                                                    console.log("******** Petición enviada exitosamente, actualizar Queue *******");

                                                    oRequestQueueItem.requestStatus = this.oRequestStatus.Sent;
                                                    this.post(this.oQueues.LoanRequest, oRequestQueueItem);

                                                }.bind(this)
                                            ).catch(
                                                function(error) {
                                                    console.log("******** Error al enviar la petición, actualizar Queue *******");
                                                    oRequestQueueItem.requestStatus = this.oRequestStatus.Error;
                                                    this.post(this.oQueues.LoanRequest, oRequestQueueItem);
                                                
                                                }.bind(this));

                                        }.bind(this) /// Bind para Pouch de datos

                                }.bind(this)
                                (result.RequestQueueLoanRequestSet[i])) /// Bind para Pouch de datos
                                .catch(function(error) {
                                    var x;
                                });





                        }


                    };


                }
            }

        }.bind(this))
        .catch(function(error) {

            var R;

        });



    };





    sap.ui.db.Synchronizer.prototype.postRequest1 = function(_oType, _sId, _fn, oController) {

        ///////// Recuperar registro de Pouch 

        //// Si es solicitud, recuperar arreglo de customers
        ///
        /// Almacenar arreglo de customers en entidad de Asociacion

        /// Si es seguro recuperar asociación con solicitud



        var sRequestUrl;

        var oRecord;

        if (_oType == this.oTypes.Customer) {

            ////// Pruebas para hacerlo fallar, hehe
            if (this.prueba == 1) {
                sRequestUrl = "/CustomerSet";
                this.prueba = this.prueba; // + 1;
            } else {
                sRequestUrl = "/CustomorSet";
            }


            oRecord = {
                type: _oType,
                requestMethod: "POST",
                requestUrl: sRequestUrl,
                requestBodyId: _sId,
                status: "initial",
                confirmed: false
            };


            this.post(this.oQueues.Customer, oRecord, _fn, oController);

        }

        if (_oType == this.oTypes.LoanRequest) {
            sRequestUrl = "/LoanRequestSet";


            oRecord = {
                type: _oType,
                requestMethod: "POST",
                requestUrl: sRequestUrl,
                requestBodyId: _sId,
                sent: false,
                confirmed: false
            };



            /// TODO: Recuperar arreglo de customers y crear tabla de relacion

            this.oDB.get(this.oTypes.LoanRequest, function(result) {

                for (var i; i < result.LoanRequestSet[0].CustomerSet.length; i++) {

                    //// Insert en relaciones
                    var oRelation;

                    oRelation = {
                        id: result.LoanRequestSet[0].CustomerSet[i],
                        loanRequestID: result.LoanRequestSet[0].id
                    }

                    this.post(this.oTypes.LoanRequestCustomerRelation, oRelation, _fn, oController);

                }

            }, oController)

            this.post(this.oQueues.LoanRequest, oRecord, _fn, oController);

        }

        if (_oType == this.oTypes.Insurance) {
            sRequestUrl = "/InsuranceSet";



            oRecord = {
                type: _oType,
                requestMethod: "POST",
                requestUrl: sRequestUrl,
                requestBodyId: _sId,
                sent: false,
                confirmed: false
            };


            this.post(this.oQueues.Insurance, oRecord, _fn, oController);
            /// TODO: Recuperar loan request asociada y crear tabla de relacion
        }






    };






    sap.ui.db.Synchronizer.prototype.sendRequests = function(_fn, oController) {

        //////// Recuperar request por tipo
        ///
        var that = this;

        var oCustomerPromise = new Promise(
            function(resolvePromiseCustomer, rejectPromiseCustomer) {


                that.oLocalPouch.oDB.rel.find(that.oQueues.Customer).then(function(result) {

                    var oRequest, oResultado, iTotal, iRequestCounter;


                    iRequestCounter = 0;

                    oResultado = result;
                    iTotal = result.RequestQueueCustomerSet.length;
                    /////// Send customers
                    ///

                    if (result.RequestQueueCustomerSet.length > 0) {

                        for (var i = 0; i < result.RequestQueueCustomerSet.length; i++) {

                            if (result.RequestQueueCustomerSet[i].sent == false) {

                                oRequest = result.RequestQueueCustomerSet[i];



                                //// Recuperar datos de este customer
                                that.oDB.oDB.rel.find("Customer", oRequest.requestBodyId).then(

                                    function(_oRequest) {

                                        var oCurrentRequest;
                                        oCurrentRequest = _oRequest;

                                        return function(result) {


                                            //// Armar request
                                            for (var i = 0; i < result.AddressSet.length; i++) {
                                                delete result.AddressSet[i].rev;
                                                delete result.AddressSet[i].id;
                                            }



                                            result.CustomerSet[0].AddressSet = result.AddressSet;

                                            delete result.CustomerSet[0].rev;
                                            delete result.CustomerSet[0].id;

                                            //// Enviar request
                                            that.oRest.create(oCurrentRequest.requestUrl, result.CustomerSet, false, "", "", "Solicitante", result.CustomerSet[0].firstname + " " + result.CustomerSet[0].firstLastName).
                                            then(function(result) {

                                                //////// Marcar registro como enviado
                                                console.log("*****************Marcando como enviado************");
                                                that.sayHi(that.oQueues.Customer, "sent", "true", oCurrentRequest.id, oCurrentRequest.rev).then(
                                                    function(result) {
                                                        iRequestCounter = iRequestCounter + 1;
                                                        if (iRequestCounter >= iTotal) {
                                                            console.log("Termina counter ok Rest");
                                                            resolvePromiseCustomer("OK");

                                                        }
                                                    }

                                                );
                                                //that.update(that.oQueues.Customer, "sent",  "true", oRequest.id, oRequest.rev);
                                                console.log("*****************Marcado como enviado************");
                                                /// Verificar si ya se cumplieron todas las operaciones, fulfill promise

                                            }).catch(function(err) {


                                                //////// Marcar dependencias como no enviadas
                                                ///      Marcar registro en modelo como no enviado
                                                console.log("***************Rechazado ********************");
                                                console.log(err);
                                                //that.oDB.oDB.rel.update("Customer", "sent", "false", result.CustomerSet[0].id, result.CustomerSet[0].rev);
                                                /// Verificar si ya se cumplieron todas las operaciones, rejectPromiseCustomer promise
                                                iRequestCounter = iRequestCounter + 1;
                                                if (iRequestCounter >= iTotal) {
                                                    resolvePromiseCustomer("OK");
                                                }

                                            });
                                            /*

                                            function(success) {

                                                //////// Marcar registro como enviado
                                                console.log("*****************Marcando como enviado************");
                                                that.sayHi(that.oQueues.Customer, "sent", "true", oCurrentRequest.id, oCurrentRequest.rev).then(
                                                    function(result) {
                                                        iRequestCounter = iRequestCounter + 1;
                                                        if (iRequestCounter >= iTotal) {
                                                            console.log("Termina counter ok Rest");
                                                            resolvePromiseCustomer("OK");

                                                        }
                                                    }

                                                );
                                                //that.update(that.oQueues.Customer, "sent",  "true", oRequest.id, oRequest.rev);
                                                console.log("*****************Marcado como enviado************");
                                                /// Verificar si ya se cumplieron todas las operaciones, fulfill promise




                                            },

                                            function(error) {

                                                //////// Marcar dependencias como no enviadas
                                                ///      Marcar registro en modelo como no enviado
                                                console.log("***************Rechazado ********************");
                                                that.oDB.oDB.rel.update("Customer", "sent", "false", result.CustomerSet[0].id, result.CustomerSet[0].rev);
                                                /// Verificar si ya se cumplieron todas las operaciones, rejectPromiseCustomer promise
                                                iRequestCounter = iRequestCounter + 1;
                                                if (iRequestCounter >= iTotal) {
                                                    resolvePromiseCustomer("OK");
                                                }


                                            }*/





                                        }

                                    }(oRequest) /////// Closure for current request


                                ).catch(function(reason) {
                                    //// Error al traer el customer

                                });





                            } else {

                                iRequestCounter = iRequestCounter + 1;
                                if (iRequestCounter >= iTotal) {
                                    console.log("Termina counter loop");
                                    resolvePromiseCustomer("OK");
                                }

                            }
                        }
                    }




                });

                /////// Recuperar request del tipo Customer
                ////// Procesar request del tipo Customer
            }
        ).then(function(val) {

            //// Enviar LoanRequests
            var valo = val;
            console.log("********!!!!! Cheers !!!!!!!*******");
            //// Enviar Insurance


        }).catch(function(reason) {


            var valo = reason;

        });







    };

    sap.ui.db.Synchronizer.prototype.sayHi = function(type, property, data, id, rev) {

        var that = this;

        var oUpdatePromise = new Promise(
            function(resolve, reject) {


                console.log("type: " + type + "property: " + property + " data: " + data + "id: " + id + "rev: " + rev);

                //console.log("HI");

                //var context = this; //requerido para acceder al objeto oDB en la funcion promise
                //this.setSchema();
                //
                console.log("Calling find function inside update");
                that.oLocalPouch.oDB.rel.find(type, id).then(function(result) {
                    console.log("Object retrieved for update");
                    console.log(result); //objeto a actualizar   

                    //var values = JSON.stringify(data);
                    var oUpdate = "result." + type + "Set[0]." + property + "=" + data;
                    //console.log("************OUPDATE = " + oUpdate);
                    eval(oUpdate);

                    //var oSet = "result." + type + "Set[0]";
                    //var oSet2 = eval(oSet);
                    console.log("About to send update");
                    //console.log(oSet2);


                    that.oLocalPouch.oDB.rel.save(type, result.RequestQueueCustomerSet[0])
                        .then(
                            function(val) {
                                console.log("Update completed");
                                resolve("Ok")

                            }
                        ).catch(function(err) {

                            reject(err);

                            if (err.code === 409) {

                            } else {

                            }
                        });


                });
                console.log("End inside update");

            });

        return oUpdatePromise;

    };

    sap.ui.db.Synchronizer.prototype.update = function(type, property, data, id, rev) {

        console.log("**** POUCH - UPDATE ****");
        var context = this; //requerido para acceder al objeto oDB en la funcion promise
        //this.setSchema();
        this.oLocalPouch.oDB.rel.find(type, id, rev).then(function(result) {


            console.log("******* RESPONSE FROM POUCH ***********");

            //oUpdate //objeto a actualizar   

            //actulización de las propiedades definidas
            var values = JSON.stringify(data);
            var oUpdate = "result." + type + "[0]." + property + "=" + values;
            console.log("************OUPDATE = " + oUpdate);


            eval(oUpdate);
            console.log(result.CustomerSet[0].groupLoanData);

            return context.oDB.rel.save(type, result.CustomerSet[0]).catch(function(err) {
                if (err.code === 409) {

                } else {
                    throw err;
                }
            });
        });
    };


    sap.ui.db.Synchronizer.prototype.post = function(type, data, fn, oController) {
        return this.oDB.oDB.rel.save(type, data);
    };

    /*sap.ui.db.Synchronizer.prototype.post = function(type, data, fn, oController) {
        console.log("**** POUCH - POST ****");
        this.oLocalPouch.oDB.rel.save(type, data).then(function(result) {
            console.log(result);
            // fn(result, oController);
        }).catch(function(err) {
            console.log(err);
        });
    };*/
    /**
     * [delete - elimina el objeto especificado]
     * @param  {[type]} type [tipo de entidad]
     * @param  {[type]} id   [id del objeto]
     * @param  {[type]} rev  [revision del objeto]
     * @return {[type]}      [description]
     */
    sap.ui.db.Synchronizer.prototype.delete = function(type, id, rev) {
        console.log("**** POUCH - DELETE ****")
        this.oLocalPouch.rel.del(type, {
            id: id,
            rev: rev
        });
    };
    /**
     * [getById - busca un objeto del tipo y id especificado]
     * @param  {[type]} type [tipo de entidad]
     * @param  {[type]} id   [id del objeto]
     * @return {[type]}      [description]
     */
    sap.ui.db.Synchronizer.prototype.getById = function(type, id) {
        console.log("**** POUCH - GET BY ID ****")
        this.setSchema();
        this.oLocalPouch.rel.find(type, id).then(function(result) {
            //fn(result, oController);
        });
    };

    sap.ui.db.Synchronizer.prototype.getByType = function(type) {
        return this.oDB.oDB.rel.find(type);
    };
    /**
     * [update - actualiza las propiedades de un objeto]
     * @param  {[type]} type [tipo de entidad]
     * @param  {[type]} id   [id del objeto]
     * @param  {[type]} rev  [revision del objeto]
     * @return {[type]}      [NOTA: Falt]a probar al actulizar]
     */
    sap.ui.db.Synchronizer.prototype.update = function(type, property, data, id, rev) {
        console.log("**** POUCH - UPDATE ****");
        var context = this; //requerido para acceder al objeto oDB en la funcion promise
        this.setSchema();
        this.oLocalPouch.rel.find(type, id, rev).then(function(result) {
            console.log(result); //objeto a actualizar   
            //actulización de las propiedades definidas
            var values = JSON.stringify(data);
            var oUpdate = "result." + type + "[0]." + property + "=" + values;
            console.log(oUpdate);
            eval(oUpdate);
            console.log(result.CustomerSet[0].groupLoanData);

            return context.oLocalPouch.rel.save(type, result.CustomerSet[0]).catch(function(err) {
                if (err.code === 409) {

                } else {
                    throw err;
                }
            });
        });
    };

    sap.ui.db.Synchronizer.prototype.updateAll = function(type, data, id, rev) {
        console.log("**** POUCH - UPDATE ****");
        var context = this; //requerido para acceder al objeto oDB en la funcion promise
        this.setSchema();
        this.oLocalPouch.rel.find(type, id, rev).then(function(result) {
            console.log(result); //objeto a actualizar   
            /*//actulización de las propiedades definidas
            var values = JSON.stringify(data);
            var oUpdate = "result." + type + "[0]." + property + "=" + values;
            console.log(oUpdate);
            eval(oUpdate);
            console.log(result.CustomerSet[0].groupLoanData);

            return context.oDB.rel.save(type, result.CustomerSet[0]).catch(function(err) {
                if (err.code === 409) {

                } else {
                    throw err;
                }
            });*/
        });
    };
})();
