
export function hideloader() {
    document.getElementById('loading').style.visibility = 'hidden';
    document.getElementById('loading').style.display = 'none';
  }

export function showloader() {
  return setTimeout(() => {
      document.getElementById('loading').style.visibility = 'visible';
      document.getElementById('loading').style.display = '';
      document.getElementById('loading').style.height = '30px'
    }, 1000);
}