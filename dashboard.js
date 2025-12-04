const quotes = [
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "The best way to get started is to quit talking and begin doing. — Walt Disney",
    "Don’t watch the clock; do what it does. Keep going. — Sam Levenson",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
    "Act as if what you do makes a difference. It does. — William James",
    "Dream big and dare to fail. — Norman Vaughan",
    "Hardships often prepare ordinary people for an extraordinary destiny. — C.S. Lewis",
    "Start where you are. Use what you have. Do what you can. — Arthur Ashe",
    "Keep your face always toward the sunshine—and shadows will fall behind you. — Walt Whitman",
    "The secret of getting ahead is getting started. — Mark Twain",
    "Everything you’ve ever wanted is on the other side of fear. — George Addair",
    "It always seems impossible until it’s done. — Nelson Mandela",
    "Don’t let yesterday take up too much of today. — Will Rogers",
    "Do something today that your future self will thank you for. — Sean Patrick Flanery",
    "Great things never come from comfort zones. — Anonymous",
    "Push yourself, because no one else is going to do it for you. — Anonymous",
    "The harder you work for something, the greater you’ll feel when you achieve it. — Anonymous",
    "Don’t limit your challenges — challenge your limits. — Anonymous",
    "Little things make big days. — Anonymous",
    "You don’t have to be great to start, but you have to start to be great. — Zig Ziglar"
];

const PendingItem = (props) => {
    return (`
        <div tdata-index="${props.id}">
            <input type="checkbox" id="delete_task">
            <p hidden class="index">${props.id}</p>
            <h3>Category: ${props.task_category}</h3>
            <h2>Title: ${props.task_title}</h2>
            <p>Assigned to: ${props.task_assigned_to}</p>
        </div>
        <div id="pBox2">
            <p>Time left: ${props.days} days</p>
            <button class="pMoreInfo" data-id="${props.id}">More info</button>
        </div>
    `)
}

