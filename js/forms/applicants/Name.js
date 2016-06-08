(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.applicants.Name");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase");


    sap.ui.base.Object.extend('sap.ui.mw.forms.applicants.Name', {});
    sap.ui.mw.forms.applicants.Name.prototype.createNameForm = function(_idForm, oController) {
        //Middleware de componentes SAPUI5
        var oInputBase, oActionBase, oDisplayBase, oLayoutBase, oPopupBase, oListBase;
        //Variables para formulario
        var oForm;
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oActionBase = new sap.ui.mw.ActionBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();
        oPopupBase = new sap.ui.mw.PopupBase();
        oListBase = new sap.ui.mw.ListBase();
        //Se crea formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "Nombre");
        //se agrega contenido a formulario
        oForm.addContent(oDisplayBase.createLabel("", "Primer Nombre*"));
        oForm.addContent(oInputBase.createInputText("txtAppFirstName", "Text", "Ingrese primer nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26));
        oForm.addContent(oDisplayBase.createLabel("", "Segundo Nombre"));
        oForm.addContent(oInputBase.createInputText("txtAppSecondName", "Text", "Ingrese segundo nombre...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26));
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Paterno*"));
        oForm.addContent(oInputBase.createInputText("txtAppLastName", "Text", "Ingrese Apellido Paterno...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26));
        oForm.addContent(oDisplayBase.createLabel("", "Apellido Materno"));
        oForm.addContent(oInputBase.createInputText("txtAppSurname", "Text", "Ingrese Apellido Materno...", "", true, true, "^(([A-Za-zÑñ]+)\\s?)*$").setMaxLength(26));
        oForm.addContent(oDisplayBase.createLabel("", "Producto*"));
        var dataProducts = new sap.ui.model.json.JSONModel("data-map/catalogos/productsIdCrm.json");

        var oItemProducts = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{productName}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppProduct", "/products", oItemProducts, dataProducts, null, null));
        oForm.addContent(oDisplayBase.createLabel("", "Id Oficina de Servicio"));
        oForm.addContent(oInputBase.createInputText("txtAppIdOffice", "Number", "", "", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Oficina de Servicio"));
        oForm.addContent(oInputBase.createInputText("txtAppOffice", "Text", "", "", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Fecha de Alta"));
        //var date = '"'+ new Date().toLocaleDateString() + '"';
        //var date = oDisplayBase.formatDate("", "dd-MM-yyyy");
        oForm.addContent(oInputBase.createInputText("pickerAppDate", "Text", "", "", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Rol"));
        oForm.addContent(oInputBase.createInputText("txtNpRol", "Text", "Prospecto", "Prospecto", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "Estatus Prospecto"));

        oForm.addContent(oInputBase.createSelect("selectAppStProspect", null, null, null, null, null).attachChange(oController.onChangeStProspect, oController));
        oForm.addContent(oDisplayBase.createLabel("lbAppReason", "Motivo"));
        var dataReasonProspect = new sap.ui.model.json.JSONModel("data-map/catalogos/motivoRechazo.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemReasonProspect = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppReason", "/Interesado", oItemReasonProspect, dataReasonProspect, null, null));


        oForm.addContent(oDisplayBase.createLabel("appDatePostCont", "Fecha"));
        //console.log(Date.now());



        var dateActual = moment(new Date).format('YYYY-MM-DD');
        var dateFuture = moment(new Date).add(3, 'month').format('YYYY-MM-DD');

        oForm.addContent(oInputBase.createDatePickerRange("pickerAppContact", dateActual, dateFuture, "dd.MM.yyyy", "dd.MM.yyyy"));
        // oForm.addContent(oInputBase.createDatePicker("pickerAppContact", "", "", "dd-MM-yyyy"));

        oForm.addContent(oDisplayBase.createLabel("appTimePostCont", "Hora"));
        oForm.addContent(oInputBase.createDateTimeInput("appTimeContect", "", "", "HH:mm", "Time", oController.onChangeTimeContact, oController));
        oForm.addContent(oDisplayBase.createLabel("", "Origen"));
        oForm.addContent(oInputBase.createInputText("txtAppOrigin", "Text", "Promocion directa", "Promocion directa", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "ID Lead"));
        oForm.addContent(oInputBase.createInputText("txtAppIdLead", "Text", "", "", true, false));
        oForm.addContent(oDisplayBase.createLabel("", "ID BP"));
        oForm.addContent(oInputBase.createInputText("txtAppIdBP", "Number", "", "", true, false));
        return oForm;
    }

})();
