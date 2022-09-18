var SELECTED_FLOOR_ID;
var SELECTED_SEATS = [];
var SELECTED_COLOR_CODES = [];

const NOTIFICATION_TYPE_INFO = "info";
const NOTIFICATION_TYPE_WARN = "warning";
const NOTIFICATION_TYPE_ERROR = "error";
function show_notification(msg, notificationType) {
	document.getElementById("notifications").innerHTML = msg;
	if (notificationType == NOTIFICATION_TYPE_ERROR) {
		document.getElementById("notifications").style.color = "#ff0000";
	} else if (notificationType == NOTIFICATION_TYPE_WARN) {
		document.getElementById("notifications").style.color = "#ff6600";
	} else {
		document.getElementById("notifications").style.color = "#009900";
	}
}

function highlight_floor_plan(floor_id) {
	console.log("Selected floor : " + floor_id);
	if (SELECTED_FLOOR_ID != null && SELECTED_FLOOR_ID != '')
		document.getElementById(SELECTED_FLOOR_ID).style.backgroundColor = "white";
	SELECTED_FLOOR_ID = floor_id;
	document.getElementById(floor_id).style.backgroundColor = "#ffff66";
}

function allocate(oe_code) {
	if (SELECTED_FLOOR_ID == null || SELECTED_FLOOR_ID == '') {
		show_notification("Error : No floor selected for floor allocation", NOTIFICATION_TYPE_ERROR);
		return;
	}

	var seat_allocation_count = 0;
	var seat_allocation_limit = document.getElementById(oe_code + "-limit").textContent;
	var seat_allocation_completed = document.getElementById(oe_code + "-alloted").textContent;
	var seat_allocation_remaining = document.getElementById(oe_code + "-pending").textContent;
	var seat_allocation_color = document.getElementById(oe_code + "-color-code").value;
	var existingColorCode = SELECTED_COLOR_CODES.indexOf(seat_allocation_color);
	if (existingColorCode != -1) {
		show_notification("Error : Color code already opted, please select another color", NOTIFICATION_TYPE_ERROR);
		return;
	}

	const non_seat_elements = [];
	var floor = document.getElementById(SELECTED_FLOOR_ID);
	non_seat_elements.push(floor);
	while (non_seat_elements.length != 0 && seat_allocation_count < seat_allocation_remaining) {
		var element = non_seat_elements.shift();
		if (element.hasChildNodes() === true) {
			var children = element.childNodes;
			for (var i=0; i<children.length; i++) {
				var child = children[i];
				if (child.tagName != "undefined") {
					if (child.id != "undefined" && child.id != null && child.id != "") {
						var selected_seat_index = SELECTED_SEATS.indexOf(child.id); 
						if (selected_seat_index == -1) {
							child.style.backgroundColor = seat_allocation_color;
							SELECTED_SEATS.push(child.id);
							seat_allocation_count++;
							if (seat_allocation_count == seat_allocation_remaining) {
								break;
							}
						}
					} else {
						non_seat_elements.push(child);			
					}
				}
			}
		}
	}

	document.getElementById(oe_code + "-alloted").textContent = seat_allocation_count;
	document.getElementById(oe_code + "-pending").textContent = (seat_allocation_remaining - seat_allocation_count);
	if (seat_allocation_count < seat_allocation_remaining) {
		show_notification("Select another floor to alocate the remaining " + (seat_allocation_remaining - seat_allocation_count) + " seats", NOTIFICATION_TYPE_WARN);
	} else {
		SELECTED_COLOR_CODES.push(seat_allocation_color);
	}
}