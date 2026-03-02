'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const practiceAreas = [
  'Family Law',
  'Criminal Defense',
  'Corporate',
  'Real Estate',
  'Immigration',
  'Personal Injury',
  'Bankruptcy',
  'Intellectual Property',
  'Employment Law',
  'Other'
];

const courts = [
  'Superior Court',
  'District Court',
  'Circuit Court',
  'Family Court',
  'Bankruptcy Court',
  'Tax Court',
  'Other'
];

export default function NewMatterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    matter_number: '',
    client_number: '',
    case_name: '',
    court: '',
    judge: '',
    practice_area: '',
    status: 'Active',
    filing_date: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('matters').insert([formData]);

    if (error) {
      alert('Error creating matter: ' + error.message);
      setLoading(false);
    } else {
      router.push('/matters');
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Matter</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matter Number *
            </label>
            <input
              type="text"
              required
              value={formData.matter_number}
              onChange={(e) => setFormData({ ...formData, matter_number: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., 2026-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Number
            </label>
            <input
              type="text"
              value={formData.client_number}
              onChange={(e) => setFormData({ ...formData, client_number: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., CLT-001"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Name *
            </label>
            <input
              type="text"
              required
              value={formData.case_name}
              onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., Smith v. Jones"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Court
            </label>
            <select
              value={formData.court}
              onChange={(e) => setFormData({ ...formData, court: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select court...</option>
              {courts.map(court => (
                <option key={court} value={court}>{court}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judge
            </label>
            <input
              type="text"
              value={formData.judge}
              onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., Hon. Johnson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Practice Area
            </label>
            <select
              value={formData.practice_area}
              onChange={(e) => setFormData({ ...formData, practice_area: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select practice area...</option>
              {practiceAreas.map(pa => (
                <option key={pa} value={pa}>{pa}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="On Hold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filing Date
            </label>
            <input
              type="date"
              value={formData.filing_date}
              onChange={(e) => setFormData({ ...formData, filing_date: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adding a filing date will auto-create a 30-day deadline
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Matter'}
          </button>
        </div>
      </form>
    </div>
  );
}
