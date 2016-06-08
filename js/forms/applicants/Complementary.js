(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.forms.applicants.Complementary");
    jQuery.sap.require("sap.ui.base.Object");
    //Se agregan Middleware de componentes SAPUI5
    jQuery.sap.require("js.base.InputBase", "js.base.ActionBase", "js.base.DisplayBase", "js.base.LayoutBase", "js.base.PopupBase", "js.base.ListBase", "js.base.ContainerBase");


    sap.ui.base.Object.extend('sap.ui.mw.forms.applicants.Complementary', {});
    sap.ui.mw.forms.applicants.Complementary.prototype.createComplementaryForm = function(_idForm,oController) {
        //Middleware de componentes SAPUI5
        var oInputBase,
            oActionBase,
            oDisplayBase,
            oLayoutBase,
            oPopupBase,
            oListBase,
            oForm,
            oRadioButtons = [];
        //Se declaran objetos de Middleware de componentes SAPUI5
        oInputBase = new sap.ui.mw.InputBase();
        oActionBase = new sap.ui.mw.ActionBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();
        oPopupBase = new sap.ui.mw.PopupBase();
        oListBase = new sap.ui.mw.ListBase();

        //Se crea formulario
        oForm = oLayoutBase.createForm(_idForm, true, 1, "Complementarios");
        //se agregan objetos a formulario
        oForm.addContent(oDisplayBase.createLabel("", "¿Es persona física con actividad empresarial?"));
        oRadioButtons = [
            oInputBase.createRadioButtonForGroupName("rbNpActivity1-1", "Si"),
            oInputBase.createRadioButtonForGroupName("rbNpActivity1-2", "No")
        ];
        oForm.addContent(oInputBase.createRadioButtonGroup("rbGroupOption", oRadioButtons, 2, 1));
        oForm.addContent(oDisplayBase.createLabel("", "Homoclave*"));
        oForm.addContent(oInputBase.createInputText("txtAppKeyRFC", "Text", "Ingrese homoclave...", "", true, true, "^[A-Za-z0-9]{3}$").setMaxLength(3));
        oForm.addContent(oDisplayBase.createLabel("", "Número FIEL*"));
        oForm.addContent(oInputBase.createInputText("txtAppNumFIEL", "Number", "Ingrese número fiel...", "",true,true,"^[0-9]*$").setMaxLength(20));
        oForm.addContent(oDisplayBase.createLabel("complementCurp", "CURP"));
        oForm.addContent(oInputBase.createInputText("txtAppCURP", "Text", "Ingrese CURP...","",true,true,"^[A-Za-z]{1}[A-Za-z]{1}[A-Za-z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HMhm]{1}(AS|as|BC|bc|BS|bs|CC|cc|CS|cs|CH|ch|CL|cl|CM|cm|DF|df|DG|dg|GT|gt|GR|gr|HG|hg|JC|jc|MC|mc|MN|mn|MS|ms|NT|nt|NL|nl|OC|oc|PL|pl|QT|qt|QR|qr|SP|sp|SL|sl|SR|sr|TC|tc|TS|ts|TL|tl|VZ|vz|YN|yn|ZS|zs|NE|ne)[B-DF-HJ-NP-TV-Z|b-df-hj-np-tv-z]{3}[0-9A-Za-z]{1}[0-9]{1}$").setMaxLength(18));
        oForm.addContent(oDisplayBase.createLabel("", "Dependientes económicos*"));
        oForm.addContent(oInputBase.createInputText("txtAppDependents", "Number", "Ingrese dependientes económicos...","",true,true,"^[0-9]+$").setMaxLength(2));
        oForm.addContent(oDisplayBase.createLabel("", "Ocupación*"));
        var AppEmployment = new sap.ui.model.json.JSONModel("data-map/catalogos/occupation.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppEmployment = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppEmployment","/ocupacion",oItemAppEmployment,AppEmployment,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Correo electrónico"));
        var placeHolderEmail = "Ingrese correo electrónico...";
        oForm.addContent(oInputBase.createInputText("txtAppEmail", "Email", "INGRESE CORREO ELECTRONICO...", "", true, true, "^[_a-z0-9-]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,3})$"));
        oForm.addContent(oDisplayBase.createTitle("", "Actividad Económica"));
        /*********StartChange DVH 21-04-2016***********/
        /*GAP - El ID de la Clave de la actividad debe ser dato básico - 53*/
        /**********************************************/
        //oForm.addContent(oDisplayBase.createLabel("", "Giro*"));
        //var TypeBussines = new sap.ui.model.json.JSONModel("data-map/catalogos/rolAE.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        //var oItemAppTypeBussines = new sap.ui.core.Item({
        //    key: "{idCRM}",
        //    text: "{text}"
        //});
        //oForm.addContent(oInputBase.createSelect("selectTypeBussines","/giro",oItemAppTypeBussines,TypeBussines,null,null));
        //oForm.addContent(oDisplayBase.createLabel("", "Industria o Sector*"));
        /* var AppIndustry = new sap.ui.model.json.JSONModel("data-map/catalogos/industry.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppIndustry = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });*/
        //oForm.addContent(oInputBase.createComboBox("selectAppIndustry",null,null,null,oController.onChangeIndustry, oController).setEnabled(false));
        //oForm.addContent(oDisplayBase.createLabel("", "Actividad económica*"));
        /*
        var AppActEconomic = new sap.ui.model.json.JSONModel("data-map/catalogos/activityE.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppActEconomic = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });*/
        //oForm.addContent(oInputBase.createComboBox("selectAppActEconomic",null,null,null,oController.onChangeActEconomic,oController).setEnabled(false));
        //oForm.addContent(oDisplayBase.createLabel("", "Clave de actividad económica*"));
        //oForm.addContent(oInputBase.createInputText("txtAppKeyActivity", "Text", "0000000", "0000000", true, false));
        /*********EndChange DVH 21-04-2016***********/
        /*GAP - El ID de la Clave de la actividad debe ser dato básico - 53*/
        /**********************************************/
        oForm.addContent(oDisplayBase.createLabel("", "¿Cuánto tiempo tiene realizando la actividad?*"));
        var AppTimeActivity = new sap.ui.model.json.JSONModel("data-map/catalogos/antiguedad.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppTimeActivity = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppTimeActivity","/antiguedad",oItemAppTimeActivity,AppTimeActivity,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "¿Cómo realiza la actividad económica?*"));
        var AppHowActivity = new sap.ui.model.json.JSONModel("data-map/catalogos/realizaAE.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppHowActivity = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppHowActivity","/realizaAE",oItemAppHowActivity,AppHowActivity,null,null));
        oForm.addContent(oDisplayBase.createLabel("", ""));
        oForm.addContent(oDisplayBase.createLabelHTML("", "", "¿Cuál es la aportación del negocio en el ingreso del hogar?").addStyleClass("sapLabelWrap"));
        oForm.addContent(oDisplayBase.createLabel("", ""));
        var AppInputEconomic = new sap.ui.model.json.JSONModel("data-map/catalogos/inputHome.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppInputEconomic = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppInputEconomic","/aporta",oItemAppInputEconomic,AppInputEconomic,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Otra fuente de ingresos"));
        var AppOtherInput = new sap.ui.model.json.JSONModel("data-map/catalogos/otherIngess.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppOtherInput = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppOtherInput","/ingreso",oItemAppOtherInput,AppOtherInput,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Tiempo en el Negocio Actual*"));
        var AppBussinesTimeInput = new sap.ui.model.json.JSONModel("data-map/catalogos/timeBusiness.json");
        var oItemAppBussinesTime = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppCurrentTime", "/antiguedad", oItemAppBussinesTime, AppBussinesTimeInput,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "¿El local es?*"));
        var AppLocal = new sap.ui.model.json.JSONModel("data-map/catalogos/local.json");
        //Cargamos el catálogo de Tipos de Pagos de Seguros
        var oItemAppLocal = new sap.ui.core.Item({
            key: "{idCRM}",
            text: "{text}"
        });
        oForm.addContent(oInputBase.createSelect("selectAppLocal","/tipoLocal",oItemAppLocal,AppLocal,null,null));
        oForm.addContent(oDisplayBase.createLabel("", "Sueldo Mensual"));
        oForm.addContent(oInputBase.createInputText("txtAppSalary", "Number", "Ingrese sueldo mensual...","",true,true,"^([0-9]+)(\\.?[0-9]{2})?$").setMaxLength(20));


        return oForm;
    }

})();
