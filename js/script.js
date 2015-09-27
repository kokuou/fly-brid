// set up our component HTML
var plus_three_column = '<div class="component-three-column"><div class="component-inner"></div></div><div class="component-three-column"><div class="component-inner"></div></div><div class="component-three-column"><div class="component-inner"></div></div>';

//set up other variables
var component_list = [];

var desktop = $(".desktop");
var mobile = $(".mobile");
var tablet = $(".tablet");

//function to produce added content
function build_component(type) {

	var controls = '<span class="controls glyphicon glyphicon-arrow-up move-up"></span><span class="controls glyphicon glyphicon-arrow-down move-down"></span><span class="controls glyphicon glyphicon-trash trash"></span>';

	switch (type) {
		case "add-banner" :
			return '<div class="components full-width component-preview" data-component-type="add-banner"><div class="delete-this">'+controls+'</div><div class="banner"><span class="glyphicon glyphicon-picture"></span></div></div>';
			break;
		case "add-one-column" :
			return '<div class="components full-width component-preview" data-component-type="add-one-column"><div class="delete-this">'+controls+'</div><div class="component-one-column"><div class="component-inner"></div></div></div>';
			break;
		case "add-two-column" :
			return '<div class="components component-preview" data-component-type="add-two-column"><div class="delete-this">'+controls+'</div><div class="component-two-column"><div class="component-inner"></div></div><div class="component-two-column"><div class="component-inner"></div></div></div>';
			break;
		case "add-three-column" :
			return '<div class="components three-col component-preview" data-component-type="add-three-column"><div class="delete-this">'+controls+'</div><div class="component-three-column"><div class="component-inner"></div></div><div class="component-three-column"><div class="component-inner"></div></div><div class="component-three-column"><div class="component-inner"></div></div></div>';
			break;
		case "add-sidebar-n" :
			return '<div class="components sidebar component-preview" data-component-type="add-sidebar-n"><div class="delete-this">'+controls+'</div><div class="component-sidebar-side"><div class="component-inner"></div></div><div class="component-sidebar-main normal"><div class="component-inner"></div></div></div>';
			break;
		case "add-sidebar-r" :
			return '<div class="components sidebar component-preview" data-component-type="add-sidebar-r"><div class="delete-this">'+controls+'</div><div class="component-sidebar-main reversed"><div class="component-inner"></div></div><div class="component-sidebar-side"><div class="component-inner"></div></div></div>';
			break;
		
	}
}

// add classes for MQ button
$("#media-query").on('click', function() {

	if ($(this).prop('checked') === true) {
		mobile.addClass("media-queries-on");
		tablet.addClass("media-queries-on");
	} else {
		mobile.removeClass("media-queries-on");
		tablet.removeClass("media-queries-on");
	}
});

// add classes for left/center align buttons when clicked
$("#align-left").on("click", function() {

	tablet.removeClass("align-center");
	tablet.addClass("align-left");

	mobile.removeClass("align-center");
	mobile.addClass("align-left");
});
$("#align-center").on("click", function() {

	tablet.removeClass("align-left");
	tablet.addClass("align-center");

	mobile.removeClass("align-left");
	mobile.addClass("align-center");
});

// trigger hover of matching elements
$(document).on('mouseenter', ".component-preview", function() {
	var this_index = $(this).index();
	var tablet_index = $(".tablet").children().eq(this_index);
	var desktop_index = $(".desktop").children().eq(this_index);
	var mobile_index = $(".mobile").children().eq(this_index);

	tablet_index.children(".delete-this").css("display", "flex");
	desktop_index.children(".delete-this").css("display", "flex");
	mobile_index.children(".delete-this").css("display", "flex");

	// show controls
	check_controls($(this));

});
$(document).on('mouseleave', ".component-preview", function() {
	var this_index = $(this).index();
	var tablet_index = $(".tablet").children().eq(this_index);
	var desktop_index = $(".desktop").children().eq(this_index);
	var mobile_index = $(".mobile").children().eq(this_index);

	tablet_index.children(".delete-this").css("display", "none");
	desktop_index.children(".delete-this").css("display", "none");
	mobile_index.children(".delete-this").css("display", "none");

	// reset controls to display: none;
	$(this).find(".controls").each(function() {
		$(this).css("display", "none");
	});

});

