'use client';

import { useEffect, useState } from 'react';
import { supabase, DashboardItem, Matter } from '@/lib/supabase';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // Fetch matters
    const { data: mattersData } = await supabase
      .from('matters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (mattersData) setMatters(mattersData);

    // Fetch upcoming deadlines
    const { data: deadlinesData } = await supabase
      .from('deadlines')
      .select('*, matters(matter_number, case_name, court, practice_area)')
      .eq('is_completed', false)
      .order('deadline_date', { ascending: true })
      .limit(10);

    if (deadlinesData) {
      const items: DashboardItem[] = deadlinesData.map(d => ({
        id: d.id,
        matter_number: d.matters?.matter_number || '',
        case_name: d.matters?.case_name || '',
        court: d.matters?.court || '',
        practice_area: d.matters?.practice_area || '',
        status: '',
        deadline_title: d.title,
        deadline_date: d.deadline_date,
        is_completed: d.is_completed,
        days_until_deadline: Math.ceil((new Date(d.deadline_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      }));
      setDashboardItems(items);
    }
    
    setLoading(false);
  }

  const urgentItems = dashboardItems.filter(d => d.days_until_deadline <= 7 && d.days_until_deadline > 0);
  const upcomingItems = dashboardItems.filter(d => d.days_until_deadline > 7);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link 
          href="/matters/new" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Matter
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-primary-600">{matters.length}</div>
          <div className="text-gray-600">Total Matters</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">
            {matters.filter(m => m.status === 'Active').length}
          </div>
          <div className="text-gray-600">Active Cases</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-yellow-600">
            {matters.filter(m => m.status === 'Pending').length}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-red-600">{urgentItems.length}</div>
          <div className="text-gray-600">Urgent Deadlines</div>
        </div>
      </div>

      {/* Urgent Deadlines */}
      {urgentItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Urgent Deadlines (7 days)</h2>
          <div className="space-y-3">
            {urgentItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900">{item.matter_number}: {item.case_name}</div>
                  <div className="text-sm text-gray-600">{item.deadline_title} • {item.court}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{item.days_until_deadline} days</div>
                  <div className="text-sm text-gray-500">{format(parseISO(item.deadline_date), 'MMM d, yyyy')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Upcoming Deadlines</h2>
        {upcomingItems.length > 0 ? (
          <div className="space-y-3">
            {upcomingItems.map(item => (
              <div key={item.id} className="border-b pb-3 last:border-b-0 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{item.matter_number}: {item.case_name}</div>
                  <div className="text-sm text-gray-600">{item.deadline_title} • {item.practice_area}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary-600">{item.days_until_deadline} days</div>
                  <div className="text-sm text-gray-500">{format(parseISO(item.deadline_date), 'MMM d, yyyy')}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming deadlines. Add a matter with a filing date to auto-generate deadlines.</p>
        )}
      </div>

      {/* Recent Matters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📁 Recent Matters</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matter #</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Case Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Court</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Practice Area</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {matters.slice(0, 5).map(matter => (
                <tr key={matter.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{matter.matter_number}</td>
                  <td className="py-3 px-4">{matter.case_name}</td>
                  <td className="py-3 px-4">{matter.court}</td>
                  <td className="py-3 px-4">{matter.practice_area}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${matter.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        matter.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        matter.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                      {matter.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link href="/matters" className="text-primary-600 hover:text-primary-700 font-medium">
            View all matters →
          </Link>
        </div>
      </div>
    </div>
  );
}
