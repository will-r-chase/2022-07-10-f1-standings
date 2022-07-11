<script> 

    import * as d3 from 'd3'; 
    import { interpolateHcl } from "d3-interpolate";

    export let max_value; 
    export let extent; 
    export let class_string; 
    export let cell_value; 
    export let prefix = ''; 
    export let suffix = ''; 


    const abbreviateNumber = (input, decimals = 1) => {
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

            // for number formatting function
    function isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }   

    // colors, swap in the desired ramp into the range method below

    // yellow: ["#fdffab", "#875D00"]
    // orange: ["#ffe5bb", "#663000"]
    // red: ["#ffd9d9", "#660000"]
    // purple: ["#ded2ff", "#1e0066"]
    // blue: ["#bbf2ff", "#00347f"]
    // green: ["#caffdc", "#005e1d"]

    let color_scale = d3.scaleLinear()
        .domain(extent)
        .range(["#bbf2ff", "#00347f"]);

</script>

<td class="heat {class_string}" style="background-color: {color_scale(cell_value)}">
    {#if cell_value > 0.85 * max_value}
        <span class="lightText">
            {prefix}{abbreviateNumber(cell_value)}{suffix}
        </span>
    {:else}
        {prefix}{abbreviateNumber(cell_value)}{suffix}
    {/if}
    
</td>

<style>

    .heat {
        width: 45%;
        text-align: center;
        vertical-align: middle;
    }

    .lightText {
        color: #fff;
    }

</style>