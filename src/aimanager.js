
import SideManager from '/src/sidemanager.js';
import {Side, Sides} from '/src/main.js';
import settings from '/src/gamesettings.js';
import City from '/src/gameobjects/city.js';


/**
 * class AIManager extends SideManager to control ai decisions aaand population growth
 */
export default class AIManager extends SideManager {

    /**
     * 
     * @param {Side} side 
     * @param {Array<City>} allCities
     */
    constructor(side, allCities) {
        super();
        this.allCities = allCities;
        this.side = side; 
        this.increasePopulation = this.increasePopulation.bind(this);
        this.popTaskId = setInterval(this.increasePopulation, settings.enemy_pop_rate);
    }

    /**
     * @override from SideManager
     */
    update() {
        console.log(`AIManager::update() -> Side: ${this.side}`)
        
        //the basic strategy: 
        // treat the cities as a list in order of importance,
        // simply attack the first city in the last that does not currently belong to the AI 
        this.cities.forEach(city => {
            //probability of AI choosing to attack for this city 
            if (settings.ai_decision_rate > Math.random()) {
                console.log(`AI manager decides to attack for city`);
                this.allCities.some(target => {
                    if (target.side != this.side) { 
                        //target acquired
                        city.sendPopTo(target);
                        return true;
                    }
                    return false; 
                });
            }
        });
    }

    /**
     * This function will be responsible for increasing the population of the cities over time.
     */ 
    increasePopulation() {
        this.cities.forEach(city => {
            // console.log(`AIManager::increasePopulation() city at ${city.x}, ${city.y}`);
            if (city.pop < settings.max_pop) city.incrementPop();
        });
    }

}