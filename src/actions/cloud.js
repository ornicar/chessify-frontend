import CLOUD_ACTION_TYPES from '../constants/cloud-action-types';

export function setToken(token) {
  return { type: CLOUD_ACTION_TYPES.SET_TOKEN, payload: { token } };
}

export function setVideos(videos) {
  return { type: CLOUD_ACTION_TYPES.SET_VIDEOS, payload: { videos } };
}

export function setGames(games) {
  return { type: CLOUD_ACTION_TYPES.SET_GAMES, payload: { games } };
}

export function connectToFree() {
  return { type: CLOUD_ACTION_TYPES.CONNECT_TO_FREE };
}

export function setFreeAnalyzer(freeAnalyzer) {
  return {
    type: CLOUD_ACTION_TYPES.SET_FREE_ANALYZER,
    payload: { freeAnalyzer },
  };
}

export function connectToPro(proWSSChannels) {
  return {
    type: CLOUD_ACTION_TYPES.CONNECT_TO_PRO,
    payload: { proWSSChannels },
  };
}

export function updateNumPV(numPV) {
  return {
    type: CLOUD_ACTION_TYPES.UPDATE_NUM_PV,
    payload: { numPV },
  };
}

export function getUserFullInfo(userData) {
  return {
    type: CLOUD_ACTION_TYPES.GET_USER_FULL_INFO,
    payload: { userData },
  };
}

export function setOrderedCores(orderedCores) {
  return {
    type: CLOUD_ACTION_TYPES.SET_ORDERED_CORES,
    payload: { orderedCores },
  };
}

export function setSavedAnalyzeInfo(analyzeInfo) {
  return {
    type: CLOUD_ACTION_TYPES.SET_SAVED_ANALYZE_INFO,
    payload: { analyzeInfo },
  };
}

export default {
  setToken,
  setVideos,
  setGames,
  connectToFree,
  setFreeAnalyzer,
  connectToPro,
  updateNumPV,
  getUserFullInfo,
  setOrderedCores,
};
