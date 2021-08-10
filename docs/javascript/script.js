/*
    File: script.js
    GUIAssignment:  Creating an Interactive Dynamic Table
    Haley Santomas, UMass Lowell Computer Science, haley_santomas@student.uml.edu
    Date: 7/22/2021
    Summary: This file contains scripts to collect input parameters from the form upon clicking the submit button, then
    utilizes that input to construct a table. It also generates an error message for invalid inputs using JQuery.

    Sources:
        1) https://stackoverflow.com/questions/19152452/jquery-ui-slider-change-automatically-on-manual-input
        Used the first answer by rusln to figure out how to get the slider to change with the manual input.
*/

/*** CONSTANTS ***/
var inputMin = -50;
var inputMax = 50;
var maxInputDifferential = 100;
var inputMessageRequired = "Please enter a number between (inclusive) " + inputMin + " and " + inputMax;
var inputMessageMin = "Please enter a number above " + inputMin - 1;
var inputMessageMax = "Please enter a number below " + inputMax + 1;

/*** GLOBALS ***/
var savedTables = new Array();

/*** JQUERY ***/
// Sliders
$(function() {
    // Initialize slider rules.
    // NOTE: There's probably a way to clean this up instead of using a bunch of functions that are practically identical except for the ID values,
    // but it's currently working, so it's kind of low on my priority list.
    // SOURCE: (See Sources-1.)
    $("#slider_rowMax").slider({
        value: 0,
        min: inputMin,
        max: inputMax,
        slide: function(event, ui) {
            $("#rowMax").val( ui.value );
            submitForm();
        }
    });
    $("#rowMax").change(function() {
        $("#slider_rowMax").slider("value", this.value)
        submitForm();
    });

    $("#slider_rowMin").slider({
        value: 0,
        min: inputMin,
        max: inputMax,
        slide: function(event, ui) {
            $("#rowMin").val( ui.value );
            submitForm();
        }
    });
    $("#rowMin").change(function() {
        $("#slider_rowMin").slider("value", this.value) 
        submitForm();
    });

    $("#slider_colMax").slider({
        value: 0,
        min: inputMin,
        max: inputMax,
        slide: function(event, ui) {
            $("#colMax").val( ui.value );
            submitForm();
        }
    });
    $("#colMax").change(function() {
        $("#slider_colMax").slider("value", this.value)
        submitForm();
    });

    $("#slider_colMin").slider({
        value: 0,
        min: inputMin,
        max: inputMax,
        slide: function(event, ui) {
            $("#colMin").val( ui.value );
            submitForm();
        }
    });
    $("#colMin").change(function() {
        $("#slider_colMin").slider("value", this.value)
        submitForm();
    });
});

// When ready...
$().ready(function()
    {
        // TABS
        //$("#div_tabs").css("display", "hidden");
        //$("#div_tabs").tabs();

        // VALIDATOR
        // Add custom rule to validate that value is less than something.
        $.validator.addMethod(
            "lessEqual",
            function(value, element, param)
            {
                var testAgainst = $(param).val();
                if (parseInt(value) <= parseInt(testAgainst))
                    return true;
                else
                    return false;
            },
            "Value is too high"
        );
        $.validator.addMethod(
            "greaterEqual",
            function(value, element, param)
            {
                var testAgainst = $(param).val();
                if (parseInt(value) >= parseInt(testAgainst))
                    return true;
                else
                    return false;
            },
            "Value is too low"
        );

        // Validate the form.
        $("#form_submission").validate(
            {
                rules:
                {
                    rowMax:
                    {
                        required: true,
                        min: inputMin,
                        max: inputMax,
                        greaterEqual: "#rowMin"
                    },
                    rowMin:
                    {
                        required: true,
                        min: inputMin,
                        max: inputMax,
                        lessEqual: "#rowMax"
                    },
                    colMax:
                    {
                        required: true,
                        min: inputMin,
                        max: inputMax,
                        greaterEqual: "#colMin"
                    },
                    colMin:
                    {
                        required: true,
                        min: inputMin,
                        max: inputMax,
                        lessEqual: "#colMax"
                    }
                },
                messages:
                {
                    rowMax:
                    {
                        required: inputMessageRequired,
                        min: inputMessageMin,
                        max: inputMessageMax,
                        greaterEqual: "Value must be greater than or equal to row min"
                    },
                    rowMin:
                    {
                        required: inputMessageRequired,
                        min: inputMessageMin,
                        max: inputMessageMax,
                        lessEqual: "Value must be less than or equal to row max"
                    },
                    colMax:
                    {
                        required: inputMessageRequired,
                        min: inputMessageMin,
                        max: inputMessageMax,
                        greaterEqual: "Value must be greater than or equal to col min"
                    },
                    colMin:
                    {
                        required: inputMessageRequired,
                        min: inputMessageMin,
                        max: inputMessageMax,
                        lessEqual: "Value must be less than or equal to col max"
                    }
                }
            }
        );
    }
);

