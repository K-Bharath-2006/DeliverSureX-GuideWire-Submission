import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const claim = location.state?.claim;

  if (!claim) {
    return (
      <div className="text-center mt-20">
        <p>No result found.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary underline">Go Home</button>
      </div>
    );
  }

  const isApproved = claim.status === 'Approved';

  return (
    <div className="flex-1 flex justify-center items-center py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-slate-100 text-center">
        
        {isApproved ? (
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
               <XCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isApproved ? 'Claim Approved!' : 'Claim Rejected'}
        </h2>
        
        {isApproved ? (
          <p className="text-slate-600 mb-6">
            Your disruption report has been verified. A parametric payout of <strong className="text-slate-900 text-lg">₹{claim.amount}</strong> has been credited to your wallet to cover the estimated time loss.
          </p>
        ) : (
          <p className="text-slate-600 mb-6">
            We could not approve your claim at this time. Reason: <br/>
            <span className="font-semibold text-slate-800 mt-2 block">{claim.reason}</span>
          </p>
        )}

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-lg transition-colors flex justify-center items-center"
        >
          Return to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
