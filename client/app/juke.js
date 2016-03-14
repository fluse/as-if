/* globals request */

var controller = {
    juke: require('./page/juke/controller.js')
};

// initialize page controller
if (controller.hasOwnProperty(request.controller)) {
    window.loaded = new controller[request.controller]();
} else {
    console.info('no page controller defined');
}
