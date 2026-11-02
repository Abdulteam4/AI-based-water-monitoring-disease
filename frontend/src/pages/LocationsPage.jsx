import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Droplet, CheckCircle } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { locationsService } from '../services/api';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Borewell / Groundwater');
  const [address, setAddress] = useState('');

  const fetchLocs = async () => {
    setLoading(true);
    try {
      const data = await locationsService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error("Error loading locations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await locationsService.createLocation({ name, type, address });
      setShowModal(false);
      setName('');
      setAddress('');
      fetchLocs();
    } catch (err) {
      alert("Failed to create location.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this monitoring location?")) {
      await locationsService.deleteLocation(id);
      fetchLocs();
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Water Monitoring Network</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">Sampling Site Locations</h1>
          <p className="text-xs text-slate-400 mt-1">Manage physical sampling sites and water source telemetry nodes.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Monitoring Site</span>
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                  {loc.type}
                </span>
                <button onClick={() => handleDelete(loc.id)} className="text-slate-500 hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-1">{loc.name}</h3>
              <p className="text-xs text-slate-400 mb-4">{loc.address || 'No address provided'}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Samples</span>
                <span className="text-sm font-bold text-slate-200">{loc.sample_count || 0}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block mb-0.5">Latest Status</span>
                <RiskBadge status={loc.latest_status || 'SAFE'} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl border border-slate-700 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Add Water Monitoring Site</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Site Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. North Reservoir Well #2"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Water Source Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Borewell / Groundwater">Borewell / Groundwater</option>
                  <option value="Municipal Treatment Plant">Municipal Treatment Plant</option>
                  <option value="Domestic Purifier / RO">Domestic Purifier / RO</option>
                  <option value="Surface Water Body">Surface Water Body (River / Lake)</option>
                  <option value="Storage Water Tank">Storage Water Tank</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Location Notes</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Zone 4, Sector B"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  Save Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
