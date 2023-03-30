export const fetcher = async ({ url, method, body }) => {
  console.log('options', {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      // Authentication: `Bearer ${token}`,
    },
  });
  if (body && body.img) {
    console.log('image', body.img);
  }
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
    console.log('error', res);
    throw new Error('API error');
  }

  return await res.json();
};
