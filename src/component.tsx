import * as React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Scrollbars } from 'rc-scrollbars';


export interface State {
    tableData: object,
    size: number,
    background?: string,
    borderWidth?: number,
    loaded: boolean,
    goals: any[],
    allIndicators: any[],
    indicator: any[],
    openGoals: any[],
    openSubgoals: any[],
    districts: any[],
    districtColors: any[],
    goalColors: any[],
    showLabels: boolean,
    showTrends: boolean,
    showTargets: boolean,
    mode: string,
    selectedIndicators: any[],
    currentChartIndicator?: string,
    currentChartData?: any[],
}

export const initialState: State = {
    tableData: {},
    size: 200,
    loaded: false,
    goals: [],
    allIndicators: [],
    indicator: [],
    openGoals: [],
    openSubgoals: [],
    districts: [],
    districtColors: [],
    goalColors: [],
    showLabels: true,
    showTrends: true,
    showTargets: true,
    mode: 'table',
    selectedIndicators: [],
    currentChartIndicator: '',
    currentChartData: [],
}

export class SiocVisual extends React.Component<{}, State>{
    constructor(props: any) {
        super(props);
        this.state = initialState;
    }

    private static updateCallback: (data: object) => void = null;

    public static update(newState: State) {
        if (typeof SiocVisual.updateCallback === 'function') {
            SiocVisual.updateCallback(newState);
        }
    }

    public state: State = initialState;

    public componentWillMount() {
        SiocVisual.updateCallback = (newState: State): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        SiocVisual.updateCallback = null;
    }

    public componentDidMount() {

        let self = this;

        // loop until we have all the data
        let loop = setInterval(() => {
            let tableData = self.state.tableData;
            if (tableData['rows'] && tableData['rows'].length > 0) {
                clearInterval(loop);
                self.setState({
                    districtColors: [
                        { district: 'JTG District', color: '#f2c265' },
                        { district: 'Tsantsabane', color: '#425ce7' },
                        { district: 'Thabazimbi', color: '#8f5b9b' },
                        { district: 'Thabazimbi Dwaalboom', color: '#58b2b8' },
                        { district: 'Gamagara', color: '#4caf50' },
                        { district: 'Joe Morolong', color: '#ff9800' },
                        { district: 'Ga-Segonyana', color: '#ff5722' }
                    ],

                    goalColors: [
                        { goal: '3. Good Health and Well Being', color: '#4c9f38' },
                        { goal: '4. Quality Education', color: '#c5192d' },
                        { goal: '8. Decent Work and Economic Growth', color: '#007fc7' },
                        { goal: '9. Industry Innovation and Infrastructure', color: '#fd6925' },
                        { goal: '13. Climate Action', color: '#3f7e44' },
                        { goal: '17. Partnerships for the goals', color: '#19486a' }
                    ],
                    loaded: true
                }, () => {
                    self.processData();
                })
            }
        }, 1000);
    }

