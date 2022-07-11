<script>
    import countryLookup from '../data/countryCodeLookup.json'; 

    export let country; 

    const logoName = (name) => {
        if (!name.includes("/")) {
            let result = countryLookup.find((d) => d.country == name)

            // uncomment to see what country is causing the error
            // console.log(result)

            let flag_name = 'https://graphics.axios.com/assets/Flags/countries/4x3/' + result.code + '.svg'; 

            return flag_name
        }
    };
</script>

<img src={logoName(country)} width="25" height="25" alt="Flag of {country}"/>

<style> 
    img {
        border: 0.5px solid #c4c4c4;
    }
</style>