function initial() {
    let year = document.getElementById("year");
    let in_hour = document.getElementById("in-hour");
    let out_hour = document.getElementById("out-hour");
    year.innerHTML = "";
    in_hour.innerHTML = "";
    out_hour.innerHTML = "";
    year.options.add(new Option("--", null));
    in_hour.options.add(new Option("--", null));
    out_hour.options.add(new Option("--", null));
    for (let i = 2010; i <= 2020; ++i)
        year.options.add(new Option(i, i));
    for (let i = 0; i <= 23; ++i) {
        in_hour.options.add(new Option(i, i));
        out_hour.options.add(new Option(i, i));
    }
    onClickHide();
}

function setMonth() {
    let month = document.getElementById("month");
    month.innerHTML = "";
    month.options.add(new Option("--", null));
    for (let i = 1; i <= 12; ++i)
        month.options.add(new Option(i, i));
}

function setDay() {
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let day = document.getElementById("day");
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    day.innerHTML = "";
    day.options.add(new Option("--", null));
    for (let i = 1; i <= days[month - 1]; ++i)
        day.options.add(new Option(i, i));
    if ((year % 4 == 0 && year % 100 != 0 || year % 400 == 0) && month == 2)
        day.options.add(new Option(29, 29));
}

function setInMinute() {
    let minute = document.getElementById("in-minute");
    if (minute.innerHTML != "") return;
    minute.options.add(new Option("--", null));
    for (let i = 0; i <= 59; ++i)
        minute.options.add(new Option(i, i));
}

function setOutMinute() {
    let minute = document.getElementById("out-minute");
    if (minute.innerHTML != "") return;
    minute.options.add(new Option("--", null));
    for (let i = 0; i <= 59; ++i)
        minute.options.add(new Option(i, i));
}

function onClickAddPlate() {
    // Initialize the variables.
    let bodyObj = document.getElementById("tbody");
    if (bodyObj == null) {
        alert("Body of table not exist!");
        return;
    }
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    month = format(month);
    let day = document.getElementById("day").value;
    day = format(day);
    let in_hour = document.getElementById("in-hour").value;
    in_hour = format(in_hour);
    let in_minute = document.getElementById("in-minute").value;
    in_minute = format(in_minute);
    let out_hour = document.getElementById("out-hour").value;
    out_hour = format(out_hour);
    let out_minute = document.getElementById("out-minute").value;
    out_minute = format(out_minute);
    let row_count = bodyObj.rows.length;
    let cell_count = bodyObj.rows[0].cells.length;

    // Check the validity.
    // Check the plate number.
    let plate = document.forms[0]["plate-no"].value;
    let normal_plate = new RegExp(/^([A-Z0-9]{5})|([D|F][A-Z0-9]{5})$/);
    if (!normal_plate.test(plate)) {
        alert("Invalid plate format!");
        return;
    }
    // Check the entrance number.
    let entrance = document.forms[0]["entrance-no"].value;
    let normal_entrance = new RegExp(/^[1-7]$/);
    if (!normal_entrance.test(entrance)) {
        alert("Invalid entrance number!");
        return;
    }
    // Check the staff number.
    let staff = document.forms[0]["staff-no"].value;
    let normal_staff = new RegExp(/^[35][0-9]{7}$/);
    if (!normal_staff.test(staff)) {
        alert("Invalid staff number!");
        return;
    }
    // Check the difference of plate number, date, and arrival time.
    let date = year + "." + month + "." + day;
    let arrival = in_hour + ":" + in_minute;
	let departure = (out_hour == "null" || out_minute == "null") ? "--" : out_hour + ":" + out_minute;
    let status = document.forms[0]["status"].value;
    for (let i = 1; i < row_count; ++i) {
        if (status == "In" && "粤B" + plate == bodyObj.rows[i].cells[0].innerHTML && date == bodyObj.rows[i].cells[2].innerHTML && arrival == bodyObj.rows[i].cells[3].innerHTML) {
            alert("Same record already in the table!");
            return;
        } else if (status == "Out" && "粤B" + plate == bodyObj.rows[i].cells[0].innerHTML && date == bodyObj.rows[i].cells[2].innerHTML && arrival == bodyObj.rows[i].cells[3].innerHTML && departure == bodyObj.rows[i].cells[4].innerHTML) {
        	alert("You've already out of the parking lot!");
        	return;
		}
    }
    // Check the departure time.
    if (status == "In" && departure != "--" || status == "Out" && departure == "--") {
        alert("Invalid Status!");
        return;
    }
    if (departure != "--" && departure <= arrival) {
        alert("Invalid departure time!");
        return;
    }
    // Check empty content.
    let name = document.forms[0]["staff-name"].value;
    if (year == "null" || month == "null" || day == "null" || in_hour == "null" || in_minute == "null" || departure == "null" || name == "" || status == "") {
        alert("Missing required information!");
        return;
    }

    // Add new row to the table.
    bodyObj.style.display = "";
    let new_row = bodyObj.insertRow(row_count++);
    new_row.insertCell(0).innerHTML = "粤B" + plate;
    new_row.insertCell(1).innerHTML = entrance;
    new_row.insertCell(2).innerHTML = date;
    new_row.insertCell(3).innerHTML = arrival;
    new_row.insertCell(4).innerHTML = departure;
    new_row.insertCell(5).innerHTML = name;
    new_row.insertCell(6).innerHTML = staff;
    new_row.insertCell(7).innerHTML = status;
    new_row.insertCell(8).innerHTML = bodyObj.rows[0].cells[cell_count - 1].innerHTML;
    bodyObj.rows[0].style.display = "none";
}

function removeRow(inputobj) {
    if (inputobj == null) return;
    let parentTD = inputobj.parentNode;
    let parentTR = parentTD.parentNode;
    let parentTBODY = parentTR.parentNode;
    parentTBODY.removeChild(parentTR);
}

function onClickShow() {
    document.getElementById("add-box").style.display = "";
    document.getElementById("add-button").style.display = "none";
}

function onClickHide() {
    document.getElementById("add-box").style.display = "none";
    document.getElementById("add-button").style.display = "";
}

function format(str) {
    if (str < 10)
        return "0" + str;
    else
        return str;
}