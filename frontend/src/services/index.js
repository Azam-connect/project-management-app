import axiosIntercepter from './axiosInterceptor';

export function PostData(isAuthenticated, apiUrl, data) {
  let axiosConfig;
  if (isAuthenticated) {
    const { access_token } = JSON.parse(
      sessionStorage.getItem('authentication')
    );
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };
  } else {
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return new Promise((resolve, reject) => {
    let totalurl = `${import.meta.env.VITE_API_BASE_URL}/api/v1${apiUrl}`;
    axiosIntercepter
      .post(totalurl, data, axiosConfig)
      .then((res) => {
        resolve({ status: res.status, payload: res.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PutData(isAuthenticated, apiUrl, data) {
  let axiosConfig;

  if (isAuthenticated) {
    const { access_token } = JSON.parse(
      sessionStorage.getItem('authentication')
    );
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };
  } else {
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return new Promise((resolve, reject) => {
    const totalurl = `${import.meta.env.VITE_API_BASE_URL}/api/v1${apiUrl}`;

    axiosIntercepter
      .put(totalurl, data, axiosConfig)
      .then((res) => {
        resolve({ status: res.status, payload: res.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function GetData(isAuthenticated, apiUrl) {
  let axiosConfig;

  if (isAuthenticated) {
    const { access_token } = JSON.parse(
      sessionStorage.getItem('authentication')
    );
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };
  } else {
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return new Promise((resolve, reject) => {
    const totalurl = `${import.meta.env.VITE_API_BASE_URL}/api/v1${apiUrl}`;

    axiosIntercepter
      .get(totalurl, axiosConfig)
      .then((res) => {
        resolve({ status: res.status, payload: res.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function DeleteData(isAuthenticated, apiUrl) {
  let axiosConfig;

  if (isAuthenticated) {
    const { access_token } = JSON.parse(
      sessionStorage.getItem('authentication')
    );
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };
  } else {
    axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  return new Promise((resolve, reject) => {
    const totalurl = `${import.meta.env.VITE_API_BASE_URL}/api/v1${apiUrl}`;

    axiosIntercepter
      .delete(totalurl, axiosConfig)
      .then((res) => {
        resolve({ status: res.status, payload: res.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PostDataMultipart(isAuthenticated, apiUrl, data) {
  let axiosConfig;

  if (isAuthenticated) {
    const { access_token } = JSON.parse(
      sessionStorage.getItem('authentication')
    );
    axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${access_token}`,
      },
    };
  } else {
    axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  return new Promise((resolve, reject) => {
    const totalurl = `${import.meta.env.VITE_API_BASE_URL}/api/v1${apiUrl}`;

    axiosIntercepter
      .post(totalurl, data, axiosConfig)
      .then((res) => {
        resolve({ status: res.status, payload: res.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function PutDataMultipart(isAuthenticated, apiUrl, data) {
  let axiosConfig;

  if (isAuthenticated) {
    const { access_token } = JSON.parse(
      sessionStorage.getItem('authentication')
    );
    axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${access_token}`,
      },
    };
  } else {
    axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
  }

  return new Promise((resolve, reject) => {
    const totalurl = `${import.meta.env.VITE_API_BASE_URL}/api/v1${apiUrl}`;

    axiosIntercepter
      .put(totalurl, data, axiosConfig)
      .then((res) => {
        resolve({ status: res.status, payload: res.data });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