/***** BASE FUNCTION *****/
function submitForm()
{
    // Get inputs.
    var rowMin = document.getElementById("rowMin");
    var rowMax = document.getElementById("rowMax");
    var colMin = document.getElementById("colMin");
    var colMax = document.getElementById("colMax");

    // Display table.
    if($("#form_submission").valid())
    {
        displayTable();
    }
}

/***** TABLE DISPLAY *****/
function displayTable()
{
    // Create and calculate table value arrays.
    var rowHead = new Array();
    for(let i = rowMin.valueAsNumber; i <= rowMax.valueAsNumber; i++)
    {
        rowHead.push(i);
    }

    var columnHead = new Array();
    for(let i = colMin.valueAsNumber; i <= colMax.valueAsNumber; i++)
    {
        columnHead.push(i);
    }

    var multiplicationTable = new Array();
    for(let i = 0; i < columnHead.length; i++) // For every row...
    {
        // Create an empty array for the row.
        multiplicationTable.push(new Array());

        // Fill out this row's array.
        for(let j = 0; j < rowHead.length; j++) // For every column...
        {
            // Push the product of rowHead[j] * columnHead[i]
            multiplicationTable[i].push(rowHead[j] * columnHead[i]);
        }
    }

    // Print to table.
    printTable(rowHead, columnHead, multiplicationTable);
}
function printTable(rowHead, columnHead, multiplicationTable)
{
    // Get table.
    var resultTable = document.getElementById("tableResult");

    // Delete previous table, if it exists.
    deletePreviousTable(resultTable);

    // Start with the first row, since it's unique.
    let firstRow = resultTable.insertRow(0);
    //let emptyCell = firstRow.insertCell(0);
    let emptyCell = document.createElement("th");
    emptyCell.classList.add("thTOP");
    emptyCell.style.color = "black";
    emptyCell.style.fontWeight = "bold";
    emptyCell.innerHTML = " ";
    firstRow.appendChild(emptyCell);
    
    for(let i = 0; i < rowHead.length; i++)
    {
        // Create new cell at i+1 with rowHead i.
        //let cell = firstRow.insertCell(i + 1);
        let cell = document.createElement("th");
        cell.classList.add("thTOP");
        if(i == 0 || i % 2 == 0)
            cell.classList.add("thGray");
        cell.style.fontWeight = "bold";
        cell.innerHTML = rowHead[i];
        firstRow.appendChild(cell);
    }

    // Now do the rest of the rows. For every column...
    for(let i = 0; i < columnHead.length; i++)
    {
        // Insert a new row at i+1.
        let row = resultTable.insertRow(i + 1);

        // Start by filling in the first cell with the current columnHead value.
        //let firstCell = row.insertCell(0);
        let firstCell = document.createElement("th");
        firstCell.classList.add("thSIDE");
        firstCell.style.fontWeight = "bold";
        firstCell.innerHTML = columnHead[i];
        row.appendChild(firstCell);

        // Now fill in the rest of the cells.
        for(let j = 1; j <= multiplicationTable[i].length; j++)
        {
            let cell = row.insertCell(j);
            cell.style.backgroundColor = "white";
            cell.style.color = "black";
            cell.innerHTML = multiplicationTable[i][j - 1];
        }
    }
}
function deletePreviousTable(resultTable)
{
    // Delete all contents.
    resultTable.innerHTML = "";
}

/***** TABLE TABS *****/
function saveTable()
{
    // Get inputs.
    var rowMin = document.getElementById("rowMin");
    var rowMax = document.getElementById("rowMax");
    var colMin = document.getElementById("colMin");
    var colMax = document.getElementById("colMax");

    // If valid...
    if($("#form_submission").valid())
    {
        // Save inputs to the array.
        var temp = new Object();
        temp.rowMin = parseInt(rowMin.value);
        temp.rowMax = parseInt(rowMax.value);
        temp.colMin = parseInt(colMin.value);
        temp.colMax = parseInt(colMax.value);
        savedTables.push(temp);
        
        // Update tabs.
        updateTabs();
    }
}

function updateTabs()
{
    // Delete all tabs.
    deleteAllTabs();

    // Generate tabs.
    generateTabs();
}

