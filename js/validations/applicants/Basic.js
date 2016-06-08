(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.validations.applicants.Basic");
    jQuery.sap.require("sap.ui.base.Object");
    sap.ui.base.Object.extend('sap.ui.mw.validations.applicants.Basic', {});
    sap.ui.mw.validations.applicants.Basic.prototype.validateEmployment = function() {
        var selectAppEmployment, AppListAdditional, returnValidate, listAdditional, currentController, validationTab, validateFor = 0;
        currentController = this;
        AppListAdditional = sap.ui.getCore().byId('AppListAdditional');
        selectAppEmployment = sap.ui.getCore().byId('selectAppEmployment');
        if (selectAppEmployment) { // si existe el select de ocupacion
            if (selectAppEmployment.getSelectedKey() === "ASAL") {
                if (AppListAdditional) { // si existe la lista
                    if (AppListAdditional.getItems() < 1) {
                        sap.m.MessageToast.show("Debe captura adicional empleador");
                        returnValidate = false;
                    } else {
                        // var acountsJson = sap.ui.getCore().getModel("acountsModel").getProperty("/");
                        listAdditional = AppListAdditional.getItems();
                        for (var i = 0; i < listAdditional.length; i++) {
                            if (listAdditional[i].getBindingContext().getObject().contacTypeId === "ZC16") {
                                // EMPLEADOR
                                validateFor++;
                            }
                        }
                        if (validateFor > 0) {
                            returnValidate = true;
                        } else {
                            sap.m.MessageToast.show("Debe capturar adicional empleador");
                            returnValidate = false;
                        }
                        //returnValidate=true;
                    }
                } else { // if(AppListAdditional){
                    sap.m.MessageToast.show("Debe capturar adicional empleador");
                    returnValidate = false;
                }
            } else { // if(selectAppEmployment.getSelectedKey()==="ASAL"){
                returnValidate = true;
            }
        } else { // if(selectAppEmployment){
            returnValidate = true;
        }
        if (returnValidate === false) {
            //currentController.triggerTabApplicants('itfApplicants6');
            validationTab = "itfApplicants6";
        }
        return { "flagValidate": returnValidate, "validationTab": validationTab };
    }; // FIN validateEmployment
    sap.ui.mw.validations.applicants.Basic.prototype.validatePhoneAndAddr = function() {
        var tblAppPhones, tblAppAddress, validationTab, flagValidate,mainAddress, statusBP, flagIsMainAddress=true;
        tblAppPhones = sap.ui.getCore().byId('tblAppPhones');
        tblAppAddress = sap.ui.getCore().byId('tblAppAddress');
        statusBP = sap.ui.getCore().byId("selectAppStProspect").getSelectedKey();
        flagValidate = false;
        if (statusBP === "E0006") {
            if (tblAppPhones && tblAppAddress) {
                if (tblAppPhones.getItems().length < 1) {
                    validationTab = "itfApplicants2";
                    flagValidate = false;
                } else {
                    flagValidate = true;
                }
                if (tblAppAddress.getItems().length < 1) {
                    validationTab = "itfApplicants3";
                    flagValidate = false;
                } else {
                    for (var i = 0; i < tblAppAddress.getItems().length; i++) {
                        mainAddress = tblAppAddress.getModel().getProperty("/results/" + i + "/isMainAddress");
                        if (mainAddress) {
                            flagValidate = true;
                            flagIsMainAddress = true;
                            i = tblAppAddress.getItems().length + 1;
                        }else{
                            // la lista de direcciones debe de tener al meno una principal
                            validationTab = "itfApplicants3";
                            flagValidate = false;
                            flagIsMainAddress = false;

                        }
                    }

                }
            }else {
                flagValidate = false;
            }
        } else {
            if (tblAppPhones) {
                if (tblAppPhones.getItems().length < 1) {
                    //sap.m.MessageToast.show("Debe ingresar al menos 1 teléfono o 1 dirección");
                    //currentController.triggerTabApplicants('itfApplicants2');
                    validationTab = "itfApplicants2";
                    flagValidate = false;
                } else {
                    flagValidate = true;
                }
            } else {
                flagValidate = false;
                //currentController.triggerTabApplicants('itfApplicants2');
                validationTab = "itfApplicants2";
            }
            if (flagValidate === false) {
                if (tblAppAddress) {
                    if (tblAppAddress.getItems().length < 1) {
                        //sap.m.MessageToast.show("Debe ingresar al menos 1 teléfono o 1 dirección");
                        //currentController.triggerTabApplicants('itfApplicants3');
                        validationTab = "itfApplicants3";
                        flagValidate = false;
                    } else {
                        flagValidate = true;
                    }
                } else {
                    //sap.m.MessageToast.show("Debe ingresar al menos 1 teléfono o 1 dirección");
                    flagValidate = false;
                }
            } else {
                // sap.m.MessageToast.show("Debe ingresar al menos 1 teléfono o 1 dirección");
                flagValidate = true;
            }
        }
        if (!flagIsMainAddress) {
            sap.m.MessageToast.show("Debe de agregar una dirección principal.", {
                duration: 7000,
                closeOnBrowserNavigation: false
            });
        }
        return { "flagValidate": flagValidate, "validationTab": validationTab };
    }; // FIN validatePhoneAndAddr
    sap.ui.mw.validations.applicants.Basic.prototype.validateMaritalStatus = function() {
        var selectAppMaritalStatus, listAdditional, listItems, countAdditional, index, returnValue, currentController, validationTab;
        selectAppMaritalStatus = sap.ui.getCore().byId("selectAppMaritalStatus");
        listAdditional = sap.ui.getCore().byId("AppListAdditional");
        currentController = this;
        if (selectAppMaritalStatus) {
            if (selectAppMaritalStatus.getSelectedKey() === '2') {
                if (listAdditional) {
                    if (listAdditional.getItems().length > 0) {
                        listItems = listAdditional.getItems();
                        countAdditional = 0;
                        for (index = 0; index < listItems.length; index++) {
                            if (listItems[index].getBindingContext().getObject().contacTypeId === 'ZC11') {
                                countAdditional++;
                            }
                        }
                        if (countAdditional === 1) {
                            returnValue = true;
                        } else if (countAdditional > 1) {
                            sap.m.MessageToast.show("Solo se permite un Conyuge");
                            returnValue = false;
                        } else {
                            sap.m.MessageToast.show("Debe Capturar Adicional Conyuge");
                            returnValue = false;
                        }
                    } else {
                        sap.m.MessageToast.show("Debe Capturar Adicional Conyuge ");
                        returnValue = false;
                    }
                } else {
                    sap.m.MessageToast.show("Debe Capturar Adicional Conyuge ");
                    returnValue = false;
                }
            } else {
                returnValue = true;
            }
        } else {
            returnValue = true;
        }

        if (returnValue === false) {
            //currentController.triggerTabApplicants('itfApplicants6');
            validationTab = "itfApplicants6";
        }
        return { "flagValidate": returnValue, "validationTab": validationTab };

    }; // FIN validateMaritalStatus
})();
