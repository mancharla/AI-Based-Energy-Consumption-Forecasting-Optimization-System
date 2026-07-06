import { useEffect, useState } from "react";

import API from "../api/api";

import SummaryCards from "../components/SummaryCards";
import HourlyChart from "../components/HourlyChart";
import DailyChart from "../components/DailyChart";
import DeviceChart from "../components/DeviceChart";
import BuildingChart from "../components/BuildingChart";
import PeakAlerts from "../components/PeakAlerts";
import RecommendationPanel from "../components/RecommendationPanel";
import AnomalyPanel from "../components/AnomalyPanel";

function Dashboard(){

const fileName=localStorage.getItem("dataset_file");

const [summary,setSummary]=useState(null);

const [hourly,setHourly]=useState([]);

const [daily,setDaily]=useState([]);

const [device,setDevice]=useState([]);

const [building,setBuilding]=useState([]);
const [peaks, setPeaks] = useState(null);

const [recommendations, setRecommendations] = useState(null);

const [anomalies, setAnomalies] = useState(null);

const [loading, setLoading] = useState(false);

useEffect(()=>{

if(!fileName) return;

loadDashboard();

},[]);

const loadDashboard=async()=>{

try{

const summaryRes=await API.get(`/dashboard/summary/${fileName}`);

const hourlyRes=await API.get(`/dashboard/hourly/${fileName}`);

const dailyRes=await API.get(`/dashboard/daily/${fileName}`);

const deviceRes=await API.get(`/dashboard/device-wise/${fileName}`);

const buildingRes=await API.get(`/dashboard/building-wise/${fileName}`);
const peakRes = await API.get(`/peaks/${fileName}`);

const recommendationRes = await API.get(
  `/recommendations/${fileName}`
);

const anomalyRes = await API.get(
  `/anomalies/${fileName}`
);

setPeaks(peakRes.data.peaks);

setRecommendations(recommendationRes.data);

setAnomalies(anomalyRes.data);

setSummary(summaryRes.data);

setHourly(hourlyRes.data);

setDaily(dailyRes.data);

setDevice(deviceRes.data);

setBuilding(buildingRes.data);

setLoading(true);
}
catch(err){

console.log(err);
setLoading(false);

}

};

return(

<div>

<h2>Dashboard</h2>


{summary && <SummaryCards summary={summary}/>}

<div className="chart-grid">

<HourlyChart data={hourly}/>

<DailyChart data={daily}/>

</div>

<div className="chart-grid">

<DeviceChart data={device}/>

<BuildingChart data={building}/>

</div>
<div className="chart-grid">

    <PeakAlerts peaks={peaks}/>

    <RecommendationPanel data={recommendations}/>

</div>

<div className="chart-grid">

    <AnomalyPanel data={anomalies}/>

</div>

</div>

)

}

export default Dashboard;