    public processData() {

        let self = this;

        // Columns are: Actual, Beneficiary, Data Type, Goals, Id, Indicator, Sub Goals, Year, Year Type

        // GOALS

        let tempGoals = self.state.tableData['rows'].map((item: any) => {
            return item[3];
        });

        let goalsArr = [...new Set(tempGoals)];

        goalsArr.sort((a: any, b: any) => {
            return a.split('.')[0] - b.split('.')[0];
        });

        let goals = goalsArr.map(goal => {
            return {
                goal: goal,
                color: "#ccc",
                subgoals: [],
            };
        });

        // SUBGOALS

        let tempSubgoals = self.state.tableData['rows'].map((item: any) => {
            return item[6];
        });

        let subgoals = [...new Set(tempSubgoals)];

        // sort subgoals by number
        subgoals.sort((a: any, b: any) => {
            return a.split('.')[0] - b.split('.')[0];
        });

        goals.forEach((goal: any) => {

            let number = goal['goal'].split('.')[0];

            subgoals.forEach((subgoal: any) => {
                if (subgoal.split('.')[0] == number) {
                    goal['subgoals'].push({
                        subgoal: subgoal,
                        indicators: []
                    });
                }
            })


        });

        // INDICATORS

        let allIndicators = [];

        goals.forEach((goal: any) => {
            goal.subgoals.forEach((subgoal: any) => {
                self.state.tableData['rows'].forEach((item: any) => {
                    if (item[6] == subgoal.subgoal) {
                        subgoal.indicators.push(item[5]);
                    }
                })
                // remove duplicates
                subgoal.indicators = [...new Set(subgoal.indicators)];

                // sort indicators by number
                subgoal.indicators.sort((a: any, b: any) => {
                    return a.split('.')[1] - b.split('.')[1];
                });


                // INDICATOR DATA

                subgoal.indicators.forEach((indicator: any) => {

                    // get all data with this indicator
                    let data = self.state.tableData['rows'].filter((item: any) => {
                        return item[5] == indicator;
                    });

                    let dataArr = [];

                    /*
                    0: 0
                    1: "Tsantsabane"
                    2: "Percentage"
                    3: "3. Good Health and Well Being"
                    4: 207
                    5: "3.3.2 Tuberculosis incidence per 100,000 population"
                    6: "3.3 End the epidemics of AIDS, tuberculosis, and combat hepatitis, water-borne diseases and other communicable diseases"
                    7: 2023
                    8: "Baseline"
                    */


                    // get all the unique years
                    let years = [...new Set(data.map((item: any) => {
                        return item[7];
                    }))];

                    // sort years
                    years.sort((a: any, b: any) => {
                        return a - b;
                    });

                    // get all the unique districts
                    let districts = [...new Set(data.map((item: any) => {
                        return item[1];
                    }))];

                    // sort districts
                    districts.sort((a: any, b: any) => {
                        return a - b;
                    });

                    self.setState({
                        districts: districts
                    })

                    // loop through years and districts and add data to array
                    years.forEach((year: any) => {

                        dataArr.push({
                            year: year,
                        });

                    })


                    districts.forEach((district: any) => {
                        let districtData = data.filter((item: any) => {
                            return item[1] == district;
                        });

                        districtData.forEach((item: any) => {
                            dataArr.forEach((data: any) => {
                                if (data.year == item[7]) {
                                    data[district] = item[0];
                                }
                            })
                        })

                    })

                    let indicatorObj = {
                        goal: goal.goal,
                        sdg: goal.goal.split('.')[0],
                        subgoal: subgoal.subgoal,
                        name: indicator,
                        data: dataArr
                    }

                    allIndicators.push(indicatorObj);

                })


                // Ok leave for tomorrow, but what I need to do is:







            })
        })

        self.setState({
            goals: goals,
            allIndicators: allIndicators
        })

    }

    public toggleGoal(type: string, goal: string) {
        let self = this;

        if (type == 'goal') {

            let openGoals = self.state.openGoals;

            if (openGoals.includes(goal)) {
                openGoals = openGoals.filter((item: any) => {
                    return item != goal;
                });
            } else {
                openGoals.push(goal);
            }

            self.setState({
                openGoals: openGoals
            })

        } else {

            let openSubgoals = self.state.openSubgoals;

            if (openSubgoals.includes(goal)) {
                openSubgoals = openSubgoals.filter((item: any) => {
                    return item != goal;
                });
            } else {
                openSubgoals.push(goal);
            }

            self.setState({
                openSubgoals: openSubgoals
            })

        }

    }

    public setIndicator(indicatorName: string) {
        let self = this;

        self.setState({
            currentChartIndicator: indicatorName,

        })
    }

    public colorLookup(district: string) {
        let self = this;

        let color = self.state.districtColors.find(dc => dc.district == district);

        return color ? color.color : '#000000';
    }

    public getGoalColor(goal: string) {
        let self = this;

        let color = self.state.goalColors.find(dc => dc.goal == goal);

        return color ? color.color : '#000000';
    }

    public toggleIndicator = (e: any) => {
        let self = this;

        let value = e.target.value;

        let selectedIndicators = self.state.selectedIndicators;

        if (selectedIndicators.includes(value)) {
            selectedIndicators = selectedIndicators.filter((item: any) => {
                return item != value;
            });
        } else {
            selectedIndicators.push(value);
        }

        self.setState({
            selectedIndicators: selectedIndicators
        }, () => {
            // console.log(self.state.selectedIndicators);
        })



    }


