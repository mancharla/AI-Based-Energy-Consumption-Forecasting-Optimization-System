import {
BarChart,
Bar,
ResponsiveContainer,
XAxis,
YAxis,
Tooltip,
CartesianGrid
} from "recharts";

function DailyChart({data}){

return(

<div className="card">

<h3>Daily Consumption</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="energy_usage"/>

</BarChart>

</ResponsiveContainer>

</div>

)

}

export default DailyChart