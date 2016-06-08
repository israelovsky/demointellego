sap.ui.jsview("originacion.DashBoard", {

    /** Specifies the Controller belonging to this View.
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf originacion.DashBoard
     */
    getControllerName: function() {
        return "originacion.DashBoard";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf originacion.DashBoard
     */
    createContent: function(oController) {
        var oDashBoardPage, oHeaderBar, oImageIntellego, oForm, oDisplayBase, oInputBase;
        jQuery.sap.require(
            "js.base.InputBase",
            "js.base.ActionBase",
            "js.base.DisplayBase",
            "js.base.LayoutBase",
            "js.base.PopupBase",
            "js.base.TileBase",
            "js.base.ListBase",
            "js.base.ContainerBase"
        );

        oTileBase = new sap.ui.mw.TileBase();
        oContainerBase = new sap.ui.mw.ContainerBase();
        oDisplayBase = new sap.ui.mw.DisplayBase();
        oActionBase = new sap.ui.mw.ActionBase();
        oInputBase = new sap.ui.mw.InputBase();
        oLayoutBase = new sap.ui.mw.LayoutBase();


        oHeaderBar= oContainerBase.createBar(null, oDisplayBase.createImage("idImg","img/logo.png"),oDisplayBase.createText("", "Concentrado de Encuestas") , null)

        oDashBoardPage = oContainerBase.createPage("dashBoardPoll", "Dashboard Encuestas Intellego", false, true, true, true, null, null, null);
        oDashBoardPage.setCustomHeader(oHeaderBar);

        return oDashBoardPage;
    }
});
