(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.individual.Credit");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase", "js.SimpleTypes.TermBase");


    sap.ui.base.Object.extend('sap.ui.mw.forms.individual.Credit', {});
    sap.ui.mw.forms.individual.Credit.prototype.createCreditForm = function(_idForm, oController) {
        //Middleware de componentes SAPUI5
        var oInputBase, oActionBase, oDisplayBase, oLayoutBase, oPopupBase, oListBase;
        //Variables para formulario
        var oForm, radioButtonsFrequency, radioButtonsWarrantyGuarantee, radioButtonsLoanDestiny;
        var yearsModel, oItemYear, monthsModel, oItemMonth, oItem, oItemFrequency, oFrequencyModel;

        var oDatePickerExpenditureDate, oDatePickerFirstPayment, oPatern;
        var oType, oRbGroupOptionDestinoPrestamo;

        var oPatternFuture, oDateTomorrow, oIdOportunidad;


        var oSimpleTypeTerms;
        var oTxtNciPlazoSolicitado;

        oDateTomorrow = new Date();

        oPatternFuture = new sap.ui.model.type.Date({
            pattern: "dd.MM.yyyy",
            UTC: true
        }, {
            minimum: oDateTomorrow /// is not less or equal, but less
        });


        yearsModel = new sap.ui.model.json.JSONModel("data-map/years.json");
        //Cargamos el catálogo de años
        oItemYear = new sap.ui.core.Item({
            key: "{year}",
            text: "{year}"
        });

        monthsModel = new sap.ui.model.json.JSONModel("data-map/months.json");
        //Cargamos el catálogo de meses
        oItemMonth = new sap.ui.core.Item({
            key: "{month}",
            text: "{month}"
        });


        oItem = new sap.ui.core.Item({
            text: "Seleccionar"
        });

        oItemFrequency = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });

        oFrequencyModel = new sap.ui.model.json.JSONModel("data-map/frecuencia_C_IND_CI.json");





        //Se declaran objetos de Middleware de componentes SAPUI5      
        oInputBase = new sap.ui.mw.InputBase();
        oActionBase = new sap.ui.mw.ActionBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();
        oPopupBase = new sap.ui.mw.PopupBase();
        oListBase = new sap.ui.mw.ListBase();
        //Se crea formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "Datos del Crédito");
        //se agrega contenido a formulario



        /// Set model to bind data
        oForm.setModel(sap.ui.getCore().getModel("oCustomerModel"), "oCustomerModel");
        oForm.setModel(sap.ui.getCore().getModel("loanRequestModel"), "loanRequestModel");
        oIdOportunidad = sap.ui.getCore().getModel("loanRequestModel").getProperty('/loanRequestIdCRM'); /// Set model to bind data


        oType = new sap.ui.model.type.Integer();

        oForm.addContent(oDisplayBase.createLabel("", "Tiempo en la vivienda *"));
        oForm.addContent(oInputBase.createInputText("txtTiempoEnLaVivienda", "Text", "", "", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Años*"));
        oForm.addContent(oInputBase.createSelect("selectNciTiempoEnLaViviendaAnios", "/years", oItemYear, yearsModel, null, null).insertItem(oItem, 0).bindProperty("selectedKey", {
            path: "oCustomerModel>/individualLoanData/yearsOnHouse",
            type: oType
        }).attachChange(oController.onChanging()));
        oForm.addContent(oDisplayBase.createLabel("", "Meses*"));
        oForm.addContent(oInputBase.createSelect("selectNciTiempoEnLaViviendaMeses", "/months", oItemMonth, monthsModel, null, null).bindProperty("selectedKey", {
            path: "oCustomerModel>/individualLoanData/monthsOnHouse",
            type: oType
        }).insertItem(oItem, 0).attachChange(oController.onChanging()));
        oForm.addContent(oDisplayBase.createLabel("", "Tiempo en el local *"));
        oForm.addContent(oInputBase.createInputText("txtTiempoEnElLocal", "Text", "", "", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Años*"));
        oForm.addContent(oInputBase.createSelect("selectNciTiempoEnElLocalAnios", "/years", oItemYear, yearsModel, null, null).bindProperty("selectedKey", {
            path: "oCustomerModel>/individualLoanData/yearsOnLocal",
            type: oType
        }).insertItem(oItem, 0).attachChange(oController.onChanging()));
        oForm.addContent(oDisplayBase.createLabel("", "Meses*"));
        oForm.addContent(oInputBase.createSelect("selectNciTiempoEnElLocalMeses", "/months", oItemMonth, monthsModel, null, null).bindProperty("selectedKey", {
            path: "oCustomerModel>/individualLoanData/monthsOnLocal",
            type: oType
        }).insertItem(oItem, 0).attachChange(oController.onChanging()));


        oForm.addContent(oDisplayBase.createLabel("", "Fecha de Primer Pago *"));

        oPatern = new sap.ui.model.type.Date({
            pattern: "dd.MM.yyyy",
            UTC: true
        });



        oDatePickerFirstPayment = new sap.m.DatePicker("dtpNciDateFechaDePrimerPago", {
            value: {
                path: "/firstPaymentDate",
                type: oPatternFuture
            },
        });


        oDatePickerFirstPayment.attachValidationError(function(evt) {
            sap.m.MessageToast.show("Por favor indique una fecha posterior al día de hoy. ");
        });

        oForm.addContent(oDatePickerFirstPayment.setModel(sap.ui.getCore().getModel("loanRequestModel")));



        /*oForm.addContent(oInputBase.createDatePicker("dtpNciDateFechaDePrimerPago", "", "yyyy/MM/dd", "yyyy/MM/dd").bindProperty("value", {
        path: "loanRequestModel>/firstPaymentDate" }));*/


        oForm.addContent(oDisplayBase.createLabel("", "Monto Solicitado"));
        oForm.addContent(oInputBase.createInputText("txtNciMontoSolicitado", "Text", "$ 0.00", "{oCustomerModel>/individualLoanData/requiredAmount}", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")));


        oForm.addContent(oDisplayBase.createLabel("", "Frecuencia Solicitada"));

        oForm.addContent(oInputBase.createSelect("selectNciFrecuenciaSolicitada", "/frecuencias", oItemFrequency, oFrequencyModel, null, null).bindProperty("selectedKey", {
            path: "loanRequestModel>/frequency"
        }));

        oForm.addContent(oDisplayBase.createLabel("", "Plazo Solicitado"));



        oSimpleTypeTerms = new sap.ui.model.SimpleType.Term();
        oTxtNciPlazoSolicitado;

        oTxtNciPlazoSolicitado = oInputBase.createInputText("txtNciPlazoSolicitado", "Text", "$", "", true, false);
        oTxtNciPlazoSolicitado.bindProperty("value", {
            path: "loanRequestModel>/term",
            type: oSimpleTypeTerms
        });


        oForm.addContent(oTxtNciPlazoSolicitado);

        //oForm.addContent(oInputBase.createInputText("txtNciPlazoSolicitado", "Text", "0", "{loanRequestModel>/term}", true, false));
        //oForm.addContent(oInputBase.createSelect("selectNciPlazoSolicitado").insertItem(oItem, 0).attachChange(oController.onChanging()));


        oForm.addContent(oDisplayBase.createLabel("", "Ingresos Mensuales"));
        oForm.addContent(oInputBase.createInputText("txtIngresosMensuales", "Text", "$ 0.00", "{oCustomerModel>/individualLoanData/totalIncomeAmount}", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")));
        oForm.addContent(oDisplayBase.createLabel("", "Gastos Mensuales"));
        oForm.addContent(oInputBase.createInputText("txtGastosMensuales", "Text", "$ 0.00", "{oCustomerModel>/individualLoanData/totalOutcomeAmount}", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")));
        //oForm.addContent(oDisplayBase.createLabel("", "Capacidad de Pago"));
        //oForm.addContent(oInputBase.createInputText("txtCapacidadDePago", "Text", "$ 0.00", "0.00", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")));
        oForm.addContent(oDisplayBase.createLabel("", "Cuota que puede pagar"));
        oForm.addContent(oInputBase.createInputText("txtCuotaQuePuedePagar", "Text", "$ 0.00", "{oCustomerModel>/individualLoanData/feeEnabledToPay}", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")));

        radioButtonsLoanDestiny = [
            oInputBase.createRadioButtonForGroupName("rbNciActivityDestinoPrestamo0", "").setVisible(false),
            oInputBase.createRadioButtonForGroupName("rbNciActivityDestinoPrestamo1", "Capital de Trabajo"),
            oInputBase.createRadioButtonForGroupName("rbNciActivityDestinoPrestamo2", "Inversión / Activo Fijo")
        ];
        oForm.addContent(oDisplayBase.createLabel("", "Destino del Préstamo*"));

        oRbGroupOptionDestinoPrestamo = oInputBase.createRadioButtonGroup("rbGroupOptionDestinoPrestamo", radioButtonsLoanDestiny, 3);


        var oPaternInt = new sap.ui.model.type.String();

        oRbGroupOptionDestinoPrestamo.bindProperty("selectedIndex", {
            path: "oCustomerModel>/individualLoanData/loanDestiny",
            type: oPaternInt
        });

        oForm.addContent(oRbGroupOptionDestinoPrestamo);



        radioButtonsWarrantyGuarantee = [oInputBase.createRadioButtonForGroupName("rbNciActivityCreditoConGarantiaDeAval", "1"),
            oInputBase.createRadioButtonForGroupName("rbNciActivityCreditoConGarantiaDeAval2", "2")
        ];
        //oForm.addContent(oDisplayBase.createLabel("", "¿Crédito con garantía de Aval?*"));
        //oForm.addContent(oInputBase.createRadioButtonGroup("rbGroupOptionCreditoConGarantiaDeAval", radioButtonsWarrantyGuarantee, 2));
        oForm.addContent(oDisplayBase.createLabel("", "Fecha de Desembolso*"));
        /*oForm.addContent(oInputBase.createDatePicker("txtNciDateFechaDeDesembolso", "", "yyyy/MM/dd", "yyyy/MM/dd").bindProperty("value", {
            path: "loanRequestModel>/expenditureDate"
        }));*/

        oDatePickerExpenditureDate = new sap.m.DatePicker("txtNciDateFechaDeDesembolso", {
            value: {
                path: "/expenditureDate",
                type: oPatternFuture
            },
        });


        oDatePickerExpenditureDate.attachValidationError(function(evt) {
            sap.m.MessageToast.show("Por favor indique una fecha posterior al día de hoy. ");
        });

        oForm.addContent(oDatePickerExpenditureDate.setModel(sap.ui.getCore().getModel("loanRequestModel")));


        oForm.addContent(oDisplayBase.createLabel("", ""));

        if (oIdOportunidad != "") {
            oForm.addContent(oActionBase.createButton("btnNciPorAprobar", "Por aprobar", "Emphasized", "sap-icon://accept", oController.toStateApprove(), oController).setEnabled(true));
        } else {
            oForm.addContent(oActionBase.createButton("btnNciPorAprobar", "Por aprobar", "Emphasized", "sap-icon://accept").setEnabled(false));
        }

        //oForm.addContent(oDisplayBase.createLabel("", ""));
        //        oForm.addContent(oActionBase.createButton("btnNciPorAprobar", "Por Aprobar", "Emphasized", "sap-icon://accept", oController.toStatePorAprobar, oController).setEnabled(false));

        /*oForm.addContent(oDisplayBase.createLabel("", "Nombre Completo"));
        oForm.addContent(oInputBase.createInputText("txtNciNombreCompleto", "Text", "Ingrese Nombre..."));
        oForm.addContent(oDisplayBase.createLabel("", "Tipo de producto *"));
        oForm.addContent(oInputBase.createSelect("selectNciTipoDeProducto"));
        oForm.addContent(oDisplayBase.createLabel("", "Ciclo"));
        oForm.addContent(oInputBase.createInputText("txtNciCiclo", "Number", "0", "0", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Estatús de la oportunidad:"));
        oForm.addContent(oInputBase.createInputText("txtNciEstatusDeLaOportunidad", "Text", "N/A", "N/A", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Medio de Dispersión"));
        oForm.addContent(oInputBase.createSelect("selectNciMedioDeDispersion"));
        oForm.addContent(oDisplayBase.createLabel("", "Canal Dispersor"));
        oForm.addContent(oInputBase.createSelect("selectNciCanalDispersor"));*/
        return oForm;
    }

})();
