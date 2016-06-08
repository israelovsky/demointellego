(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.applicants.Address");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase");
    sap.ui.base.Object.extend('sap.ui.mw.forms.applicants.Address' ,{});
    sap.ui.mw.forms.applicants.Address.prototype.createAddressForm = function(_idForm,oController,_oModel) {
        //Middleware de componentes SAPUI5
        var oInputBase, oActionBase, oDisplayBase, oLayoutBase;
        //Variables para formulario
        var oForm;
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase   = new sap.ui.mw.InputBase();
        oActionBase  = new sap.ui.mw.ActionBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase  = new sap.ui.mw.LayoutBase();
        //Se crea formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "");
        oForm.destroyContent();
        oForm.setModel(_oModel,"oModelAddress");
        oForm.setWidth("100%");
        oForm.setLayout(sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout);
        oForm.addContent(oDisplayBase.createLabel("", "Tipo de domicilio*"));
        var AppDgTypeAddress = new sap.ui.model.json.JSONModel("data-map/catalogos/typeAddress.json");
        var oItemAppDgTypeAddress = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });

        /*********StartChange DVH 24-05-2016***********/
        /*GAP -  Quitar check y en el combo agregar "Principal"*/
        /**********************************************/
        oForm.addContent(oInputBase.createSelect("selectAppDgTypeAddress", "/tipo", oItemAppDgTypeAddress, AppDgTypeAddress, null , null).attachChange(oController.onChangeTypeAddress, oController));
        /*********EndtChange DVH 24-05-2016***********/
        /*GAP -  Quitar check y en el combo agregar "Principal"*/
        /**********************************************/
        oForm.addContent(oInputBase.createCheckBox("chkAppDgMainAddress", "Es Principal",false,true,null,null).setVisible(false));
        oForm.addContent(oDisplayBase.createLabel("", "Código Postal*"));
        oForm.addContent(oInputBase.createInputText("txtAppDgPostCode", "Number", "Ingrese código postal...", "", true, true, "^\\d{5}$").setMaxLength(5));
        oForm.addContent(oActionBase.createButton("", "Buscar", "Default", "sap-icon://search", oController.searchAddressByCP, oController));
        oForm.addContent(oDisplayBase.createLabel("", "País*"));
        var AppDgCountry = new sap.ui.model.json.JSONModel("data-map/catalogos/pais.json");
        AppDgCountry.setSizeLimit(300);
        var oItemAppDgCountry = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppDgCountry", "/pais", oItemAppDgCountry, AppDgCountry, null, null).setSelectedKey("MX").setEnabled(false));

        oForm.addContent(oDisplayBase.createLabel("", "Entidad Federativa*"));
        var AppDgEntity = new sap.ui.model.json.JSONModel("data-map/catalogos/entidadNac.json");
        var oItemAppDgEntity = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppDgEntity", "/entidad", oItemAppDgEntity, AppDgEntity, null, null).setEnabled(false));
        var oItemAppDgDelegation = new sap.ui.core.Item({
            key: "{townName}",
            text: "{townName}"
        });
        oForm.addContent(oDisplayBase.createLabel("", "Delegación o Municipio*"));
        oForm.addContent(oInputBase.createSelect("selectAppDgDelegation", "/results", oItemAppDgDelegation));
        oForm.addContent(oDisplayBase.createLabel("", "Ciudad o Localidad*"));
        oForm.addContent(oInputBase.createInputText("txtAppDgCity", "Text", "Ingrese Ciudad o Localidad...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(40));
        var oItemAppDgSuburb = new sap.ui.core.Item({
            key: "{suburbName}",
            text: "{suburbName}"
        });
        oForm.addContent(oDisplayBase.createLabel("", "Colonia o Barrio*"));
        oForm.addContent(oInputBase.createComboBox("selectAppDgSuburb", "/results", oItemAppDgSuburb,null,"",""));
        // oForm.addContent(oInputBase.createSelect("selectAppDgSuburb", "/results", oItemAppDgSuburb).setAutoAdjustWidth(true));


        // oForm.addContent(oInputBase.createComboBox("selectAppIndustry",null,null,null,oController.onChangeIndustry, oController).setEnabled(false));

        oForm.addContent(oDisplayBase.createLabel("", "Calle*"));
        // oForm.addContent(oInputBase.createInputText("txtAppDgStreet", "Text", "Ingrese Calle...", "{oModelAddress>/street}", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$"));
        oForm.addContent(oInputBase.createInputText("txtAppDgStreet", "Text", "Ingrese Calle...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(60));
        oForm.addContent(oDisplayBase.createLabel("", "Número exterior*"));
        oForm.addContent(oInputBase.createInputText("txtAppDgNumExt", "Text", "Ingrese Número Exterior...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(10));
        oForm.addContent(oDisplayBase.createLabel("", "Número interior*"));
        oForm.addContent(oInputBase.createInputText("txtAppDgNumInt", "Text", "Ingrese Número Interior...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(10));
        oForm.addContent(oDisplayBase.createLabel("", "Ingrese Entre que Calles(Calle 1)"));
        oForm.addContent(oInputBase.createInputText("txtAppDgStreet1", "Text", "Ingrese entre que calle 1...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(40));
        oForm.addContent(oDisplayBase.createLabel("", "Ingrese Entre que Calles(Calle 2)"));
        oForm.addContent(oInputBase.createInputText("txtAppDgStreet2", "Text", "Ingrese entre que calle 2...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(40));
        oForm.addContent(oDisplayBase.createLabel("", "Referencia de ubicación"));
        oForm.addContent(oInputBase.createInputText("txtAppDgLocationRef", "Text", "Ingrese referencia de ubicación ...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(80));
        oForm.addContent(oDisplayBase.createLabel("", "Latitud"));
        oForm.addContent(oInputBase.createInputText("txtAppDgLatitude", "Text", "Latitude", "", true, true, "^(\\-?\\d+(\\.\\d+)?)$").setMaxLength(20));
        oController.hiddenOrShowElement(false, "txtAppDgLatitude");
        oForm.addContent(oDisplayBase.createLabel("", "Longitud"));
        oForm.addContent(oInputBase.createInputText("txtAppDgLongitude", "Text", "Longitude", "", true, true, "^(\\-?\\d+(\\.\\d+)?)$").setMaxLength(20));
        oController.hiddenOrShowElement(false, "txtAppDgLongitude");
        oForm.addContent(oDisplayBase.createLabel("", ""));
        oForm.addContent(oActionBase.createButton("", "Ver Mapa", "Default", "sap-icon://map", oController.serchLocationMap, oController));
        return oForm;
    }
})();
