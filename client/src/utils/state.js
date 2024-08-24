
export function stateNewState(key, value) {
  if (typeof value === "object") {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  localStorage.setItem(key, value);
}

export function getState(key) {
  return localStorage.getItem(key);
}

export function updateState(key, value) {
  if (typeof value === "object") {
   return localStorage.setItem(key, JSON.stringify(value));
  }
  localStorage.setItem(key, value);
}