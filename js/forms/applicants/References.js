(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.applicants.References");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase");


    sap.ui.base.Object.extend('sap.ui.mw.forms.applicants.References', {});
    sap.ui.mw.forms.applicants.References.prototype.createSpouseForm = function(_idForm, oController, oModel, isEdited) {
        //Middleware de componentes SAPUI5
        var oInputBase, oDisplayBase, oLayoutBase, oForm, AppEmployment, oItemAppEmployment;
        //Variables para formulario
        var txtAppDgName, txtAppDgSecondName, txtAppDgLastname, txtAppDgSurname, txtAppDgPhone, selectAppDgOcupacion, dataProducts, lblOcupacion , lblTelefono;
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();

        //Se agrega contenido a formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "Agregar Cónyuge");
        oForm.destroyContent();
        oForm.addContent(oDisplayBase.createLabel("", "Primer Nombre *"));
        txtAppDgName = oInputBase.createInputText("txtAppDgName", "Text", "Ingrese Primer Nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26);
        oForm.addContent(txtAppDgName);
        oForm.addContent(oDisplayBase.createLabel("", "Segundo Nombre"));
        txtAppDgSecondName = oInputBase.createInputText("txtAppDgSecondName", "Text", "Ingrese Segundo Nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26);
        oForm.addContent(txtAppDgSecondName);
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Paterno *"));
        txtAppDgLastname = oInputBase.createInputText("txtAppDgLastname", "Text", "Ingrese Apellido Paterno...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26);
        oForm.addContent(txtAppDgLastname);
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Materno"));
        txtAppDgSurname = oInputBase.createInputText("txtAppDgSurname", "Text", "Ingrese Apellido Materno...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26);
        oForm.addContent(txtAppDgSurname);
        AppEmployment = new sap.ui.model.json.JSONModel("data-map/catalogos/occupation.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        oItemAppEmployment = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });

        if (sap.ui.getCore().byId("selectAppProduct").getSelectedKey() != "C_IND_CI") {
           lblOcupacion = "Ocupación";
           lblTelefono = "Teléfono";
        }else{
           lblOcupacion = "Ocupación *";
           lblTelefono  = "Teléfono *";
        }

        oForm.addContent(oDisplayBase.createLabel("", lblOcupacion));
        selectAppDgOcupacion = oInputBase.createSelect("selectAppDgOcupacion", "/ocupacion", oItemAppEmployment, AppEmployment, null, null);
        oForm.addContent(selectAppDgOcupacion);
        oForm.addContent(oDisplayBase.createLabel("", lblTelefono));
        txtAppDgPhone = oInputBase.createInputText("txtAppDgPhone", "Tel", "Ingrese Teléfono de Trabajo...", "", true, true, "^\\d{7,}$").setMaxLength(10);
        oForm.addContent(txtAppDgPhone);

        if (isEdited) {
            //console.log(oModel);
            txtAppDgName.setValue(oModel.getProperty('/firstName'));
            txtAppDgSecondName.setValue(oModel.getProperty('/middleName'));
            txtAppDgLastname.setValue(oModel.getProperty('/lastName'));
            txtAppDgSurname.setValue(oModel.getProperty('/secondName'));
            txtAppDgPhone.setValue(oModel.getProperty('/contacPhone'));
            selectAppDgOcupacion.setSelectedKey(oModel.getProperty('/job'));
        }

        return oForm;
    };
    sap.ui.mw.forms.applicants.References.prototype.createEmployerForm = function(_idForm, oController, oModel, isEdited) {
        //Middleware de componentes SAPUI5
        var oInputBase, oDisplayBase, oLayoutBase, oForm;
        //Variables para formulario
        var chkRazonSocial, txtAppDgEmpRazon, txtAppDgEmpName, txtAppDgEmpSecondName, txtAppDgEmpLastname, txtAppDgEmpSurname, txtAppDgPostCode, selectAppDgEntity, selectAppDgDelegation, txtAppDgCity, selectAppDgSuburb, txtAppDgStreet, txtAppDgNumExt, txtAppDgNumInt;

        var oItemAppDgEntity = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        var oItemAppDgDelegation = new sap.ui.core.Item({
            key: "{townName}",
            text: "{townName}"
        });
        var oItemAppDgSuburb = new sap.ui.core.Item({
            key: "{suburbName}",
            text: "{suburbName}"
        });
        var appDgEntity = new sap.ui.model.json.JSONModel("data-map/catalogos/entidadNac.json");
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();

        //Se agrega contenido a formulario}
        oForm = oLayoutBase.createForm("idDgContactForm", true, 1, "Agregar Empleador");
        chkRazonSocial = oInputBase.createCheckBox("chkRazonSocial", "¿Razón Social?", null, true, oController.onSelchkAppReason, oController);
        oForm.addContent(chkRazonSocial);
        oForm.addContent(oDisplayBase.createLabel("", "Razón Social*"));
        txtAppDgEmpRazon = oInputBase.createInputText("txtAppDgEmpRazon", "Text", "Ingrese razón social...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(80);
        oForm.addContent(txtAppDgEmpRazon);
        oController.hiddenOrShowElement(false, "txtAppDgEmpRazon");
        oForm.addContent(oDisplayBase.createLabel("", "Primer Nombre*"));
        txtAppDgEmpName = oInputBase.createInputText("txtAppDgEmpName", "Text", "Ingrese Primer Nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(30);
        oForm.addContent(txtAppDgEmpName);
        oForm.addContent(oDisplayBase.createLabel("", "Segundo Nombre"));
        txtAppDgEmpSecondName = oInputBase.createInputText("txtAppDgEmpSecondName", "Text", "Ingrese Segundo Nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(30);
        oForm.addContent(txtAppDgEmpSecondName);
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Paterno*"));
        txtAppDgEmpLastname = oInputBase.createInputText("txtAppDgEmpLastname", "Text", "Ingrese Apellido Paterno", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(30);
        oForm.addContent(txtAppDgEmpLastname);
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Materno"));
        txtAppDgEmpSurname = oInputBase.createInputText("txtAppDgEmpSurname", "Text", "Ingrese Apellido Materno...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(30);
        oForm.addContent(txtAppDgEmpSurname);
        oForm.addContent(oDisplayBase.createLabel("", "Código Postal*"));
        txtAppDgPostCode = oInputBase.createInputText("txtAppDgPostCode", "Number", "Ingrese Código Postal...", "", true, true, "^\\d{5}$").setMaxLength(5);
        oForm.addContent(txtAppDgPostCode);
        oForm.addContent(oActionBase.createButton("", "Buscar", "Default", "sap-icon://search", oController.searchAddressByCP, oController));
        oForm.addContent(oDisplayBase.createLabel("", "Entidad Federativa*"));
        selectAppDgEntity = oInputBase.createSelect("selectAppDgEntity", "/entidad", oItemAppDgEntity, appDgEntity);
        oForm.addContent(selectAppDgEntity);
        oForm.addContent(oDisplayBase.createLabel("", "Delegación o Municipio*"));
        selectAppDgDelegation = oInputBase.createSelect("selectAppDgDelegation", "/results", oItemAppDgDelegation);
        oForm.addContent(selectAppDgDelegation);
        oForm.addContent(oDisplayBase.createLabel("", "Ciudad o Localidad*"));
        txtAppDgCity = oInputBase.createInputText("txtAppDgCity", "Text", "Ingrese Ciudad o Localidad...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$");
        oForm.addContent(txtAppDgCity);
        oForm.addContent(oDisplayBase.createLabel("", "Colonia o Barrio*"));
        selectAppDgSuburb = oInputBase.createSelect("selectAppDgSuburb", "/results", oItemAppDgSuburb).setAutoAdjustWidth(true);
        oForm.addContent(selectAppDgSuburb);
        oForm.addContent(oDisplayBase.createLabel("", "Calle*"));
        txtAppDgStreet = oInputBase.createInputText("txtAppDgStreet", "Text", "Ingrese Calle...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(40);
        oForm.addContent(txtAppDgStreet);
        oForm.addContent(oDisplayBase.createLabel("", "Número Exterior*"));
        txtAppDgNumExt = oInputBase.createInputText("txtAppDgNumExt", "Text", "Ingrese Número Exterior...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(10);
        oForm.addContent(txtAppDgNumExt);
        oForm.addContent(oDisplayBase.createLabel("", "Número Interior*"));
        txtAppDgNumInt = oInputBase.createInputText("txtAppDgNumInt", "Text", "Ingrese Número Interior...", "", true, true, "^(([A-Za-zÑñ0-9]+)\\s?)*$").setMaxLength(10);
        oForm.addContent(txtAppDgNumInt);

        if (isEdited) {
            //console.log(oModel);
            if (oModel.getProperty('/isCompany') === true) {
                chkRazonSocial.setSelected(true);
                chkRazonSocial.fireSelect({'selected': true});
                chkRazonSocial.setEditable(false);
            }else {
                chkRazonSocial.setSelected(false);
                chkRazonSocial.fireSelect({'selected': false});
                chkRazonSocial.setEditable(false);
            }
            txtAppDgEmpRazon.setValue(oModel.getProperty('/businessName'));
            txtAppDgEmpRazon.setEditable(false);
            txtAppDgEmpName.setValue(oModel.getProperty('/firstName'));
            txtAppDgEmpSecondName.setValue(oModel.getProperty('/middleName'));
            txtAppDgEmpLastname.setValue(oModel.getProperty('/lastName'));
            txtAppDgEmpSurname.setValue(oModel.getProperty('/secondName'));
            txtAppDgPostCode.setValue(oModel.getProperty('/postalCode'));
            oController.searchAddressByCP();
            selectAppDgEntity.setSelectedKey(oModel.getProperty('/stateId'));
            selectAppDgDelegation.setSelectedKey(oModel.getProperty('/townId'));
            txtAppDgCity.setValue(oModel.getProperty('/city'));
            selectAppDgSuburb.setSelectedKey(oModel.getProperty('/suburb'));
            txtAppDgStreet.setValue(oModel.getProperty('/street'));
            txtAppDgNumExt.setValue(oModel.getProperty('/outsideNumber'));
            txtAppDgNumInt.setValue(oModel.getProperty('/interiorNumber'));
        }

        return oForm;
    };
    sap.ui.mw.forms.applicants.References.prototype.createReferenceForm = function(_idForm, oController, oModel, isEdited) {
        //Middleware de componentes SAPUI5
        var oInputBase, oDisplayBase, oLayoutBase, oForm;
        //Variables campos de formulario
        var txtAppDgRefName, txtAppDgRefSecondName, txtAppDgRefLastname, txtAppDgRefSurname, txtAppDgRefPhone;
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();

        //Se agrega contenido a formulario}
        oForm = oLayoutBase.createForm("idDgContactForm", true, 1, "Agregar Referencia");
        oForm.addContent(oDisplayBase.createLabel("", "Primer Nombre *"));
        txtAppDgRefName = oInputBase.createInputText("txtAppDgRefName", "Text", "Ingrese Primer Nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(30);
        oForm.addContent(txtAppDgRefName);
        oForm.addContent(oDisplayBase.createLabel("", "Segundo Nombre"));
        txtAppDgRefSecondName = oInputBase.createInputText("txtAppDgRefSecondName", "Text", "Ingrese Segundo Nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(30);
        oForm.addContent(txtAppDgRefSecondName);
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Paterno*"));
        txtAppDgRefLastname = oInputBase.createInputText("txtAppDgRefLastname", "Text", "Ingrese Apellido Paterno...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*").setMaxLength(30);
        oForm.addContent(txtAppDgRefLastname);
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Materno"));
        txtAppDgRefSurname = oInputBase.createInputText("txtAppDgRefSurname", "Text", "Ingrese Apellido Materno...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(30);
        oForm.addContent(txtAppDgRefSurname);
        //Se quita campo nombre y se agregan campos para nombre completo separado nombre, segundo nombre, apellido peterno, apellido materno por integridad de datos con CRM
        /*oForm.addContent(oDisplayBase.createLabel("", "Nombre(s) y Apellidos"));
        oForm.addContent(oInputBase.createInputText("txtAppDgRefNames", "Text", "Ingresar nombre completo...", "", true, true, "^[A-Za-zÑñ+][\\s[A-Za-zÑñ]+]*$").setMaxLength(60));*/
        oForm.addContent(oDisplayBase.createLabel("", "Teléfono*"));
        txtAppDgRefPhone = oInputBase.createInputText("txtAppDgRefPhone", "Tel", "Ingrese Teléfono...", "", true, true, "^\\d{7,}$").setMaxLength(10);
        oForm.addContent(txtAppDgRefPhone);

        if (isEdited) {
            oForm.setModel(oModel, "oModelReference");
            //console.log(oModel);
            txtAppDgRefName.setValue(oModel.getProperty('/firstName'));
            txtAppDgRefSecondName.setValue(oModel.getProperty('/middleName'));
            txtAppDgRefLastname.setValue(oModel.getProperty('/lastName'));
            txtAppDgRefSurname.setValue(oModel.getProperty('/secondName'));
            txtAppDgRefPhone.setValue(oModel.getProperty('/contacPhone'));
        }

        return oForm;
    }

})();
