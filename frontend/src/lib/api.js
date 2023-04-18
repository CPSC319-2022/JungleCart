export const fetcher = async ({ url, method, body }) => {
  console.log('fetch options', {
    method,
    ...(body && { body }),
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
    console.log('error', res);
    throw new Error('API error');
  }

  try {
    return await res.json();
  } catch (error) {
    try {
      return JSON.parse(res);
    } catch (e) {
      return res;
    }
  }
};

export const fetcherWithSpinner = async (button, options) => {
  console.log('fetcherWithSpinner', button, options);
  const buttonText = button.innerText;
  button.classList.add('loader');
  button.disabled = true;
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  const negativeActions = ['delete', 'remove', 'cancel'];
  if (
    negativeActions.some((action) => buttonText.toLowerCase().includes(action))
  ) {
    spinner.classList.add('red');
  }
  button.appendChild(spinner);
  const res = await fetcher(options);
  // button.classList.remove('loader');
  // button.disabled = false;
  // spinner.remove();
  return res;
};
