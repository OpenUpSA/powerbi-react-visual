import * as React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];



export interface State {
    textLabel: string,
    textValue: string,
    size: number,
    background?: string,
    borderWidth?: number
}

export const initialState: State = {
    textLabel: "",
    textValue: "",
    size: 200
}

export class ReactCircleCard extends React.Component<{}, State>{
    constructor(props: any){
        super(props);
        this.state = initialState;
    }

    private static updateCallback: (data: object) => void = null;

    public static update(newState: State) {
        if(typeof ReactCircleCard.updateCallback === 'function'){
            ReactCircleCard.updateCallback(newState);
        }
    }

    public state: State = initialState;

    public componentWillMount() {
        ReactCircleCard.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        ReactCircleCard.updateCallback = null;
    }

    render(){
        const { textLabel, textValue, size, background, borderWidth } = this.state;

        const style: React.CSSProperties = { width: size, height: size, background, borderWidth };

        return (
            <>
                <div className="circleCard" style={style}>
                    <p>
                        {textLabel}
                        <br/>
                        <em>{textValue}</em>
                    </p>
                </div>
                <h1>SIOCVIZ</h1>
                <LineChart width={600} height={300} data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                </LineChart>
            </>
        )
    }
}