function getBookmarks() {
    $.get("http://" + serverIP + ":" + serverPort + "/bookmarks", function (marks) {
        
        for(var i=0;i<marks.length;i++) {
            $("#starToolDiv").append("<div class='list-group-item'>"+marks[i].xmin+"qqq" +"</div>")
        }



    })

    
}