$(document).ready(function () {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    (function () {
        const uname = params.get("username")
        // const data = JSON.parse(localStorage.getItem("todo"))
        $("#welcome_msg").text(`Welcome ${uname}`);
        let initials = ""
        uname.split(" ").forEach(e => {
            initials += e[0]
        })
        $("#user_initials > p").text(`${initials.toUpperCase()}`);
        const temp = Math.floor(Math.random() * 20)
        $("#quote_of_day").html("<b>Quote of the day : </b>" + quotes[temp])
        resetContent()
    })();

    $("#new_btn").click(function () {
        $("#add_new_task").fadeIn(500)
        $("#task_created_at").val(new Date().toISOString().split('T')[0])
    });
    $("#filter_btn").click(function () {
        $("#filter_display_tasks").fadeIn(500)
    });
    $("#close_add_form").click(function () {
        $("#task_form")[0].reset();
        $("#add_new_task").fadeOut(500)
    });
    $("#close_filter_form").click(function () {
        $("#filter_form")[0].reset();
        $("#filter_display_tasks").fadeOut(500)
    });
    $("#close_more_info").click(function () {
        $("#more_info_tasks").fadeOut(500)
    });


    $("#task_completed").click(function () {
        if ($("#task_completed").prop('checked')) {
            let tempV1 = $("#task_created_at").val()
            $("#task_complete_at").val(tempV1)
            $('#task_priority').val("none");
            document.querySelector("#task_priority").setAttribute("disabled", "true")
        } else {
            document.querySelector("#task_priority").removeAttribute("disabled")
            $("#task_complete_at").val("")
            $('#task_priority').val("");
        }
    });

    $("#task_form").submit(function (e) {
        e.preventDefault()
        let task_category, task_title, task_description, task_assigned_to, task_date_created, task_date_to_complete, priority, set_reminder, task_completed, task_comment
        task_category = $("#task_category").val()
        task_title = $("#task_title").val()
        task_description = $("#task_desc").val()
        task_assigned_to = $("#task_asignned_to").val()
        task_date_created = $("#task_created_at").val()
        task_date_to_complete = $("#task_complete_at").val()
        if (new Date(task_date_created) > new Date(task_date_to_complete)) {
            showToast("invalid dates!", 1000)
            return
        }
        if ($("#task_priority").val() == null || $("#task_priority").val() == undefined) {
            priority = "none"
        } else priority = $("#task_priority").val()

        set_reminder = $("#task_reminder").prop('checked')
        task_completed = $("#task_completed").prop('checked')
        task_comment = $("#task_comments").val()
        const data = JSON.parse(localStorage.getItem("todo"))
        const uname = params.get("username")
        data.data.forEach(d => {
            if (d.user_creds.user_name == uname) {
                const inpData = { "id": d.user_data.length + 1, "task_category": task_category, "task_title": task_title, "task_description": task_description, "task_assigned_to": task_assigned_to, "task_date_created": task_date_created, "task_date_to_complete": task_date_to_complete, "priority": priority, "set_reminder": set_reminder, "task_completed": task_completed, "task_comment": task_comment }
                d.user_data.push(inpData)
            }
        })
        localStorage.setItem("todo", JSON.stringify(data))
        $("#add_new_task").fadeOut(500)
        showToast("task created!", 1000)
        this.reset();
        resetContent()
    })
    function debouncerWithApiNewReq(handler, delay) {
        let timer
        // let requesttoapimade = true
        return (...args) => {
            console.log("argss", ...args)
            if (requesttoapimade) {
                handler(...args)
                requesttoapimade = false
                return
            }
            timer = setTimeout(() => {
                clearTimeout(timer)
                requesttoapimade = true
            }, delay)
            console.log("bool",requesttoapimade);
            
        }
    }
    const searchHandler = (event) => {
        setTimeout(() => {
            const elemList = document.querySelectorAll(`[task_title^="${tempTitle}" i]`)
            console.log(elemList);
            document.querySelectorAll("[task_title]").forEach(e => {
                $(e).hide()
            })
            elemList.forEach(E => {
                $(E).show()
            })
        }, 3000)
        let tempTitle = event.target.value.trim()
        if (tempTitle == '') {
            document.querySelectorAll("[task_title]").forEach(e => {
                $(e).show()
            })
            return
        }
    }
    const searchWithDebounce = debouncerWithApiNewReq(searchHandler, 1000)
    $("#search_inp").on("input", searchWithDebounce)
    // function debouncer(handler,delay) {
    //     let timer;
    //     return function (...args) {
    //         clearTimeout(timer);
    //         timer = setTimeout(()=>{
    //             handler(...args)
    //         },delay)
    //     }
    // }
    // const searchHandler =(event)=>{
    //     let tempTitle = event.target.value.trim()
    //     if (tempTitle=='') {
    //         document.querySelectorAll("[task_title]").forEach(e=>{
    //         $(e).show()
    //     })
    //     return
    //     }
    //     const elemList = document.querySelectorAll(`[task_title^="${tempTitle}" i]`)
    //     console.log(elemList);
    //     document.querySelectorAll("[task_title]").forEach(e=>{
    //         $(e).hide()
    //     })
    //     elemList.forEach(E=>{
    //         $(E).show()
    //     })

    // }
    // const searchWithDebounce = debouncer(searchHandler,1000)
    // $("#search_inp").on("input", searchWithDebounce)


    $("#clear_filters").click(function () {
        resetContent()
    })



    $("#pending_tasks_filter").change(function (e) {
        e.preventDefault();
        if ($("#pending_tasks_filter").prop('checked')) {
            $('#pending_tasks').show()
            if ($("#completed_tasks_filter").prop('checked')) {
                $('#completed_tasks').show()
            } else {
                $('#completed_tasks').hide()
            }
        } else {
            if ($("#completed_tasks_filter").prop('checked')) {
                $('#completed_tasks').show()
                $('#pending_tasks').hide()
            } else {
                $('#completed_tasks').show()
                $('#pending_tasks').show()
            }
        }
    });
    $("#completed_tasks_filter").change(function (e) {
        e.preventDefault();
        if ($("#completed_tasks_filter").prop('checked')) {
            $('#completed_tasks').show()
            if ($("#pending_tasks_filter").prop('checked')) {
                $('#pending_tasks').show()
            } else {
                $('#pending_tasks').hide()
            }
        } else {
            if ($("#pending_tasks_filter").prop('checked')) {
                $('#pending_tasks').show()
                $('#completed_tasks').hide()
            } else {
                $('#completed_tasks').show()
                $('#pending_tasks').show()
            }
        }
    });
    $("#pf").change(function (e) {
        e.preventDefault();
        const filterVal = $("#pf").val().toString()
        console.log(this.value);
        const compFilter = $("#completed_tasks_filter").prop('checked')
        const pendFilter = $("#pending_tasks_filter").prop('checked')
        if (compFilter && !pendFilter) {
            const elemArr = document.querySelectorAll("#completed_tasks .pending_item")
            console.log(elemArr);

        }
        if (pendFilter && !compFilter) {
            const elemArr = document.querySelectorAll("#pending_tasks .pending_item")
            console.log(elemArr);
        }
        if ((pendFilter && compFilter) || (!pendFilter && !compFilter)) {
            const elemArr = document.querySelectorAll(`[priority]`).forEach(e => {
                if ($(e).attr('priority') == filterVal) {
                    $(e).show()
                }
                else $(e).hide()
            })
        }
    });

    $("#del_btn").click(function () {
        const dataToDelete = []
        document.querySelectorAll("#delete_task").forEach(e => {
            if (e.checked) {
                dataToDelete.push($(e).parent().data('index'))
            } else console.log("not delete");
        })
        console.log(dataToDelete);
        const data = JSON.parse(localStorage.getItem("todo"))
        const uname = params.get("username")
        const tmpData = []
        data.data.forEach(d => {
            if (d.user_creds.user_name == uname) {
                d.user_data.forEach(entry => {
                    console.log("id here", entry.id);
                    if (!dataToDelete.includes(entry.id)) {
                        tmpData.push(entry)
                    }
                })
                d.user_data = tmpData
            }
        })
        console.log(data, tmpData);
        localStorage.setItem("todo", JSON.stringify(data))
        showToast("deleted successfully", 1500)
        resetContent()
    })

    $(".pMoreInfo").click(function () {
        const iD = $(this).parent().parent().find(".index").text()
        const data = JSON.parse(localStorage.getItem("todo"))
        const uname = params.get("username")
        data.data.forEach(d => {
            if (d.user_creds.user_name == uname) {
                d.user_data.forEach(info => {
                    if (info.id == iD) {
                        const temp = info
                        console.log(temp);
                        $("#mi_box_1 > p").text(temp.task_category)
                        $("#mi_box_2 > p").text(temp.task_title)
                        $("#mi_box_3 > p").text(temp.task_description)
                        $("#mi_box_4 > p").text(temp.task_assigned_to)
                        $("#mi_box_5").children("p:first-of-type").text(temp.task_date_created)
                        $("#mi_box_5 > p").children("p:last-of-type").text(temp.task_date_to_complete)
                        $("#mi_box_6 > p").text(temp.priority)
                        $("#mi_box_7 > p").text(temp.task_comment)
                    }
                })
            }
        })
        $("#more_info_tasks").fadeIn(500);
    })

})

