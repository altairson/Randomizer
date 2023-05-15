$(document).ready(function() {
    const array_months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    var text = "";
    var topic_datalist = [];
    var datalist = [];

    $(".box").click(function(e) {
        if(!$(this).hasClass("picked")) {
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
        }
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

    $("#app_submit").click(function() {
        location.reload();
    })

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
        for (let i = 1; i < datalist.length; i++) {
            if(datalist[i][0] == id) {
                let box_text = `<h3>${datalist[i][2]}</h3>\n<h1>${datalist[i][1].toUpperCase()}</h1>`;
                text += `${datalist[i][1]} ${datalist[i][2]}\n`;
                boxes[parseInt(datalist[i][3])].classList.add("selected");
                removeElementFromArray(datalist[i][1]);
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
        debugger
        let new_index = 0;
        if (topic_datalist.length > 1) { 
            new_index = parseInt(topic_datalist[topic_datalist.length - 1][0]) + 1;
        }
        $("#id").val(new_index);
        $(".new-app").toggleClass("hidden");
    })

    function sortText() {
        sorted_text = "";
        let sorted_months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
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

    $("#pass").keypress(function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $("#unlock").click();
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
        const url = "https://script.google.com/macros/s/AKfycbzRERg_ZY_cbFU3a1Rd_BmfW8ETnyWGawqdKBH-ENUxFvqpcm9GO5eigmQZjFdzSbH0_A/exec";
        document.getElementById('app_form').action = url;

        fetch(`${url}`)
            .then((response) => response.json())
            .then(({ data }) => {
                topic_datalist = data;
                console.log(topic_datalist);
                fillSelectOptions();
            })
        .catch((error) => console.error('!!!!!!!!', error));
    }

    function fillSelectOptions() {
        for(let i = 1; i < topic_datalist.length; i++) {
            let option = `<option data-password="${topic_datalist[i][2]}" value="${topic_datalist[i][0]}">${topic_datalist[i][1]}</option>`;
            $("#topics_select").append(option);
            $(".loading").addClass('hidden');
        }
    }

    $("#topics_select").change(function() {
        $(".pass_input").toggleClass("hidden");
    });

    read_write_app_names();

  function connectToSheets() {
        let url = "https://script.google.com/macros/s/AKfycbysLQdUbmLOutN-vBhhXvmJXenWm8UvPzyzY6TWdu3GHaBf_iuGQM--39Ih9UadHiD6/exec";
        document.getElementById('form').action = url;

        fetch(`${url}`)
            .then((response) => response.json())
            .then(({ data }) => {
                console.log(data);
                datalist = data;
            })
            .catch((error) => console.log('!!!!!!!!', error));
  }

  connectToSheets();

});

