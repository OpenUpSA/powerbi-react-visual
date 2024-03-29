import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var siocVizD403F370313746EC8035E81E1183C5A7_DEBUG: IVisualPlugin = {
    name: 'siocVizD403F370313746EC8035E81E1183C5A7_DEBUG',
    displayName: 'SiocViz',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["siocVizD403F370313746EC8035E81E1183C5A7_DEBUG"] = siocVizD403F370313746EC8035E81E1183C5A7_DEBUG;
}
export default siocVizD403F370313746EC8035E81E1183C5A7_DEBUG;