import Auth from '../utils/auth';

const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
      if (response.status === 403) {
          Auth.logout();
          return Promise.reject("Token expired. Redirecting to login.");
      }
      throw new Error(`API Error: ${response.status} - ${data?.message || response.statusText}`);
  }
  return data;
};

const retrieveUsers = async () => {
  try {
    const response = await fetch('/api/users', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    return handleApiResponse(response);
  } catch (err) {
    console.error('Error from data retrieval:', err);
    return Promise.reject('Could not retrieve users');
  }
};

export { retrieveUsers };