import * as React from "react";
export interface State {
    tableData: object;
    size: number;
    background?: string;
    borderWidth?: number;
    loaded: boolean;
    goals: any[];
    data: any[];
    indicator: string;
    openGoals: any[];
    openSubgoals: any[];
    districts: any[];
    districtColors: any[];
    goalColors: any[];
    showLabels: boolean;
    showTrends: boolean;
    showTargets: boolean;
}
export declare const initialState: State;
export declare class SiocVisual extends React.Component<{}, State> {
    constructor(props: any);
    private static updateCallback;
    static update(newState: State): void;
    state: State;
    componentWillMount(): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    processData(): void;
    toggleGoal(type: string, goal: string): void;
    setIndicator(indicator: string): void;
    colorLookup(district: string): any;
    getGoalColor(goal: string): any;
    render(): React.JSX.Element;
}
