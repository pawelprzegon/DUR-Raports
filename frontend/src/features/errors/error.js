export function err(status, response){
    document.getElementById('err').innerHTML = `
                        <h1>${status}</h1>
                        <p>${response}</p>
                        `
}