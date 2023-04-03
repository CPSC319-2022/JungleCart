export const fetcher = async ({ url, method, body, token = "" }) => {
  console.log('fetch options', {
    method,
    ...(body && { body }),
    headers: {
      'Content-Type': 'application/json',
      Authentication: `Bearer ${token}`,
    },
  });
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // handle your errors
    console.log('error', res);
    throw new Error('API error');
  }

  return await res.json();
};
