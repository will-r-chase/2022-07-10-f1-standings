<script>
    import { getContext } from 'svelte';
  
    const { data, xGet, yGet, xScale, yScale, } = getContext('LayerCake');
  
    export let stroke = '#ab00d6';

    $: x_pos = $xGet($data[$data.length - 1])
    $: y_pos = $yGet($data[$data.length - 1])
  </script>
  
  <circle class="circleLabel" cx={x_pos} cy={y_pos} r=4 fill={stroke} ></circle>
  
  <style>
    .path-line {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-width: 2;
    }

    .circleLabel {
        stroke: #fff;
        stroke-width: 1px;
    }
  </style>