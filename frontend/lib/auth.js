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
