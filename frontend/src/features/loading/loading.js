
export function hideloader() {
    document.getElementById('loading').style.visibility = 'hidden';
    document.getElementById('loading').style.display = 'none';
  }

export function showloader() {
  console.log('test')
  const loader = setTimeout(() => {
    document.getElementById('loading').style.visibility = 'visible';
    document.getElementById('loading').style.display = '';
  }, 1000)
  return loader
}