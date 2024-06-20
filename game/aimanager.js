
import SideManager from './sidemanager.js';



/**
 * class AIManager extends SideManager to control ai decisions aaand population growth
 */
class AIManager extends SideManager {

    constructor() {
        super();
        this.increasePopulation = this.increasePopulation.bind(this);
        this.popTaskId = setInterval(this.increasePopulation, settings.enemy_pop_rate);
    }

    /**
     * @override from SideManager
     */
    update() {
        //TODO 
    }

    /**
     * This function will be responsible for increasing the population of the cities over time.
     */ 
    increasePopulation() {
        this.cities.forEach(city => {
            if (city.pop < settings.max_pop) city.incrementPop();
        });
    }

}