// import { error } from 'jquery';
import { CLOUD_URL } from '../constants/cloud-params';

export async function getVideos(token, fen) {
  const url = `${CLOUD_URL}/get_videos`;

  const data = new FormData();
  data.append('token', token);
  data.append('fen', fen);

  const response = await fetch(url, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function getUserFullData() {
  const url = '/user_account/user_full_info';
  const response = await fetch(url, {
    method: 'GET',
  });
  const responseJson = await response.json();
  if (responseJson.error === true) {
    window.location.replace('/auth/signin');
  }
  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return responseJson;
}

export async function getAvailableServers() {
  const url = '/api/available_servers';
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function getEnginesOptions() {
  const url = '/billing/get_engines_options_list';
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function orderServer(core, serverName, options) {
  const url = `/billing/order_server?cores=${core}&engine=${serverName}&options=${JSON.stringify(
    options
  )}&plugin=0`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function stopServer(serverName) {
  const url = `/billing/stop_server?engine=${serverName}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function pingAlive(userFullInfo) {
  const { servers } = userFullInfo;
  const engines = Object.keys(servers);
  let response = {};
  for (let i = 0; i < engines.length; i++) {
    response = await fetch(`/api/ping_alive?engine=${engines[i]}`, {
      method: 'GET',
    });
  }
  if (!response.ok) {
    throw new Error('Something went wrong');
  }
  return await response.json();
}

export async function sendResetPasswordEmail(data, onSuccess, onError) {
  const response = await fetch('/user_account/password/reset/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    error: (xhr) => onError(xhr),
    onSuccess: (response) => onSuccess(response),
  });
  return response.json();
}

export const logout = () => {
  const response = fetch('/user_account/logout/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
};

export const changePassword = (data, id, token) => {
  fetch(`/user_account/change_password/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

export const updateUser = (data, id, token) => {
  fetch(`/user_account/update_profile/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

export const manageSubscription = async () => {
  fetch('/billing/customer_portal/', {
    method: 'GET',

    redirect: 'follow',
  }).then(async (response) => {
    const rspJson = await response.json();
    if (rspJson.redirectUrl) {
      window.location.href = rspJson.redirectUrl;
    }
  });
};

export async function getUserAccountInfo() {
  const url = '/user_account/user_info';
  const response = await fetch(url, {
    method: 'GET',
  });
  console.log(response);
  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function searchPlayers(playerName) {
  const url = `${CLOUD_URL}/dbsearch/find_player`;

  const response = await fetch(`${url}?subname=${playerName}`);

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function createFolder(path, name) {
  const url = `${CLOUD_URL}/user_account/create-folder/`;
  const data = new FormData();
  data.append('path', path);
  data.append('name', name);
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return await response.json();
}

export async function getFiles(filePath, token) {
  const url = `${CLOUD_URL}/user_account/get-decrypted-file?path=${encodeURIComponent(
    filePath
  )}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }
  const result = await response.json()
  return result.data;
}

export default {
  getVideos,
  getUserFullData,
  getAvailableServers,
  orderServer,
  stopServer,
  pingAlive,
  searchPlayers,
  sendResetPasswordEmail,
  logout,
  changePassword,
  updateUser,
  manageSubscription,
  getFiles,
};
