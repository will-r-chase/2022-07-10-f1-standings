<script>
    import { timeParse, timeFormat } from 'd3-time-format';
    import { LayerCake, Svg } from 'layercake'; 

    import Line from './layercake/Line.svelte'; 
    import LineCircle from './layercake/LineCircle.svelte';
    import LineLabel from './layercake/LineLabel.svelte'; 

    export let xKey; 
    export let yKey; 
    export let data; 
    export let parseDate = timeParse('%m/%d/%Y')
    export let prefix = ""; 
    export let suffix = ""; 
    export let color = "#ffa515"

    export let yDomain = [0, 100]
</script>

    <div class="lineContainer">
        <LayerCake
            padding={{ right: 5, bottom: 20, left: 0 }}
            x={d => parseDate(d[xKey])}
            y={yKey}
            yDomain={yDomain}
            data={data}
      >
        <Svg>
        <!-- adjust the values here if you want a custom amount of ticks. otherwise layercake will create the ticks on its own -->
          <Line stroke={color} />
          <LineCircle stroke={color}/>
          <LineLabel 
            {yKey} 
            precision=1 
            fill={color} 
            {prefix} 
            {suffix}
          /> 
        </Svg>
      </LayerCake>
    </div>

<style>

    .lineContainer {
        display: relative;
        width: 100%; 
        height: 50px; 
    }
</style>