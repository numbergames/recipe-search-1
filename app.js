$(function() {

//!state
const URL = 'https://api.edamam.com/search?callback=?';
let state = {
    query: '',
    searchObj: {
        q:'',
        app_id: '6da7e93e',
        app_key: '8e6eaad81cc090bc90cb3479ffff21f6'
    }
}
//new search    
const newSearch = query => {
    state.searchObj.q = state.query; 
    $.getJSON(URL, state.searchObj, renderData);
};
//add or deletes property from search obj vg v gf ect.
const changeHealthState = healthyDiet => {
    state.searchObj.health = healthyDiet;

    if (healthyDiet === "none") {
        delete state.searchObj.health;
    }

    // if (healthyDiet === "none" && state.searchObj.hasOwnProperty("health")) {
    //     delete state.searchObj["health"];
    // } else if (healthyDiet !== "none") {
    //     state.searchObj["health"] = healthyDiet;
    // };

    $("#diet-need").text(healthyDiet);
}
//!rendering
//nutrition facts
    
const generateNutrient = (nutrient, servings) => {
    return (nutrient 
        ? Math.round(nutrient.quantity / servings) 
        : "NA");
    // return num;
}
    
const generateNutrition = result => {
    let servings = result.recipe.yield;
    let calories = result.recipe.calories / servings;
    let nutrients = result.recipe.totalNutrients;

    let totalFat = generateNutrient(nutrients.FAT, servings);
    let saturatedFat = generateNutrient(nutrients.FASAT, servings);
    let cholesterol = generateNutrient(nutrients.CHOLE, servings);
    let sodium = generateNutrient(nutrients.NA, servings);
    let potassium = generateNutrient(nutrients.K, servings);
    let totalCarbs = generateNutrient(nutrients.CHOCDF, servings);
    let sugars = generateNutrient(nutrients.SUGAR, servings);
    let protein = generateNutrient(nutrients.PROCNT, servings);
    
    let resultsHtml = 
        `<div class="nutrition-info hidden">` +
            `<table>` +
                `<tr><th>Nutrition Facts</th></tr>` +
                `<tr><th>Amount per Serving</th></tr>` +
                `<tr><td>Calories.....${Math.round(calories)}</td></tr>` + 
                `<tr><td>Total Fat... ${totalFat}</td></tr>` + 
                `<tr><td>Saturated Fat...${saturatedFat}</td></tr>` + 
                `<tr><td>Cholesterol...${cholesterol}</td></tr>` + 
                `<tr><td>Sodium...${sodium}</td></tr>` + 
                `<tr><td>Potassium...${potassium}</td></tr>` +
                `<tr><td>Total Carbohydrate...${totalCarbs}</td></tr>` +
                `<tr><td>Sugars... ${sugars}</td></tr>` +
                `<tr><td>Protein... ${protein}</td></tr>` +
            `</table>` +
        `</div>`;
    return resultsHtml;
}
//ingredients 
const generateIngredientsList = result => {
    return result.recipe.ingredientLines.map(result => `<dt>${result}</dt>`).join("");
}
//recipe && nutrition buttons
const generateButtons = result => {
    let link = result.recipe.url;
    
    return (
        `<div class="btn-group">` + 
            `<button type="button" id="recipebtn" value="${link}" class="btn btn-primary">Recipe</button>` +
            `<button type="button" id="nutritionbtn" class="btn btn-primary">Nutrition</button>` +
        `</div>`
    );
}
//renders page
const renderData = data => {
    let resultsHtml = data.hits.map(result => {
        let img = result.recipe.image;
        return (`<div class=result><img src="${img}"></br>` +
        `<div class="list hidden"><h3>${result.recipe.label}</h3>` + 
        `<h4>serves ${result.recipe.yield}</h4>` +
        `<dl>${generateIngredientsList(result)}</dl>` + 
        `${generateNutrition(result)}` +
        `${generateButtons(result)}</div></div>`);
    });
    $("#results").html(resultsHtml);
};
//!event listeners 
//submit query 
$("form").submit(e => {
    e.preventDefault();
    state.query = $("#searchRecipes").val();
    newSearch(state.query);
});
//toggle ingredient view w/recipe && nutrional info button
$("#results").on("click", ".result", e => {
    e.stopPropagation();
    $(e.currentTarget).children(".list").toggleClass("hidden").toggleClass("float");
})
//recipe button
$("#results").on("click", "#recipebtn", e => {
    e.stopPropagation();
    let siteURL = $(e.currentTarget).val();
    window.open(siteURL);
});
//nutritional data toggle
$("#results").on("click", "#nutritionbtn", e => {
    e.stopPropagation();
    $(e.currentTarget).closest(".list").children(".nutrition-info").toggleClass("hidden");
    $(e.currentTarget).closest(".list").children("dl").toggleClass("hidden");
})
//v, vg, gf ect
$("#health-diet").submit(e => {
    e.preventDefault();
    e.stopPropagation();
    let healthyDiet = ($("#health-diet input:checked").val());
    changeHealthState(healthyDiet);
    newSearch(state.query);
})
});
