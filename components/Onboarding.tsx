import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronRight, Check, Heart, User, MapPin, Activity } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    city: '',
    sensitivity: 'moderate',
    commuteMode: 'public_transport',
    healthConditions: []
  });

  const [customCondition, setCustomCondition] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData as UserProfile);
  };

  const toggleCondition = (condition: string) => {
    const current = formData.healthConditions || [];
    if (current.includes(condition)) {
      setFormData({ ...formData, healthConditions: current.filter(c => c !== condition) });
    } else {
      setFormData({ ...formData, healthConditions: [...current, condition] });
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.city;
    if (step === 2) return true; // Optional
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="mb-8">
            {step === 1 && (
                <div className="animate-fade-in space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><User size={24} /></div>
                        <h2 className="text-2xl font-bold text-gray-900">Let's get to know you</h2>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">What should we call you?</label>
                        <input 
                           type="text" 
                           className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                           placeholder="Your Name"
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Which city are you in?</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                            type="text" 
                            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. New Delhi, Mumbai"
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">We prioritize data for Indian cities.</p>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="animate-fade-in space-y-6">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full"><Heart size={24} /></div>
                        <h2 className="text-2xl font-bold text-gray-900">Health Profile</h2>
                    </div>
                    <p className="text-gray-600">This helps us tailor alerts for heart and respiratory safety.</p>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Do you have any specific concerns?</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                "Heart Conditions", 
                                "Asthma", 
                                "Respiratory Issues", 
                                "Pregnant", 
                                "Elderly", 
                                "Children in home",
                                "None"
                            ].map(cond => (
                                <button
                                    key={cond}
                                    onClick={() => toggleCondition(cond)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                                        formData.healthConditions?.includes(cond) 
                                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                        : 'border-gray-100 hover:border-blue-200 text-gray-700'
                                    }`}
                                >
                                    <span className="font-medium">{cond}</span>
                                    {formData.healthConditions?.includes(cond) && <Check size={18} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity Level</label>
                        <div className="flex gap-2">
                             {(['low', 'moderate', 'high'] as const).map((level) => (
                                 <button
                                    key={level}
                                    onClick={() => setFormData({...formData, sensitivity: level})}
                                    className={`flex-1 p-3 rounded-lg border capitalize ${
                                        formData.sensitivity === level 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                 >
                                     {level}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="animate-fade-in space-y-6">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full"><Activity size={24} /></div>
                        <h2 className="text-2xl font-bold text-gray-900">Daily Commute</h2>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">How do you usually travel?</label>
                        <div className="space-y-3">
                             {[
                                 { id: 'car', label: 'Car (AC)', desc: 'Lowest direct exposure' },
                                 { id: 'public_transport', label: 'Public Transport', desc: 'Moderate exposure' },
                                 { id: 'bike', label: 'Bike / Motorbike', desc: 'High exposure' },
                                 { id: 'walk', label: 'Walking', desc: 'Highest exposure' },
                             ].map((mode) => (
                                 <button
                                    key={mode.id}
                                    onClick={() => setFormData({...formData, commuteMode: mode.id as any})}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                                        formData.commuteMode === mode.id
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-100 hover:border-gray-200'
                                    }`}
                                 >
                                     <div>
                                         <div className={`font-semibold ${formData.commuteMode === mode.id ? 'text-blue-700' : 'text-gray-900'}`}>{mode.label}</div>
                                         <div className="text-sm text-gray-500">{mode.desc}</div>
                                     </div>
                                     {formData.commuteMode === mode.id && <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white"><Check size={12}/></div>}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
            {step === 3 ? 'Complete Setup' : 'Continue'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};