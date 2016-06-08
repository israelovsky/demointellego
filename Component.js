jQuery.sap.declare("com.gentera.Component");

sap.ui.core.UIComponent.extend("com.gentera.Component", {
    metadata: {
        routing: {
            config: {
                viewType: "JS",
                viewPath: "originacion",
                targetControl: "navContainer",
                targetAggregation: "pages",
                clearTarget: false,
                transition: "slide"
            },
            routes: [{
                pattern: "",
                name: "DashBoard",
                view: "DashBoard"
            }]
        }
    }
});

com.gentera.Component.prototype.init = function() {
    jQuery.sap.require("sap.ui.core.routing.History");
    jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

    sap.ui.core.UIComponent.prototype.init.apply(this);
    console.log(this);
    var router = this.getRouter();
    console.log(router);
    this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
    router.initialize();
};
com.gentera.Component.prototype.destroy = function() {
    if (this.routeHandler) {
        this.routeHandler.destroy();
    }
    sap.ui.core.UIComponent.destroy.apply(this, arguments);
};
com.gentera.Component.prototype.createContent = function() {
    this.view = sap.ui.view({
        id: "app",
        viewName: "originacion.App",
        type: sap.ui.core.mvc.ViewType.JS
    });
    return this.view;
};
