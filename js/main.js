$(document).ready(function() {
    const array_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var text = "";
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

    function pickNameAndRandomMonth() {
        let name = $("#name").val();
        let random_month = getRandomMonth(array_months);
        text += `${random_month} ${name}\n`;
        let box_text = `<h3>${name}</h3>\n<h1>${random_month.toUpperCase()}</h1>`;
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

});