    render() {

        let self = this;

       

        return (

            <>

                <header>

                    <div className="header-left">
                        <div className="logo"></div>
                    </div>
                    <div className="header-right">
                        <div className="mode-label">View As</div>
                        <div className={self.state.mode == 'chart' ? 'mode-btn selected' : 'mode-btn'} onClick={() => self.setState({ mode: 'chart' })}>Chart</div>
                        <div className={self.state.mode == 'table' ? 'mode-btn selected' : 'mode-btn'} onClick={() => self.setState({ mode: 'table' })}>Table</div>
                    </div>


                </header>


                <div className="dashboard-container" style={{height: '90%'}}>
                    <div className="dashboard-menu">
                        <Scrollbars style={{ width: '100%', height: '100%' }}>
                        <div className="dashboard-menu-container">
                            {
                                self.state.goals.length > 0 ? (
                                    self.state.goals.map(goal => {
                                        return (<div className={self.state.openGoals.includes(goal.goal) ? 'goal open' : 'goal'}>
                                            <div className={'goal-trigger'} style={{ backgroundColor: this.getGoalColor(goal.goal) }} onClick={() => (this.toggleGoal('goal', goal.goal))}>{goal.goal}</div>
                                            <div className="goal-content">
                                                {
                                                    goal['subgoals'].map((subgoal: any) => {
                                                        return <div className={self.state.openSubgoals.includes(subgoal.subgoal) ? 'subgoal open' : 'subgoal'}>
                                                            <div className="subgoal-trigger" onClick={() => this.toggleGoal('subgoal', subgoal.subgoal)}>
                                                                {subgoal.subgoal.substring(0, 35) + '...'}
                                                            </div>
                                                            <div className="indicators">
                                                                {
                                                                    subgoal.indicators.map((indicator: any) => {
                                                                        return <div className={self.state.currentChartIndicator == indicator ? 'indicator selected' : 'indicator'} onClick={() => this.setIndicator(indicator)}>
                                                                            {
                                                                                self.state.mode == 'table' &&
                                                                                <input type="checkbox" value={indicator}
                                                                                    checked={self.state.selectedIndicators.includes(indicator)}
                                                                                    onChange={self.toggleIndicator}
                                                                                ></input>
                                                                            }
                                                                            {indicator}</div>
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>)
                                    })
                                ) : ''
                            }
                        </div>
                        </Scrollbars>
                    </div>
                    <div className="dashboard-content">
                        <Scrollbars style={{ width: '100%', height: '100%' }}>
                        {(self.state.currentChartIndicator != '') ? (

                            <>
                                {
                                    self.state.mode == 'chart' &&
                                    <>
                                        <h2>{self.state.currentChartIndicator}</h2>

                                        <div className="toolbar">

                                            <div className="toolbar-item">
                                            </div>

                                            {/* <div className="toolbar-item">
                                                <div className="toolbar-item">
                                                    <label>Targets</label>
                                                    <input type="checkbox" id="showTargets" name="showTargets" checked={self.state.showTargets} onChange={() => self.setState({ showTargets: !self.state.showTargets })} />
                                                </div>
                                                <div className="toolbar-item">
                                                    <label>Trends</label>
                                                    <input type="checkbox" id="showTrends" name="showTrends" checked={self.state.showTrends} onChange={() => self.setState({ showTrends: !self.state.showTrends })} />
                                                </div>
                                                <div className="toolbar-item">
                                                    <label>Labels</label>
                                                    <input type="checkbox" id="showLabels" name="showLabels" checked={self.state.showLabels} onChange={() => self.setState({ showLabels: !self.state.showLabels })} />
                                                </div>
                                            </div> */}


                                        </div>
                                    </>
                                }
                                {
                                    (self.state.mode == 'chart' && self.state.currentChartIndicator != '') ?

                                        <div className="dashboard-chart" style={{ width: '100%', height: 450 }}>
                                            <ResponsiveContainer>

                                                <BarChart
                                                    width={700}
                                                    height={500}
                                                    data={self.state.allIndicators.find(ind => ind.name == self.state.currentChartIndicator)?.data}
                                                    margin={{
                                                        top: 5, right: 30, left: 20, bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="year" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    {
                                                        self.state.districts.map((district: any) => {
                                                            return <Bar
                                                                dataKey={district}
                                                                name={district}
                                                                fill={this.colorLookup(district)}
                                                            />
                                                        })
                                                    }
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        :

                                        <>

                                            {
                                                self.state.selectedIndicators.length > 0 &&

                                                <>
                                                    {
                                                        self.state.selectedIndicators.map((indicator: any) => {
                                                            return <div className="indicator">
                                                                <h3><div className={`sdg-${self.state.allIndicators.find(ind => ind.name == indicator)?.sdg} sdg-icon`}></div><div className="sdg-title">{indicator}</div></h3>

                                                                <div className="dashboard-table">
                                                                    <table>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Region</th>
                                                                                {
                                                                                    self.state.allIndicators.find(ind => ind.name == indicator)?.data.map((item: any) => {
                                                                                        return <th>{item.year}</th>
                                                                                    })
                                                                                }
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                self.state.districts.map((district: any) => {
                                                                                    return <tr>
                                                                                        <td>{district}</td>
                                                                                        {
                                                                                            self.state.allIndicators.find(ind => ind.name == indicator)?.data.map((item: any) => {
                                                                                                return <td>{item[district]}</td>
                                                                                            })
                                                                                        }
                                                                                    </tr>
                                                                                })
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                            </div>
                                                        })
                                                    }
                                                </>


                                            }



                                        </>

                                }

                            </>
                        ) : ''}
                    </Scrollbars>
                    </div>
                </div>
            </>
        )
    }
}