function check_controls(component) {
	// check which buttons we need to show

	var this_index = component.index();
	var total_components = component_list.length;

	if (this_index === 0) {
		// top item, only show trash and down
		if (total_components > 1) {
			component.find(".move-down").css("display", "inline-block");
		}
	} else if (this_index === total_components - 1) {
		// bottom item, only show trash and up
		component.find(".move-up").css("display", "inline-block");
	} else {
		// middle item, show both arrows
		component.find(".move-up").css("display", "inline-block");
		component.find(".move-down").css("display", "inline-block");
	}

	//finally, show trash
	component.find(".trash").css("display", "inline-block");
}

// deal with control clicks
$(document).on("click", ".controls", function(e){
	e.stopPropagation();
	var this_index = $(this).parents(".components").index();

	// clone items
	var d_clone = desktop.children().eq(this_index);
	var t_clone = tablet.children().eq(this_index);
	var m_clone = mobile.children().eq(this_index);

	//trash the item by removing it from all three views and then removing it from component list
	desktop.children().eq(this_index).remove();
	tablet.children().eq(this_index).remove();
	mobile.children().eq(this_index).remove();

	if ($(this).hasClass("trash")) {
		//do nothing, just remove it from the component list
		var trashed_item = component_list.splice(this_index, 1);
	}

	if ($(this).hasClass("move-up") || $(this).hasClass("move-down")) {
		// insert objects at new index
		var new_index;
		if ($(this).hasClass("move-up")) {
			new_index = this_index - 1;

			desktop.children(".components").eq(new_index).before(d_clone);
			tablet.children(".components").eq(new_index).before(t_clone);
			mobile.children(".components").eq(new_index).before(m_clone);
		}
		
		if ($(this).hasClass("move-down")) {
			new_index = this_index;

			desktop.children(".components").eq(new_index).after(d_clone);
			tablet.children(".components").eq(new_index).after(t_clone);
			mobile.children(".components").eq(new_index).after(m_clone);
		}

		// reorder component list
		rebuild_component_list();
	}
});

// function to rebuild the component list
function rebuild_component_list(){
	// empty component_list
	component_list = [];
	desktop.children(".components").each(function(){
		var this_type = $(this).attr("data-component-type");
		component_list.push(this_type);
	});
}

// code for buttons
$(".component").on("click", function() {

	var this_id = $(this).attr("id");

	switch (this_id) {

		case "add-three-column" :

			// check to see if the last component is add-three-column, if so add three more to it
			var bottom_component = desktop.children(".components").last();

			// here, we want to add three new cells to the previous container if the last component added was also three_column
			if (bottom_component.attr("data-component-type") === "add-three-column") {
				desktop.children().last().append(plus_three_column).attr("data-component-type", "add-six-column");
				mobile.children().last().append(plus_three_column).attr("data-component-type", "add-six-column");
				tablet.children().last().append(plus_three_column).attr("data-component-type", "add-six-column");

				//modify component_list and merge the two three-columns
				var last_item = component_list.pop();
				component_list.push("add-six-column");
			} else {
				var html = build_component(this_id);
				desktop.append(html);
				mobile.append(html);
				tablet.append(html);

				// reorder component list
				rebuild_component_list();
			}

			break;
		case "add-sidebar-r" :
			desktop.append(build_component("add-sidebar-r"));
			mobile.append(build_component("add-sidebar-n"));
			tablet.append(build_component("add-sidebar-n"));

			// reorder component list
			rebuild_component_list();
			break;
		default :
			// banner, one-column, two-column, and sidebar-n are all the same
			var html = build_component(this_id)
			desktop.append(html);
			mobile.append(html);
			tablet.append(html);

			// reorder component list
			rebuild_component_list();
			break;
		
	}
});

$('#email_code').on('show.bs.modal', function (e) {
	// rebuild component list, just in case
	rebuild_component_list();

	//build email
    build_email(component_list);
});

// escape tags
// this code courtesy of Martijn: http://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

