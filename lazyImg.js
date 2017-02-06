var lazyImg = {};
// if developer has not defined a image url for lazy loading then use the default 1px * 1px
var lazyImg_image = lazyImg_image || "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEA";
var lazyImg_custom_offset = lazyImg_custom_offset || 100;

lazyImg.image = lazyImg_image;
lazyImg.custom_offset = lazyImg_custom_offset;
lazyImg.view_elements = [];

lazyImg.viewportHeight = lazyImg.viewportWidth = 0;
lazyImg.body = lazyImg.docEl = null;

lazyImg.initVar = function() {
    lazyImg.viewportHeight  = window.innerHeight;
    lazyImg.viewportWidth   = window.innerWidth;
    lazyImg.body            = document.body;
    lazyImg.docEl           = document.documentElement;
};
//detects if the img has entered viewport or not.
lazyImg.reveal = function() {
    // http://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document/26230989#26230989
    var scrollTop   = window.scrollTop || lazyImg.docEl.scrollTop || lazyImg.body.scrollTop;
    var scrollLeft  = window.scrollLeft || lazyImg.docEl.scrollLeft || lazyImg.body.scrollLeft;
    var clientTop   = lazyImg.docEl.clientTop || lazyImg.body.clientTop || 0;
    var clientLeft  = lazyImg.docEl.clientLeft || lazyImg.body.clientLeft || 0;

    for (var count = 0; count < lazyImg.view_elements.length; count++) {
        var img = lazyImg.view_elements[count];

        var box = img.getBoundingClientRect();
        var offsetImgTop = Math.round(box.top + scrollTop - clientTop);
        var offsetImgBottom = Math.round(box.bottom + scrollTop - clientTop);
        var offsetImgLeft = Math.round(box.left + scrollLeft - clientLeft);

        if (offsetImgBottom > scrollTop - lazyImg.custom_offset &&
            offsetImgTop < scrollTop + lazyImg.viewportHeight + lazyImg.custom_offset &&
            offsetImgLeft > scrollLeft - lazyImg.custom_offset &&
            offsetImgLeft < scrollLeft + lazyImg.viewportWidth + lazyImg.custom_offset) {
            img.src = img.getAttribute("data-lazyimg-src");
            img.srcset = img.getAttribute("data-lazyimg-srcset");
            img.removeAttribute("data-lazyimg-loading");
            img.removeAttribute("data-lazyimg-src");
            img.removeAttribute("data-lazyimg-srcset");
            lazyImg.view_elements.splice(count, 1);
            count--;
        }
    }
    if (lazyImg.view_elements.length == 0) {
        lazyImg.removeListener();
    }
};

lazyImg.removeListener = function() {
    window.removeEventListener("scroll", lazyImg.listener);
    window.removeEventListener("resize", lazyImg.listener);
};

lazyImg.listener = function() {
    lazyImg.initVar();
    lazyImg.reveal();
};

//Stop img loading from server and display lazy loading image.
lazyImg.list_maker = function() {
    var elements = document.querySelectorAll("img:not([data-lazyimg-list])");
    for( var count = 0; count < elements.length; count++) {
        lazyImg.view_elements.push(elements[count]);
        elements[count].setAttribute("data-lazyimg-list", "true");
        elements[count].setAttribute("data-lazyimg-loading", "true");
        elements[count].setAttribute("data-lazyimg-src", elements[count].src);
        elements[count].setAttribute("data-lazyimg-srcset", elements[count].srcset);
        elements[count].src = lazyImg.image;
        elements[count].srcset = '';
    }
};

window.addEventListener("scroll", lazyImg.listener, false);
window.addEventListener("resize", lazyImg.listener, false);

lazyImg.intervalObject = setInterval(function() {
    lazyImg.list_maker();
}, 20);

window.addEventListener("load", function() {
    clearInterval(lazyImg.intervalObject);
    lazyImg.list_maker();
    lazyImg.initVar();
    lazyImg.reveal();
}, false);