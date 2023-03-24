
export function hideloader() {
    document.getElementById('loading').style.visibility = 'hidden';
  }

export function showloader() {
  const loader = setTimeout(() => {
    document.getElementById('loading').style.visibility = 'visible';
  }, 1000)
  return loader
}