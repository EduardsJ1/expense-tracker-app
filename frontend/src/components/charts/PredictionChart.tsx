import {ComposedChart, Tooltip, XAxis, YAxis, Area, Line,ResponsiveContainer, ReferenceLine, Legend} from 'recharts';
import { DateToMonth, DateToDay } from '../../utils/formatDate';
import { useState } from 'react';


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        //console.log(payload);
        
        const payloadData=payload[0]?.payload;
        const income = payloadData?.income || 0;
        const expense = payloadData?.expense || 0;
        const balance = payloadData?.balance || 0;

        const fullDate = payloadData?.fullDate || 
                        payloadData?.fullPeriod || 
                        payloadData?.date || 
                        payloadData?.period || 
                        label;

        return (
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg min-w-[200px]">
                <p className="font-bold text-gray-800 mb-3 text-center">{fullDate}</p>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-green-600 font-medium">Income:</span>
                        <span className="font-semibold">${income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-red-600 font-medium">Expense:</span>
                        <span className="font-semibold">${expense.toLocaleString()}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between items-center">
                        <span className={`font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Balance:
                        </span>
                        <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${balance.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};



function PredictionChart({data,dataKey,xLabelKey,dateFormat="month",dateKey,colors}:
    {data:any[],
    dataKey:string[],
    xLabelKey:"date"|"period"|string,
    dateFormat?:"month"|"day",
    dateKey?:"date"|"period",
    colors?:string[]}){


    const [visibleLines,setVisibleLines]=useState<{[key: string]:boolean}>(
        dataKey.reduce((acc,key)=>({...acc,[key]:true}),{})
    );
    
    const CustomLegend = () => {
        return (
            <div className="flex justify-center gap-6 mb-4">
                {dataKey.map((key, index) => (
                    <div
                        key={key}
                        className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded transition-all duration-200 hover:bg-gray-100 ${
                            !visibleLines[key] ? 'opacity-50' : 'opacity-100'
                        }`}
                        onClick={() => handleLegendClick({ dataKey: key })}
                    >
                        <div
                            className="w-4 h-0.5 rounded"
                            style={{ 
                                backgroundColor: visibleLines[key] ? (colors?.[index] || '#000000') : '#ccc'
                            }}
                        />
                        <span className={`text-sm font-medium capitalize ${
                            !visibleLines[key] ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}>
                            {key}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

   let formatedData;
   const YearLines:any[] = [];
   if(dateFormat==="month"){
        if(dateKey==="date"){
            formatedData= data.map((item,index) => {
            const formatedDate= DateToMonth(item.date);
            if(formatedDate && formatedDate.includes('Jan')){
                const year = new Date(item.date).getFullYear();
                YearLines.push({
                position:index,
                year: year,
                })
            }
            return { ...item, date: formatedDate };
            });
        }else if(dateKey==="period"){
            formatedData= data.map((item,index) => {
            const formatedPeriod = DateToMonth(item.period);
            if(formatedPeriod && formatedPeriod.includes('Jan')){
                const year = new Date(item.period).getFullYear();
                YearLines.push({
                position: index,
                year: year,
                })
            }
            return { ...item, period: formatedPeriod };
            });
        }else{
            formatedData = data;
        }
    }else if(dateFormat==="day"){
        if(dateKey==="date"){
            formatedData= data.map((item,index) => {
            const day = DateToDay(item.date, false)
            const dayWithMonth = DateToDay(item.date, true);
            if(dayWithMonth && (dayWithMonth ==='1 Jan')){
                const year = new Date(item.date).getFullYear();
                YearLines.push({
                position: index,
                year: year,
                })
            }

            return{ 
                ...item, 
                date: day,
                fullDate: dayWithMonth,
            }
            });
        }else if(dateKey==="period"){
            formatedData= data.map((item,index) => {
            const day = DateToDay(item.period, false)
            const dayWithMonth = DateToDay(item.period, true);
            if(dayWithMonth && (dayWithMonth ==='1 Jan')){
                const year = new Date(item.period).getFullYear();
                YearLines.push({
                position: index,
                year: year,
                })
            }
            return { 
                ...item, 
                period: day,
                fullPeriod: dayWithMonth
            }
            });
        }else{
            formatedData = data;
        }
    }else{
        formatedData = data;
    }

    const getMonthStartLines = () => {
    const monthStarts = [];
    if(dateFormat==="day"){
        for (let i = 0; i < formatedData.length; i++) {
            const item = formatedData[i];
            
            const fullDateStr = item.fullDate || item.fullPeriod;
            
            if (fullDateStr) {
                const parts = fullDateStr.split(' ');
                const day = parts[0];
                const monthName = parts[1];
                
                if (day === '1') {
                    monthStarts.push({
                        position: i,
                        monthName: monthName,
                        fullDate: fullDateStr,
                    });
                }
            }
        }
        return monthStarts;
    }else{
        return [];
    }
    
    
};
    const monthStartLines = getMonthStartLines();
    //console.log(monthStartLines);

    //console.log(formatedData);
     const handleLegendClick = (payload: any) => {
        const dataKey = payload.dataKey;
        setVisibleLines(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));
    };

    return(
        <div className="w-full h-full">
            <ResponsiveContainer>
                <ComposedChart data={formatedData} width={500} height={400}>
                    <XAxis dataKey={xLabelKey}/>
                    <YAxis/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend content={CustomLegend}/>
                    {dataKey.map((dataItem, index)=>(
                        visibleLines[dataItem]&&(
                        <Line type="monotone" dataKey={dataItem} dot={false} stroke={colors?.[index]||'#000000'} strokeWidth={2}/>
                        )
                    ))}
                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" strokeWidth={2}/>
                    {monthStartLines.map((monthStart,index)=>(
                        <ReferenceLine 
                            key={`month-${index}`}
                            x={monthStart.position} 
                            stroke="#999" 
                            
                            strokeWidth={1}
                            opacity={0.7}
                            label={{ 
                                value: monthStart.monthName, 
                                position:{x:5,y:5},
                                offset: 5,
                                style: { 
                                    textAnchor: 'start',
                                    fontSize: '12px',
                                    fill: '#666',
                                    fontWeight: 'bold'
                                }
                            }}
                        />
                    ))}
                    {YearLines.map((YearStart,index)=>(
                        <ReferenceLine
                            key={`year-${index}`} 
                            x={YearStart.position} 
                            stroke="#999" 
                            
                            strokeWidth={1}
                            opacity={0.7}
                            label={{ 
                                value: YearStart.year, 
                                position:{x:5,y:20},
                                offset: 5,
                                style: { 
                                    textAnchor: 'start',
                                    fontSize: '12px',
                                    fill: '#666',
                                    fontWeight: 'bold'
                                }
                            }}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};




export default PredictionChart;