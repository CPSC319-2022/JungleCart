export const decodePath = (url) => {
  if (!url.includes('#')) return;
  const queryString = url.split('#')[1];
  return queryString.split('&').reduce(
    (queries, queryStr) => ({
      ...queries,
      [queryStr.split('=')[0]]: queryStr.split('=')[1],
    }),
    {}
  );
};

export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
