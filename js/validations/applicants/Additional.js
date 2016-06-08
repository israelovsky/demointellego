(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.validations.applicants.Additional");
    jQuery.sap.require("sap.ui.base.Object");
    sap.ui.base.Object.extend('sap.ui.mw.validations.applicants.Additional', {});
    sap.ui.mw.validations.applicants.Additional.prototype.validateAdditional = function() {
        var currentController, selectAppProduct, AppListAdditional, listAdditional, returnValidate, validationTab, statusBP, validateConyugue = 0,
            validateEmpleador = 0,
            validarReferenciaP = 0,
            validarReferenciaC = 0;
        currentController = this;
        selectAppProduct = sap.ui.getCore().byId('selectAppProduct');
        AppListAdditional = sap.ui.getCore().byId('AppListAdditional');
        /************StartChange DVH 02-05-2016***************/
        /*Validacion de adicionales en proceso de originacion*/
        /*****************************************************/
        //statusBP = sap.ui.getCore().byId("selectAppStProspect").getSelectedKey();
        /************EndChange DVH 02-05-2016***************/
        /*Validacion de adicionales en proceso de originacion*/
        /*****************************************************/
        if (selectAppProduct.getSelectedKey() === "C_IND_CI") {
            // Credito Individual
            if (AppListAdditional) {
                listAdditional = AppListAdditional.getItems();
                if (listAdditional.length > 0) {
                    for (var i = 0; i < listAdditional.length; i++) {
                        switch (listAdditional[i].getBindingContext().getObject().contacTypeId) {
                            case 'ZC11':
                                // CONYUGUE
                                validateConyugue++;
                                break;
                            case 'ZC16':
                                // EMPLEADOR
                                validateEmpleador++;
                                break;
                            case 'ZC14':
                                // REFERENCIA PERSONAL/FAMILIAR
                                validarReferenciaP++;
                                break;
                                /************StartChange DVH 02-05-2016***************/
                                /*Validacion de adicionales en proceso de originacion*/
                                /*****************************************************/
                            /*case 'ZC15':
                                // REFERENCIA PERSONAL/FAMILIAR
                                validarReferenciaC++;
                                break;*/
                                /************EndChange DVH 02-05-2016***************/
                                /*Validacion de adicionales en proceso de originacion*/
                                /*****************************************************/
                        }
                    } // fin for
                    if (validateConyugue <= 1) {
                        returnValidate = true;

                        if (validateEmpleador <= 1) {
                            returnValidate = true;

                            if (validarReferenciaP <= 6) {
                                returnValidate = true;
                            } else {
                                setTimeout(function() {
                                    sap.m.MessageToast.show("No puede capturar más de 6 referencias Personales");
                                }, 3000);
                                returnValidate = false;
                            }
                        } else {
                            setTimeout(function() {
                                sap.m.MessageToast.show("No puede capturar más de 1 referencia empleador");
                            }, 3000);
                            returnValidate = false;
                        }
                    } else {
                        setTimeout(function() {
                            sap.m.MessageToast.show("No puede capturar más de 1 referencia cónyuge");
                        }, 3000);
                        returnValidate = false;
                    }
                    /************StartChange DVH 02-05-2016***************/
                    /*Validacion de adicionales en proceso de originacion*/
                    /*****************************************************/
                    /*if (statusBP === "E0006") {
                        if (validarReferenciaP >= 1) {
                            returnValidate = true;
                            if (validarReferenciaC >= 1) {
                                returnValidate = true;
                            } else {
                                setTimeout(function() {
                                    sap.m.MessageToast.show("Debe capturar una referencia comercial");
                                }, 3000);
                                returnValidate = false;
                            }
                        } else {
                            setTimeout(function() {
                                sap.m.MessageToast.show("Debe capturar una referencia personal");
                            }, 3000);
                            returnValidate = false;
                            returnValidate = false;
                        }
                    }*/
                    /************EndChange DVH 02-05-2016***************/
                    /*Validacion de adicionales en proceso de originacion*/
                    /*****************************************************/
                } //else { // if(listAdditional>0){
                    //sap.m.MessageToast.show("Debe ingresar al menos 1 referencia");
                    /************StartChange DVH 02-05-2016***************/
                    /*Validacion de adicionales en proceso de originacion*/
                    /*****************************************************/
                    /*if (statusBP === "E0006") {
                        returnValidate = false;
                        setTimeout(function() {
                            sap.m.MessageToast.show("Debe capturar una referencia personal y una comercial");
                        }, 3000);
                    } else {
                        returnValidate = true;
                    }*/
                //}
            } //else { //    if(AppListAdditional){
                /*if (statusBP === "E0006") {
                    returnValidate = false;
                    setTimeout(function() {
                        sap.m.MessageToast.show("Debe capturar una referencia personal y una comercial");
                    }, 3000);
                } else {
                    returnValidate = true;
                }*/
                /************EndChange DVH 02-05-2016***************/
                /*Validacion de adicionales en proceso de originacion*/
                /*****************************************************/
            //}
        } //  if(selectAppProduct.getSelectedKey()==="C_IND_CI"){
        // *** FUNCION CREDITO MUJER Y COMERCIANTE ****
        if (selectAppProduct.getSelectedKey() === "C_GRUPAL_CCR" || selectAppProduct.getSelectedKey() === "C_GRUPAL_CM") {
            // Credito Mujer y Comerciante
            if (AppListAdditional) {
                listAdditional = AppListAdditional.getItems();
                if (listAdditional.length > 0) {
                    for (var i = 0; i < listAdditional.length; i++) {
                        if (listAdditional[i].getBindingContext().getObject().contacTypeId === 'ZC11') {
                            //CONYUGUE
                            validateConyugue++;
                        }
                        if (listAdditional[i].getBindingContext().getObject().contacTypeId === 'ZC16') {
                            //EMPLEADOR
                            validateEmpleador++;
                        }
                    } // fin for
                    if (validateConyugue <= 1) {
                        returnValidate = true;
                        if (validateEmpleador <= 1) {
                            returnValidate = true;
                        } else {
                            sap.m.MessageToast.show("No puede capturar más de 1 referencia empleador");
                            returnValidate = false;
                        }
                    } else {
                        sap.m.MessageToast.show("No puede capturar más de 1 referencia cónyuge");
                        returnValidate = false;
                    }
                } else { // if(listAdditional>0){
                    //sap.m.MessageToast.show("Debe ingresar al menos 1 referencia");
                    returnValidate = true;
                }
            } else {
                returnValidate = true;
            }
        }

        if (returnValidate === false) {
            validationTab = 'itfApplicants6';
        }
		if(returnValidate===undefined){
			returnValidate=true;
		}
        return { "flagValidate": returnValidate, "validationTab": validationTab };


    };
})();
