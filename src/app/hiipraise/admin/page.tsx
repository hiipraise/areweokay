'use client';

import { FormEvent, useState } from 'react';

interface DashboardData {
  userCount: number;
  sessionCount: number;
  totalResponses: number;
  featureBreakdown: Record<string, number>;
  recentSessions: Array<{ sessionId: string; type: string; creatorUsername: string; createdAt: string }>;
}

export default function AdminPage() {
  const [username, setUsername] = useState('hiipraise');
  const [password, setPassword] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [newUsername, setNewUsername] = useState('hiipraise');
  const [newPassword, setNewPassword] = useState('deaa0da01614');

  const login = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert('Invalid admin credentials');
      return;
    }

    await loadDashboard();
  };

  const loadDashboard = async () => {
    const res = await fetch('/api/admin/analytics');
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
  };

  const updateCredentials = async () => {
    const res = await fetch('/api/admin/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });

    if (res.ok) {
      alert('Admin credentials updated');
      setUsername(newUsername);
      setPassword('');
    }
  };

  return (
    <main className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Private URL: /hiipraise/admin</p>

        {!data && (
          <form onSubmit={login} className="space-y-3 border p-4 rounded-lg">
            <h2 className="font-semibold">Admin Login</h2>
            <input className="w-full border p-2 rounded" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
            <input className="w-full border p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded">Login</button>
          </form>
        )}

        {data && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border rounded p-4"><p className="text-sm text-muted-foreground">Users</p><p className="text-2xl font-bold">{data.userCount}</p></div>
              <div className="border rounded p-4"><p className="text-sm text-muted-foreground">Sessions</p><p className="text-2xl font-bold">{data.sessionCount}</p></div>
              <div className="border rounded p-4"><p className="text-sm text-muted-foreground">Responses</p><p className="text-2xl font-bold">{data.totalResponses}</p></div>
            </section>

            <section className="border rounded p-4 space-y-2">
              <h2 className="font-semibold">Feature Breakdown</h2>
              {Object.entries(data.featureBreakdown).map(([feature, count]) => (
                <p key={feature} className="text-sm">{feature}: {count}</p>
              ))}
            </section>

            <section className="border rounded p-4 space-y-3">
              <h2 className="font-semibold">Change admin credentials</h2>
              <input className="w-full border p-2 rounded" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="new username" />
              <input className="w-full border p-2 rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="new password" />
              <button onClick={updateCredentials} className="px-4 py-2 bg-primary text-primary-foreground rounded">Save</button>
            </section>

            <section className="border rounded p-4 space-y-2">
              <h2 className="font-semibold">Recent Sessions</h2>
              {data.recentSessions.map((session) => (
                <div key={session.sessionId} className="text-sm border-b pb-2">
                  <p><strong>{session.type}</strong> by @{session.creatorUsername}</p>
                  <p className="text-muted-foreground">ID: {session.sessionId}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
