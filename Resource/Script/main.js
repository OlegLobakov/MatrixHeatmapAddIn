let container;
let navControl;
let navControlContainer;
let AddInReady = false;
let UpdateIsEnabled = false;
let error;
let showlegend = false;

function InitializeAddin() {
    try {
        navControlContainer = $("#controlAddIn");
        let html = '<div id="chart"></div><div id="tooltip" class="hidden"><p> <span id="value"></p></div>';
        navControlContainer.append(html);
        container = document.getElementById('controlAddIn');
        ClearData();
        AddInReady = true;
    } catch (err) {
        RaiseCALEvent('OnError', ["Javascript Error :" + err]);
    }
    RaiseCALEvent('ControlAddIsReady', []);
}

var margin = { top: 100, right: 5, bottom: 5, left: 100 };
cellSize = 12;
col_number = 10;
row_number = 10;
width = cellSize * col_number; // - margin.left - margin.right,
height = cellSize * row_number; // - margin.top - margin.bottom,
//gridSize = Math.floor(width / 24),
legendElementWidth = cellSize * 2.5;
colorBuckets = 21;
colors = ['#005824', '#1A693B', '#347B53', '#4F8D6B', '#699F83', '#83B09B', '#9EC2B3', '#B8D4CB', '#D2E6E3', '#EDF8FB', '#FFFFFF', '#F1EEF6', '#E6D3E1', '#DBB9CD', '#D19EB9', '#C684A4', '#BB6990', '#B14F7C', '#A63467', '#9B1A53', '#91003F'];

hcrow = [];
hccol = [];

rowLabel = [];
colLabel = [];

var data = [],
    index = 0;

function Update() {
    try {
        InnerUpdate();
        UpdateIsEnabled = true;
    } catch (err) {
        RaiseCALEvent('OnError', ["Javascript Error :" + err]);
    }
}

function DataPrepare() {

}

