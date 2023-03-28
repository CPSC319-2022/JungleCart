export const fetcher = async ({ url, token, method, body }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    // headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    //   Authentication: `Bearer ${token}`,
    // },
  });

  if (!res.ok) {
    // handle your errors
    throw new Error('API error');
  }

  return await res.json();
};
