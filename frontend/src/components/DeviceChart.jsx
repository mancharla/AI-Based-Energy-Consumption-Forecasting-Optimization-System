import {
PieChart,
Pie,
ResponsiveContainer,
Tooltip,
Legend
} from "recharts";

function DeviceChart({data}){

return(

<div className="card">

<h3>Device-wise Usage</h3>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie

data={data}

dataKey="energy_usage"

nameKey="device_id"

label

/>

<Tooltip/>

<Legend/>

</PieChart>

</ResponsiveContainer>

</div>

)

}

export default DeviceChart