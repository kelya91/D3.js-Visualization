
function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
    d3.json("/metadata/" + sample).then((meta) => {
      Object.entries(meta).forEach(([key, value]) => {
        metadata.append("p").text(`${key}: ${value}`).style("font-size", "15pt");
      });
    });
}

  // @TODO: Build a Bubble Chart using the sample data


function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then(function(samples) {
    
    console.log(samples)

    var newsample = []
    for (i=0; i<samples.otu_ids.length; i++) {
      newsamplesdict = {}
      newsamplesdict["id"] = samples.otu_ids[i]
      newsamplesdict["label"] = samples.otu_labels[i]
      newsamplesdict["value"] = samples.sample_values[i]
      newsample.push(newsamplesdict)
    }

    newsample = newsample.sort(function compareFunction(x, y) {
     return y.value - x.value;
    });
    // Use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
    newsample = newsample.slice(0, 10);
    
    console.log(newsample)
    //define trace for pie chart
    //need to define textinfo and hoverinfo for % display and info on tooltip
    var trace = {
      type: "pie",
      values: newsample.map(row => row.value),
      labels: newsample.map(row => row.id),
      text: newsample.map(row => row.label),
      textinfo: 'percent',
      hoverinfo: 'labels+text+percent'
    }

    var data = [trace];
    //define layout for pie chart
    var layout = {
      title:`Bacteria Findings for Sample: ${sample}`,
      titlefont: {
        family: 'Helvetica',
        size: 30,
        color:'#7f7f7f'
      },
      font: {
        family: 'Helvetica',
        size: 20
      },
      height: 600,
      width: 800
    };
    //"pie" is the div ID
    Plotly.newPlot("pie", data, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