// build our html when the button is pressed
function build_email(all_components) {
	var textarea = $("#final-code");

	// option variables
	var mobile_bp = $("#breakpoint-mobile").val();
	var tablet_start_bp = parseInt($("#breakpoint-mobile").val()) + 1;
	var tablet_end_bp = $("#breakpoint-tablet").val();
	var three_col_align = $("input[name=align-columns]:checked").val();

	// component html
	var banner = '\n'
+'                <!-- FULL WIDTH BANNER -->\n'
+'                <tr>\n'
+'                    <td class="full-width-image">\n'
+'                        <img src="images/header.jpg" width="600" alt="" />\n'
+'                    </td>\n'
+'                </tr>\n'
+'                <!-- /FULL WIDTH BANNER -->\n'
+'\n';
	
	var one_column = '\n'
+'                <!-- ONE COLUMN -->\n'
+'                <tr>\n'
+'                    <td class="one-column">\n'
+'                        <table width="100%">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <p class="h1">Lorem ipsum dolor sit amet</p>\n'
+'                                    <p>Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat.</p>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                    </td>\n'
+'                </tr>\n'
+'                <!-- /ONE COLUMN -->\n'
+'\n';

	var two_column = '\n'
+'                <!-- TWO COLUMN -->\n'
+'                <tr>\n'
+'                    <td class="two-column">\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        <table width="100%">\n'
+'                        <tr>\n'
+'                        <td width="50%" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <div class="column">\n'
+'                            <table width="100%">\n'
+'                                <tr>\n'
+'                                    <td class="inner">\n'
+'                                        <table class="contents">\n'
+'                                            <tr>\n'
+'                                                <td>\n'
+'                                                    <img src="images/two-column-01.jpg" width="280" alt="" />\n'
+'                                                </td>\n'
+'                                            </tr>\n'
+'                                            <tr>\n'
+'                                                <td class="text">\n'
+'                                                    Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. \n'
+'                                                </td>\n'
+'                                            </tr>\n'
+'                                        </table>\n'
+'                                    </td>\n'
+'                                </tr>\n'
+'                            </table>\n'
+'                        </div>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="50%" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <div class="column">\n'
+'                            <table width="100%">\n'
+'                                <tr>\n'
+'                                    <td class="inner">\n'
+'                                        <table class="contents">\n'
+'                                            <tr>\n'
+'                                                <td>\n'
+'                                                    <img src="images/two-column-02.jpg" width="280" alt="" />\n'
+'                                                </td>\n'
+'                                            </tr>\n'
+'                                            <tr>\n'
+'                                                <td class="text">\n'
+'                                                    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas sed ante pellentesque, posuere leo id, eleifend dolor.  \n'
+'                                                </td>\n'
+'                                            </tr>\n'
+'                                        </table>\n'
+'                                    </td>\n'
+'                                </tr>\n'
+'                            </table>\n'
+'                        </div>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td>\n'
+'                        </tr>\n'
+'                        </table>\n'
+'                        <![endif]-->\n'
+'                    </td>\n'
+'                </tr>\n'
+'                <!-- /TWO COLUMN -->\n'
+'\n';

	var three_column_single = '\n'
+'                <!-- THREE COLUMN (SINGLE ROW) -->\n'
+'                <tr>\n'
+'                    <td class="three-column">\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        <table width="100%">\n'
+'                        <tr>\n'
+'                        <td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner">\n'
+'                                    <table class="contents">\n'
+'                                        <tr>\n'
+'                                            <td>\n'
+'                                                <img src="images/three-column-01.jpg" width="180" alt="" />\n'
+'                                            </td>\n'
+'                                        </tr>\n'
+'                                        <tr>\n'
+'                                            <td class="text">\n'
+'                                                Scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat. \n'
+'                                            </td>\n'
+'                                        </tr>\n'
+'                                    </table>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner">\n'
+'                                    <table class="contents">\n'
+'                                        <tr>\n'
+'                                            <td>\n'
+'                                                <img src="images/three-column-02.jpg" width="180" alt="" />\n'
+'                                            </td>\n'
+'                                        </tr>\n'
+'                                        <tr>\n'
+'                                            <td class="text">\n'
+'                                                Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. \n'
+'                                            </td>\n'
+'                                        </tr>\n'
+'                                    </table>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner">\n'
+'                                    <table class="contents">\n'
+'                                        <tr>\n'
+'                                            <td>\n'
+'                                                <img src="images/three-column-03.jpg" width="180" alt="" />\n'
+'                                            </td>\n'
+'                                        </tr>\n'
+'                                        <tr>\n'
+'                                            <td class="text">\n'
+'                                                Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere.\n'
+'                                            </td>\n'
+'                                        </tr>\n'
+'                                    </table>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td>\n'
+'                        </tr>\n'
+'                        </table>\n'
+'                        <![endif]-->\n'
+'                    </td>\n'
+'                </tr>\n'
+'                <!-- /THREE COLUMN (SINGLE) -->\n'
+'\n';

	var three_column_double = '\n'
+'                <!-- THREE COLUMN (DOUBLE)-->\n'
+'                <tr>\n'
+'                    <td class="three-column">\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        <table width="100%">\n'
+'                        <tr>\n'
+'                        <td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <p class="h2">Fashion</p>\n'
+'                                    <p>Class eleifend aptent taciti sociosqu ad litora torquent conubia</p>\n'
+'                                    <p><a href="#">Read requirements</a></p>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <p class="h2">Photography</p>\n'
+'                                    <p>Maecenas sed ante pellentesque, posuere leo id, eleifend dolor</p>\n'
+'                                    <p><a href="#">See examples</a></p>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <p class="h2">Design</p>\n'
+'                                    <p>Class aptent taciti sociosqu eleifend ad litora per conubia nostra</p>\n'
+'                                    <p><a href="#">See the winners</a></p>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td>\n'
+'                        </tr>\n'
+'                        <tr>\n'
+'                        <td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <p class="h2">Cooking</p>\n'
+'                                    <p>Class aptent taciti eleifend sociosqu ad litora torquent conubia</p>\n'
+'                                    <p><a href="#">Read recipes</a></p>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <p class="h2">Woodworking</p>\n'
+'                                    <p>Maecenas sed ante pellentesque, posuere leo id, eleifend dolor</p>\n'
+'                                    <p><a href="#">See examples</a></p>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="200" valign="top">\n'
+'                        <![endif]-->\n'
+'                        <table class="column">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <p class="h2">Craft</p>\n'
+'                                    <p>Class aptent taciti sociosqu ad eleifend litora per conubia nostra</p>\n'
+'                                    <p><a href="#">Vote now</a></p>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td>\n'
+'                        </tr>\n'
+'                        </table>\n'
+'                        <![endif]-->\n'
+'                    </td>\n'
+'                </tr>\n'
+'                <!-- /THREE COLUMN (DOUBLE)-->\n'
+'\n';

	var left_sidebar = '\n'
+'                <!-- LEFT SIDEBAR -->\n'
+'                <tr>\n'
+'                    <td class="left-sidebar">\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        <table width="100%">\n'
+'                        <tr>\n'
+'                        <td width="100">\n'
+'                        <![endif]-->\n'
+'                        <table class="column left">\n'
+'                            <tr>\n'
+'                                <td class="inner">\n'
+'                                    <img src="images/sidebar-01.jpg" width="80" alt="" />\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="500">\n'
+'                        <![endif]-->\n'
+'                        <table class="column right">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut erat. <a href="#">Read&nbsp;on</a>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td>\n'
+'                        </tr>\n'
+'                        </table>\n'
+'                        <![endif]-->\n'
+'                    </td>\n'
+'                </tr>\n'
+'                <!-- /LEFT SIDEBAR -->\n'
+'\n';

	var right_sidebar = '\n'
+'                <!-- RIGHT SIDEBAR -->\n'
+'                <tr>\n'
+'                    <td class="right-sidebar" dir="rtl">\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        <table width="100%" dir="rtl">\n'
+'                        <tr>\n'
+'                        <td width="100">\n'
+'                        <![endif]-->\n'
+'                        <table class="column left" dir="ltr">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    <img src="images/sidebar-02.jpg" width="80" alt="" />\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td><td width="500">\n'
+'                        <![endif]-->\n'
+'                        <table class="column right" dir="ltr">\n'
+'                            <tr>\n'
+'                                <td class="inner contents">\n'
+'                                    Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra. <a href="#">Per&nbsp;inceptos</a>\n'
+'                                </td>\n'
+'                            </tr>\n'
+'                        </table>\n'
+'                        <!--[if (gte mso 9)|(IE)]>\n'
+'                        </td>\n'
+'                        </tr>\n'
+'                        </table>\n'
+'                        <![endif]-->\n'
+'                    </td>\n'
+'                </tr>\n'
+'                <!-- RIGHT SIDEBAR -->\n'
+'\n';

	// now we start compiling the code

	var code = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n'
+'<html xmlns="http://www.w3.org/1999/xhtml">\n'
+'<head>\n'
+'    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'
+'    <!--[if !mso]><!-->\n'
+'        <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n'
+'    <!--<![endif]-->\n'
+'    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n'
+'    <title></title>\n'
+'    \n'
+'    <style type="text/css">\n'
+'        /* Basics */\n'
+'        body {\n'
+'            Margin: 0;\n'
+'            padding: 0;\n'
+'            min-width: 100%;\n'
+'            background-color: #ffffff;\n'
+'        }\n'
+'        table {\n'
+'            border-spacing: 0;\n'
+'            font-family: sans-serif;\n'
+'            color: #333333;\n'
+'        }\n'
+'        td {\n'
+'            padding: 0;\n'
+'        }\n'
+'        img {\n'
+'            border: 0;\n'
+'        }\n'
+'        .wrapper {\n'
+'            width: 100%;\n'
+'            table-layout: fixed;\n'
+'            -webkit-text-size-adjust: 100%;\n'
+'            -ms-text-size-adjust: 100%;\n'
+'        }\n'
+'        .webkit {\n'
+'            max-width: 600px;\n'
+'        }\n'
+'        .outer {\n'
+'            Margin: 0 auto;\n'
+'            width: 100%;\n'
+'            max-width: 600px;\n'
+'        }\n'
+'        .inner {\n'
+'            padding: 10px;\n'
+'        }\n'
+'        .contents {\n'
+'            width: 100%;\n'
+'        }\n'
+'        p {\n'
+'            Margin: 0;\n'
+'        }\n'
+'        a {\n'
+'            color: #ee6a56;\n'
+'            text-decoration: underline;\n'
+'        }\n'
+'        .h1 {\n'
+'            font-size: 21px;\n'
+'            font-weight: bold;\n'
+'            Margin-bottom: 18px;\n'
+'        }\n'
+'        .h2 {\n'
+'            font-size: 18px;\n'
+'            font-weight: bold;\n'
+'            Margin-bottom: 12px;\n'
+'        }\n'
+'        .full-width-image img {\n'
+'            width: 100%;\n'
+'            max-width: 600px;\n'
+'            height: auto;\n'
+'        }\n'
+'\n'
+'        /* One column layout */\n'
+'        .one-column .contents {\n'
+'            text-align: left;\n'
+'        }\n'
+'        .one-column p {\n'
+'            font-size: 14px;\n'
+'            Margin-bottom: 10px;\n'
+'        }\n'
+'\n'
+'        /*Two column layout*/\n'
+'        .two-column {\n'
+'            text-align: center;\n'
+'            font-size: 0;\n'
+'        }\n'
+'        .two-column .column {\n'
+'            width: 100%;\n'
+'            max-width: 300px;\n'
+'            display: inline-block;\n'
+'            vertical-align: top;\n'
+'        }\n'
+'        .two-column .contents {\n'
+'            font-size: 14px;\n'
+'            text-align: left;\n'
+'        }\n'
+'        .two-column img {\n'
+'            width: 100%;\n'
+'            max-width: 280px;\n'
+'            height: auto;\n'
+'        }\n'
+'        .two-column .text {\n'
+'            padding-top: 10px;\n'
+'        }\n'
+'\n'
+'        /*Three column layout*/\n'
+'        .three-column {\n'
+'            text-align: '+three_col_align+';\n'
+'            font-size: 0;\n'
+'            padding-top: 10px;\n'
+'            padding-bottom: 10px;\n'
+'        }\n'
+'        .three-column .column {\n'
+'            width: 100%;\n'
+'            max-width: 200px;\n'
+'            display: inline-block;\n'
+'            vertical-align: top;\n'
+'        }\n'
+'        .three-column img {\n'
+'            width: 100%;\n'
+'            max-width: 180px;\n'
+'            height: auto;\n'
+'        }\n'
+'        .three-column .contents {\n'
+'            font-size: 14px;\n'
+'            text-align: center;\n'
+'        }\n'
+'        .three-column .text {\n'
+'            padding-top: 10px;\n'
+'        }\n'
+'\n'
+'        /* Left sidebar layout */\n'
+'        .left-sidebar {\n'
+'            text-align: center;\n'
+'            font-size: 0;\n'
+'        }\n'
+'        .left-sidebar .column {\n'
+'            width: 100%;\n'
+'            display: inline-block;\n'
+'            vertical-align: middle;\n'
+'        }\n'
+'        .left-sidebar .left {\n'
+'            max-width: 100px;\n'
+'        }\n'
+'        .left-sidebar .right {\n'
+'            max-width: 500px;\n'
+'        }\n'
+'        .left-sidebar .img {\n'
+'            width: 100%;\n'
+'            max-width: 80px;\n'
+'            height: auto;\n'
+'        }\n'
+'        .left-sidebar .contents {\n'
+'            font-size: 14px;\n'
+'            text-align: center;\n'
+'        }\n'
+'        .left-sidebar a {\n'
+'            color: #85ab70;\n'
+'        }\n'
+'\n'
+'        /* Right sidebar layout */\n'
+'        .right-sidebar {\n'
+'            text-align: center;\n'
+'            font-size: 0;\n'
+'        }\n'
+'        .right-sidebar .column {\n'
+'            width: 100%;\n'
+'            display: inline-block;\n'
+'            vertical-align: middle;\n'
+'        }\n'
+'        .right-sidebar .left {\n'
+'            max-width: 100px;\n'
+'        }\n'
+'        .right-sidebar .right {\n'
+'            max-width: 500px;\n'
+'        }\n'
+'        .right-sidebar .img {\n'
+'            width: 100%;\n'
+'            max-width: 80px;\n'
+'            height: auto;\n'
+'        }\n'
+'        .right-sidebar .contents {\n'
+'            font-size: 14px;\n'
+'            text-align: center;\n'
+'        }\n'
+'        .right-sidebar a {\n'
+'            color: #70bbd9;\n'
+'        }\n'
+'\n'
+'        /*Media Queries*/\n'
+'        @media screen and (max-width: '+mobile_bp+'px) {\n'
+'            .two-column .column,\n'
+'            .three-column .column {\n'
+'                max-width: 100% !important;\n'
+'            }\n'
+'            .two-column img {\n'
+'                max-width: 100% !important;\n'
+'            }\n'
+'            .three-column img {\n'
+'                max-width: 50% !important;\n'
+'            }\n'
+'        }\n'
+'\n'
+'        @media screen and (min-width: '+tablet_start_bp+'px) and (max-width: '+tablet_end_bp+'px) {\n'
+'            .three-column .column {\n'
+'                max-width: 33% !important;\n'
+'            }\n'
+'            .two-column .column {\n'
+'                max-width: 50% !important;\n'
+'            }\n'
+'        }\n'
+'\n'
+'    </style>\n'
+'\n'
+'    <!--[if (gte mso 9)|(IE)]>\n'
+'    <style type="text/css">\n'
+'        table {border-collapse: collapse;}\n'
+'    </style>\n'
+'    <![endif]-->\n'
+'</head>\n'
+'<body>\n'
+'    <center class="wrapper">\n'
+'        <div class="webkit">\n'
+'            <!--[if (gte mso 9)|(IE)]>\n'
+'            <table width="600" align="center">\n'
+'            <tr>\n'
+'            <td>\n'
+'            <![endif]-->\n'
+'            <table class="outer" align="center">\n'
+'            <!-- CONTENT START -->\n\n'

 	// loop through and add components here
 	var total_components = component_list.length;

 	for (var i = 0; i <= total_components - 1; i++) {

 		switch (component_list[i]) {
 			case "add-banner" :
 				code += banner;
 				break;
 			case "add-one-column" :
 				code += one_column;
 				break;
 			case "add-two-column" :
 				code += two_column;
 				break;
 			case "add-three-column" :
 				code += three_column_single;
 				break;
 			case "add-sidebar-n" :
 				code += left_sidebar;
 				break;
 			case "add-sidebar-r" :
 				code += right_sidebar;
 				break;
 			case "add-six-column" :
 				code += three_column_double;
 				break;

 		}
 	}


 	// add end of email code
	code += '\n'
+'            <!-- /CONTENT -->\n'
+'            </table>\n'
+'            <!--[if (gte mso 9)|(IE)]>\n'
+'            </td>\n'
+'            </tr>\n'
+'            </table>\n'
+'            <![endif]-->\n'
+'        </div>\n'
+'    </center>\n'
+'</body>\n'
+'</html>\n';

	code = safe_tags_replace(code);
	textarea.html(code);
}