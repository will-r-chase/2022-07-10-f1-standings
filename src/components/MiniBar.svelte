<script>
  import * as d3 from "d3";

  export let value;
  export let max_value;
  export let bar_color = "#00ab58";
  export let text_color = "#656568";
  export let prefix = "";
  export let suffix = "";

  const abbreviateNumber = (input, decimals = 1) => {
    if (!isNumber(input)) {
      return input ? input : "";
    }
    // Round function
    let round = (value) => {
      return (
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
      );
    };
    // Get power
    let b = input.toPrecision(2).split("e");
    // Floor at decimals, ceiling at trillions
    let k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3);
    // Divide by power
    let c = k < 1 ? round(input) : round(input / Math.pow(10, k * 3));
    // Ensure -0 is 0
    c = c < 0 ? c : Math.abs(c);
    // Append abbreviation
    return c + ["", "k", "m", "b", "t"][k];
  };

  // for number formatting function, don't touch
  function isNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  // function if you need to format a 
  const formatMoney = d3.format(".3s");
  const barScale = d3.scaleLinear().domain([0, max_value]).range([0, 80]);
</script>

<div class="barContainer">

  <!-- if bars are too wide, adjust the 0.85 multiplier to have them take up less space -->
  <div
    class="bar"
    style="width: {barScale(value) * 0.85}%; background-color: {bar_color}"
  />
  <span class="text" style="color: {text_color}"
    >{prefix}{abbreviateNumber(value)}{suffix}</span
  >
</div>

<style>
  .bar {
    height: 20px;
    /* background-color: #00ab58; */
  }
  .text {
    margin-left: 5px;
    font-family: var(--font-nb-pro-mono);
    font-weight: 400;
    font-size: 0.75rem;
    color: #656568;
  }
  .barContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  @media (max-width: 420px) {
    .text {
      font-size: 0.65rem;
    }
  }
</style>
