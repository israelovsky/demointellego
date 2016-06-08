(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.Rest");
    jQuery.sap.require("sap.ui.base.Object");

    sap.ui.base.Object.extend('sap.ui.mw.Rest', {
        constructor: function(_sServiceUrl, _bJson, _sAuth, _sAppCID, _bUseMockServer) {

            var oMyOdataModel;

            this.sServiceUrl = _sServiceUrl;
            this.bJson = _bJson;


            this.sAuth = _sAuth;
            this.sAppCID = _sAppCID;

            if (_bUseMockServer) {
                this.sServiceUrl = "/mock/"
                this.createMockServer();
                console.log("******** MockServer enabled *******");
            }

            var oHeaders = {};
            oHeaders['Authorization'] = _sAuth;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === true) {
                this.user = sap.ui.getCore().AppContext.applicationContext.registrationContext.user;
                this.pass = sap.ui.getCore().AppContext.applicationContext.registrationContext.password;
                oHeaders['X-SMP-APPCID'] = sap.ui.getCore().AppContext.applicationContext.applicationConnectionId;

            }



            oMyOdataModel = new sap.ui.model.odata.ODataModel(this.sServiceUrl, this.bJson, this.user, this.pass, oHeaders);

            oMyOdataModel.attachRequestSent(function(oEvent) {
                console.log("inicia");
            });
            oMyOdataModel.attachRequestCompleted(function(oEvent) {
                console.log("finaliza");
            });

            console.log(oMyOdataModel);

            oMyOdataModel.forceNoCache(true);
            this.oDataModel = oMyOdataModel;

        }

    });

    sap.ui.mw.Rest.prototype.setsServiceUrl = function(sServiceUrl) {
        this.sServiceUrl = sServiceUrl;
    };

    sap.ui.mw.Rest.prototype.getsServiceUrl = function() {
        return this.sServiceUrl;
    };
    sap.ui.mw.Rest.prototype.setbJson = function(bJson) {
        this.bJson = bJson;
    };
    sap.ui.mw.Rest.prototype.getbJson = function() {
        return this.bJson;
    };
    sap.ui.mw.Rest.prototype.setsAuth = function(sAuth) {
        this.sAuth = sAuth;
    };
    sap.ui.mw.Rest.prototype.getsAuth = function() {
        return this.sAuth;
    };
    sap.ui.mw.Rest.prototype.setsAppCID = function(sAppCID) {
        this.sAppCID = sAppCID;
    };
    sap.ui.mw.Rest.prototype.getsAppCID = function() {
        return this.sAppCID;
    };
    sap.ui.mw.Rest.prototype.setoDataModel = function(oDataModel) {
        this.oDataModel = oDataModel;
    };
    sap.ui.mw.Rest.prototype.getoDataModel = function(oDataModel) {
        return this.oDataModel;
    };
    sap.ui.mw.Rest.prototype.setoBase64 = function(oBase64) {
        this.oBase64 = oBase64;
    };
    sap.ui.mw.Rest.prototype.getoBase64 = function(oBase64) {
        return this.oBase64;
    };

    sap.ui.mw.Rest.prototype.createMockServer = function() {

        var oMockServer;

        jQuery.sap.require("sap.ui.core.util.MockServer");
        oMockServer = new sap.ui.core.util.MockServer({
            rootUri: this.sServiceUrl //"/mock/"
        });

        sap.ui.core.util.MockServer.config({
            autoRespondAfter: 0,
            autoRespond: true
        });
        oMockServer.simulate("model/metadata.xml", "model/");
        oMockServer.start();

    };

    /**
     * [refreshCredentials Actualiza petición al oData]
     * @return {[type]} [NA]
     */
    sap.ui.mw.Rest.prototype.refreshCredentials = function() {
        this.model.refreshSecurityToken(function() {
            alert("success");
        }, function() {
            alert("error");
        }, true);
    };
    /**
     * [create crea una nueva petición al oData de tipo POST]
     * @param  {[string]} _sPath                 [colleción oData]
     * @param  {[JSON Array]} _oData             [datos JSON de lo que se insertará]
     * @param  {[boolean]} _bIsAsynchronous      [define si es asincrono o no el odata]
     * @param  {[string]} _sId                   [id del modelo]
     * @return {[sap.ui.model.json.JSONModel]}  [retorno del modelo con los datos recolectados del oData]
     */
    sap.ui.mw.Rest.prototype.create = function(_sPath, _oData, _bIsAsynchronous) {
        var currentClass;
        currentClass = this;

        return new Promise(function(resolve, reject) {
            try {
                currentClass.oDataModel.refresh(true, false);
                currentClass.oDataModel.create(
                    _sPath,
                    _oData,
                    null,
                    function(oData, oResponse) {
                        console.log("oData");
                        console.log(oData);
                        console.log("oResponse");
                        console.log(oResponse);
                        resolve(oResponse);
                    },
                    function(error) {
                        console.log(error);
                        if (error.response && error.response.statusCode == 403) { //Forbidden = Expiró el CSRF Token
                            console.log("create - Renovando el CSRF Token");
                            //return new Promise(function(resolve, reject) {
                            var promiseRefresh = currentClass.refreshSession();

                            promiseRefresh.then(function(response) {
                                try {

                                    currentClass.oDataModel.create(
                                        _sPath,
                                        _oData,
                                        null,
                                        function(oData, oResponse) {
                                            console.log("oData");
                                            console.log(oData);
                                            console.log("oResponse");
                                            console.log(oResponse);
                                            resolve(oResponse);
                                        },
                                        function(err) {
                                            console.log(err);
                                            if (err.response) {
                                                reject(err.response.body);
                                            } else {
                                                reject(err);
                                            }
                                        },
                                        _bIsAsynchronous);

                                } catch (secondSendingError) {
                                    console.log("Error al intentar el envio por 2nda ocasión: " + secondSendingError);
                                    reject(secondSendingError);
                                }


                            }).catch(function(error) {
                                console.log("No fue posible completar el refresh de CSRF token: " + error);
                                reject(error);
                            });
                            //});
                        } else {
                            if (error.response) {
                                reject(error.response.body);
                            } else {
                                reject(error);
                            }
                        }
                    },
                    _bIsAsynchronous
                );
            } catch (ex) {
                console.log(ex);
                reject(ex);
            }
        });
    };
    /**
     * [read Lectura de servicio oData]
     * @param  {[string]} _sPath                 [Identity o IdentitySet oData. Ej: /WarehouseCollection]
     * @param  {[string]} _filters              [filtros aplicados al servicio de oData. Ej: "$filter=warehouseId eq '300'" ]
     * @param  {[boolean]} _bIsAsynchronous      [true para asincrono, false para sincrono]
     * @param  {[string]} _sId                   [Asignaciónd el Id al modelo retornado]
     * @return {[sap.ui.model.json.JSONModel]}  [Retorno del modelo Creado]
     */
    sap.ui.mw.Rest.prototype.read = function(_sPath, _filters, _bIsAsynchronous) {
        var oModel,
            currentClass;
        var oFilters;
        currentClass = this;
        if (_filters == "") {
            oFilters = "";
        } else {
            oFilters = [_filters];
        }
        return new Promise(function(resolve, reject) {
            try {
                currentClass.oDataModel.refreshMetadata();
                currentClass.oDataModel.refresh(true, false);

                currentClass.oDataModel.read(
                    _sPath,
                    null, oFilters,
                    _bIsAsynchronous,
                    function(oData, response) {
                        console.log(oData);
                        console.log(response);
                        resolve(oData);
                    },
                    function(error) {
                        console.log(error);
                        if (error.response && error.response.statusCode == 401) { //Unauthorized = Cambió la contraseña en GW
                            var promiseNewPassword = currentClass.captureNewPassword();
                            promiseNewPassword.then(function(response) {
                                currentClass.oDataModel.read(
                                    _sPath,
                                    null, oFilters,
                                    _bIsAsynchronous,
                                    function(oData, response) {
                                        console.log(oData);
                                        console.log(response);
                                        resolve(oData);
                                    },
                                    function(err) {
                                        console.log(err);
                                        if (err.response) {
                                            reject(err.response.body);
                                        } else {
                                            reject(err);
                                        }
                                    });
                            });
                        } else {
                            if (error.response) {
                                if (error.response.statusCode === 0 || error.response.statusCode === 503 || error.response.statusCode === 404) {
                                    reject(error.response.statusCode);
                                } else {
                                    reject(error.response.body);
                                }

                            } else {
                                reject(error);
                            }
                        }
                    });

            } catch (ex) {
                console.log(ex);
                reject(ex);
            }
        });
    };

    sap.ui.mw.Rest.prototype.update = function(_sPath, _oData, _bIsAsynchronous) {
        var currentClass;
        currentClass = this;

        return new Promise(function(resolve, reject) {
            try {
                currentClass.oDataModel.refresh(true, false);
                currentClass.oDataModel.update(
                    _sPath,
                    _oData,
                    null,
                    function(oData, oResponse) {
                        console.log("oData");
                        console.log(oData);
                        console.log("oResponse");
                        console.log(oResponse);
                        resolve(oResponse);
                    },
                    function(error) {
                        console.log(error);
                        if (error.response && error.response.statusCode == 403) { //Forbidden = Expiró el CSRF Token
                            console.log("update - Renovando el CSRF Token");
                            //return new Promise(function(resolve, reject) {
                            var promiseRefresh = currentClass.refreshSession();
                            promiseRefresh.then(function(response) {
                                currentClass.oDataModel.update(
                                    _sPath,
                                    _oData,
                                    null,
                                    function(oData, oResponse) {
                                        console.log("oData");
                                        console.log(oData);
                                        console.log("oResponse");
                                        console.log(oResponse);
                                        resolve(oResponse);
                                    },
                                    function(err) {
                                        console.log(err);
                                        if (err.response) {
                                            reject(err.response.body);
                                        } else {
                                            reject(err);
                                        }
                                    },
                                    _bIsAsynchronous);
                            });
                            //});
                        } else {
                            if (error.response) {
                                reject(error.response.body);
                            } else {
                                reject(error);
                            }
                        }
                    },
                    _bIsAsynchronous
                );
            } catch (ex) {
                console.log(ex);
                reject(ex);
            }
        });
    };

    /**
     * [remove No se ha implementado en el proyecto]
     * @return {[type]} [NA]
     */
    sap.ui.mw.Rest.prototype.remove = function() {};

    /*
    Retrieves pouch db structure from current model
     */
    sap.ui.mw.Rest.prototype.retrievePouchStructure = function() {

        //////// Get current model metadata
        var oMetadata,
            oEntitySets,
            oEntidadesPouch;

        oMetadata = this.oDataModel.getMetaModel().oMetadata.sMetadataBody;
        oEntitySets = this.findEntitySets(oMetadata);
        oEntidadesPouch = this.processSchemaPouchDB(oEntitySets);

        return oEntidadesPouch;

    };

    sap.ui.mw.Rest.prototype.processSchemaPouchDB = function(_oEntitySets) {

            var oEntitySets,
                oEntidadesPouch,
                oEntidadesPouchTemporal,
                oRelations;

            oEntitySets = _oEntitySets;
            oEntidadesPouch = new Array();
            oEntidadesPouchTemporal = {};
            oRelations = {};

            jQuery.each(oEntitySets, function(sEntitySetName, entitySetValue) {

                var oEntidadPouch,
                    oRelations,
                    bHasRelations;

                oEntidadPouch = {};
                oRelations = {};
                bHasRelations = false;

                oEntidadPouch.singular = entitySetValue.type;
                oEntidadPouch.plural = sEntitySetName;

                jQuery.each(entitySetValue.navprops, function(oNavName, oNavValue) {

                    bHasRelations = true;

                    if (oNavValue.from.entitySet === sEntitySetName) { /// Relationship comes from current

                        ///////// Add to primary oRelationships
                        var ObjectNameTO,
                            ObjectNameFROM;
                        ObjectNameTO = oNavValue.to.entitySet;

                        this[ObjectNameTO] = {};

                        if (oNavValue.to.multiplicity == "1") { /// to One
                            this[ObjectNameTO].belongsTo = oNavValue.to.entitySet.replace("Set", "");
                        } else { //// to Many
                            this[ObjectNameTO].hasMany = oNavValue.to.entitySet.replace("Set", "");;
                        }

                        ///////// Add to particular entitySet
                        ObjectNameFROM = oNavValue.from.entitySet;

                        this[ObjectNameFROM] = {};

                        if (oNavValue.from.multiplicity == "1") { /// to One
                            this[ObjectNameFROM].belongsTo = oNavValue.from.entitySet.replace("Set", "");
                        } else { //// to Many
                            this[ObjectNameFROM].hasMany = oNavValue.from.entitySet.replace("Set", "");
                        }

                        if (oEntidadesPouchTemporal[ObjectNameTO]) { //// Si ya existe la entidad

                            if (oEntidadesPouchTemporal[ObjectNameTO].oRelations) {

                                oEntidadesPouchTemporal[ObjectNameTO].oRelations[ObjectNameFROM] = this[ObjectNameFROM];

                            } else {

                                oEntidadesPouchTemporal[ObjectNameTO].oRelations = {};
                                oEntidadesPouchTemporal[ObjectNameTO].oRelations[ObjectNameFROM] = this[ObjectNameFROM];
                            }

                        } else {

                            oEntidadesPouchTemporal[ObjectNameTO] = {
                                singular: ObjectNameTO.replace("Set", ""),
                                plural: ObjectNameTO,
                                oRelations: {}
                            };
                            oEntidadesPouchTemporal[ObjectNameTO].oRelations[ObjectNameFROM] = this[ObjectNameFROM];

                        }

                        if (oEntidadesPouchTemporal[ObjectNameFROM]) { //// Si ya existe la entidad

                            if (oEntidadesPouchTemporal[ObjectNameFROM].oRelations) {

                                oEntidadesPouchTemporal[ObjectNameFROM].oRelations[ObjectNameTO] = this[ObjectNameTO];

                            } else {

                                oEntidadesPouchTemporal[ObjectNameFROM].oRelations = {};
                                oEntidadesPouchTemporal[ObjectNameFROM].oRelations[ObjectNameTO] = this[ObjectNameTO];
                            }

                        } else {

                            oEntidadesPouchTemporal[ObjectNameFROM] = {
                                singular: ObjectNameFROM.replace("Set", ""),
                                plural: ObjectNameFROM,
                                oRelations: {}
                            };
                            oEntidadesPouchTemporal[ObjectNameFROM].oRelations[ObjectNameTO] = this[ObjectNameTO];

                        }

                    }

                });

            });

            jQuery.each(oEntidadesPouchTemporal, function(sEntitySetName, entitySetValue) {

                oEntidadesPouch.push(entitySetValue);

            });

            return oEntidadesPouch;

        },

        sap.ui.mw.Rest.prototype.findEntitySets = function(oMetadata) {

            // here we need to analyse the EDMX and identify the entity sets

            var mEntitySets,
                oPrincipals,
                oDependents;

            mEntitySets = {};
            oPrincipals = jQuery(oMetadata).find("Principal");
            oDependents = jQuery(oMetadata).find("Dependent");

            jQuery(oMetadata).find("EntitySet").each(function(iIndex, oEntitySet) {
                var aEntityTypeParts;
                var $EntitySet = jQuery(oEntitySet);
                // split the namespace and the name of the entity type (namespace could have dots inside)
                aEntityTypeParts = /((.*)\.)?(.*)/.exec($EntitySet.attr("EntityType"));
                mEntitySets[$EntitySet.attr("Name")] = {
                    "name": $EntitySet.attr("Name"),
                    "schema": aEntityTypeParts[2],
                    "type": aEntityTypeParts[3],
                    "keys": [],
                    "keysType": {},
                    "navprops": {}
                };
            });

            // helper function to find the entity set and property reference
            // for the given role name
            var fnResolveNavProp = function(sRole, bFrom) {

                var aRoleEnd,
                    sEntitySet,
                    sMultiplicity,
                    aPropRef,
                    oPrinDeps;

                aRoleEnd = jQuery(oMetadata).find("End[Role=" + sRole + "]");

                jQuery.each(aRoleEnd, function(i, oValue) {
                    if (!!jQuery(oValue).attr("EntitySet")) {
                        sEntitySet = jQuery(oValue).attr("EntitySet");
                    } else {
                        sMultiplicity = jQuery(oValue).attr("Multiplicity");
                    }
                });
                aPropRef = [];
                oPrinDeps = (bFrom) ? oPrincipals : oDependents;
                jQuery(oPrinDeps).each(function(iIndex, oPrinDep) {
                    if (sRole === (jQuery(oPrinDep).attr("Role"))) {
                        jQuery(oPrinDep).children("PropertyRef").each(function(iIndex, oPropRef) {
                            aPropRef.push(jQuery(oPropRef).attr("Name"));
                        });
                        return false;
                    }
                });
                return {
                    "role": sRole,
                    "entitySet": sEntitySet,
                    "propRef": aPropRef,
                    "multiplicity": sMultiplicity
                };
            };

            // find the keys and the navigation properties of the entity types
            jQuery.each(mEntitySets, function(sEntitySetName, oEntitySet) {
                // find the keys
                var aKeys,
                    aNavProps;
                var $EntityType = jQuery(oMetadata).find("EntityType[Name=" + oEntitySet.type + "]");
                aKeys = jQuery($EntityType).find("PropertyRef");
                jQuery.each(aKeys, function(iIndex, oPropRef) {
                    var sKeyName;
                    sKeyName = jQuery(oPropRef).attr("Name");
                    oEntitySet.keys.push(sKeyName);
                    oEntitySet.keysType[sKeyName] = jQuery($EntityType).find("Property[Name='" + sKeyName + "']").attr("Type");
                });
                // resolve the navigation properties
                aNavProps = jQuery(oMetadata).find("EntityType[Name='" + oEntitySet.type + "'] NavigationProperty");
                jQuery.each(aNavProps, function(iIndex, oNavProp) {
                    var $NavProp = jQuery(oNavProp);
                    oEntitySet.navprops[$NavProp.attr("Name")] = {
                        "name": $NavProp.attr("Name"),
                        "from": fnResolveNavProp($NavProp.attr("FromRole"), true),
                        "to": fnResolveNavProp($NavProp.attr("ToRole"), false)
                    };
                });
            });

            // return the entity sets
            return mEntitySets;

        },
        /*
        Retrieves pouch db structure from current model
         */
        sap.ui.mw.Rest.prototype.refreshSession = function() {
            var currentClass;
            currentClass = this;
            try {
                return new Promise(function(resolve, reject) {
                    try {

                        currentClass.oDataModel.refreshSecurityToken(function() {
                            resolve("OK");
                        }, function(err) {
                            reject(err);
                        }, false);

                    } catch (err) {
                        reject(err);
                        console.log(err);
                    }
                });
            } catch (err) {
                reject(err);
                console.log(err);
            }

        };

    /**
     * Invoca el plugin Logon de Kapsel con la pantalla de actualización de contraseña, 
     * para el caso en que esta fue cambiada en el IDP.
     * Actualiza la contraseña y el ODataModel contenidos dentro de la instancia de clase Rest actual.
     * Actualiza sap.ui.getCore().AppContext.applicationContext.registrationContext.password, 
     * sap.ui.getCore().AppContext.myRest y sap.ui.getCore().AppContext.oRest.
     * Retorna un objeto Promise con resultado exitoso o de error, 
     * de acuerdo a si el usuario proporcionó o no la nueva contraseña correctamente.
     */
    sap.ui.mw.Rest.prototype.captureNewPassword = function() {
        var currentClass;
        currentClass = this;
        try {
            return new Promise(function(resolve, reject) {
                try {

                    sap.Logon.changePassword(
                        function(contextNewPwd) {
                            var oHeaders = {};
                            sap.ui.getCore().AppContext.applicationContext.registrationContext.password = contextNewPwd.registrationContext.password;
                            currentClass.pass = sap.ui.getCore().AppContext.applicationContext.registrationContext.password;
                            currentClass.sAuth = "Basic " + btoa(currentClass.user + ":" + currentClass.pass);
                            oHeaders['Authorization'] = currentClass.sAuth;
                            oHeaders['X-SMP-APPCID'] = currentClass.sAppCID;

                            //ODataModel Actual
                            currentClass.oDataModel = new sap.ui.model.odata.ODataModel(currentClass.sServiceUrl, currentClass.bJson, currentClass.user, currentClass.pass, oHeaders);
                            currentClass.oDataModel.forceNoCache(true);
                            //gateway services
                            sap.ui.getCore().AppContext.myRest = new sap.ui.mw.Rest(sap.ui.getCore().AppContext.applicationContext.applicationEndpointURL, true, currentClass.sAuth, currentClass.sAppCID, false);
                            //integration gateway services
                            sap.ui.getCore().AppContext.oRest = new sap.ui.mw.Rest(sap.ui.getCore().AppContext.applicationContext.igwEndpointURL, true, currentClass.sAuth, currentClass.sAppCID, false);

                            sap.m.MessageToast.show("La contraseña proporcionada es correcta.");
                            console.log("La contraseña proporcionada es correcta.");
                            resolve("OK");
                        },
                        function(error) {
                            sap.m.MessageToast.show("Contraseña inválida o usuario bloqueado.");
                            console.log("Contraseña inválida o usuario bloqueado.");
                            reject(error);
                        }
                    );
                } catch (err) {
                    reject(err);
                    console.log(err);
                }
            });
        } catch (err) {
            reject(err);
            console.log(err);
        }
    };
})();
