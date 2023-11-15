$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});


(function (global) {

var dc = {};

var homeHtml = "snippets/home_snippet.html";
var allCategoriesUrl ="json/ponudaArtikla.json"; //link to json
var categoryHtml = "snippets/category-snippet.html";
var categoriesTitleHtml = "snippets/category-snippet.html";
// Convenience function for inserting innerHTML for 'select'
  function insertHtml(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  }

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='img/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function(string, propName, propValue){
  var propToReplace="{{"+propName+"}}";
  string = string.replace(new RegExp(propToReplace, "g"),propValue);
  return string;
}
// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  (responseText) => {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});
dc.loadMenuCategories = function(){
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
}

function buildAndShowCategoriesHTML (ponudaArtikla){
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function(categoriesTitleHtml){

      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function(categoryHtml){
        var categoriesViewHtml= buildCategoriesViewHtml(ponudaArtikla,categoriesTitleHtml,categoryHtml);
        insertHtml("#main-content", categoriesViewHtml);
      },false);

    },false);

}
function buildCategoriesViewHtml(
  ponudaArtikla, categoriesTitleHtml, categoryHtml
){
  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";
  for(var i=0; i<ponudaArtikla.length; i++){
    var html= categoryHtml;
    var name=""+ ponudaArtikla[i].name;
    var short_name= ponudaArtikla[i].short_name;
    html= insertProperty(html, "name",name);
    html= insertProperty(html,"short_name", short_name);
    finalHtml +=html;
  }
  finalHtml +="</section>";
  return finalHtml;
}
global.$dc = dc;


})(window);