function resetContent() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const uname = params.get("username")
    const data = JSON.parse(localStorage.getItem("todo"))
    document.querySelector("#pending_tasks").innerHTML = ''
    document.querySelector("#completed_tasks").innerHTML = ''
    data.data.forEach(d => {
        if (d.user_creds.user_name == uname) {
            const temp = d.user_data
            temp.forEach(e => {
                const elem = document.createElement('div')
                elem.classList.add('pending_item')
                if (e.task_date_to_complete != '') {
                    const d1 = new Date(e.task_date_to_complete)
                    const d2 = new Date(new Date().toISOString().split('T')[0])
                    if (d1 > d2) {
                        const dif = d1 - d2
                        const diffInDays = dif / (1000 * 60 * 60 * 24);
                        const obj = {
                            id: e.id,
                            task_category: e.task_category,
                            task_title: e.task_title,
                            task_assigned_to: e.task_assigned_to,
                            days: diffInDays
                        }
                        elem.innerHTML = PendingItem(obj)

                    } else {
                        const obj = {
                            id: e.id,
                            task_category: e.task_category,
                            task_title: e.task_title,
                            task_assigned_to: e.task_assigned_to,
                            days: 0
                        }
                        elem.innerHTML = PendingItem(obj)
                    }
                } else {
                    const obj = {
                        id: e.id,
                        task_category: e.task_category,
                        task_title: e.task_title,
                        task_assigned_to: e.task_assigned_to,
                        days: 0
                    }
                    elem.innerHTML = PendingItem(obj)
                }
                elem.setAttribute("priority", e.priority)
                elem.setAttribute("task_title", e.task_title)
                if (!e.task_completed) {
                    document.querySelector("#pending_tasks").append(elem)
                } else {
                    document.querySelector("#completed_tasks").append(elem)
                }
            })
        }
    })
}

function showToast(message, duration = 1000) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
}
