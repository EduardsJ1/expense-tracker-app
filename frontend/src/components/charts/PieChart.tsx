import { PieChart as PieWrapper, Pie,Cell,Tooltip,Label, Legend, ResponsiveContainer  } from "recharts";

interface TooltipProps{
    active?:boolean,
    payload?:any[],
    label?:string,
    valueSign?:string,
    showLabel?:boolean;
}


const CustomToolTip=({active,payload,label="Category",valueSign="$",showLabel=true}:TooltipProps)=>{
    if(active && payload && payload.length){
        return(
            <div className="bg-white rounded-2xl p-3 shadow-lg border border-neutral-200">
                {showLabel &&(
                    <p className="flex justify-between gap-5 border-b-1 pb-1 border-neutral-400">
                        <span className="font-medium">{label}:</span><span>{payload[0].name}</span>
                    </p>
                )}
                <p className="text-right font-semibold">
                    {valueSign} {payload[0].value}
                </p>
            </div>
        );
    }
}

function generateColors(amount: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < amount; i++) {
        // Generate evenly spaced hues around the color wheel
        const hue = Math.floor((360 / amount) * i);
        // Use HSL to generate vibrant colors, then convert to hex
        const color = `#${hslToHex(hue, 30, 50)}`;
        colors.push(color);
    }
    return colors;
}

// Helper to convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `${f(0)}${f(8)}${f(4)}`;
}


const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className={`font-medium ${percent*100<2?"hidden":""}`}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


interface PieChartProps{
    data:any[],
    valueData:string,
    valueName:string,
    label?:string,
    valueSign?:string,
    showLabel?:boolean;
}

function PieChart(
    {data, valueData,valueName,label="Category",valueSign="$",showLabel=true}:PieChartProps){
    const COLORS = generateColors(data.length);
    
    return(
        <ResponsiveContainer>
            <PieWrapper width={400} height={400}>
                <Pie data={data} nameKey={valueName} dataKey={valueData} label={renderCustomizedLabel} labelLine={false}>
                    {data.map((entry,index)=>(
                        <Cell key={`cell-${index}`} fill={COLORS[index]}/>
                    ))}
                </Pie>
                <Tooltip content={(props)=>(<CustomToolTip {...props} label={label} valueSign={valueSign} showLabel={showLabel}/>)}/>
                <Legend/>
            </PieWrapper>
        </ResponsiveContainer>
    )
}

export default PieChart;