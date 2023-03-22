/* Alerts */
var close = document.querySelectorAll('[data-close="alert"]');
for (var i = 0; i < close.length; i++) {
    close[i].onclick = function(){
        var div = this.parentElement;
        div.style.opacity = '0';
        setTimeout(function(){div.style.visibility = 'hidden';}, 400);
    }
}