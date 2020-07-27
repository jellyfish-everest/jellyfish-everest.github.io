(function ($, window) {

    $.fn.contextMenu = function (settings) {

        _openConextMenu = function (e, setting) {
            // return native menu if pressing control
            if (e.ctrlKey) return;

            let x = e.clientX;
            let y = e.clientY;

            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                x = touch.pageX;
                y = touch.pageY;
            }

            //open menu
            var $menu = $(settings.menuSelector)
                .data("invokedOn", $(e.target))
                .show()
                .css({
                    position: "absolute",
                    left: getMenuPosition(x, 'width', 'scrollLeft'),
                    top: getMenuPosition(y, 'height', 'scrollTop')
                })
                .off('click')
                .on('click', 'a', function (e) {
                    $menu.hide();

                    var $invokedOn = $menu.data("invokedOn");
                    var $selectedMenu = $(e.target);

                    settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                });

            return false;
        }

        return this.each(function () {
            // Open context menu on "context menu" (right click)
            $(this).on("contextmenu", function (e) {
                return _openConextMenu(e, settings);
            });

            // Handle long press as well
            // $(this).on("mousedown", function (e) {
            //     $(this).data("checkdown", setTimeout(function () {
            //         return _openConextMenu(e, settings);
            //     }, 1000));
            // }).on("mouseup", function () {
            //     clearTimeout($(this).data("checkdown"));
            // }).on("mouseout", function () {
            //     clearTimeout($(this).data("checkdown"));
            // });

            $(this).on('touchend', function (e) {
                clearTimeout($(this).data("pressTimer"));
            }).on('touchstart', function (e) {
                // Set timeout
                $(this).data("pressTimer", setTimeout(function () {
                    return _openConextMenu(e, settings);
                }, 800));
            });

            // $(this).longclick(1000, function (e) {
            //     return _openConextMenu(e, settings);
            // });

            // Hide when click other places
            $(window).click(function () {
                $(settings.menuSelector).hide();
            });
        });

        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;

            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse)
                position -= menu;

            return position;
        }

    };

})(jQuery, window);