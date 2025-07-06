import {ComposedChart, Tooltip, XAxis, YAxis, Area, Line,ResponsiveContainer, ReferenceLine, Legend} from 'recharts';
import { DateToMonth, DateToDay } from '../../utils/formatDate';


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // Extract values from payload
        const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
        const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
        const balance = payload.find((p: any) => p.dataKey === 'balance')?.value || 0;

        return (
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg min-w-[200px]">
                <p className="font-bold text-gray-800 mb-3 text-center">{label}</p>
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
    xLabelKey:"date"|"period"|string ,
    dateFormat?:"month"|"day",
    dateKey?:"date"|"period",
    colors?:string[]}){

   let formatedData;
   if(dateFormat==="month"){
        if(dateKey==="date"){
            formatedData= data.map((item) => ({ ...item, date: DateToMonth(item.date) }));
        }else if(dateKey="period"){
            formatedData= data.map((item) => ({ ...item, period: DateToMonth(item.period) }));
        }else{
            formatedData = data;
        }
    }else if(dateFormat==="day"){
        if(dateKey==="date"){
            formatedData= data.map((item) => ({ ...item, date: DateToDay(item.date, true) }));
        }else if(dateKey="period"){
            formatedData= data.map((item) => ({ ...item, period: DateToDay(item.period, true) }));
        }else{
            formatedData = data;
        }
    }else{
        formatedData = data;
    }
    return(
        <div className="w-full h-full">
            <ResponsiveContainer>
                <ComposedChart data={formatedData} width={500} height={400}>
                    <XAxis dataKey={xLabelKey}/>
                    <YAxis/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend/>
                    {dataKey.map((dataItem, index)=>(
                        <Line type="monotone" dataKey={dataItem} dot={false} stroke={colors?.[index]||'#000000'} strokeWidth={2}/>
                    ))}
                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" strokeWidth={2}/>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};



export default PredictionChart;