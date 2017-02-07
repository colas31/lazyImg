var lazyImg = {};
(function () {

    // if developer has not defined a image url for lazy loading then use the default 1px * 1px
    lazyImg.image = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEA";
    // offset before image in viewport
    lazyImg.custom_offset = 100;
    lazyImg.view_elements = [];

    lazyImg.viewportHeight = lazyImg.viewportWidth = 0;
    lazyImg.body = lazyImg.docEl = null;

    lazyImg.initVar = function () {
        lazyImg.viewportHeight = window.innerHeight;
        lazyImg.viewportWidth = window.innerWidth;
        lazyImg.body = document.body;
        lazyImg.docEl = document.documentElement;
    };

    // Allow user to define its own image and offset
    lazyImg.setConfig = function (lazyImg_image, lazyImg_custom_offset) {
        lazyImg.image = lazyImg_image || lazyImg.image;
        lazyImg.custom_offset = lazyImg_custom_offset || lazyImg.custom_offset;
    };

    //detects if the img has entered viewport or not.
    lazyImg.reveal = function () {
        // http://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document/26230989#26230989
        var scrollTop = window.scrollTop || lazyImg.docEl.scrollTop || lazyImg.body.scrollTop;
        var scrollLeft = window.scrollLeft || lazyImg.docEl.scrollLeft || lazyImg.body.scrollLeft;
        var clientTop = lazyImg.docEl.clientTop || lazyImg.body.clientTop || 0;
        var clientLeft = lazyImg.docEl.clientLeft || lazyImg.body.clientLeft || 0;

        for (var count = 0; count < lazyImg.view_elements.length; count++) {
            var img = lazyImg.view_elements[count];

            var box = img.getBoundingClientRect();
            var offsetImgTop = Math.round(box.top + scrollTop - clientTop);
            var offsetImgBottom = Math.round(box.bottom + scrollTop - clientTop);
            var offsetImgLeft = Math.round(box.left + scrollLeft - clientLeft);

            if (offsetImgBottom > scrollTop - lazyImg.custom_offset && offsetImgTop < scrollTop + lazyImg.viewportHeight + lazyImg.custom_offset && offsetImgLeft > scrollLeft - lazyImg.custom_offset && offsetImgLeft < scrollLeft + lazyImg.viewportWidth + lazyImg.custom_offset) {
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

    //Stop img loading from server and display lazy loading image.
    lazyImg.list_maker = function () {
        var elements = document.querySelectorAll("img:not([data-lazyimg-list])");
        for (var count = 0; count < elements.length; count++) {
            var el = elements[count];
            lazyImg.view_elements.push(el);
            el.setAttribute("data-lazyimg-list", "true");
            el.setAttribute("data-lazyimg-loading", "true");
            el.setAttribute("data-lazyimg-src", el.src);
            el.setAttribute("data-lazyimg-srcset", el.srcset);
            el.src = lazyImg.image;
            el.srcset = '';
        }
    };

    // http://sampsonblog.com/749/simple-throttle-function
    lazyImg.throttle = function (callback, limit) {
        var wait = false;                 // Initially, we're not waiting
        return function () {              // We return a throttled function
            if (!wait) {                  // If we're not waiting
                callback.call();          // Execute users function
                wait = true;              // Prevent future invocations
                setTimeout(function () {  // After a period of time
                    wait = false;         // And allow future invocations
                }, limit);
            }
        }
    };

    lazyImg.listener = function () {
        lazyImg.initVar();
        lazyImg.reveal();
    };

    // Allow callback to run at most 1 time per 100ms
    lazyImg.throttleListener = lazyImg.throttle(lazyImg.listener, 100);

    lazyImg.removeListener = function () {
        window.removeEventListener("scroll", lazyImg.throttleListener);
        window.removeEventListener("resize", lazyImg.throttleListener);
    };

    lazyImg.activeListener = function () {
        window.addEventListener("scroll", lazyImg.throttleListener, false);
        window.addEventListener("resize", lazyImg.throttleListener, false);
    };

    lazyImg.activeListener();

    lazyImg.intervalObject = setInterval(function () {
        lazyImg.list_maker();
    }, 20);

    window.addEventListener("load", function () {
        clearInterval(lazyImg.intervalObject);
        lazyImg.list_maker();
        // since Event "Scroll" begins before "load", it needs to activeListener again in case they were removed
        // if page loads too quick (intervalObject isn't call from intervalObject)
        lazyImg.activeListener();
        lazyImg.initVar();
        lazyImg.reveal();

    }, false);
})();