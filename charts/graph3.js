fetch("/prayaas/admin/data3")
  .then((response) => response.json()) // Parse the response as JSON
  .then((data) => {
    console.log(data);
    const values = [data.individualDataGraph.totalIndividual, data.organizationDataGraph.totalOrganization]; // Extract values for the pie chart

    var ctx = document.getElementById("pieChart").getContext("2d");
    var chartData = {
      labels: ["Individual Data", "Organization Data"],
      datasets: [
        {
          label: "Individual vs Organization Data",
          data: values,
          backgroundColor: [
            '#003049', // Red color with transparency
            '#2a9d8f', // Blue color with transparency
          ],
          borderWidth: 1,
        },
      ],
    };

    var pieChart = new Chart(ctx, {
      type: "pie", // Pie chart type
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Pie Chart of Individual vs Organization Registered",
          },
        },
      },
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
