export const fetcher = async ({ url, token, method, body }) => {
  console.log('options', {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      // Authentication: `Bearer ${token}`,
    },
  });
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      // Authentication: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // handle your errors
    throw new Error('API error');
  }

  return await res.json();
};
