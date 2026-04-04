import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, MapPin, Clock } from 'lucide-react';

export default function ClaimPage() {
  const [disruptionType, setDisruptionType] = useState('Traffic');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('Submit Report & Claim Payout');
  const navigate = useNavigate();

  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
          (error) => reject(error)
        );
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setStatusText("Acquiring exact location...");
    let coords;
    try {
      coords = await getCoordinates();
    } catch (err) {
      alert("Location access is required to verify real-time claims. Please allow location access.");
      setLoading(false);
      setStatusText("Submit Report & Claim Payout");
      return;
    }

    setStatusText("Verifying with AI services...");
    const userId = localStorage.getItem('userId');
    
    try {
      const res = await axios.post('/api/claims/report', {
        userId,
        disruptionType,
        duration,
        lat: coords.lat,
        lon: coords.lon
      });
      
      if (res.data.success) {
        navigate('/result', { state: { claim: res.data.claim } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setLoading(false);
      setStatusText("Submit Report & Claim Payout");
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <AlertCircle className="w-32 h-32 transform translate-x-8 -translate-y-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Report Disruption</h2>
          <p className="text-slate-300 text-sm mt-1">Parametric verification via Live APIs</p>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">What is causing delay?</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium text-slate-800"
                value={disruptionType}
                onChange={e => setDisruptionType(e.target.value)}
              >
                <option value="Traffic">Heavy Traffic</option>
                <option value="Rain">Extreme Weather</option>
                <option value="Pollution">Hazardous AQI</option>
                <option value="Crowd">Dense Crowd</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <Clock className="w-4 h-4 mr-1 text-slate-500" /> Duration of Disruption
                </label>
                <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-sm">
                  {duration} {duration === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="12"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>1h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>

            <div className="bg-amber-50 text-amber-900 border border-amber-200 text-sm p-4 rounded-xl flex items-start shadow-sm">
              <MapPin className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-amber-600" />
              <p className="leading-relaxed">This report requires GPS location access. Your coordinates will be used by live AI algorithms to verify the disruption in your exact zone.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)] hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {statusText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
