(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.serialize.LoanRequest");
    jQuery.sap.require("sap.ui.base.Object");
    jQuery.sap.require("js.db.Pouch");



    sap.ui.base.Object.extend('sap.ui.serialize.LoanRequest', {
        constructor: function(_dataDB) {


            var oSchemaDB;

            jQuery.sap.require("js.helper.Dictionary");
            jQuery.sap.require("js.helper.Schema");
            jQuery.sap.require("js.base.DisplayBase");

            oSchemaDB = new sap.ui.helper.Schema();
            this.dataDB = new sap.ui.db.Pouch(_dataDB);

            /////////// ::: Estos datos deberian venir del diccionario

            this.dataDB.setSchema(oSchemaDB.getDataDBSchema()); /// ::: Set schema de Pouch deberia aceptar parametro


        }
    });

    sap.ui.serialize.LoanRequest.prototype.upsertCustomers = function(_oCustomer) {
        var oCustomer = _oCustomer;

        return function(result) {

            var promiseOdata;
            var oDictionary = new sap.ui.helper.Dictionary();
            var oParams;
            var oCustomerDictionary;
            var bUpdateSent;


            bUpdateSent = false;







            if (result.CustomerSet.length == 0) { /// No existe en PouchDB
                /// Si no viene de Pouch, debe venir de CRM (Hacer expand y guardar todas sus propiedades)

                if (oCustomer.BPIdCRM != "") {
                    oParams = {
                        BPIdCRM: oCustomer.BPIdCRM
                    };

                    oCustomerDictionary = oDictionary.oDataRequest(oParams).getRequest("CustomerSet");
                    bUpdateSent = true;
                    promiseOdata = sap.ui.getCore().AppContext.myRest.read("/" + oCustomerDictionary.odata.name, oCustomerDictionary.odata.get.filter.BPIdCRM + oCustomerDictionary.odata.get.expand, true).
                    then(function(result) {

                        if (result) {
                            var a;

                            if (result.results.length > 0) {

                                result.results[0].groupLoanData = oCustomer.groupLoanData;
                                result.results[0].individualLoanData = oCustomer.individualLoanData;
                                result.results[0].generalLoanData = oCustomer.generalLoanData;
                                result.results[0].id = oCustomer.customerIdMD;


                                if (result.results[0].AddressSet) {

                                    if (result.results[0].AddressSet.results) {

                                        result.results[0].AddressSet = result.results[0].AddressSet.results;

                                    }

                                }
                                if (result.results[0].PersonalReferenceSet) {

                                    if (result.results[0].PersonalReferenceSet.results) {

                                        result.results[0].PersonalReferenceSet = result.results[0].PersonalReferenceSet.results;

                                    }

                                }
                                if (result.results[0].PhoneSet) {

                                    if (result.results[0].PhoneSet.results) {

                                        result.results[0].PhoneSet = result.results[0].PhoneSet.results;

                                    }

                                }
                                if (result.results[0].ImageSet) {

                                    if (result.results[0].ImageSet.results) {

                                        result.results[0].ImageSet = result.results[0].ImageSet.results;

                                    }

                                }
                                if (result.results[0].EmployerSet) {

                                    if (result.results[0].EmployerSet.results) {

                                        result.results[0].EmployerSet = result.results[0].EmployerSet.results;

                                    }

                                }

                                result.results[0].IsEntityInQueue = true;


                                ///////////// Agregar bandera de que fue escrito en Pouch desde la solicitud 
                                /// ( no exitia en Pouch previamente)
                                result.results[0].bRegisterComesFromLoanRequest = true;
                                /// ( no exitia en Pouch previamente)

                                this.dataDB.post(oDictionary.oTypes.Customer, result.results[0]).then(function(data) {
                                    var C;
                                }).catch(
                                    function(error) {
                                        var A;
                                    }
                                );

                            }
                            //// Hacer update
                        }

                    }.bind(this));


                }

                if (!bUpdateSent) {



                    /// Make Insert
                    oCustomer.id = oCustomer.customerIdMD;
                    /////::: El tipo de datos Customer deberia venir del diccionario
                    this.dataDB.post(oDictionary.oTypes.Customer, oCustomer).then(function(data) {
                        var C;
                    }).catch(
                        function(error) {
                            var A;
                        }
                    );
                }




            } else {

                result.CustomerSet[0].groupLoanData = oCustomer.groupLoanData;
                result.CustomerSet[0].individualLoanData = oCustomer.individualLoanData;
                result.CustomerSet[0].generalLoanData = oCustomer.generalLoanData;
                /////::: El tipo de datos Customer deberia venir del diccionario
                this.dataDB.post(oDictionary.oTypes.Customer, result.CustomerSet[0]);

            }

        }.bind(this);


    };

    /**
     * [updateFlagEntitityInQueue :: Update value for IsEntityInQueue which will block ]
     *
     * @param  {[type]} _sLanRequestIdMD [description]
     * @param  {[type]} _bValue          [description]
     * @return {[type]}                  [description]
     */
    sap.ui.serialize.LoanRequest.prototype.updateFlagEntitityInQueue = function(_sLanRequestIdMD, _bValue) {

        return new Promise(function(resolve, reject) {

            var oDictionary = new sap.ui.helper.Dictionary();

            this.dataDB.getById(oDictionary.oTypes.LoanRequest, _sLanRequestIdMD)
                .then(
                    function(_bValue, results) {

                        ////////// Si encuentra el registro, actualizar, de lo contrario insertar
                        if (results.LoanRequestSet) {
                            if (results.LoanRequestSet.length > 0) { /// registro encontrado, actualizar


                                results.LoanRequestSet[0].IsEntityInQueue = _bValue;

                                this.dataDB.post(oDictionary.oTypes.LoanRequest, results.LoanRequestSet[0]).then(function(result) {

                                    resolve("OK");

                                }).catch(function(error) {
                                    console.log("Error al insertar la solicitud:" + error)
                                    resolve("Error " + error);
                                });



                            }
                        }

                    }.bind(this, _bValue)
                )
                .catch(
                    function(error) {
                        console.log("Error al consultar la solicitud para hacer update de IsEntityInQueue:" + error)
                        resolve("Error" + error);

                    }
                );

        }.bind(this));


    };

    sap.ui.serialize.LoanRequest.prototype.serialize = function(_oData) {
        return new Promise(function(resolve, reject) {
            var sId;

            var aPropertyEntitySets, i, aCustomersIdMD;
            aPropertyEntitySets = new Array();
            aCustomersIdMD = new Array();

            var oDictionary = new sap.ui.helper.Dictionary();

            /////// Iterar sobre customers y recuperar Id's
            for (i = 0; i < _oData.CustomerSet.length; i++) {
                /// Upsert Customers
                /// /////::: El tipo de datos Customer deberia venir del diccionario

                this.dataDB.getById(oDictionary.oTypes.Customer, _oData.CustomerSet[i].customerIdMD)
                    .then(
                        this.upsertCustomers(_oData.CustomerSet[i])
                    ).catch(function(error) {
                        var B;
                    });

                aCustomersIdMD.push(_oData.CustomerSet[i].customerIdMD);
            }

            /// Cambiar expand de Customers por arreglo de Id's
            _oData.CustomerSet = aCustomersIdMD;

            /// Guardar Solicitud

            _oData.id = _oData.loanRequestIdMD;


            //////// Para pruebas
            //        _oData.id = "this" + sap.ui.getCore().AppContext.iterador;
            //////// Para pruebas

            /////::: El tipo de datos LoanRequest deberia venir del diccionario

            this.dataDB.getById(oDictionary.oTypes.LoanRequest, _oData.id)
                .then(
                    function(_oData, results) {

                        ////////// Si encuentra el registro, actualizar, de lo contrario insertar

                        if (results.LoanRequestSet) {

                            if (results.LoanRequestSet.length > 0) { /// registro encontrado, actualizar revision

                                _oData.rev = results.LoanRequestSet[0].rev;

                            }

                        }

                        this.dataDB.post(oDictionary.oTypes.LoanRequest, _oData).then(function(resp) {
                            resolve(resp);

                        }).catch(function(error) {
                            reject(error)

                            var X;

                            console.log("Error al insertar la solicitud:" + error)

                        });



                    }.bind(this, _oData))

        }.bind(this));







    };



    sap.ui.serialize.LoanRequest.prototype.deSerialize = function(_sIdMD, _bIncludeResults, _bPrepareServiceCall) {
        var sId;
        var oDisplayBase;



        /////::: El tipo de datos LoanRequest deberia venir del diccionario
        var oDictionary = new sap.ui.helper.Dictionary();


        return this.dataDB.getById(oDictionary.oTypes.LoanRequest, _sIdMD)
            .then(function(result) {

                oDisplayBase = new sap.ui.mw.DisplayBase();

                var LoanRequestModelData;
                console.log("1");
                console.log(result);
                var i;


                if (result.CustomerSet && result.LoanRequestSet) {

                    if (result.LoanRequestSet.length > 0) {

                        for (i = 0; i < result.CustomerSet.length; i++) {

                            delete result.CustomerSet[i]["id"];
                            delete result.CustomerSet[i]["rev"];
                            delete result.CustomerSet[i]["IsEntityInQueue"];
                            delete result.CustomerSet[i]["bRegisterComesFromLoanRequest"];

                            if (result.CustomerSet[i].__metadata) {

                                result.CustomerSet[i].__metadata = "";
                                delete result.CustomerSet[i]["__metadata"];

                            }






                            result.CustomerSet[i].birthdate = oDisplayBase.retrieveJSONDate(result.CustomerSet[i].birthdate);
                            result.CustomerSet[i].registrationDate = oDisplayBase.retrieveJSONDate(result.CustomerSet[i].registrationDate);

                            if (_bPrepareServiceCall) {


                                //// Validaciones solicitud individual

                                if (result.CustomerSet[i].PhoneSet) {
                                    result.CustomerSet[i].PhoneSet = [];
                                }
                                if (result.CustomerSet[i].AddressSet) {
                                    result.CustomerSet[i].AddressSet = [];
                                }
                                if (result.CustomerSet[i].PersonalReferenceSet) {
                                    result.CustomerSet[i].PersonalReferenceSet = [];
                                }
                                if (result.CustomerSet[i].EmployerSet) {
                                    result.CustomerSet[i].EmployerSet = [];
                                }
                                if (result.CustomerSet[i].ImageSet) {
                                    result.CustomerSet[i].ImageSet = [];
                                }
                                if (result.CustomerSet[i].InsuranceSet) {
                                    delete result.CustomerSet[i]['InsuranceSet'];
                                }
                                if (result.CustomerSet[i].IsEntityInQueue) {
                                    delete result.CustomerSet[i]['IsEntityInQueue'];
                                }
                                delete result.CustomerSet[i]['registrationDate'];

                                //// Validaciones solicitud grupal

                                if (result.CustomerSet[i].spouse) {
                                    delete result.CustomerSet[i].spouse.__metadata;
                                }
                                if (result.CustomerSet[i].groupLoanData) {
                                    delete result.CustomerSet[i].groupLoanData.__metadata;
                                }
                                if (result.CustomerSet[i].individualLoanData) {
                                    delete result.CustomerSet[i].individualLoanData.__metadata;
                                }
                                if (result.CustomerSet[i].generalLoanData) {
                                    delete result.CustomerSet[i].generalLoanData.__metadata;
                                }


                                /// Eliminar propiedad isApplicantPouch

                                if (result.CustomerSet[i].isApplicantPouch) {
                                    delete result.CustomerSet[i]['isApplicantPouch'];
                                }
                            }


                        }

                        LoanRequestModelData = result.LoanRequestSet[0];

                        if (_bIncludeResults) {

                            LoanRequestModelData.CustomerSet.results = {};
                            LoanRequestModelData.CustomerSet.results = result.CustomerSet;

                        } else {

                            LoanRequestModelData.CustomerSet = result.CustomerSet;
                        }



                        delete LoanRequestModelData["id"];
                        delete LoanRequestModelData["rev"];
                        delete LoanRequestModelData["IsEntityInQueue"];


                        if (LoanRequestModelData.__metadata) {

                            LoanRequestModelData.__metadata = "";
                            delete LoanRequestModelData["__metadata"];

                        }


                        if (LoanRequestModelData.groupRequestData) {
                            if (LoanRequestModelData.groupRequestData.__metadata) {
                                LoanRequestModelData.groupRequestData.__metadata = "";
                                delete LoanRequestModelData.groupRequestData["__metadata"];
                            }

                            if (LoanRequestModelData.groupRequestData.groupMeetingPlace) {

                                if (LoanRequestModelData.groupRequestData.groupMeetingPlace.__metadata) {

                                    LoanRequestModelData.groupRequestData.groupMeetingPlace.__metadata = "";
                                    delete LoanRequestModelData.groupRequestData.groupMeetingPlace["__metadata"];
                                }
                            }

                        }


                        if (_bPrepareServiceCall) {

                            LoanRequestModelData.startDate = oDisplayBase.retrieveUTCDate(oDisplayBase.retrieveJSONDate(LoanRequestModelData.startDate));
                            LoanRequestModelData.firstPaymentDate = oDisplayBase.retrieveUTCDate(oDisplayBase.retrieveJSONDate(LoanRequestModelData.firstPaymentDate));
                            LoanRequestModelData.expenditureDate = oDisplayBase.retrieveUTCDate(oDisplayBase.retrieveJSONDate(LoanRequestModelData.expenditureDate));


                        } else {

                            LoanRequestModelData.startDate = oDisplayBase.retrieveJSONDate(LoanRequestModelData.startDate);
                            LoanRequestModelData.firstPaymentDate = oDisplayBase.retrieveJSONDate(LoanRequestModelData.firstPaymentDate);
                            LoanRequestModelData.expenditureDate = oDisplayBase.retrieveJSONDate(LoanRequestModelData.expenditureDate);

                        }



                        console.log(LoanRequestModelData);

                        return LoanRequestModelData;

                    }

                }

            });


    };
    sap.ui.serialize.LoanRequest.prototype.getMainModel = function(_oType, _oPromoterID, _dashBoardOpt) {
        var oDictionary, oLoanRequestDictionary, oParams, promisePouch, promiseOdata, oDataPrePouchArray;
        var oDataPouchArray, oDataKapselArray, oMergedArray, oDataModel, oDisplayBase, oDataCustomerArray;
        var promiseCustomers;

        jQuery.sap.require("js.helper.Dictionary");
        jQuery.sap.require("js.base.DisplayBase");
        oParams = {
            promoterID: _oPromoterID
        };
        oDataPouchArray = {};
        oMergedArray = {};
        oDataCustomerArray = {};

        oDictionary = new sap.ui.helper.Dictionary();
        oDataModel = new sap.ui.model.json.JSONModel();

        return new Promise(function(resolve, reject) {
            try {



                oLoanRequestDictionary = oDictionary.oDataRequest(oParams).getRequest(_oType);
                promisePouch = this.dataDB.get(oLoanRequestDictionary.pouch.name);
                promiseOdata = sap.ui.getCore().AppContext.myRest.read(oLoanRequestDictionary.odata.name + oLoanRequestDictionary.odata.get.expand, oLoanRequestDictionary.odata.get.filter, true);

                /////// Agregar para la lectura de Customers, si ya se borro el customer actual de PDB por notificaciÃ³n
                oLoanRequestDictionary = oDictionary.oDataRequest(oParams).getRequest("CustomerSet");
                promiseCustomers = sap.ui.getCore().AppContext.myRest.read(oLoanRequestDictionary.odata.name, oLoanRequestDictionary.odata.get.filter.customer, true);
                /////// Agregar para la lectura de Customers, si ya se borro el customer actual de PDB por notificaciÃ³n




                Promise.all([promisePouch, promiseOdata, promiseCustomers]).then(function(values) {

                    oDisplayBase = new sap.ui.mw.DisplayBase();


                    console.log(oDataPrePouchArray);
                    if (_dashBoardOpt == 2) { // viene de applicants
                        oDataKapselArray = values[1];
                        oDataPrePouchArray = values[0];
                        oDataCustomerArray = values[2];
                    }
                    if (_dashBoardOpt == 4) { // viene de seguros
                        /*oDataKapselArray = values[1];
                        oDataPrePouchArray = {
                            LoanRequestSet: []
                        };
                        oDataCustomerArray = values[2];*/

                        oDataKapselArray = values[1];
                        oDataPrePouchArray = values[0];
                        oDataCustomerArray = values[2];
                    }

                    var newPouchArray = {};
                    var oFinalKapsel = {};
                    //var oFinalKapsel = jQuery.extend({}, oDataKapselArray);
                    oFinalKapsel.results = [];

                    oDataPrePouchArray.LoanRequestSet.forEach(function(oLoanRequest) {
                        var currArray = [];


                        oLoanRequest.startDate = oDisplayBase.retrieveJSONDate(oLoanRequest.startDate);
                        oLoanRequest.firstPaymentDate = oDisplayBase.retrieveJSONDate(oLoanRequest.firstPaymentDate);
                        oLoanRequest.expenditureDate = oDisplayBase.retrieveJSONDate(oLoanRequest.expenditureDate);


                        if (oLoanRequest.CustomerSet) {

                            if (oLoanRequest.CustomerSet.length > 0) {

                                oLoanRequest.CustomerSet.forEach(function(oLoanRequestoCust) {


                                    if (oDataPrePouchArray.CustomerSet) {

                                        if (oDataPrePouchArray.CustomerSet.length > 0) {

                                            oDataPrePouchArray.CustomerSet.forEach(function(oCustomer) {
                                                if (oLoanRequestoCust === oCustomer.id) {
                                                    oCustomer.birthdate = oDisplayBase.retrieveJSONDate(oCustomer.birthdate);
                                                    oCustomer.registrationDate = oDisplayBase.retrieveJSONDate(oCustomer.registrationDate);
                                                    currArray.push(oCustomer)
                                                }
                                            });

                                        }

                                    }

                                });

                            }

                        }

                        if (currArray.length === 0) {
                            /////// Si no hay Customer, habra que buscarlo en Local Store :S
                            if (oDataCustomerArray.results) {
                                if (oDataCustomerArray.results.length > 0) {


                                    oLoanRequest.CustomerSet.forEach(function(oLoanRequestoCust) {

                                        oDataPrePouchArray.CustomerSet.forEach(function(oLocalStoreCustomer) {
                                            if (oLoanRequestoCust === oLocalStoreCustomer.id) {
                                                oLocalStoreCustomer.birthdate = oDisplayBase.retrieveJSONDate(oLocalStoreCustomer.birthdate);
                                                oLocalStoreCustomer.registrationDate = oDisplayBase.retrieveJSONDate(oLocalStoreCustomer.registrationDate);
                                                currArray.push(oLocalStoreCustomer)
                                            }
                                        });
                                    });
                                }
                            }

                        }

                        oLoanRequest.CustomerSet = {};
                        oLoanRequest.CustomerSet.results = currArray;

                        if (oLoanRequest.ElectronicSignatureSet) {
                            if ($.isArray(oLoanRequest.ElectronicSignatureSet)) {
                                var tmpArray = oLoanRequest.ElectronicSignatureSet;
                                oLoanRequest.ElectronicSignatureSet = {};
                                oLoanRequest.ElectronicSignatureSet.results = tmpArray;
                            }
                        }



                        //console.log(oLoanRequest);
                    });
                    //console.log(oDataPrePouchArray);
                    oDataPouchArray.results = oDataPrePouchArray["LoanRequestSet"];
                    console.log(oDataPouchArray);
                    console.log(oDataKapselArray);


                    //oFinalKapsel.results.concat(oDataKapselArray.results);
                    for (var j = 0; j < oDataKapselArray.results.length; j++) {
                        oDataKapselArray.results[j].startDate = oDisplayBase.retrieveJSONDate(oDataKapselArray.results[j].startDate);
                        oDataKapselArray.results[j].firstPaymentDate = oDisplayBase.retrieveJSONDate(oDataKapselArray.results[j].firstPaymentDate);
                        oDataKapselArray.results[j].expenditureDate = oDisplayBase.retrieveJSONDate(oDataKapselArray.results[j].expenditureDate);
                        oFinalKapsel.results.push(oDataKapselArray.results[j]);
                    }



                    for (var i = oDataKapselArray.results.length - 1; i >= 0; i--) {
                        oDataPouchArray.results.forEach(function(entry) {
                            if ((oDataKapselArray.results[i].loanRequestIdMD === entry.loanRequestIdMD))
                                oFinalKapsel.results.splice(i, 1);
                        });
                    }
                    oMergedArray.results = oFinalKapsel.results.concat(oDataPouchArray.results);

                    oDataModel.setData(oMergedArray);
                    console.log(oMergedArray);
                    resolve(oDataModel);

                }).catch(function(e) {
                    reject(e);
                });
            } catch (e) {
                reject(e);
            }

        }.bind(this));
    }

    sap.ui.serialize.LoanRequest.prototype.reviewCustomerLoanRelationship = function(resp) {
        var _self, counter;
        _self = this;

        return new Promise(function(resolve, reject) {
            try {
                if (resp.docs.length !== 0) {
                    counter = 0;
                    resp.docs.forEach(function(oCustomerLoanRelationship) {
                        console.log(oCustomerLoanRelationship)
                        var parseDoc = _self.dataDB.oDB.rel.parseDocID(oCustomerLoanRelationship._id);
                        console.log(parseDoc);
                        _self.dataDB.delete("CustomerLoanRelationship", parseDoc.id, oCustomerLoanRelationship._rev).then(function(msg) {
                            counter++;
                            console.log(msg);
                            if (resp.docs.length === counter) {
                                resolve(resp);

                            }


                        }).catch(function(error) {
                            console.log(error);
                        });



                        console.log(oCustomerLoanRelationship._id);

                    });

                } else {
                    resolve(resp);
                }

            } catch (ex) {
                reject(ex);
            }


        });



    }
    sap.ui.serialize.LoanRequest.prototype.relateCustomersToLoan = function(_loanRequestIdMD, _CustomerSetArray) {

        console.log(_loanRequestIdMD, _CustomerSetArray);
        var oDictionary, oIndexes, oFilters, _self;
        oDictionary = new sap.ui.helper.Dictionary();
        _self = this;

        oIndexes = ['data.loanRequestIdMD'];
        oFilters = {
            $and: [{
                    '_id': { $lte: 'CustomerLoanRelationship\uffff' }
                }, {
                    'data.loanRequestIdMD': { $eq: _loanRequestIdMD }
                }

            ]
        };
        this.dataDB.getByProperty(oIndexes, oFilters).then(function(resp) {
            console.log(resp);

            _self.reviewCustomerLoanRelationship(resp).then(function(resp) {
                _CustomerSetArray.forEach(function(oCustomer) {
                    var request = { loanRequestIdMD: _loanRequestIdMD, customerIdMD: oCustomer };

                    _self.dataDB.post(oDictionary.oTypes.CustomerLoanRelationship, request).then(function(data) {
                        console.log(data);
                    }).catch(function(error) {
                        console.log(error);
                    });

                });

            });


        }).catch(function(error) {
            console.log(error)

        });





        /* this.dataDB.getById(oDictionary.oTypes.CustomerLoanRelationship, _loanRequestIdMD)
           .then(function(resolve) {


             if(resp.docs.length===0){

             }

               if (resolve.LoanRequestSet.length === 0) { //Si no existe solo se inserta la relaciÃ³n



               } else {

               }

           }.bind(this)).catch(function(error) {});*/
    };

    sap.ui.serialize.LoanRequest.prototype.reviewGuaranteeLoanRelationship = function(resp) {
        var _self, counter;
        _self = this;

        return new Promise(function(resolve, reject) {
            try {
                if (resp.docs.length !== 0) {
                    counter = 0;
                    resp.docs.forEach(function(oGuaranteeLoanRelationship) {
                        console.log(oGuaranteeLoanRelationship)
                        var parseDoc = _self.dataDB.oDB.rel.parseDocID(oGuaranteeLoanRelationship._id);
                        console.log(parseDoc);
                        _self.dataDB.delete("GuaranteeLoanRelationship", parseDoc.id, oGuaranteeLoanRelationship._rev).then(function(msg) {
                            counter++;
                            console.log(msg);
                            if (resp.docs.length === counter) {
                                resolve(resp);

                            }


                        }).catch(function(error) {
                            console.log(error);
                        });



                        console.log(oGuaranteeLoanRelationship._id);

                    });

                } else {
                    resolve(resp);
                }

            } catch (ex) {
                reject(ex);
            }


        });



    };




    sap.ui.serialize.LoanRequest.prototype.relateGuaranteesToLoan = function(_loanRequestIdMD, _sIndividualLoanGuaranteeID) {

        //console.log(_loanRequestIdMD, _CustomerSetArray);
        var oDictionary, oIndexes, oFilters, _self;
        oDictionary = new sap.ui.helper.Dictionary();
        _self = this;

        oIndexes = ['data.loanRequestIdMD'];
        oFilters = {
            $and: [{
                    '_id': { $lte: 'GuaranteeLoanRelationship\uffff' }
                }, {
                    'data.loanRequestIdMD': { $eq: _loanRequestIdMD }
                }

            ]
        };
        this.dataDB.getByProperty(oIndexes, oFilters).then(function(resp) {
            console.log(resp);

            _self.reviewGuaranteeLoanRelationship(resp).then(function(resp) {


                var request = {

                    loanRequestIdMD: _loanRequestIdMD,
                    indLoanGuaranteeIdMD: _sIndividualLoanGuaranteeID

                };

                _self.dataDB.post(oDictionary.oTypes.GuaranteeLoanRelationship, request)
                    .then(function(data) {
                        console.log(data);
                    }).catch(function(error) {
                        console.log(error);
                    })

            });


        }).catch(function(error) {
            console.log(error)

        });

    };






})();
