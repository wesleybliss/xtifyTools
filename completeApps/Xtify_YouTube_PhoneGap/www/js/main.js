//
// YouTube feed parser
// Michael Bordash
// 
// Nothing fancy here. Grabs a json-c formatted youtube feed as describe here:
// https://developers.google.com/youtube/2.0/developers_guide_jsonc
// 
// Populates a list in index.html with results, including thumbnail
//
// When user selects a video, it calls loadItem and pulls the info in json-c format from youtube. It will then update the html div with meta-data and en embed code for the video. When the user clicks, the video will be played in the local player. When done, the user is returned cleanly to your app.
//
// 

$(document).ready(function(){
    // enter a youtube feed url. I've included an example user feed that works.
    var URL = "http://gdata.youtube.com/feeds/api/users/fastlanedaily/uploads?v=2&alt=jsonc&max-results=25";
    $.ajax({
        type: "GET",
        url: URL,
        cache: false,
        dataType:'jsonp',
        success: function(data){
            $.each(data.data.items, function(index) { 
                var dateArray = this.updated.split("-");
                var date = parseInt(dateArray[1])+"/"+(dateArray[2]).toString().substr(0,2)+"/"+dateArray[0];
                var tn = this.thumbnail.sqDefault;
                var count = this.viewCount; 
                var title = this.title;
                //var link = getAttributeByIndex(this.player, 0); 
                var videoId = this.id;
                $('#fldFeed #fldFeedMain #fldFeedItems').append("<li><a id='" + videoId + "' href='#' onClick='javascript:loadItem(this)'><img src='" + tn + "' width='120' alt='" + title + "' /><h3>"+title+"</h3><p>" + count + " views - added " +  date  + " </p></a></li>");  
            });
            $("#fldFeedItems").listview('refresh');
        }
    });
});

function loadItem(itemObj) {
    var videoId = itemObj.id;
    //call youtube API and get video elements for video ID passed by the feed list
    var URL = "https://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=jsonc";

    $.ajax({
        type: "GET",
        url: URL,
        cache: false,
        dataType:'jsonp',
        success: function(data){
            var obj = jQuery.parseJSON(data);
            var dateArray = data.data.updated.split("-");
            var date = parseInt(dateArray[1])+"/"+(dateArray[2]).toString().substr(0,2)+"/"+dateArray[0];
            //var tn = this.thumbnail.sqDefault;
            //var count = this.viewCount; 
                
            var title = data.data.title;
            var description = data.data.description;
            var videoUrl = getAttributeByIndex(data.data.content, 0); 
            var embedCode = '<iframe src="http://www.youtube.com/embed/' + videoId + '" class="youtube-player" type="text/html" width="290" height="160"  frameborder="0"></iframe>';
            $('#fldItem #fldItemTitle').html(title);
            $('#fldItem #fldItemDesc').html(description);
            $('#fldItem #fldItemContent').html(embedCode);
        }
    });
    $("#fldItem").click();
    
}

// credit for this function
// "CMS" 
// http://stackoverflow.com/questions/909003/javascript-getting-the-first-index-of-an-object
//

function getAttributeByIndex(obj, index){
  var i = 0;
  for (var attr in obj){
    if (index === i){
      return obj[attr];
    }
    i++;
  }
  return null;
}