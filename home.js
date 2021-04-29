//sets  html elements into constants
const currencyTarget = document.querySelector("#currCheck");
const submit = document.querySelector("#submit");
const back = document.querySelector("#back");
const conversion = document.querySelector("#conversion");
const container = document.querySelector(".chartContainer");
const display = document.querySelector(".display");
const title = document.querySelector("#title");
const error = document.querySelector("#error");

//hides certain html elements
container.style.display = "none";
back.style.display = "none";
display.style.display = "none";

//function that reveals and hides certain html elements
function revealElements() {
  container.style.display = "block";
  back.style.display = "block";
  display.style.display = "block";
  submit.style.display = "none";
  currencyTarget.style.display = "none";
  title.style.display = "none";
  error.style.display = "none";
}

//asynchronous function that retrieves the nessesary data from an api
async function getExchangeRate() {
  //variables used for the chart creation
  const xLabels = [];
  const yLabels = [];

  //variables used to create the start and end date
  const date = new Date();
  const endYear = date.getFullYear();
  const endMonth = date.getMonth() + 1;
  var startYear = endYear;
  var startMonth = endMonth - 1;

  if (endMonth == 1) {
    startYear -= 1;
    startMonth = 12;
  }

  //retrieves data for the exchange rate of currencies in the past 30 days from the current day
  const response = await fetch(
    "https://api.exchangerate.host/timeseries?start_date=" +
      startYear +
      "-" +
      startMonth +
      "-01&end_date=" +
      endYear +
      "-" +
      endMonth +
      "-01"
  );

  const data = await response.json();

  const currencyVal = currencyTarget.value.toUpperCase();
  const rates = data.rates;

  //error checking
  try {
    Object.entries(rates).forEach(([key, value]) => {
      xLabels.push(key);
      yLabels.push(rates[key][currencyVal].toFixed(2));
    });

    conversion.innerHTML = yLabels[xLabels.length - 1] + " " + currencyVal;
  } catch {
    return 0; //returns 0 for invalid inputs
  }

  return { xLabels, yLabels }; //returns x and y labels for the chart if inputs are valid
}

//asynchronous function used to create a chart (chart.js) for the exchange rates of the chosen currency
async function chart() {
  const data = await getExchangeRate();

  //checks for value returned from getExchangeRate() and determines if the inputs are able to create a chart or not
  if (data != 0) {
    const ctx = document.getElementById("chart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.xLabels,
        datasets: [
          {
            label: `Exchange Rate for ${currencyTarget.value.toUpperCase()}`,
            data: data.yLabels,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: `Conversion Rate between ${currencyTarget.value.toUpperCase()} and EUR`,
            padding: {
              top: 10,
              bottom: 20,
            },
          },
        },
      },
    });
    revealElements(); //calls a function to reveal certain html elements
  } else {
    error.innerHTML = "Invalid Input"; //error messeage
  }
}

//finds the user's location and displays data
submit.addEventListener("click", () => {
  chart();
});

//allows user to retry the program and enter more codes
back.addEventListener("click", function () {
  window.location.reload();
});
