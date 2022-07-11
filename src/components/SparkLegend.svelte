<script>
    import { timeParse, timeFormat } from 'd3-time-format';
    import { LayerCake, Svg } from 'layercake'; 

    import Line from './layercake/Line.svelte'; 
    import LineCircle from './layercake/LineCircle.svelte';
    import AxisX from './layercake/AxisX.svelte'; 

    import legend_data from '../data/legend_data.json'; 

    export let parseDate = timeParse('%m/%d/%Y')
    export let color = "#ffa515"
    export let xKey = "date" 
    export let yKey = "val"
    export let yDomain = [0, 100]

</script>

<div class="legendContainer">
    <LayerCake
        padding={{ right: 0, bottom: 20, left: 0 }}
        x={d => parseDate(d[xKey])}
        y={yKey}
        yDomain={yDomain}
        data={legend_data}
    >
        <Svg>
            <!-- you need to pull the array of tick values from the AxisX.svelte  -->
            <AxisX
                ticks={[1638684000000, 1642226400000]}
            />
            <Line stroke={color} />
            <LineCircle stroke={color} />
        </Svg>
    </LayerCake>
</div>

<style>
    .legendContainer {
        width: 100px; 
        height: 40px; 
        margin-bottom: 20px;
        margin-left: 35px;
    }
</style>