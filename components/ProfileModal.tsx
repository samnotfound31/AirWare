import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Save } from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [tempCondition, setTempCondition] = useState('');

  const handleAddCondition = () => {
    if (tempCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        healthConditions: [...prev.healthConditions, tempCondition.trim()]
      }));
      setTempCondition('');
    }
  };

  const removeCondition = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Your Health Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City (India Focus)</label>
            <input 
              type="text" 
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sensitivity</label>
              <select 
                value={formData.sensitivity}
                onChange={e => setFormData({...formData, sensitivity: e.target.value as any})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commute Mode</label>
              <select 
                value={formData.commuteMode}
                onChange={e => setFormData({...formData, commuteMode: e.target.value as any})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="car">Car</option>
                <option value="bike">Bike / Motorbike</option>
                <option value="public_transport">Public Transport</option>
                <option value="walk">Walk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Health Conditions</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={tempCondition}
                onChange={e => setTempCondition(e.target.value)}
                placeholder="e.g. Asthma, Allergies"
                onKeyDown={e => e.key === 'Enter' && handleAddCondition()}
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                onClick={handleAddCondition}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.healthConditions.map((cond, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {cond}
                  <button onClick={() => removeCondition(idx)} className="hover:text-blue-900">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};