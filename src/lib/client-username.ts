export async function ensureUsername(): Promise<string | null> {
  const existing = localStorage.getItem('awo_username');
  const desired = prompt(
    existing
      ? `Your current username is @${existing}. Enter a new unique username to change it, or press Cancel to keep it.`
      : 'Pick a unique username (at least 3 chars). Keep it private; all responses stay anonymous.'
  );

  if (desired === null && existing) {
    return existing;
  }

  const username = (desired || '').trim().toLowerCase();
  if (!username) {
    alert('Username is required.');
    return null;
  }

  const response = await fetch('/api/users/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, currentUsername: existing || undefined }),
  });

  const data = await response.json();
  if (!response.ok) {
    alert(data.error || 'Could not claim username.');
    return null;
  }

  localStorage.setItem('awo_username', data.username);
  return data.username;
}
