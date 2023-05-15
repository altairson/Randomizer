$(document).ready(function() {
    const array_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var text = "";
    var ids = [];
    var topics = [];
    var passwords = [];

    var data = [];

    $(".box").click(function(e) {
        $(this).addClass("selected");
        e.preventDefault();
        let overlay = document.createElement("div");
        overlay.id = "overlay";
        let top = $(this).offset().top;
        let left = $(this).offset().left;
        let div = document.createElement("div");
        div.style.top = top + "px";
        div.style.left = left + "px";
        div.id = "info";
        let input = document.createElement("input");
        input.placeholder = "your name";
        input.id = "name";
        div.appendChild(input);
        let button = document.createElement("button");
        button.innerText = "Random Month";
        button.id = "random";
        div.appendChild(button);
        $("#main").append(overlay);
        $("#main").append(div);
        $("#name").focus();
    })

    //delete month from array 
    function removeElementFromArray(month) {
        const index = array_months.indexOf(month);
        if (index > -1) { 
            array_months.splice(index, 1);
        }
        console.log(array_months.length);
    }

    function saveInSpreadSheet(name, month, index) {
        let app_id = $("#topics_select").val();
        $("#app_id").val(app_id);
        $("#asigned_to").val(name);
        $("#month").val(month);
        $("#box_index").val(index);
        $("#submit").click();
    }

    function pickNameAndRandomMonth() {
        let name = $("#name").val();
        let random_month = getRandomMonth(array_months);
        text += `${random_month} ${name}\n`;
        let box_text = `<h3>${name}</h3>\n<h1>${random_month.toUpperCase()}</h1>`;
        let index = $(".selected").index();
        saveInSpreadSheet(name, random_month, index);
        $(".selected")[0].innerText = "";
        $(".selected").append(box_text);
        removeElementFromArray(random_month);
        $(".selected").addClass("picked");
        $(".selected").removeClass("selected");
        $("#info").remove();
        $("#overlay").remove();
        $("#result_text").val(text);
        sortText();
    }

    $("#unlock").click(function() {
        let pass = $("#pass").val();
        let id = $("#topics_select").val();
        if(checkPassword(pass)) {
            displayData(id);
            $(".select-background").toggleClass("hidden");
        }
        else {
            alert("verkeerd trefwoord!");
        }
    })

    function checkPassword(pass) {
        let match = false;
        let password = $("#topics_select").find(":selected")[0].dataset.password;
        if (password == pass) {
            match = true;
        }
        return match;
    }

    function displayData(id) {
        let boxes = $(".box");
        text = "";
        for (let i = 0; i < data.length; i++) {
            if(data[i].app_id == id) {
                let box_text = `<h3>${data[i].asigned_to}</h3>\n<h1>${data[i].month.toUpperCase()}</h1>`;
                text += `${data[i].month} ${data[i].asigned_to}\n`;
                boxes[parseInt(data[i].box_index)].classList.add("selected");
                removeElementFromArray(data[i].month);
                $(".selected").html("");
                $(".selected").append(box_text);
                $(".selected").addClass("picked");
                $(".selected").removeClass("selected");
                $("#result_text").val(text);
                sortText();
            }
        }
    }

    $("#create_topic").click(function() {
        let new_index = 0;
        if (ids.length > 0) { 
            new_index = parseInt(ids[ids.length - 1]) + 1;
        }
        $("#id").val(new_index);
        $(".new-app").toggleClass("hidden");
    })

    function sortText() {
        sorted_text = "";
        let sorted_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let text_array = text.split('\n');
        for(let i = 0; i < sorted_months.length; i++) {
            for(let j = 0; j < text_array.length; j++) {
                if(sorted_months[i] == text_array[j].split(' ')[0]) {
                    sorted_text += `${sorted_months[i]} ${text_array[j].split(' ')[1]}\n`;
                }
            }
        }
        $("#result_text").val(sorted_text);
    }

    $("#main").on("click", "#random", function(e) {
        e.preventDefault();
        pickNameAndRandomMonth();
    })


    $("#main").on("keypress", "#name", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            pickNameAndRandomMonth();
        }
    })
    

    function getRandomMonth(arr) {
        // get random index value
        const randomIndex = Math.floor(Math.random() * arr.length);
        // get random item
        const item = arr[randomIndex];
        return item;
    }

    $("#copy").click(function() {
        copyText()
    });

    function copyText() {
        let text = $("#result_text").val();
        navigator.clipboard.writeText(text);
        alert('text copied to clipboard');
    }

    function read_write_app_names() {
        const url = "https://script.google.com/macros/s/AKfycbwy3yOzvIBrPjtYzaa_1OQDPaLYpDvheAOwzwdtqmA6J09HwRD15npiBkOJkvjJAXlbgQ/exec";
        document.getElementById('app_form').action = url;
        let index = 0;

        fetch(`${url}?header=id`)
            .then((response) => response.json())
            .then(({ data }) => {
                ids = data;
                console.log("id: " + data);
                index++;
                if(index == 3) {
                    fillSelectOptions(ids, topics, passwords);
                }
            })
        .catch((error) => console.error('!!!!!!!!', error));


        fetch(`${url}?header=topic`)
            .then((response) => response.json())
            .then(({ data }) => {
                topics = data;
                console.log("topics: " + data);
                index++;
                if(index == 3) {
                    fillSelectOptions(ids, topics, passwords);
                }
            })
        .catch((error) => console.error('!!!!!!!!', error));

        fetch(`${url}?header=password`)
            .then((response) => response.json())
            .then(({ data }) => {
                passwords = data;
                console.log("passwords: " + data);
                index++;
                if(index == 3) {
                    fillSelectOptions(ids, topics, passwords);
                }
            })
        .catch((error) => console.error('!!!!!!!!', error));
    }

    function fillSelectOptions(ids, topics, passwords) {
        for(let i = 0; i < ids.length; i++) {
            let option = `<option data-password="${passwords[i]}" value="${ids[i]}">${topics[i]}</option>`;
            $("#topics_select").append(option);
        }
    }

    $("#topics_select").change(function() {
        $(".pass_input").toggleClass("hidden");
    });

    read_write_app_names();


    function combine_arrays(ids, months, names, boxes) {
        for(let i = 0; i < ids.length; i++) {
            let obj = {
                app_id: ids[i],
                month: months[i],
                asigned_to: names[i],
                box_index: boxes[i]
            }
            data.push(obj);
        }
    }

  function connectToSheets() {
        let url = "https://script.google.com/macros/s/AKfycby9n0jh2Mjr-P9H9Rz3ARcgoDbanxNBmyilt83lne3AlY9U0D38RGmvknlr1LBETrqp/exec";
        document.getElementById('form').action = url;
        let index = 0;

        let app_ids = [];
        let months = [];
        let asigned_tos = [];
        let box_indexes = [];

        fetch(`${url}?header=app_id`)
            .then((response) => response.json())
            .then(({ data }) => {
                console.log(data);
                app_ids = data;
                index++;
                if(index == 4) {
                    combine_arrays(app_ids, months, asigned_tos, box_indexes);
                }
            })
            .catch((error) => console.error('!!!!!!!!', error));

            fetch(`${url}?header=month`)
            .then((response) => response.json())
            .then(({ data }) => {
                console.log(data);
                months = data;
                index++;
                if(index == 4) {
                    combine_arrays(app_ids, months, asigned_tos, box_indexes);
                }
            })
            .catch((error) => console.error('!!!!!!!!', error));

            fetch(`${url}?header=asigned_to`)
            .then((response) => response.json())
            .then(({ data }) => {
                console.log(data);
                asigned_tos = data
                index++;
                if(index == 4) {
                    combine_arrays(app_ids, months, asigned_tos, box_indexes);
                }
            })
            .catch((error) => console.error('!!!!!!!!', error));

            fetch(`${url}?header=box_index`)
            .then((response) => response.json())
            .then(({ data }) => {
                console.log(data);
                box_indexes = data;
                index++;
                if(index == 4) {
                    combine_arrays(app_ids, months, asigned_tos, box_indexes);
                }
            })
            .catch((error) => console.error('!!!!!!!!', error));

  }

  connectToSheets();

});

