'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Matter, Deadline } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';

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

export default function EditMatterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [matter, setMatter] = useState<Matter | null>(null);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
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

  useEffect(() => {
    fetchMatter();
  }, [params.id]);

  async function fetchMatter() {
    const { data: matterData } = await supabase
      .from('matters')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (matterData) {
      setMatter(matterData);
      setFormData({
        matter_number: matterData.matter_number || '',
        client_number: matterData.client_number || '',
        case_name: matterData.case_name || '',
        court: matterData.court || '',
        judge: matterData.judge || '',
        practice_area: matterData.practice_area || '',
        status: matterData.status || 'Active',
        filing_date: matterData.filing_date || ''
      });
    }

    const { data: deadlinesData } = await supabase
      .from('deadlines')
      .select('*')
      .eq('matter_id', params.id)
      .order('deadline_date', { ascending: true });
    
    if (deadlinesData) setDeadlines(deadlinesData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('matters')
      .update(formData)
      .eq('id', params.id);

    if (error) {
      alert('Error updating matter: ' + error.message);
      setLoading(false);
    } else {
      router.push('/matters');
    }
  }

  async function toggleDeadline(id: string, current: boolean) {
    await supabase
      .from('deadlines')
      .update({ is_completed: !current })
      .eq('id', id);
    fetchMatter();
  }

  async function deleteDeadline(id: string) {
    if (!confirm('Delete this deadline?')) return;
    await supabase.from('deadlines').delete().eq('id', id);
    fetchMatter();
  }

  if (!matter) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Matter</h1>
      
      <div className="space-y-6">
        {/* Matter Form */}
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Judge</label>
              <input
                type="text"
                value={formData.judge}
                onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Practice Area</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Filing Date</label>
              <input
                type="date"
                value={formData.filing_date}
                onChange={(e) => setFormData({ ...formData, filing_date: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Deadlines Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Deadlines</h2>
          
          {deadlines.length === 0 ? (
            <p className="text-gray-500">No deadlines. Add a filing date to auto-generate deadlines.</p>
          ) : (
            <div className="space-y-3">
              {deadlines.map(deadline => (
                <div 
                  key={deadline.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    deadline.is_completed ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={deadline.is_completed}
                      onChange={() => toggleDeadline(deadline.id, deadline.is_completed)}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className={`font-medium ${deadline.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {deadline.title}
                      </div>
                      <div className="text-sm text-gray-600">{deadline.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`font-medium ${
                        !deadline.is_completed && new Date(deadline.deadline_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {format(parseISO(deadline.deadline_date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteDeadline(deadline.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
