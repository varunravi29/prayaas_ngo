fetch("/prayaas/admin/data3")
  .then((response) => response.json()) 
  .then((data) => {
    console.log("this is the data1", data);
    const valuesClothes = [data.clothesQuantity]; 
    const valuesFood = [data.foodQuantity]; 

    var ctx = document.getElementById("barChart1").getContext("2d");
    var chartData = {
      labels: ["Clothes", "Food"],
      datasets: [
        {
          label: "Clothes Total Quantity",
          data: valuesClothes,
          backgroundColor: "#5a189a", 
          borderWidth: 2,
          barPercentage: 1.5, 
          categoryPercentage: 0.9, 
        },
        {
          label: "Food Total Quantity",
          data: valuesFood,
          backgroundColor: "#001845", 
          borderWidth: 2,
          barPercentage: 1.5, 
          categoryPercentage: 0.9, 
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
            text: "Quantity of Items Received",
          },
        },
        scales: {
          x: {
            stacked: false, 
            ticks: {
              fontSize: 12,
              padding: 10, 
            },
          },
          y: {
            beginAtZero: true, 
            ticks: {
              fontSize: 12, 
            },
          },
        },
      },
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
