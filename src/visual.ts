"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { SiocVisual, initialState } from "./component";    

import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private viewport: IViewport;

    constructor(options: VisualConstructorOptions) {
        

        this.reactRoot = React.createElement(SiocVisual, {});
        this.target = options.element;

        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {

        if(options.dataViews && options.dataViews[0]){
            const dataView: DataView = options.dataViews[0];

            this.viewport = options.viewport;
            const { width, height } = this.viewport;
            const size = Math.min(width, height);
            const tableData = options.dataViews[0].table;

            SiocVisual.update({
                loaded: false,
                tableData,
                size,
                goals: [],
                data: [],
                indicator: '',
                openGoals: [],
                openSubgoals: [],
                districts: [],
                districtColors: [],
                goalColors: [],
                showLabels: true,
                showTrends: true,
                showTargets: true
            });

        } else {
            this.clear();
        }

    }

    private clear() {
        SiocVisual.update(initialState);
    }
}