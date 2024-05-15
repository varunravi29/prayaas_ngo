const fetchDataAndDisplayChart = async () => {
  try {
    // Fetch data from the backend
    const response = await fetch("/prayaas/admin/data3");
    const data = await response.json();

    // Process the fetched data to extract years and total amounts
    const years = Array.from({ length: 6 }, (_, index) => 2019 + index);
    const totalAmounts = Array.from({ length: 11 }, () => 0); // Initialize amounts array with zeros
    const totalAmounts1 = Array.from({ length: 11 }, () => 0); // Initialize amounts array with zeros

    // Update totalAmounts array with actual data
    data.amountAndDate.forEach(item => {
      const yearIndex = item.year - 2019;
      if (yearIndex >= 0 && yearIndex < totalAmounts.length) {
        totalAmounts[yearIndex] += item.total_amount;
      }
    });
    data.amountRequestDate.forEach(item => {
      const yearIndex = item.year - 2019;
      if (yearIndex >= 0 && yearIndex < totalAmounts1.length) {
        totalAmounts1[yearIndex] += item.total_amount;
      }
    });

    // Create a line chart using Chart.js
    var ctx = document.getElementById("lineChart").getContext("2d");
    var chartData = {
      labels: years, // Use years as labels on the x-axis
      datasets: [
        {
          label: "Total Amount Received Per Year",
          data: totalAmounts, // Use total amounts as data points on the y-axis
          borderColor: 'rgba(54, 162, 235, 1)', // Blue color for the line
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue color with transparency for fill
          borderWidth: 1,
        },
        {
          label: "Total Amount Donated Per Year",
          data: totalAmounts1, // Use total amounts as data points on the y-axis
          borderColor: '#c1121f', // Blue color for the line
          backgroundColor: '#c1121f', // Blue color with transparency for fill
          borderWidth: 1,
        }
      ],
    };

    var lineChart = new Chart(ctx, {
      type: "line", // Line chart type
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Line Chart of Total Amount Donated Per Year",
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Hide grid lines on x-axis
            },
          },
          x: {
            grid: {
              display: false, // Hide grid lines on x-axis
            },
          },
          y: {
            beginAtZero: true, // Start y-axis from zero
          }
        },
      },
    });
  } catch (error) {
    console.error("Error fetching or displaying data:", error);
  }
};

// Call the function to fetch data and display the chart
fetchDataAndDisplayChart();
