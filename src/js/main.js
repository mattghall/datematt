// import $ from 'jquery';
importAll(require.context('../style', false, /\.css$/));
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import feather from 'feather-icons';
const mainJsVersion = 1.0;

function importAll(r) {
    r.keys().forEach(r);
}

$(function () {
    feather.replace();
    $("#main-version-span").text(mainJsVersion);

    if (location.hostname == '' || location.hostname.includes("local") || location.hostname.includes("file")) {
        console.log("Localhost detected, skipping service worker registration.");
    } else {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function (error) {
                    console.log('ServiceWorker registration failed: ', error);
                });
            });
        }
    }

    setTimeout(function () {
        feather.replace();
    }, 1500);

});