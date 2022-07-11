<script>
    import * as d3 from 'd3';

    import TableHead from "./TableHead.svelte";
    import TableItemRow from "./TableItemRow.svelte";

    export let cols;
    export let isSplitTable;
    export let data; 
    export let hideHeader; 
    export let value; 
    export let facet;

    // Takes the max value as well as the min, max of the designated value of the "value" prop in App.svelte
    // This is used to create the MiniBar and Heat elements in the table, if used. If a table uses neither, leave these as is

    let max_value = d3.max(data, function(d) { return d[value]; } );
    let extent = d3.extent(data, function(d) { return d[value]; } );
  
    // Split the dataset in half to populate 2 <table> tags on desktop
    let tables = [];
    if (isSplitTable) {
      const half = Math.ceil(data.length / 2);
      tables[0] = data.slice(0, half);
      tables[1] = data.slice(half, data.length);
    }

    
  </script>
  
  <!-- Mobile Table: All Rows -->
  <table class="table is-mobile">
    <TableHead {cols} hideHeader={false} />
    <tbody>
      {#each data as row, index}
        <TableItemRow {row} {index} {extent} {value} {max_value} />
      {/each}
    </tbody>
  </table>
  
  <!-- Desktop Table: Split -->
  {#if isSplitTable}
    {#each tables as table, i}
      <table class="table is-newsletter">
        <caption class="sr-only"
          >{i === 0 ? "Top" : "Bottom"} half of the rankings</caption
        >
        <TableHead {cols} hideHeader={isSplitTable && i !== 0 ? true : false} />
        <tbody>
          {#each table as row, index}
            <TableItemRow {row} {index} {max_value} {extent} {value} />
          {/each}
        </tbody>
      </table>
    {/each}
    
  {:else} 
    <!-- Desktop table: Not split -->
    <table class="table is-newsletter">
      <TableHead {cols} hideHeader={false} />
      <tbody>
        {#each data as row, index}
          <TableItemRow {row} {index} {extent} {value} {max_value} />
        {/each}
      </tbody>
    </table>
  {/if}
  
  <style>
    :global(:root) {
      /* Space between table cells */
      --cell-spacing: 6px;
    }
  
    .table {
      width: 100%;
      border-collapse: collapse;
      position: relative; 
      margin-bottom: 10px;
    }

    caption {
      position: absolute;
      top: 0;
    }
  </style>