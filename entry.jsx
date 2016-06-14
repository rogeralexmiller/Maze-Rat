var React = require('react');
var ReactDOM = require('react-dom');
var Grid = require("./grid");

document.addEventListener("DOMContentLoaded", function(){
  var root = document.getElementById("content");
  ReactDOM.render(
    <Grid/>,
    root);
});
