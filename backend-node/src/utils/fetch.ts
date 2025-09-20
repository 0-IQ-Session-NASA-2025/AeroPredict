// fetch function
export const apiFetch = async (url: string, method: string, body?: object, token?: string) => {
  try {

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    }
    

    if(body && method !== 'GET' && method !== 'HEAD'){
      options.body = JSON.stringify(body);
    }

    console.log(url, JSON.stringify(options));

    // console.log(JSON.stringify(body));
    const response = await fetch(url, options);
    // console.log(response)
    return response.json();
  } catch (error: any) {
    console.log(error);
  }
}