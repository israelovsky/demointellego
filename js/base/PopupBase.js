(function() {
    "use strict";
    jQuery.sap.declare("sap.ui.mw.PopupBase");
    jQuery.sap.require("sap.ui.base.Object");

    sap.ui.base.Object.extend('sap.ui.mw.PopupBase', {});
    sap.ui.mw.PopupBase.prototype.createDialog = function(_id, _title, _type, _icon) {
        var oDialog = new sap.m.Dialog(_id, {
            title: _title,
            type: _type,
            icon: _icon
        });

        return oDialog;

    };
})();
