/**
 *  ATMaterial is an HTML5 theme for LuCI based off of Lutty Yang's 
 *  work on the LuCI Material theme which uses parts from LuCI
 *  Bootstrap theme and MUI.
 *
 *  luci-theme-ATMaterial
 *  	Copyright 2016 "panda-mute" <https://github.com/panda-mute>
 *  	Copyright 2017 "monokoo" <https://github.com/monokoo>
 *  	Copyright 2019 William Rogers <https://github.com/solidus1983>
 *  	Copyright 2019 Jose Olivera <oliverajeo@gmail.com>
 *
 *  luci-theme-material
 *      Copyright 2015 Lutty Yang <lutty@wcan.in>
 *
 *  Have a bug? Please create an issue here on GitHub!
 *      https://github.com/jeolives/luci-theme-atmaterial/issues
 *
 *  luci-theme-bootstrap:
 *      Copyright 2008 Steven Barth <steven@midlink.org>
 *      Copyright 2008 Jo-Philipp Wich <jow@openwrt.org>
 *      Copyright 2012 David Menting <david@nut-bolt.nl>
 *
 *  MUI:
 *      https://github.com/muicss/mui
 *
 *  Licensed to the public under the Apache License 2.0
 */
(function ($) {
    $(".main > .loading").fadeOut();

    /**
     * trim text, Remove spaces, wrap
     * @param text
     * @returns {string}
     */
    function trimText(text) {
        return text.replace(/[ \t\n\r]+/g, " ");
    }


    var lastNode = undefined;
    var mainNodeName = undefined;

    var nodeUrl = "";
    (function(node){
        var luciLocation;
        if (node[0] == "admin"){
            luciLocation = [node[1], node[2]];
        }else{
            luciLocation = node;
        }

        for(var i in luciLocation){
            nodeUrl += luciLocation[i];
            if (i != luciLocation.length - 1){
                nodeUrl += "/";
            }
        }
    })(luciLocation);

    /**
     * get the current node by Burl (primary)
     * @returns {boolean} success?
     */
    function getCurrentNodeByUrl() {
        var ret = false;
        if (!$('body').hasClass('logged-in')) {
            luciLocation = ["Main", "Login"];
            return true;
        }

        $(".main > .main-left > .nav > .slide > .menu").each(function () {
            var ulNode = $(this);
            ulNode.next().find("a").each(function () {
                var that = $(this);
                var href = that.attr("href");

                if (href.indexOf(nodeUrl) != -1) {
                    ulNode.click();
                    ulNode.next(".slide-menu").stop(true, true);
                    lastNode = that.parent();
                    lastNode.addClass("active");
                    ret = true;
                    return true;
                }
            });
        });
        return ret;
    }

    /**
     * menu click
     */
    $(".main > .main-left > .nav > .slide > .menu").click(function () {
        var ul = $(this).next(".slide-menu");
        var menu = $(this);
        if (!ul.is(":visible")) {
            menu.addClass("active");
            ul.addClass("active");
            ul.stop(true).slideDown("fast");
        } else {
            ul.stop(true).slideUp("fast", function () {
                menu.removeClass("active");
                ul.removeClass("active");
            });
        }
        return false;
    });

    /**
     * hook menu click and add the hash
     */
    $(".main > .main-left > .nav > .slide > .slide-menu > li > a").click(function () {
        if (lastNode != undefined) lastNode.removeClass("active");
        $(this).parent().addClass("active");
        $(".main > .loading").fadeIn("fast");
        return true;
    });

    /**
     * fix menu click
     */
    $(".main > .main-left > .nav > .slide > .slide-menu > li").click(function () {
        if (lastNode != undefined) lastNode.removeClass("active");
        $(this).addClass("active");
        $(".main > .loading").fadeIn("fast");
        window.location = $($(this).find("a")[0]).attr("href");
        return false;
    });

    /**
     * get current node and open it
     */
    if (getCurrentNodeByUrl()) {
        mainNodeName = "node-" + luciLocation[0] + "-" + luciLocation[1];
        mainNodeName = mainNodeName.replace(/[ \t\n\r\/]+/g, "_").toLowerCase();
        $("body").addClass(mainNodeName);
    }
    $(".cbi-button-up").val("");
    $(".cbi-button-down").val("");


    /**
     * hook other "A Label" and add hash to it.
     */
    $("#maincontent > .container").find("a").each(function () {
        var that = $(this);
        var onclick = that.attr("onclick");
        if (onclick == undefined || onclick == "") {
            that.click(function () {
                var href = that.attr("href");
                if (href.indexOf("#") == -1) {
                    $(".main > .loading").fadeIn("fast");
                    return true;
                }
            });
        }
    });

    /**
     * Sidebar expand
     */
    var showSide = false;
    $(".showSide").click(function () {
        if (showSide) {
            $(".darkMask").stop(true).fadeOut("fast");
            $(".main-left").stop(true).animate({
                width: "0"
            }, "fast");
            $(".main-right").css("overflow-y", "visible");
            showSide = false;
        } else {
            $(".darkMask").stop(true).fadeIn("fast");
            $(".main-left").stop(true).animate({
                width: "15rem"
            }, "fast");
            showSide = true;
        }
    });


    $(".darkMask").click(function () {
        if (showSide) {
            showSide = false;
            $(".darkMask").stop(true).fadeOut("fast");
            $(".main-left").stop(true).animate({
                width: "0"
            }, "fast");
            $(".main-right").css("overflow-y", "visible");
        }
    });

    $(window).resize(function () {
        if ($(window).width() > 921) {
            $(".main-left").css("width", "");
            $(".darkMask").stop(true);
            $(".darkMask").css("display", "none");
            showSide = false;
        }
    });

    /**
     * fix legend position
     */
    $("legend").each(function () {
        var that = $(this);
        that.after("<span class='panel-title'>" + that.text() + "</span>");
    });

    /*fix vlan prot*/
    /*$(".cbi-section-table-titles, .cbi-section-table-descr, .cbi-section-descr").each(function () {
        var that = $(this);
        if (that.text().trim() == ""){
            that.css("display", "none");
        }
    });*/


    $(".main-right").focus();
    $(".main-right").blur();
    $("input").attr("size", "0");

    if (mainNodeName != undefined) {
        console.log(mainNodeName);
        switch (mainNodeName) {
            case "node-status-system_log":
            case "node-status-kernel_log":
                $("#syslog").focus(function () {
                    $("#syslog").blur();
                    $(".main-right").focus();
                    $(".main-right").blur();
                });
                break;
            case "node-status-firewall":
                var button = $(".node-status-firewall > .main fieldset li > a");
                button.addClass("cbi-button cbi-button-reset a-to-btn");
                break;
            case "node-system-reboot":
                var button = $(".node-system-reboot > .main > .main-right p > a");
                button.addClass("cbi-button cbi-input-reset a-to-btn");
                break;
        }
    }

})(jQuery);
