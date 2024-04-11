import * as React from "react";
export interface State {
    tableData: object;
    size: number;
    background?: string;
    borderWidth?: number;
    loaded: boolean;
    goals: any[];
    allIndicators: any[];
    indicator: any[];
    openGoals: any[];
    openSubgoals: any[];
    districts: any[];
    districtColors: any[];
    goalColors: any[];
    showLabels: boolean;
    showTrends: boolean;
    showTargets: boolean;
    mode: string;
    selectedIndicators: any[];
    currentChartIndicator?: string;
    currentChartData?: any[];
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
    setIndicator(indicatorName: string): void;
    colorLookup(district: string): any;
    getGoalColor(goal: string): any;
    toggleIndicator: (e: any) => void;
    render(): React.JSX.Element;
}
