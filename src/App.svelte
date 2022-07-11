<script>
  // comoponent import
  import Window from "./components/Window.svelte";
  import Table from "./components/Table.svelte";

  // import data here using the same syntax
  import standings from "./data/standings.json";

  // Handle responsive iframes for Eden embeds
  import pym from "pym.js";
  new pym.Child({
    polling: 500,
  });
  // Declare your column headers here.
  // The number of objects in this array should match the number of columns in your table, even if you don't want all the headers to show

  const cols = [
    {
      label: "Rank",
      visible: false,
    },
    {
      label: "Driver",
      visible: true,
      class: "driver",
    },
    {
      label: "Team",
      visible: true,
      class: "team",
    },
    {
      label: "Pts",
      visible: true,
      class: "pts",
    },
  ];
</script>

<Window />
<!-- Outer div must have class 'chart-container' don't change -->
<div class="chart-container">
  <h1 class="headline">Formula 1 standings</h1>
  <p class="headline-units">Through July 10, 2022</p>
  <div class="table-container">
    <!-- replace teams with the variable containing your data -->
    <Table
      data={standings}
      {cols}
      isSplitTable={true}
      hideHeader={false}
      value="Valuation"
    />
  </div>
</div>

<style>
  .table-container {
    max-width: 850px;
  }
  @media (min-width: 600px) {
    .table-container {
      display: flex;
      align-items: flex-start;
      gap: 30px;
    }
  }
</style>
