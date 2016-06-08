(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.individual.Main");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase", "js.SimpleTypes.LevelRiskBase", "js.SimpleTypes.ListaControlBase");


    sap.ui.base.Object.extend('sap.ui.mw.forms.individual.Main', {});
    sap.ui.mw.forms.individual.Main.prototype.createMainForm = function(_idForm, oController) {
        //Middleware de componentes SAPUI5
        var oInputBase, oActionBase, oDisplayBase, oLayoutBase, oPopupBase, oListBase;
        //Variables para formulario
        var oForm;
        ////
        
        var oDialogSelectExceptionCause, oExceptionCauseModel, oItemException, oProductsModel, oItemProducts, oCustomerModel, oLoanRequestModel, sSemaforo, semaphoreIcon, oLevelRisk;

        var oInputNombreCompleto, oTxtLevelRisk, oTxtListaControl, oListaControl;

        oExceptionCauseModel = new sap.ui.model.json.JSONModel("data-map/exceptionCause.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        oItemException = new sap.m.StandardListItem({
            title: "{cause}",
            type: "Active"
        });

        oProductsModel = new sap.ui.model.json.JSONModel("data-map/catalogos/productsIdCrm.json");
        //Cargamos el catálogo de Productos
        oItemProducts = new sap.ui.core.Item({
            
            key: "{idCRM}",
            text: "{productName}"
        });

        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oActionBase = new sap.ui.mw.ActionBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();
        oPopupBase = new sap.ui.mw.PopupBase();
        oListBase = new sap.ui.mw.ListBase();
        oLevelRisk = new sap.ui.model.SimpleType.LevelRisk();
        oListaControl = new sap.ui.model.SimpleType.ListaControl();
        //Se crea formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "Principales");
        //se agrega contenido a formulario OGG consumo de servicio
        //LoRuta = sap.ui.core.UIComponent.getRouterFor(oController);
        //oAplicantion = LoRuta._oRouter._prevRoutes[0].params[0];
        //oAplicant = LoRuta._oRouter._prevRoutes[0].params[1];

        //sap.ui.getCore().AppContext.aplicantByID = myModelAplicant;
        //sap.ui.getCore().AppContext.aplicationByID = myModelAplication;

        /// Set model to bind data
        oLoanRequestModel = sap.ui.getCore().getModel("loanRequestModel");
        
        oCustomerModel = sap.ui.getCore().getModel("oCustomerModel");
        oForm.setModel(oCustomerModel, "oCustomerModel");
        oForm.setModel(oLoanRequestModel, "loanRequestModel");

        oForm.addContent(oDisplayBase.createLabel("", "Id Oportunidad"));
        oForm.addContent(oInputBase.createInputText("txtNciIdOportunidad", "Text", "0000000", "{loanRequestModel>/loanRequestIdCRM}", true, false));

        oForm.addContent(oDisplayBase.createLabel("", "Id Cliente"));
        oForm.addContent(oInputBase.createInputText("txtNciIdCliente", "Text", "0000000", "{oCustomerModel>/BPIdCRM}", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Nombre Completo"));
        oInputNombreCompleto = oInputBase.createInputText("txtNciNombreCompleto", "Text", "Nombre(s) Apellidos", "", true, false);
        oInputNombreCompleto.bindProperty("value", {
            parts: [
                "oCustomerModel>/firstName",
                "oCustomerModel>/secondName",
                "oCustomerModel>/lastName",
                "oCustomerModel>/middleName"
            ],
            formatter: function(_sFirstName, _secondName, _sLastName, _sMiddleName ) {

                if (_sLastName === undefined) {
                    _sLastName = "";
                }
                if (_secondName === undefined) {
                    _secondName = "";
                }
                if (_sFirstName === undefined) {
                    _sFirstName = "";
                }
                if (_sMiddleName === undefined) {
                    _sMiddleName = "";
                }

                return  _sLastName +  " " + _secondName + " " + _sFirstName + " " + _sMiddleName + " " ;
            }
        });
        oForm.addContent(oInputNombreCompleto);
        oForm.addContent(oDisplayBase.createLabel("", "Tipo de producto *"));
        oForm.addContent(oInputBase.createSelect("selectNciTipoDeProducto", "/products", oItemProducts, oProductsModel).setEnabled(false).bindProperty("selectedKey", {
            path: "loanRequestModel>/productID"
        }));
        oForm.addContent(oDisplayBase.createLabel("", "Ciclo"));
        oForm.addContent(oInputBase.createInputText("txtNciCiclo", "Number", "", "{loanRequestModel>/cycle}", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Estatus de la Oportunidad"));
        oForm.addContent(oInputBase.createInputText("txtNciEstatusDeLaOportunidad", "Text", "", "{loanRequestModel>/statusText}", true, false));
        

        oTxtListaControl = oInputBase.createInputText("txtNciListasDeControl", "Text", "", "", true, false);
        oTxtListaControl.bindProperty("value", {
            path: "oCustomerModel>/generalLoanData/controlListsResult",
            type: oListaControl
        });

        oForm.addContent(oDisplayBase.createLabel("", "Listas de Control"));
        oForm.addContent(oTxtListaControl);
        
        oTxtLevelRisk = oInputBase.createInputText("txtNciNivelDeRiesgo", "Text", "", "", true, false);
        oTxtLevelRisk.bindProperty("value", {
            path: "oCustomerModel>/generalLoanData/riskLevel",
            type: oLevelRisk
        });
        oForm.addContent(oDisplayBase.createLabel("", "Nivel de riesgo"));
        oForm.addContent(oTxtLevelRisk);

        semaphoreIcon = oDisplayBase.createIcon("iconSemaforoMain", "sap-icon://status-error", "2.0rem");
        oForm.addContent(oDisplayBase.createLabel("", ""));
        oForm.addContent(semaphoreIcon);

        oForm.addContent(oDisplayBase.createLabel("", "Canal de Dispersión"));
        oForm.addContent(oInputBase.createSelect("selectNciCanalDispersor").bindProperty("selectedKey", {
            path: "oCustomerModel>/generalLoanData/dispersionChannelId"
        }).attachChange(oController.onChanging()));
        oForm.addContent(oDisplayBase.createLabel("", "Medio de Dispersión"));
        oForm.addContent(oInputBase.createSelect("selectNciMedioDeDispersion").bindProperty("selectedKey", {
            path: "oCustomerModel>/generalLoanData/dispersionMediumId"
        }).attachChange(oController.onChanging()));

        //////// Create popup - Seleccionar causa de excepción
        oDialogSelectExceptionCause = oPopupBase.createDialog("popupNciSeleccionarCausaExcepcion", "Seleccionar causa de excepción", sap.m.DialogType.Standard);
        oDialogSelectExceptionCause.addContent(oInputBase.createSearchField("searchNciBusquedaCausaExcepcion", "", this));
        oDialogSelectExceptionCause.addContent(oListBase.createList("listNciCausaDeExcepcion", "", sap.m.ListMode.None, oExceptionCauseModel, "/exception", oItemException, "", this));
        oDialogSelectExceptionCause.addButton(oActionBase.createButton("btnNciCancelarCausaDeExcepcion", "Cancelar", "Emphasized", "", oController.onShowExceptionCausesClose, oController));

        oForm.addEventDelegate({
            onAfterRendering: function(evt) {
                oController.onUpdateDispersion();
            }
        });

        return oForm;
    }

})();