function generateTabs()
{
    // Show if hidden.
    //$("#div_tabs").css("display", "visible");

    // For every chart...
    for(var i = 0; i < savedTables.length; i++)
    {
        // Find tabs.
        var tabDiv = $("#div_tabs").tabs();
        var tabList = tabDiv.find("#list_tabs");

        // Get the new div ID.
        var currentDivID = "div_tab" + (i+1);

        // Generate tab label.
        var currentTabLabel = '';
        var currentDeleteButtonID = 'button_delete' + (i+1);
        var currentDeleteButtonOnClick = 'deleteButton(' + i + '); return false;'; // Onclick deletes the entry at this index and refreshes the tab.
        currentTabLabel += '(' + savedTables[i].rowMin + ' to ' + savedTables[i].rowMax + ')x(' + savedTables[i].colMin + ' to ' + savedTables[i].colMax + ')';
        currentTabLabel += ' <button id="' + currentDeleteButtonID + '" onclick="' + currentDeleteButtonOnClick + '">X</button>'

        // Generate div content.
        var tab_TabTableID = "table_tabTable" + (i+1);
        var currentDivContent = '<table class="table_tabTable" id="' + tab_TabTableID + '"></table>';

        // Append tab.
        $('<li class="tab"><a href="#div_tab' + (i+1) + '">' + currentTabLabel + '</a></li>').appendTo(tabList);
        $('<div id="' + currentDivID + '">' + currentDivContent + '</div>').appendTo(tabDiv);
        tabDiv.tabs("refresh");

        //$('#' + tabTabTableID).append("TEEEEST " + (i+1));

        // Create and calculate table value arrays.
        var rowHead = new Array();
        for(let j = savedTables[i].rowMin; j <= savedTables[i].rowMax; j++)
        {
            rowHead.push(j);
        }

        var columnHead = new Array();
        for(let j = savedTables[i].colMin; j <= savedTables[i].colMax; j++)
        {
            columnHead.push(j);
        }

        var multiplicationTable = new Array();
        for(let j = 0; j < columnHead.length; j++) // For every row...
        {
            // Create an empty array for the row.
            multiplicationTable.push(new Array());

            // Fill out this row's array.
            for(let k = 0; k < rowHead.length; k++) // For every column...
            {
                // Push the product of rowHead[j] * columnHead[i]
                multiplicationTable[j].push(rowHead[k] * columnHead[j]);
            }
        }
        
        // Get table.
        var resultTable = document.getElementById(tab_TabTableID);

        // Start with the first row, since it's unique.
        let firstRow = resultTable.insertRow(0);
        //let emptyCell = firstRow.insertCell(0);
        let emptyCell = document.createElement("th");
        emptyCell.classList.add("thTOP");
        emptyCell.style.color = "black";
        emptyCell.style.fontWeight = "bold";
        emptyCell.innerHTML = " ";
        firstRow.appendChild(emptyCell);
        
        for(let j = 0; j < rowHead.length; j++)
        {
            // Create new cell at j+1 with rowHead j.
            //let cell = firstRow.insertCell(i + 1);
            let cell = document.createElement("th");
            cell.classList.add("thTOP");
            if(j == 0 || j % 2 == 0)
                cell.classList.add("thGray");
            cell.style.fontWeight = "bold";
            cell.innerHTML = rowHead[j];
            firstRow.appendChild(cell);
        }

        // Now do the rest of the rows. For every column...
        for(let j = 0; j < columnHead.length; j++)
        {
            // Insert a new row at i+1.
            let row = resultTable.insertRow(j + 1);

            // Start by filling in the first cell with the current columnHead value.
            //let firstCell = row.insertCell(0);
            let firstCell = document.createElement("th");
            firstCell.classList.add("thSIDE");
            firstCell.style.fontWeight = "bold";
            firstCell.innerHTML = columnHead[j];
            row.appendChild(firstCell);

            // Now fill in the rest of the cells.
            for(let k = 1; k <= multiplicationTable[j].length; k++)
            {
                let cell = row.insertCell(k);
                cell.style.backgroundColor = "white";
                cell.style.color = "black";
                cell.innerHTML = multiplicationTable[j][k - 1];
            }
        }
    }
}


function deleteAllTabs()
{
    // Get tab div.
    var tabDiv = $("#div_tabs").tabs();

    // Destroy it.
    tabDiv.tabs('destroy');
    tabDiv.empty();
    tabDiv.append('<ul id="list_tabs"></ul>');
}

function deleteButton(index)
{
    // Create a new object array with every item except the deleted item.
    var tempNewSavedTables = new Array();

    for(var i = 0; i < savedTables.length; i++)
    {
        if(i != index)
            tempNewSavedTables.push(savedTables[i]);
    }

    savedTables = tempNewSavedTables;

    // Regenerate tabs.
    updateTabs();
}