require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/renderers/DotDensityRenderer",
    "esri/widgets/Legend",
    "esri/widgets/Home",
    "esri/widgets/Expand"
], function(
    Map,
    MapView,
    FeatureLayer,
    DotDensityRenderer,
    Legend,
    Home,
    Expand
){
    const map = new Map({
        basemap: "dark-gray-vector"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-95.444, 29.756],
        zoom: 8
    });

    //After the view is loaded create the renderer for the layer
    view.when().then(function(){
        const dotDensityRenderer = new DotDensityRenderer({
            referenceDotValue: 50,
            outline: null,
            referenceScale: 577790,
            legendOptions: {
                unit: "people"
            },
            attributes: [
                {
                    field: "Pop_White",
                    color: "#f23c3f",
                    label: "White (non-Hispanic)"
                },{
                    field: "Pop_Hispanic",
                    color: "#e8ca0d",
                    label: "Hispanic"
                },{
                    field: "Pop_Black",
                    color: "#00b6f1",
                    label: "Black or African American"
                },{
                    field: "Pop_Asian",
                    color: "#32ef94",
                    label: "Asian"
                },{
                    field: "Pop_Other",
                    color: "#ff6a00",
                    label: "Other race"
                }
            ]
        });

        const tractRenderer = {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: "#efefef",
                width: 0.5
            }
        };

        //Add the feature layer
        const layer = new FeatureLayer({
            url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Tracts/MapServer/0",
            title: "Census Tract Population by Race",
            maxScale: 30000,
            minScale: 2000000,
            renderer: dotDensityRenderer
        });
        const layerOutline = new FeatureLayer({
            url: "https://gis.h-gac.com/arcgis/rest/services/Census_ACS/Census_ACS_5Yr_Tracts/MapServer/0",
            minScale: 2000000,
            renderer: tractRenderer
        });
        map.add(layerOutline);
        map.add(layer);

        //Add the extra widgets to the map
        view.ui.add([
            new Home({
                view: view,
            }),
            new Expand({
                view: view,
                content: new Legend({view: view, layerInfos:[{layer:layer}]}),
                group: "top-left",
                expanded: true
            })            
        ], "top-left");
    });
});
