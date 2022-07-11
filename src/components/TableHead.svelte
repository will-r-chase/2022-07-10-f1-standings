<script>
  export let cols;
  export let hideHeader;
</script>

<thead>
  <tr>
    {#each cols as col}
      <th
        scope="col"
        class="subhead {col.class ? col.class : ''}"
        class:text-hidden={col.visible === false || hideHeader}
        aria-hidden={col.ariaHidden}
      >
        {#if col.ariaLabel}
          <span class="sr-only">{col.ariaLabel}</span>
          <span aria-hidden="true">{col.label}</span>
        {:else}
          {col.label}
        {/if}
      </th>
    {/each}
  </tr>
</thead>

<style>
  thead {
    border-bottom: 1px solid #626262;
  }

  th {
    padding: 0 0 6px;
    text-align: left;
    vertical-align: bottom;
  }

  th + th {
    padding-left: var(--cell-spacing);
  }

  .text-hidden {
    color: transparent;
    font-size: 0;
  }

  .valuation {
    width: 55%;
  }
  .pts {
    text-align: right;
  }
</style>
