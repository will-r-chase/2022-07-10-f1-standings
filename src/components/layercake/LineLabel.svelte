<script>
    import { getContext } from 'svelte';
  
    const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');
    import { timeParse, timeFormat } from 'd3-time-format';
  
    export let fill = '#ab00d6';
    export let yKey; 
    export let precision; 
    export let prefix = ''; 
    export let suffix = ''; 

    const parseDate = timeParse('%m/%d/%Y');

    const abbreviateNumber = (input, decimals = precision) => {
        if (!isNumber(input)) {
          return input ? input : "";
        }
        // Round function
        let round = value => {
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
    }

    function isNumber(value) 
    {
        return typeof value === 'number' && isFinite(value);
    }

    $: x_pos = $xGet($data[$data.length - 1]) + 5
    $: y_pos = $yGet($data[$data.length - 1]) + 5
  </script>
  
  <text class="textLabel" x={x_pos} y={y_pos} text-anchor="start" fill={fill} >{prefix}{abbreviateNumber($data[$data.length - 1][yKey])}{suffix}</text>
  
  <style>
    .path-line {
      fill: none;
      stroke-linejoin: round;
      stroke-linecap: round;
      stroke-width: 2;
    }

    .textLabel {
        font-family: "NB International Pro Mono", Helvetica, Helvetica Neue, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, sans-serif;
        font-size: 13px;
        line-height: 22px;
    }
  </style>