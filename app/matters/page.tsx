'use client';

import { useEffect, useState } from 'react';
import { supabase, Matter } from '@/lib/supabase';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function MattersPage() {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ practiceArea: '', status: '', search: '' });

  useEffect(() => {
    fetchMatters();
  }, []);

  async function fetchMatters() {
    setLoading(true);
    const { data } = await supabase
      .from('matters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMatters(data);
    setLoading(false);
  }

  async function deleteMatter(id: string) {
    if (!confirm('Are you sure you want to delete this matter?')) return;
    await supabase.from('matters').delete().eq('id', id);
    fetchMatters();
  }

  const filteredMatters = matters.filter(m => {
    if (filter.practiceArea && m.practice_area !== filter.practiceArea) return false;
    if (filter.status && m.status !== filter.status) return false;
    if (filter.search) {
      const search = filter.search.toLowerCase();
      return (
        m.matter_number.toLowerCase().includes(search) ||
        m.case_name.toLowerCase().includes(search) ||
        m.client_number?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const practiceAreas = [...new Set(matters.map(m => m.practice_area).filter(Boolean))];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Matters</h1>
        <Link 
          href="/matters/new" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + New Matter
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search matters..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
          />
          <select
            value={filter.practiceArea}
            onChange={(e) => setFilter({ ...filter, practiceArea: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Practice Areas</option>
            {practiceAreas.map(pa => (
              <option key={pa} value={pa}>{pa}</option>
            ))}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Matter #</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Client #</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Case Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Court</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Judge</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Practice Area</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Filing Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatters.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No matters found. Create your first matter to get started.
                </td>
              </tr>
            ) : (
              filteredMatters.map(matter => (
                <tr key={matter.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{matter.matter_number}</td>
                  <td className="py-3 px-4">{matter.client_number}</td>
                  <td className="py-3 px-4">{matter.case_name}</td>
                  <td className="py-3 px-4">{matter.court}</td>
                  <td className="py-3 px-4">{matter.judge}</td>
                  <td className="py-3 px-4">{matter.practice_area}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${matter.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        matter.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        matter.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                      {matter.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {matter.filing_date ? format(parseISO(matter.filing_date), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Link 
                      href={`/matters/${matter.id}`} 
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteMatter(matter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
