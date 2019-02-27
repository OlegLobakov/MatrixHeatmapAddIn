# Matrix Heatmap Javascript Control Add-In for Microsoft Dynamics NAV

A heat map is a graphical representation of data where the individual values contained in a matrix are represented as colors. In this case value has range -10..10.

## Information
As Control Add-In use D3 Javascript library it works in Windows Client, Tablet and Web. D3.js (or just D3 for Data-Driven Documents) is a JavaScript library for producing dynamic, interactive data visualizations in web browsers. It makes use of the widely implemented SVG, HTML5, and CSS standards.
<p align="center">
    <img src="https://github.com/Setrange/MatrixHeatmapAddIn/blob/master/Microsoft%20Dynamics%20NAV%20Objects/MatrixHeatmapDemo.png">
</p>

## Demo
 
<a href="http://www.youtube.com/watch?feature=player_embedded&v=xVs7Tmvkpew" target="_blank">
<img src="http://img.youtube.com/vi/xVs7Tmvkpew/0.jpg" alt="Warehouse Search" width="480" height="320" border="10" />
</a>

## Installation
To use this Visual Studio add-in project, you need to configure some settings:
1. Change Post-build event command line in Visual Studio project properties. (name of javascript resource zip file, paths to Microsoft Dynamics NAV.
2. Change Build powershell file ImportResource.ps1 (path to Microsoft.Dynamics.Nav.Management.dll, instance name, sn, name of zip file.

Detail information of installation process:
<a href="https://github.com/Setrange/JavascriptControlAddInTemplate" target="_blank"> https://github.com/Setrange/JavascriptControlAddInTemplate </a>

## Control Add-In Template
Javascript Control Add-In Template 
<a href="https://github.com/Setrange/JavascriptControlAddInTemplate" target="_blank"> https://github.com/Setrange/JavascriptControlAddInTemplate </a>

## Idea
Original D3 Javascript Example
<a href="http://bl.ocks.org/ianyfchang/8119685" target="_blank"> http://bl.ocks.org/ianyfchang/8119685 </a>