function InnerUpdate() {

    var colorScale = d3.scale.quantile()
        .domain([-10, 0, 10])
        .range(colors);

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var rowSortOrder = false;
    var colSortOrder = false;

    var rowLabels = svg.append("g")
        .selectAll(".rowLabelg")
        .data(rowLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return hcrow.indexOf(i + 1) * cellSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
        .attr("class", function (d, i) { return "rowLabel mono r" + i; })
        .on("mouseover", function (d) { d3.select(this).classed("text-hover", true); })
        .on("mouseout", function (d) { d3.select(this).classed("text-hover", false); })
        .on("click", function (d, i) {
            rowSortOrder = !rowSortOrder;
            sortbylabel("r", i, rowSortOrder);
            d3.select("#order").property("selectedIndex", 4).node().focus();
        });

    var colLabels = svg.append("g")
        .selectAll(".colLabelg")
        .data(colLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return hccol.indexOf(i + 1) * cellSize; })
        .style("text-anchor", "left")
        .attr("transform", "translate(" + cellSize / 2 + ",-6) rotate (-90)")
        .attr("class", function (d, i) { return "colLabel mono c" + i; })
        .on("mouseover", function (d) { d3.select(this).classed("text-hover", true); })
        .on("mouseout", function (d) { d3.select(this).classed("text-hover", false); })
        .on("click", function (d, i) {
            colSortOrder = !colSortOrder;
            sortbylabel("c", i, colSortOrder);
            d3.select("#order").property("selectedIndex", 4).node().focus();
        });

    var heatMap = svg.append("g").attr("class", "g3")
        .selectAll(".cellg")
        .data(data, function (d) { return d.row + ":" + d.col; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return hccol.indexOf(d.col) * cellSize; })
        .attr("y", function (d) { return hcrow.indexOf(d.row) * cellSize; })
        .attr("class", function (d) { return "cell cell-border cr" + (d.row - 1) + " cc" + (d.col - 1); })
        .attr("width", cellSize)
        .attr("height", cellSize)
        .style("fill", function (d) { return colorScale(d.value); })
        .on("click", function (d) {
            RaiseCALEvent('OnClicked', [d.rowname, d.columnname]);
        })
        .on("mouseover", function (d) {
            //highlight text
            d3.select(this).classed("cell-hover", true);
            d3.selectAll(".rowLabel").classed("text-highlight", function (r, ri) { return ri === d.row - 1; });
            d3.selectAll(".colLabel").classed("text-highlight", function (c, ci) { return ci === d.col - 1; });

            //Update the tooltip position and value
            d3.select("#tooltip")
                .style("left", (d3.event.pageX + 10).toString() + "px")
                .style("top", (d3.event.pageY - 10).toString() + "px")
                .select("#value")
                .text(d.description);
            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function () {
            d3.select(this).classed("cell-hover", false);
            d3.selectAll(".rowLabel").classed("text-highlight", false);
            d3.selectAll(".colLabel").classed("text-highlight", false);
            d3.select("#tooltip").classed("hidden", true);
        });

    if (showlegend) {
        var legend = svg.selectAll(".legend")
            .data([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function (d, i) { return legendElementWidth * i; })
            .attr("y", height + cellSize * 2)
            .attr("width", legendElementWidth)
            .attr("height", cellSize / 2)
            .style("fill", function (d, i) { return colors[i]; });

        legend.append("text")
            .attr("class", "mono")
            .text(function (d) { return d; })
            .attr("width", legendElementWidth)
            .attr("x", function (d, i) { return legendElementWidth * i; })
            .attr("y", height + cellSize * 4);
    }

    // Change ordering of cells
    function sortbylabel(rORc, i, sortOrder) {
        var t = svg.transition().duration(3000);
        var log2r = [];
        var sorted; // sorted is zero-based index
        d3.selectAll(".c" + rORc + i)
            .filter(function (ce) {
                log2r.push(ce.value);
            });
        if (rORc === "r") { // sort log2ratio of a gene
            sorted = d3.range(col_number).sort(function (a, b) {
                if (sortOrder) {
                    return log2r[b] - log2r[a];
                } else {
                    return log2r[a] - log2r[b];
                }
            });
            t.selectAll(".cell")
                .attr("x", function (d) {
                    return sorted.indexOf(d.col - 1) * cellSize;
                });
            t.selectAll(".colLabel")
                .attr("y", function (d, i) {
                    return sorted.indexOf(i) * cellSize;
                });
        } else { // sort log2ratio of a contrast
            sorted = d3.range(row_number).sort(function (a, b) {
                if (sortOrder) { return log2r[b] - log2r[a]; } else { return log2r[a] - log2r[b]; }
            });
            t.selectAll(".cell")
                .attr("y", function (d) {
                    return sorted.indexOf(d.row - 1) * cellSize;
                });
            t.selectAll(".rowLabel")
                .attr("y", function (d, i) {
                    return sorted.indexOf(i) * cellSize;
                });
        }
    }
}

function ClearData() {
    data = [];
    hcrow = [];
    hccol = [];
    rowLabel = [];
    colLabel = [];
    index = 0;
}

function AddRowLabel(rl) {
    rowLabel.push(rl);
    row_number = rowLabel.length;
    hcrow.push(rowLabel.indexOf(rl)+1);
    UpdateView();
}

function AddColumnLabel(cl) {
    colLabel.push(cl);
    col_number = colLabel.length;
    hccol.push(colLabel.indexOf(cl)+1);
    UpdateView();
}

function BlockSize(newsize) {
    cellSize = newsize;
    UpdateView();
}

function UpdateView() {
    col_number = colLabel.length;
    row_number = rowLabel.length;
    width = cellSize * col_number; // - margin.left - margin.right,
    height = cellSize * row_number; // - margin.top - margin.bottom,
    //gridSize = Math.floor(width / 24),
    legendElementWidth = cellSize * 2.5;
}

function Add(rowname, columnname, value, color, description1) {
    data.push({
        "row": rowLabel.indexOf(rowname)+1,
        "col": colLabel.indexOf(columnname)+1,
        "value": value,
        "color": color,
        "rowname": rowname,
        "columnname": columnname,
        "description": description1
    });
    index++;
}

function ShowLegend(show) {
    showlegend = show;
}

function Margin(left, top, right, bottom) {
    margin.top = top;
    margin.right = right;
    margin.bottom = bottom;
    margin.left = left;
}

function RaiseCALEvent(eventName, args) {
    /// <summary>Raises an event trigger in C/AL` code.</summary>
    /// <param name="eventName">Name of the C/AL event trigger. The event must belong to the control and be declared in the IAdvancedExtensibilityControl interface.</param>
    /// <param name="args">Any event trigger parameters to pass to C/AL. This parameter is always of the array type, so you must enclose it in [].</param>
    Microsoft.Dynamics.NAV.InvokeExtensibilityMethod(eventName, args);
}

window.addEventListener('resize', function (event) {
    if (UpdateIsEnabled) {
        width = container.offsetWidth - margin.left - margin.right;
        height = container.offsetHeight - - margin.bottom - margin.top;
    }
});

window.__controlAddInError__NAV = window.__controlAddInError;
window.__controlAddInError = function (e) {
    console.log("Unhandled error has occurred: '" + e.message + "' - Stack: " + e.stack);
    window.__controlAddInError__NAV(e);
};


