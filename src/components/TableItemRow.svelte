<script>
  // import components here, comment out the ones you aren't using
  import MiniBar from "./MiniBar.svelte";
  // import Heat from "./Heat.svelte";
  import Logo from "./Logo.svelte";
  // import Flag from './Flag.svelte';
  // import SparkLine from 'SparkLine.svelte';

  export let row;
  export let index;
  export let max_value;
  export let extent;
  export let value;
</script>

<!-- if this is for a sports table, add below as an attribute -->
<!-- data-team={row.team.toLowerCase()} -->
<!-- The full tr tag would look like this <tr class="row" data-team={row.team.toLowerCase()}
  > -->
<tr class="row">
  <th class="rank" scope="row">{row.Rank}</th>
  <td class="driver">
    {row.Driver}
  </td>
  <td class="team">
    {row.Team}
  </td>
  <td class="pts">
    {row.Pts}
  </td>

  <!-- other example cells -->
  <!-- Heat cell: <Heat {max_value} cell_value={row[value]} class_string="valuation" {extent} /> -->
  <!-- Sparkline cell:  -->
  <!-- Flag: <Flag country={row.country_name} /> -->
</tr>

<style>
  .row {
    font-family: var(--font-nb-pro);
    line-height: 1.25;
    text-align: left;
    vertical-align: middle;
  }
  .row:not(:first-of-type) {
    border-top: 1px solid #cfd0d0;
  }
  td,
  th {
    padding: 8px 0;
    font-family: var(--font-nb-pro-mono);
    font-size: 14px;
    text-align: right;
    color: #333335;
    vertical-align: middle;
  }
  td + td,
  th + td {
    padding-left: var(--cell-spacing);
  }
  .rank {
    width: 25px;
    font-size: 0.8rem;
    text-align: right;
  }
  .logo {
    text-align: center;
    width: calc(22px + var(--cell-spacing));
  }
  .logo img {
    display: block;
    max-width: none;
    /* margin: 0 auto; */
    mix-blend-mode: multiply;
  }
  .team {
    font-family: var(--font-nb-pro);
    line-height: 1.25;
    text-align: left;
    color: #656568;
    /* width: 100px; */
  }
  .driver {
    font-family: var(--font-nb-pro);
    line-height: 1.25;
    text-align: left;
    /* width: 100px; */
  }
  .pts {
    /* width: 55%; */
    font-family: var(--font-nb-pro-mono);
    color: #421ab3;
    text-align: right;
  }
</style>
