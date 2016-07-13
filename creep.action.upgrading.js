var mod = {

    name: 'upgrading',
    
    getTargetId: function(target){ 
        return target.id;
    },

    getTargetById: function(id){
        return Game.getObjectById(id);
    },

    isValidAction: function(creep){
        return creep.carry.energy > 0 && creep.room.sourceEnergyAvailable > 0;
    },

    isValidTarget: function(target){
        return (target != null ) && ( target.progress != null );
    }, 

    isAddableAction: function(creep){
        return true;
    },

    isAddableTarget: function(target){ // target is valid to be given to an additional creep
        return true;
    }, 

    newTarget: function(creep, state){
        return creep.room.controller;
    }, 

    step: function(creep){       
        var moveResult = creep.moveTo(creep.target);
        var workResult = creep.upgradeController(creep.target);
        if(workResult == OK || moveResult == OK)
            return;
        
        if( moveResult == ERR_NO_PATH && Game.flags['IdlePole']){// get out of the way
            creep.moveTo(Game.flags['IdlePole']);
            return;
        } 
        if( !( [ERR_TIRED, ERR_NO_PATH].indexOf(moveResult) > -1 ) ) {
            if( DEBUG ) logError(creep, moveResult);
            creep.memory.action = null;
            creep.memory.target = null;
        }
    }
}

module.exports = mod;