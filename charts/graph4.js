fetch("/prayaas/admin/data3")
  .then((response) => response.json()) // Parse the response as JSON
  .then((data) => {
    console.log("this is the data1", data);
    const values = [
      data.orgType1,
      data.orgType2,
      data.orgType3,
      data.orgType4,
      data.orgType5,
    ]; // Extract values for the bar chart

    var ctx = document.getElementById("barChart").getContext("2d");
    var chartData = {
      labels: [
        "Private",
        "Community-Based Organizations",
        "Government-Initiated",
        "International",
        "Advocacy",
      ],
      datasets: [
        {
          label: "Organization Type Count",
          data: values,
          backgroundColor: [
            "#001845", // Dark Blue
            "#c77dff", // Greenish Blue
            "#9d4edd", // Light Orange
            "#7b2cbf",
            "#5a189a",
          ],
          borderWidth: 2,
        },
      ],
    };

    var barChart = new Chart(ctx, {
      type: "bar", // Bar chart type
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Type of Organization Registered",
          },
        },
        scales: {
          x: {
            stacked: true, // Stack bars horizontally
            ticks: {
                fontSize: 5, // Reduce y-axis label font size
              },
          },
          y: {
            stacked: true, // Stack bars vertically
            max: 10,
            ticks: {
                fontSize: 12, // Reduce y-axis label font size
              },
          },
        },
      },
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
