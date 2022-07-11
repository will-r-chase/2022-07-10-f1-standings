<script>
    export let league; 
    export let team; 

    const lookup = {      
        "college": "college-logos", 
        "euro-basketball": "euro-basketball", 
        "euro-football": "euro-football", 
        "mls": "mls-logos", 
        "milb": "milb-logos", 
        "mlb": "mlb-logos", 
        "nba": "nba-logos", 
        "nhl": "nhl-logos", 
        "nfl": "nfl-logos", 
        "nwsl": "nwsl-logos", 
        "wnba": "wnba-logos", 
    }

    const imgName = (team) => {
        let base = "https://graphics.axios.com/assets/sports-logos";

        let league_string = `/${lookup[league]}/color/`

        if (team == "Southern California") {
        return base + "usc.png";
        } else {
        let new_name = team.replace("State", "St");
        new_name = new_name.replace("&", "");
        new_name = new_name.replace(" ", "-");
        new_name = new_name.toLowerCase();
        return base + league_string + new_name + ".png";
        }
    };

</script>

<img src={imgName(team)} width="22" height="22" alt="" />