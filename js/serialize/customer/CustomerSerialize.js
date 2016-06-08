(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.serialize.Customer");
    jQuery.sap.require("sap.ui.base.Object");
    jQuery.sap.require("js.db.Pouch");
    jQuery.sap.require("js.helper.Dictionary");
    jQuery.sap.require("js.base.DisplayBase");

    sap.ui.base.Object.extend('sap.ui.serialize.Customer', {
        constructor: function(_dataDB) {
            var oSchemaDB;


            jQuery.sap.require("js.helper.Schema");

            oSchemaDB = new sap.ui.helper.Schema();
            this.dataDB = new sap.ui.db.Pouch(_dataDB);
            this.dataDB.setSchema(oSchemaDB.getDataDBSchema());
            this.promoterID = "";
        }
    });
    /**
     * [setPromoterID SETTER para promoterID]
     * @param {[String]} _promoterID [setear el id del promotor actual]
     */
    sap.ui.serialize.Customer.prototype.setPromoterID = function(_promoterID) {
        this.promoterID = _promoterID;
    };
    /**
     * [getPromoterID GETTER par promoterID]
     * @return {[String]} [ID del promotor actual]
     */
    sap.ui.serialize.Customer.prototype.getPromoterID = function() {
        return this.promoterID;
    };
    /**
     * [getMainModel genera un modelo único de dos fuentes: pouchdb & odata]
     * @param  {[String]} _oType        [Colección deseada de tipo GET: CustomerSet, LoanRequest, etc.]
     * @return {[Promise]}  [Promise que contiene un Model obtenido del merge de dos fuentes]
     */
    sap.ui.serialize.Customer.prototype.getMainModel = function(_oType, _oPromoterID) {
        var promiseOdata, promisePouch, oParams, oCustomerDictionary, oDataPouchArray, oDataKapselArray, oMergedArray, oDataModel, oDictionary;
        var oFinalKapsel;

        oDictionary = new sap.ui.helper.Dictionary();
        return new Promise(function(resolve, reject) {
            try {
                oFinalKapsel = {};
                oFinalKapsel.results = [];
                oDataPouchArray = {};
                oMergedArray = {};
                this.setPromoterID(_oPromoterID); //Cambiar en su momento por el usuario en cuestión
                oParams = {
                    promoterID: this.getPromoterID()
                };
                oDataModel = new sap.ui.model.json.JSONModel();
                oCustomerDictionary = oDictionary.oDataRequest(oParams).getRequest(_oType);
                promisePouch = this.dataDB.get(oCustomerDictionary.pouch.name);

                promiseOdata = sap.ui.getCore().AppContext.myRest.read(oCustomerDictionary.odata.name, oCustomerDictionary.odata.get.filter.customer, true);
                Promise.all([promisePouch, promiseOdata]).then(function(values) {
                    oDataPouchArray.results = values[0].CustomerSet;
                    for (var i = 0; i < oDataPouchArray.results.length; i++) {

                        var currentPhoneSet = [];

                        oDataPouchArray.results[i].PhoneSet.forEach(function(entry) {
                            currentPhoneSet.push(entry);

                        });
                        oDataPouchArray.results[i].PhoneSet = { results: currentPhoneSet };
                        var currentAddressSet = [];
                        console.log(oDataPouchArray);
                        oDataPouchArray.results[i].AddressSet.forEach(function(entry) {
                            currentAddressSet.push(entry);

                        });
                        oDataPouchArray.results[i].AddressSet = { results: currentAddressSet };
                        console.log(oDataPouchArray);
                        var currentPersonalReferenceSet = [];
                        oDataPouchArray.results[i].PersonalReferenceSet.forEach(function(entry) {
                            currentPersonalReferenceSet.push(entry);

                        });
                        oDataPouchArray.results[i].PersonalReferenceSet = { results: currentPersonalReferenceSet };
                        var currentEmployerSet = [];
                        oDataPouchArray.results[i].EmployerSet.forEach(function(entry) {
                            currentEmployerSet.push(entry);

                        });
                        oDataPouchArray.results[i].EmployerSet = { results: currentEmployerSet };

                    }
                    oDataKapselArray = values[1];
                    for (var j = 0; j < oDataKapselArray.results.length; j++) {
                        oFinalKapsel.results.push(oDataKapselArray.results[j]);
                    }
                    for (var i = oDataKapselArray.results.length - 1; i >= 0; i--) {
                        oDataPouchArray.results.forEach(function(entry) {
                            if ((oDataKapselArray.results[i].customerIdMD === entry.customerIdMD))
                                oFinalKapsel.results.splice(i, 1);
                        });
                    }
                    oMergedArray.results = oFinalKapsel.results.concat(oDataPouchArray.results);
					var oMergedArraySort=_.sortBy(oMergedArray.results, 'lastName');
					oMergedArray.results=oMergedArraySort;
                    oDataModel.setData(oMergedArray);
                    resolve(oDataModel);
                });
            } catch (e) {
                reject(e);
            }

        }.bind(this));
    };

    sap.ui.serialize.Customer.prototype.deleteCustomerLoanRelationship = function(_customerIdMD) {

        this.verifyCustomerLoanRelationShip(_customerIdMD).then(
            function(result){

                var BreakPointHere;
                BreakPointHere = "OK";

                if( result.docs ){
                    if( result.docs.length > 0 ){

                        var parsedID = this.dataDB.oDB.rel.parseDocID(result.docs[0]._id);
                        this.dataDB.delete("CustomerLoanRelationship", parsedID.id, result.docs[0]._rev);
                    }

                }
            }.bind(this)
        ).catch(function(error){
            console.log("Error al borrar CustomerLoanRelationship " + error);
        });


    },


    sap.ui.serialize.Customer.prototype.verifyCustomerLoanRelationShip = function(_customerIdMD) {
        var oIndexes, oFilters;
        oIndexes = ['data.customerIdMD'];
        oFilters = {
            $and: [{
                '_id': { $lte: 'CustomerLoanRelationship\uffff' }
            }, {
                'data.customerIdMD': { $eq: _customerIdMD }
            }]
        };
        return new Promise(function(resolve, reject) {


            this.dataDB.getByProperty(oIndexes, oFilters).then(function(msg) {
                resolve(msg);
            }).catch(function(error) {
                reject(error);

            });

        }.bind(this));
    };

    sap.ui.serialize.Customer.prototype.reviewMergedArray = function(_oMergedArray) {
        var counter, oCustomerLoanArray, _self;
        counter = 0;
        oCustomerLoanArray = [];
        _self = this;


        return new Promise(function(resolve, reject) {
            try {

                if (_oMergedArray.results.length > 0) {

                    _oMergedArray.results.forEach(function(entry) {


                        _self.verifyCustomerLoanRelationShip(entry.customerIdMD).then(function(msg) {
                            counter++;
                            console.log(msg);
                            if (msg.docs.length > 0) {
                                oCustomerLoanArray.push(entry);
                                console.log(oCustomerLoanArray);
                            }

                            if (_oMergedArray.results.length === counter) {
                                resolve(oCustomerLoanArray);

                            }


                        });





                    });

                } else {
                    resolve(oCustomerLoanArray);

                }

            } catch (ex) {
                console.log(ex);
                reject(ex);
            }






        });


    };
    /**
     * [getMainModelWithOutLoan Lista de solicitantes sin oportunidad asignada]
     * @param  {[String]} _oType       [description]
     * @param  {[String]} _oPromoterID [description]
     * @param  {[String]} _oProductID  [description]
     * @return {[Promise]}             [Promesa con el modelo combinado de las dos fuentes]
     */
    sap.ui.serialize.Customer.prototype.getMainModelWithOutLoan = function(_oType, _oPromoterID, _oProductID) {
            var promiseOdata, promisePouch, oParams, oCustomerDictionary, oDataPouchArray, oDataKapselArray, oMergedArray, oDataModel, oDictionary, _self;
            _self = this;

            oDictionary = new sap.ui.helper.Dictionary();
            return new Promise(function(resolve, reject) {
                try {
                    oDataPouchArray = {};
                    oMergedArray = {};
                    _self.setPromoterID(_oPromoterID); //Cambiar en su momento por el usuario en cuestión
                    oParams = {
                        promoterID: _self.getPromoterID(),
                        productID: _oProductID
                    };
                    oDataModel = new sap.ui.model.json.JSONModel();
                    oCustomerDictionary = oDictionary.oDataRequest(oParams).getRequest(_oType);
                    promisePouch = _self.dataDB.get(oCustomerDictionary.pouch.name);
                    promiseOdata = sap.ui.getCore().AppContext.myRest.read("/" + oCustomerDictionary.odata.name, oCustomerDictionary.odata.get.filter.loanRequest, true);
                    Promise.all([promisePouch, promiseOdata]).then(function(values) {
                        oDataPouchArray.results = values[0].CustomerSet;
                        oDataPouchArray.results = _.where(oDataPouchArray.results, { productId: _oProductID, loanRequestIdCRM: "0", statusId: "E0006", IsEntityInQueue: true });
                        for (var i = 0; i < oDataPouchArray.results.length; i++) {

                            var currentPhoneSet = [];

                            oDataPouchArray.results[i].PhoneSet.forEach(function(entry) {
                                currentPhoneSet.push(entry)

                            });
                            oDataPouchArray.results[i].PhoneSet = { results: currentPhoneSet };
                            var currentAddressSet = [];
                            console.log(oDataPouchArray);
                            oDataPouchArray.results[i].AddressSet.forEach(function(entry) {
                                currentAddressSet.push(entry)

                            });
                            oDataPouchArray.results[i].AddressSet = { results: currentAddressSet };
                            console.log(oDataPouchArray);
                            var currentPersonalReferenceSet = [];
                            oDataPouchArray.results[i].PersonalReferenceSet.forEach(function(entry) {
                                currentPersonalReferenceSet.push(entry)

                            });
                            oDataPouchArray.results[i].PersonalReferenceSet = { results: currentPersonalReferenceSet }
                            var currentEmployerSet = [];
                            oDataPouchArray.results[i].EmployerSet.forEach(function(entry) {
                                currentEmployerSet.push(entry);

                            });
                            oDataPouchArray.results[i].EmployerSet = { results: currentEmployerSet }

                        };
                        oDataKapselArray = values[1];
                        for (var i = 0; i < oDataKapselArray.results.length; i++) {
                            oDataPouchArray.results.forEach(function(entry) {
                                if (i < oDataKapselArray.results.length) {
                                    if (oDataKapselArray.results[i].customerIdMD === entry.customerIdMD)
                                        oDataKapselArray.results.splice(i, 1);
                                }
                            });
                        }
                        oMergedArray.results = oDataKapselArray.results.concat(oDataPouchArray.results);
                        _self.reviewMergedArray(oMergedArray).then(function(array) {
                            for (var i = 0; i < oMergedArray.results.length; i++) {
                                array.forEach(function(entry) {
                                    if (oMergedArray.results[i].customerIdMD === entry.customerIdMD) {
                                        oMergedArray.results.splice(i, 1);
                                    }
                                });
                            }
                            oDataModel.setData(oMergedArray);
                            resolve(oDataModel);
                        }).catch(function(error) { console.log(error); })

                    });
                } catch (e) {
                    reject(e);
                }

            });



        }
        /**
         * [serialize Función que serializa un customer en json a formato pouchdb]
         * @param  {[JSON]} _oCustomer [Solicitante en formato json]
         * @return {[NA]}            [NA]
         */
    sap.ui.serialize.Customer.prototype.serialize = function(_oCustomer) {
        var oDictionary, oDisplayBase,self;
        self = this;

        return new Promise(function(resolve, reject) {
            
            oDictionary = new sap.ui.helper.Dictionary();
            oDisplayBase = new sap.ui.mw.DisplayBase();
            _oCustomer.id = _oCustomer.customerIdMD;
            _oCustomer.birthdate = oDisplayBase.formatJSONDate(_oCustomer.birthdate);
            this.dataDB.getById(oDictionary.oTypes.Customer, _oCustomer.id)
                .then(function(_oCustomerResult) {

                    self.upsertCustomer(_oCustomer, _oCustomerResult).then(function(resp) {
                        console.log(resp);
                        resolve("UPSERTCUSTOMER OK");
                    }).catch(function(error) {
                        reject(error);
                    });

                })
                .catch(function(error) {
                    reject(error);
                });

        }.bind(this));


    };

    /**
     * [upsertCustomer Validación del solicitante en serialize, si existe lo actualiza, si no lo inserta]
     * @param  {[JSON]} _oCustomer  [Solicitante en formato json]
     * @return {[NA]}               [NA]
     */
    sap.ui.serialize.Customer.prototype.upsertCustomer = function(_oCustomer,_oCustomerResult) {

        var oDictionary,self;
        oDictionary = new sap.ui.helper.Dictionary();
        self=this;

        return new Promise(function(resolve, reject) {

            if (_oCustomerResult.CustomerSet.length === 0) {
                //No existe el customer
                self.dataDB.post(oDictionary.oTypes.Customer, _oCustomer)
                    .then(function(msg) {
                        resolve("POUCH POST");
                    }).catch(function(error) {
                        reject(error);

                    });

            } else {

                ////// Si ya existia el registro asegurarse de eliminar el atributo bRegisterComesFromLoanRequest
                ///bRegisterComesFromLoanRequest

                delete _oCustomer["bRegisterComesFromLoanRequest"];

                self.dataDB.update(oDictionary.oTypes.Customer, _oCustomerResult.CustomerSet[0].id, _oCustomer).then(function(msg) {
                        console.log(msg);
                        resolve("POUCH UPDATE");
                    })
                    .catch(function(error) {
                        console.log(error);
                        reject(error);
                    });

            }

        });
        console.log(_oCustomer);
        
        /*return function(_oCustomerResult) {
            //Valida si ya existe el customer
            if (_oCustomerResult.CustomerSet.length === 0) {
                //No existe el customer
                this.dataDB.post(oDictionary.oTypes.Customer, _oCustomer)
                    .then(function(msg) {
                        console.log(msg);
                    }).catch(function(error) {
                        console.log(error);

                    });

            } else {

                ////// Si ya existia el registro asegurarse de eliminar el atributo bRegisterComesFromLoanRequest
                ///bRegisterComesFromLoanRequest

                delete _oCustomer["bRegisterComesFromLoanRequest"];

                this.dataDB.update(oDictionary.oTypes.Customer, _oCustomerResult.CustomerSet[0].id, _oCustomer).then(function(msg) {
                        console.log(msg);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });

            }
            console.log(_oCustomerResult);

        }.bind(this);*/

    };
    /**
     * [updateFlagEntitityInQueue Actualización del campo IsEntityInQueue a true en algún Customer]
     * @param  {[JSON]} _sCustomerID    [Solicitante en formato json]
     * @return {[NA]}                   [NA]
     */
    sap.ui.serialize.Customer.prototype.updateFlagEntitityInQueue = function(_sCustomerID, _bValue) {
        return new Promise(function(resolve, reject) {
            var oDictionary = new sap.ui.helper.Dictionary();

            this.dataDB.getById(oDictionary.oTypes.Customer, _sCustomerID)
                .then(
                    function(results) {
                        if (results.CustomerSet) {
                            if (results.CustomerSet.length > 0) {
                                results.CustomerSet[0].IsEntityInQueue = _bValue;

                                this.dataDB.update(oDictionary.oTypes.Customer, results.CustomerSet[0].id, results.CustomerSet[0]).then(function(msg) {
                                        console.log(msg);
                                        resolve("OK");
                                    })
                                    .catch(function(error) {
                                        console.log(error);
                                        resolve("Error en updateFlagEntitityInQueue: " + error);
                                    });
                            }
                        }

                    }.bind(this)
                ).catch(
                    function(error) {
                        console.log("Error al consultar la solicitud para hacer update de IsEntityInQueue:" + error);

                    }
                );


        }.bind(this));
    };

    sap.ui.serialize.Customer.prototype.deSerialize = function(_sIdMD, _bIncludeResults) {
        var sId;
        var oDisplayBase;



        /////::: El tipo de datos Customer deberia venir del diccionario
        var oDictionary = new sap.ui.helper.Dictionary();


        return this.dataDB.getById(oDictionary.oTypes.Customer, _sIdMD)
            .then(function(result) {

                var oDisplayBase = new sap.ui.mw.DisplayBase();
                var CustomerModelData = {};
                var i;

                //console.log("(A):");
                //console.log(result);

                if (result.CustomerSet) {

                    if (result.CustomerSet.length > 0) {
                        //elimina identificador y revisión
                        for (i = 0; i < result.CustomerSet.length; i++) {
                            delete result.CustomerSet[i]['id'];
                            delete result.CustomerSet[i]['rev'];
                            delete result.CustomerSet[i]['rev'];
                            //delete result.CustomerSet["IsEntityInQueue"];

                            //se modifica el formato de la fecha de nacimiento y de registro
                            result.CustomerSet[i].birthdate = oDisplayBase.retrieveJSONDate(result.CustomerSet[i].birthdate);
                            result.CustomerSet[i].registrationDate = oDisplayBase.retrieveJSONDate(result.CustomerSet[i].registrationDate);
                            //Se borran dueDate en ImageSet
                            for(var j = 0; j < result.CustomerSet[i].ImageSet.length; j++){
                                delete result.CustomerSet[i].ImageSet[j]["dueDate"];
                            }
                            if(result.CustomerSet[i].isApplicantPouch){
                                delete result.CustomerSet[i].isApplicantPouch;
                            }
                        }


                        /* if (_bIncludeResults) {
                             //CustomerModelData.results = [];
                             //CustomerModelData.results.push(result.CustomerSet[0]);
                          
                         } else {
                             //CustomerModelData.CustomerSet = result.CustomerSet[0];
                             console.log("(B) CustomerModelData:");
                             console.log(CustomerModelData);
                         }*/
                        console.log("CustomerSet:");
                        console.log(result.CustomerSet[0]);
                        return result.CustomerSet[0];
                    }

                }

            });


    };


})();
