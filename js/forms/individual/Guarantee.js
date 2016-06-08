(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.individual.Guarantee");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase", "js.SimpleTypes.ListaControlBase", "js.SimpleTypes.ListaControlBaseAval",  "js.SimpleTypes.LevelRiskBase");

    sap.ui.base.Object.extend('sap.ui.mw.forms.individual.Guarantee', {});
    sap.ui.mw.forms.individual.Guarantee.prototype.createGuaranteeForm = function(_idForm, oController) {
        //Middleware de componentes SAPUI5
        var oInputBase, oActionBase, oDisplayBase, oLayoutBase, oPopupBase, oListBase, oLoanRequestModel, oSemaforo;
        //Variables para formulario
        var oForm, oDialogSelectGuarantee, guaranteeModel, oItemGuarantee, oAvalList, oInputAddress, oInputGuaranteeName, oGuaranteeModel, semaphoreIcon;

        var sFirstName, sSecondName, sLastName, sMiddleName, sFullName;
        var street, outsideNumber, interiorNumber, suburb, city, postalCode, townId, stateId, countryId, sFullAddress;
        var oTxtNciListaDeContorlAval, oListaControl, oLevelRisk, oTxtLevelRisk;
        var bAvalExists;


        bAvalExists = false;

        sFullAddress = "";

        //Dialog
        //
        // = new sap.ui.model.json.JSONModel("data-map/avalList.json");
        //oGuaranteeModel = new sap.ui.model.json.JSONModel("data-map/avalList.json");
        oGuaranteeModel = sap.ui.getCore().getModel("guaranteeModel");
        oLoanRequestModel = sap.ui.getCore().getModel("loanRequestModel");


        //Cargamos el catálogo de Tipos de Pagos de Seguros
        oItemGuarantee = new sap.m.StandardListItem({
            title: "{}",
            description: "{BPIdCRM}",
            info: "{registrationDate}"
        });
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oActionBase = new sap.ui.mw.ActionBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();
        oPopupBase = new sap.ui.mw.PopupBase();
        oListBase = new sap.ui.mw.ListBase();
        oLevelRisk = new sap.ui.model.SimpleType.LevelRisk();
        oListaControl = new sap.ui.model.SimpleType.ListaControlAval();
        //Se crea formulario


        oForm = oLayoutBase.createForm(_idForm, true, 1, "Datos del Aval");
        oForm.setModel(oLoanRequestModel, "loanRequestModel");
        oForm.addContent(oActionBase.createButton("btnNciAsignarAval", "Asignar Aval", "Emphasized", "sap-icon://add", oController.onShowGuarantees, oController));
        oForm.addContent(oDisplayBase.createLabel("", "ID Aval*"));
        oForm.addContent(oInputBase.createInputText("txtNciIdAval", "Number", "00000000000", "{loanRequestModel>/IndividualLoanGuaranteeSet/BPIdCRM}", true, false).attachChange(oController.onChanging()));
        oForm.addContent(oDisplayBase.createLabel("", "Nombre del Aval*"));

        oInputGuaranteeName = oInputBase.createInputText("txtNciNombreDelAval", "Text", "Nombre del Aval", "", true, false);

        sFirstName = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/firstName");
        sSecondName = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/secondName");
        sLastName = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/lastName");
        sMiddleName = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/middleName");


         if (sLastName) {
            sFullName = sLastName;
        }

        if (sSecondName) {
            sFullName = sFullName + " " + sSecondName;
        }

        if (sFirstName) {
            sFullName = sFullName + " " + sFirstName;
        }

        if (sMiddleName) {
            sFullName = sFullName + " " + sMiddleName;
        }

        oInputGuaranteeName.setValue(sFullName);

        oForm.addContent(oInputGuaranteeName);

        if (oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/firstName") == ""){

            bAvalExists = false;

        }else{
            bAvalExists = true;
        }

        oForm.addContent(oDisplayBase.createLabel("", "Ingresos Mensuales"));
        oForm.addContent(oInputBase.createInputText("txtNciIngresosMensuales", "Text", "$ 0.00", "{loanRequestModel>/IndividualLoanGuaranteeSet/totalIncomeAmountGuarantee}", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")).setEnabled(bAvalExists));
        oForm.addContent(oDisplayBase.createLabel("", "Gastos Mensuales"));
        oForm.addContent(oInputBase.createInputText("txtNciGastosMensuales", "Text", "$ 0.00", "{loanRequestModel>/IndividualLoanGuaranteeSet/totalOutcomeAmountGuarantee}", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")).setEnabled(bAvalExists));
        oForm.addContent(oDisplayBase.createLabel("", "Capacidad de Pago del Aval"));
        oForm.addContent(oInputBase.createInputText("txtNciCapacidadDePagoDelAval", "Text", "$ 0.00", "{loanRequestModel>/IndividualLoanGuaranteeSet/guaranteePaymentCapacity}", true, true).attachChange(oController.onChanging("^(([0-9]){1,15})(\.[0-9]{2})?$")).setEnabled(bAvalExists));
        oForm.addContent(oDisplayBase.createLabel("", "Teléfono"));
        oForm.addContent(oInputBase.createInputText("txtNciTelefono", "Text", "", "{loanRequestModel>/IndividualLoanGuaranteeSet/telephone}", true, false).attachChange(oController.onChanging()));

        oForm.addContent(oDisplayBase.createLabel("", "Dirección"));

        oInputAddress = oInputBase.createInputText("txtNciDireccion", "Text", "Dirección Completa", "", true, false);


        street = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/street");
        outsideNumber = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/outsideNumber");
        interiorNumber = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/interiorNumber");
        suburb = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/suburb");
        city = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/city");
        postalCode = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/postalCode");
        townId = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/townId");
        stateId = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/stateId");
        countryId = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/countryId");

        if (street) {
            sFullAddress =  street;
        }
        if (outsideNumber) {
            sFullAddress = sFullAddress + " " + outsideNumber;
        }

        if (interiorNumber) {
            sFullAddress = sFullAddress + " " + interiorNumber;
        }

        if (suburb) {
            sFullAddress = sFullAddress + " " + suburb;
        }

        if (postalCode) {
            sFullAddress = sFullAddress + " " + postalCode;
        }

        if (townId) {
            sFullAddress = sFullAddress + " " + townId;
        }

        if (stateId) {
            sFullAddress = sFullAddress + " " + stateId;
        }

        if (countryId) {
            sFullAddress = sFullAddress + " " + countryId;
        }

        /*
        oInputAddress.bindProperty("value", "loanRequestModel>/IndividualLoanGuaranteeSet", function(_oValue) {
            if (_oValue) {
                if (_oValue.street && _oValue.outsideNumber) {
                    return _oValue.street + " " + _oValue.outsideNumber + " " + _oValue.interiorNumber + " " + _oValue.suburb + " " + _oValue.city + " " + _oValue.postalCode + " " + _oValue.townId + " " + _oValue.stateId + " " + _oValue.countryId;
                }
            }
        });*/
        oInputAddress.setValue(sFullAddress);

        //oForm.addContent(oInputBase.createInputText("txtNciDireccion", "Text", "Dirección Completa", "", true, false).attachChange(oController.onChanging()));
        oForm.addContent(oInputAddress);




        oTxtNciListaDeContorlAval = oInputBase.createInputText("txtNciListaDeContorlAval", "Text", "", "", true, false);
        oTxtNciListaDeContorlAval.bindProperty("value", {
            path: "loanRequestModel>/IndividualLoanGuaranteeSet/controlListsResult",
            type: oListaControl
        });

        oForm.addContent(oDisplayBase.createLabel("", "Listas de Control"));
        oForm.addContent(oTxtNciListaDeContorlAval);


       /* oForm.addContent(oDisplayBase.createLabel("", "Listas de Control"));   

        oTxtNciListaDeContorlAval = oInputBase.createInputText("txtNciListaDeContorlAval", "Text", "", "{loanRequestModel>/IndividualLoanGuaranteeSet/controlListsResult}", true, false);

        oForm.addContent(oTxtNciListaDeContorlAval);*/

     /*   
        if (sap.ui.getCore().AppContext.bIsCreating) {

            oTxtNciListaDeContorlAval.setValue("");

        }
*/

        oTxtLevelRisk = oInputBase.createInputText("txtNciNivelDeRiesgoAval", "Text", "", "", true, false);
        oTxtLevelRisk.bindProperty("value", {
            path: "loanRequestModel>/IndividualLoanGuaranteeSet/riskLevel",
            type: oLevelRisk
        });
        oForm.addContent(oDisplayBase.createLabel("", "Nivel de riesgo"));
        oForm.addContent(oTxtLevelRisk);



/*
        oForm.addContent(oDisplayBase.createLabel("", "Nivel de riesgo"));
        oForm.addContent(oInputBase.createInputText("txtNciNivelDeRiesgoAval", "Text", "", "{loanRequestModel>/IndividualLoanGuaranteeSet/riskLevel}", true, false));

*/


        semaphoreIcon = oDisplayBase.createIcon("iconSemaforoGuarantee", "sap-icon://status-error", "2.0rem");
        oForm.addContent(oDisplayBase.createLabel("", ""));
        oForm.addContent(semaphoreIcon);


      /*  oSemaforo = oLoanRequestModel.getProperty("/IndividualLoanGuaranteeSet/semaphoreResultFilters");

        semaphoreIcon = oDisplayBase.createIcon("", "sap-icon://status-error", "2.0rem");
        if (oSemaforo) {
            semaphoreIcon.addStyleClass('semaphoreLevelGreen');
        } else {
            semaphoreIcon.addStyleClass('semaphoreLevelRed');
        }

        oForm.addContent(oDisplayBase.createLabel("", ""));
        oForm.addContent(semaphoreIcon);*/




        /* oForm.addContent(oDisplayBase.createLabel("", ""));
        oForm.addContent(oDisplayBase.createIcon("iconNciListaDeControlAval", "sap-icon://status-completed", "2em"));
*/
        //////// Create popup - Seleccionar Aval
        oDialogSelectGuarantee = sap.ui.getCore().byId("popupNciSeleccionarAval");

        if (!oDialogSelectGuarantee) {



            oDialogSelectGuarantee = oPopupBase.createDialog("popupNciSeleccionarAval", "Seleccionar Aval", sap.m.DialogType.Standard);

            //oDialogSelectGuarantee.addContent(oInputBase.createSearchField("searchNciBusquedaAval", "", this));
            oDialogSelectGuarantee.addContent(oInputBase.createSearchField("searchNciBusquedaAval", oController.searchAvalTxt, oController, "100%"));




            var tableFields = ["Nombre", "Fecha de Alta", "Id Cliente"];
            var tableFieldVisibility = [true, true, true];
            var tableFieldDemandPopid = [false, false, true];

            oDialogSelectGuarantee.addContent(oListBase.createTable("listNciAval", "", sap.m.ListMode.SingleSelectMaster, tableFields, tableFieldVisibility, tableFieldDemandPopid, null, oController.setAval, oController));

            var listNciAval = sap.ui.getCore().byId("listNciAval");



            listNciAval.setModel(oGuaranteeModel);
            listNciAval.bindAggregation("items", {
                path: "/results/",
                factory: function(_id, _context) {
                    return oController.onLoadTableAval(_context);
                }
            });

            oDialogSelectGuarantee.addButton(oActionBase.createButton("btnNciCancelarAval", "Cancelar", "Emphasized", "", oController.onShowGuaranteesClose, oController));

        }

        //var oAvalList = oListBase.createList( "listNciAval", "", sap.m.ListMode.None, guaranteeModel, "/", oItemGuarantee, "", this));

        /*oAvalList = new sap.m.List("listNciAval", {
            headerText: "",
            noDataText: "No se encontraron datos",
            mode: sap.m.ListMode.None,
            itemPress: [oController.setAval, oController]
        });

        oAvalList.setModel(oGuaranteeModel);

        oAvalList.setHeaderText("Nombre          Fecha de Alta");

        oAvalList.bindItems( {
            path: "/results/",  
            //path: "/Avales/", 
            factory: function(_oId, _oContext) {


                 var oItemGuarantee;

                     oItemGuarantee = new sap.m.StandardListItem({

                        title: _oContext.getProperty(_oContext.sPath).firstName + " " + _oContext.getProperty(_oContext.sPath).middleName + " " + _oContext.getProperty(_oContext.sPath).lastName, 
                        //title: _oContext.getProperty(_oContext.sPath).fullName,
                        description:  _oContext.getProperty(_oContext.sPath).BPIdCRM,
                        info: _oContext.getProperty(_oContext.sPath).registrationDate,
                        type: sap.m.ListType.Active

                    });

                    return oItemGuarantee;

                }
                
        });*/

        //oDialogSelectGuarantee.addContent(oListBase.createList("listNciAval", "", sap.m.ListMode.None, guaranteeModel, "/", oItemGuarantee, "", this));

        //oDialogSelectGuarantee.addContent(oAvalList);





        //se agrega contenido a formulario
        /*oForm.addContent(oDisplayBase.createLabel("", "Id Cliente"));
        oForm.addContent(oInputBase.createInputText("txtNciIdCliente", "Text", "Id de Cliente.","0000000",true,false));
        oForm.addContent(oDisplayBase.createLabel("", "Nombre Completo"));
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
    };



})();
