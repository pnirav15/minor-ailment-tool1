import React, { useState } from 'react';

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('active'); 
  const [referralReason, setReferralReason] = useState('');

  const questions = [
    { id: 'gender', text: 'What is your biological sex?', options: ['Female', 'Male'], logic: (a) => a === 'Male' ? 'Ontario pharmacists can only treat UTIs in females.' : null },
    { id: 'age', text: 'Are you 12 years of age or older?', options: ['Yes', 'No'], logic: (a) => a === 'No' ? 'Patients under 12 must see a physician.' : null },
    { id: 'pregnancy', text: 'Is there any chance you are pregnant?', options: ['Yes', 'No'], logic: (a) => a === 'Yes' ? 'UTIs during pregnancy require physician monitoring.' : null },
    { id: 'red_flags', text: 'Do you have fever, chills, or mid-back pain?', options: ['Yes', 'No'], logic: (a) => a === 'Yes' ? 'These suggest a kidney infection. Please go to Urgent Care.' : null },
    { id: 'symptoms', text: 'Do you have burning, urgency, or frequent urination?', options: ['Yes', 'No'], logic: (a) => a === 'No' ? 'Without these symptoms, it may not be a UTI. Consult a pharmacist.' : null }
  ];

  const handleAnswer = (answer) => {
    const error = questions[step].logic(answer);
    const newDocs = { ...formData, [questions[step].id]: answer };
    setFormData(newDocs);

    if (error) {
      setReferralReason(error);
      setStatus('referral');
    } else if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStatus('complete');
    }
  };

  const copySummary = () => {
    const text = `UTI ASSESSMENT (ON MINOR AILMENTS)\nStatus: Eligible\nDetails: Female, 12+, Non-pregnant.\nSymptoms: ${formData.symptoms}\nRed Flags: None reported.\nAction: Pharmacist to confirm via direct interview.`;
    navigator.clipboard.writeText(text);
    alert("Summary copied for Pharmacist!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">UTI Assessment</h1>
        <p className="text-sm text-gray-500 mb-6">Ontario Pharmacist Intake Tool</p>

        {status === 'active' && (
          <div className="space-y-6">
            <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-blue-500 rounded-full transition-all" style={{width: `${(step/questions.length)*100}%`}}></div></div>
            <p className="text-lg font-medium text-gray-800">{questions[step].text}</p>
            <div className="grid grid-cols-2 gap-4">
              {questions[step].options.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} className="py-3 px-4 border-2 border-blue-100 rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-colors font-semibold text-blue-700">{opt}</button>
              ))}
            </div>
          </div>
        )}

        {status === 'referral' && (
          <div className="text-center space-y-4">
            <div className="text-red-500 text-5xl">⚠️</div>
            <h2 className="text-xl font-bold">Referral Required</h2>
            <p className="text-gray-600">{referralReason}</p>
            <button onClick={() => window.location.reload()} className="w-full py-3 bg-gray-800 text-white rounded-xl">Start Over</button>
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-5xl">✅</div>
            <h2 className="text-xl font-bold">Ready for Pharmacist</h2>
            <p className="text-gray-600">You meet the clinical criteria for a minor ailment assessment.</p>
            <button onClick={copySummary} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700">Copy Summary for Pharmacist</button>
          </div>
        )}
      </div>
    </div>
  );
}
