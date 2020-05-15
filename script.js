function ascii() {

    document.body.innerHTML += "<pre>" +
    "    ______    __                        __   _       __      ____ <br>" +
    "   / ____/___/ /      ______ __________/ /  | |     / /___ _/ / / <br>" +
    "  / __/ / __  / | /| / / __ `/ ___/ __  /   | | /| / / __ `/ / /  <br>" +
    " / /___/ /_/ /| |/ |/ / /_/ / /  / /_/ /    | |/ |/ / /_/ / / /   <br>" +
    "/_____/\\__,_/ |__/|__/\\__,_/_/   \\__,_/     |__/|__/\\__,_/_/_/    <br></pre>";

}

function input() {

    let path = "edwardwall.me";

    if (dir) {
        path += "/" + dir;
    }

    document.body.innerHTML +=
        "<form id=form autocomplete=off>" +
        "<div class=path><span class=blue>" + path + "</span>&nbsp;$</div>" +
        "<input type=text id=input>" +
        "</form>";

    document.getElementById("form").addEventListener("submit", function(event) {
        event.preventDefault();
        execute(document.getElementById("input").value);
    });
    document.getElementById("input").focus();

}

function execute(command) {

    command = command.trim();

    let indent = "<span class=invisible>&nbsp;&nbsp;</span>";
    let output = "";


    if ("sudo" == command || command.startsWith("sudo ")) {
        if ("" == command.substring("sudo ".length)) {
            output = "usage: sudo [command]";
        } else {
            output = "Permission denied";
        }

    } else if ("clear" == command) {
        document.body.innerHTML = "";
        input();
        return;

    } else if ("" == command) {

    } else if ("cd" == command || command.startsWith("cd ")) {
        output = changedir(command.substring("cd ".length));

    } else if ("ls" == command) {
        output = ("" == dir ? Object.keys(map) : map[dir]).join(indent);

    } else if ("exit" == command) {
        location = "https://edwardwall.me/";

    } else if ("help" == command) {
        output = ["Available commands:", "ascii", "clear", "cd", "exit", "ls", "help"].join( indent);

    } else if ("ascii" == command) {
        ascii();

    } else {
        output = encode(command) + ": command not found";
    }


    // remove old input field
    document.getElementById("input").remove();

    // replace old input field with div containing command
    let node = document.createElement("div");
    node.classList.add("input");
    node.appendChild(document.createTextNode(command));
    document.getElementById("form").appendChild(node);

    // add response
    document.body.innerHTML += "<div>" + output + "</div>";

    // remove id from old form
    document.getElementById("form").removeAttribute("id");

    input();

}

function changedir(newDir) {

    if ("." == newDir) {
        return "";
    }

    if (".." == newDir || "" == newDir) {
        dir = "";
        return "";
    }

    try {

        if ("" != dir) { // cannot change to another dir if already in one
            throw "";
        }

        let len = map[newDir].length; // will throw if dir does not exist
        dir = newDir;
        return "";

    } catch (e) {
        return encode(newDir) + ": No such directory";
    }

}

function encode(string) {

    return string.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

}

var dir = "";
var map = {
    blog: [],
    projects: []
};

// to begin
ascii();
input();
