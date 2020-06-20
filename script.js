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
        "<input type=text id=input autocorrect=off autocapitalize=none>" +
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

    } else if ("" == command) {

    } else if ("ascii" == command) {
        ascii();

    } else if ("cat" == command || command.startsWith("cat ")) {
        output = cat(command.substring("cat ".length));

    } else if ("cd" == command || command.startsWith("cd ")) {
        output = changedir(command.substring("cd ".length));

    } else if ("clear" == command) {
        document.body.innerHTML = "";
        input();
        return;

    } else if ("exit" == command) {
        location = "https://edwardwall.me/";

    } else if ("ls" == command) {
        output = ("" == dir ? Object.keys(map) : Object.keys(map[dir])).join(indent);

    } else if ("help" == command) {
        output = ["Available commands:", "ascii", "cat", "cd", "clear", "exit", "ls", "help"].join(indent);

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

function cat(file) {

    if ("" == file) {
        return "usage: cat [file]";
    }

    let value;

    if ("" == dir) {
        value = map[file];
    } else {
        value = map[dir][file];
    }

    if ("string" == typeof value) {

        if ("" === value) {
            window.location = "https://edwardwall.me/" + file;
        }

        return value;

    } else if ("object" == typeof value || "." == file || ".." == file) {
        return "cat: " + encode(file) + ": Is a directory";

    } else {
        return "cat: " + encode(file) + ": No such file";
    }

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

        if ("" != dir) {

            if ("string" == typeof map[dir][newDir]) {
                return "cd: " + encode(newDir) + ": Not a directory";
            }

            throw "Can't change to another dir if already in one";
        }

        if ("object" == typeof map[newDir]) {
            dir = newDir;
            return "";

        } else {
            throw "no such file or directory";
        }

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
    blog: {
        "cloudflare-san-scan": "",
        "browsealoud-users-are-still-vulnerable": "",
        "subdomain-takeover": "",
        "channel-4-data-leak": "",
        "ministry-of-defence-domain-hijacking": ""
    },
    projects: {}
};

// to begin
ascii();
input();
