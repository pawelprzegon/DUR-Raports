export function showPassword(elem) {
  var x = document.getElementById(elem);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}