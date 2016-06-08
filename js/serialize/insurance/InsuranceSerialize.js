(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.serialize.Insurance");
    jQuery.sap.require("sap.ui.base.Object");
    jQuery.sap.require("js.db.Pouch");
    jQuery.sap.require("js.helper.Dictionary");

    sap.ui.base.Object.extend('sap.ui.serialize.Insurance', {
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
     * [serialize Función que serializa un insurance en json a formato pouchdb]
     * @param  {[JSON]} _oInsurance [Solicitante en formato json]
     * @return {[NA]}            [NA]
     */
    sap.ui.serialize.Insurance.prototype.serialize = function(_oInsurance) {
        var oDictionary;
        return new Promise(function(resolve, reject) {

            oDictionary = new sap.ui.helper.Dictionary();
            _oInsurance.id = _oInsurance.insuranceIdMD;
            this.dataDB.getById(oDictionary.oTypes.Insurance, _oInsurance.id)
                .then(this.upsertInsurance(_oInsurance)).then(function(msg) {
                    resolve("OK")
                })
                .catch(function(error) {
                    reject(error);
                });

        }.bind(this));

    };
    /**
     * [upsertInsurance Validación del insurance en serialize, si existe lo actualiza, si no lo inserta]
     * @param  {[JSON]} _oInsurance  [Solicitante en formato json]
     * @return {[NA]}               [NA]
     */
    sap.ui.serialize.Insurance.prototype.upsertInsurance = function(_oInsurance) {
        var oDictionary = new sap.ui.helper.Dictionary();
        return function(_oInsuranceResult) {
            //Valida si ya existe el Insurance
            if (_oInsuranceResult.InsuranceSet.length === 0) {
                //No existe el Insurance
                this.dataDB.post(oDictionary.oTypes.Insurance, _oInsurance)
                    .then(function(msg) {
                        console.log(msg);
                    }).catch(function(error) {
                        console.log(error);
                    });
            } else {
                this.dataDB.update(oDictionary.oTypes.Insurance, _oInsuranceResult.InsuranceSet[0].id, _oInsurance).then(function(msg) {
                        console.log(msg);
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
            console.log(_oInsuranceResult);
        }.bind(this);
    };

    sap.ui.serialize.Insurance.prototype.deSerialize = function(_sIdMD, _bIncludeResults) {
        var sId;
        var oDisplayBase;
        var oDictionary = new sap.ui.helper.Dictionary();

        return this.dataDB.getById(oDictionary.oTypes.Insurance, _sIdMD)
            .then(function(result) {
                oDisplayBase = new sap.ui.mw.DisplayBase();
                var InsuranceModelData;
                console.log(result);
                var i;
                if (result.InsuranceSet) {
                    if (result.InsuranceSet.length > 0) {
                        for (i = 0; i < result.InsuranceSet.length; i++) {
                            delete result.InsuranceSet[i]['id'];
                            delete result.InsuranceSet[i]['rev'];
                            delete result.InsuranceSet[i]['aux'];
                            //result.InsuranceSet[i].birthdate = oDisplayBase.retrieveJSONDate(result.InsuranceSet[i].birthdate);
                            //result.InsuranceSet[i].registrationDate = oDisplayBase.retrieveJSONDate(result.InsuranceSet[i].registrationDate);
                        }
                        return result.InsuranceSet[0];
                    }
                }
            });
    };

    //Modelo CustomerSet con expand InsuranceSet
    sap.ui.serialize.Insurance.prototype.mergeModel = function(_oLoanRequestIdCRM, _oModel) {

        //InsuranceSet
        var oIndexes = ['data.loanRequestIdCRM'];
        var oFilters = {
            $and: [{
                '_id': { $lte: 'Insurance\uffff' }
            }, {
                'data.loanRequestIdCRM': { $eq: _oLoanRequestIdCRM }
            }]
        };

        return this.dataDB.getByProperty(oIndexes, oFilters)
            .then(function(response) {
                return (response);
            }).catch(function(e) {
                console.log(e);
            });
    };

})();
