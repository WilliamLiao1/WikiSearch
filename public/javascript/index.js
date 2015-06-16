//Get query variables from URL
var pf = getQueryVariable('pf'),
    here = getQueryVariable('here'),
    aphere = getQueryVariable('aphere');

//Get favorites from localStorage
var favArr = localStorage.wikiSearchFav ? JSON.parse(localStorage.wikiSearchFav) : [];
updateFavList(favArr);

//Make a GET request to the MediaWiki API to retrieve results of prefix searching
if (pf != false) {
  $('#prefixInput').val(pf.toLowerCase());
  var url = "https://en.wikipedia.org/w/api.php";
  var queryData = {
    action : 'query',
    list : 'allpages',
    apprefix : pf.toLowerCase(),
    format : 'json',
    continue : here || '',
    apcontinue : aphere || ''
  };
  $.ajax({
      type: 'GET',
      url: url,
      data: queryData,
      dataType: 'jsonp',
  }).done(handleResult);
};


///////////////////////////////////////////////////////////////////////////////helper functions
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1].replace(/\+/g, " "));
      };
  };
  return false;
}

function encodeQueryData(data) {
  var ret = [];
  for (var d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
}

function itemTemplate(itemData) {
  var index = favArr.map(function(e) { return e.title; }).indexOf(itemData.title);
  var itemUrl = 'http://en.wikipedia.org/?curid='+itemData.pageid;
  if (index > -1) {
    return '<li><img class="star starred" src="https://ssl.gstatic.com/ui/v1/star/star-lit4.png" /><a href="'+itemUrl+'">'+itemData.title+'</a></li>';
  } else {
    return '<li><img class="star" src="https://ssl.gstatic.com/ui/v1/star/star4.png" /><a href="'+itemUrl+'">'+itemData.title+'</a></li>';
  }
}

function favItemTemplate(itemData) {
  var itemUrl = 'http://en.wikipedia.org/?curid='+itemData.pageid;
  return '<li><img class="delete" src="../image/delete.png" height="20px" width="20px" /><a href="'+itemUrl+'">'+itemData.title+'</a></li>';
}

function starOnClick(img,itemData) {
  $(img).on('click', function(e){
    $(this).toggleClass('starred');
    if ($(this).hasClass('starred')) {
      $(this).attr('src', 'https://ssl.gstatic.com/ui/v1/star/star-lit4.png');
      favArr.push(itemData);
      localStorage.wikiSearchFav = JSON.stringify(favArr);
      updateFavList(favArr)
    } else {
      $(this).attr('src', 'https://ssl.gstatic.com/ui/v1/star/star4.png');
      var index = favArr.map(function(e) { return e.title; }).indexOf(itemData.title);
      if (index > -1) {
        favArr.splice(index, 1);
      };
      localStorage.wikiSearchFav = JSON.stringify(favArr);
      updateFavList(favArr);
    }
  })
}

function deleteOnClick(img,itemData) {
  $(img).on('click', function(e){
    var index = favArr.map(function(e) { return e.title; }).indexOf(itemData.title);
    if (index > -1) {
      favArr.splice(index, 1);
    }
    localStorage.wikiSearchFav = JSON.stringify(favArr);
    updateFavList(favArr);
    updateList(favArr);
  })
}

function handleResult(data) {
  var result = data.query.allpages;
  for (var i=0 ; i<result.length ; i++) {
    var newItem = $(itemTemplate(result[i])).appendTo($('#resultList'));
    starOnClick($(newItem).find('.star'),result[i]);
  }
  if (data.continue) {
    var queryData = {
      pf : pf,
      here : data.continue.continue,
      aphere : data.continue.apcontinue
    };
    $('<a href="'+window.location.href.split('?')[0]+'?'+encodeQueryData(queryData)+'">Next 10</a>').appendTo($('#searchResult'));
  }
}

function updateFavList(favArr) {
  $('#favList li').remove();
  for (var i = 0; i < favArr.length; i++) {
    var newFavItem = $(favItemTemplate(favArr[i])).appendTo($('#favList'));
    deleteOnClick($(newFavItem).find('.delete'),favArr[i]);
  }
}

function updateList(favArr) {
  $('#resultList li').each(function(){
    var index = favArr.map(function(e) { return e.title; }).indexOf($(this).find('a').text());
    console.log(index);
    console.log($(this).find('img').hasClass('starred'));
    console.log((!(index > -1)&&!($(this).find('img').hasClass('starred'))));
    if (!(index > -1)&&($(this).find('img').hasClass('starred'))) {
     $(this).find('img').toggleClass('starred');
     $(this).find('img').attr('src', 'https://ssl.gstatic.com/ui/v1/star/star4.png');
    }
  })
}