(function ($, window) {

    $.fn.contextMenu = function (settings) {

        _openConextMenu = function (e, setting) {
            // return native menu if pressing control
            if (e.ctrlKey) return;

            //open menu
            var $menu = $(settings.menuSelector)
                .data("invokedOn", $(e.target))
                .show()
                .css({
                    position: "absolute",
                    left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                    top: getMenuPosition(e.clientY, 'height', 'scrollTop')
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

            $(this).longclick(1000, function (e) {
                return _openConextMenu(e, settings);
            });

            // Hide when click other places
            $(window).click(function () {
                $(settings.menuSelector).hide();
                console.log("hide context")
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