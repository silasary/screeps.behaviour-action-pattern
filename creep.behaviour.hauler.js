module.exports = {
    name: 'hauler',
    run: function(creep) {
        // Assign next Action
        let oldTargetId = creep.data.targetId;
        if( creep.action == null || creep.action.name == 'idle' ) {
            this.nextAction(creep);
        }
        if( creep.data.targetId != oldTargetId ) {
            delete creep.data.path;
        }
        // Do some work
        if( creep.action && creep.target ) {
            creep.action.step(creep);
        } else {
            logError('Creep without action/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
        }
    },
    nextAction: function(creep){
        let priority;
        if( creep.sum < creep.carryCapacity/2 ) { 
            priority = [
                Creep.action.uncharging,
                Creep.action.picking,
                Creep.action.reallocating, 
                Creep.action.withdrawing, 
                Creep.action.idle];
        }
        else {	  
            priority = [
                Creep.action.feeding, 
                Creep.action.charging, 
                Creep.action.fueling, 
                Creep.action.storing, 
                Creep.action.idle];

            if ( creep.sum > creep.carry.energy || 
                ( !creep.room.situation.invasion
                && SPAWN_DEFENSE_ON_ATTACK
                && creep.room.conserveForDefense && creep.room.relativeEnergyAvailable > 0.8)) {
                    priority.unshift(Creep.action.storing);
            }
            if (creep.room.structures.urgentRepairable.length > 0 ) {
                priority.unshift(Creep.action.fueling);
            }
            if( creep.room.controller && creep.room.controller.ticksToDowngrade < 2000 ) { // urgent upgrading 
                priority.unshift(Creep.action.upgrading);
            }
        }

        for(var iAction = 0; iAction < priority.length; iAction++) {
            var action = priority[iAction];
            if(action.isValidAction(creep) && 
                action.isAddableAction(creep) && 
                action.assign(creep)) {
                    return;
            }
        }
    }
}
