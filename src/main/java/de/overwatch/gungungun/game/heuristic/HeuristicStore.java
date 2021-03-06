package de.overwatch.gungungun.game.heuristic;


import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class HeuristicStore {

    private static final Map<HeuristicName, AbstractHeuristic> HEURISTICS = new HashMap<>();
    static{
        HEURISTICS.put(HeuristicName.NONE, new NoneHeuristic());
        HEURISTICS.put(HeuristicName.CLOSER_DISTANCE_TO_NEAREST_ENEMY, new CloserDistanceToNearestEnemyHeuristic());
        HEURISTICS.put(HeuristicName.GOOD_SHOOTING_POSITION, new GoodShootingPositionHeuristic());
        HEURISTICS.put(HeuristicName.CLOSE_TO_LONG_RANGE_WEAPON_RANGE, new NearestEnemyCloseToLonRangeWeaponRangeHeuristic());
        HEURISTICS.put(HeuristicName.SHOOTING_IS_GOOD, new ShootingIsGoodHeuristic());
        HEURISTICS.put(HeuristicName.DIRECT_DISTANCE_IS_BETTER, new DirectDistanceIsBetterHeuristic());
        HEURISTICS.put(HeuristicName.ATTACKING_IS_GOOD, new AttackingIsGoodHeuristic());
    }


    public AbstractHeuristic getHeuristicByName(HeuristicName name){
        return HEURISTICS.get(name);
    }


}
