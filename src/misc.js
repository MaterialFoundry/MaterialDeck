export function compareVersions(checkedVersion, requiredVersion) {
    requiredVersion = requiredVersion.split(".");
    checkedVersion = checkedVersion.split(".");
    
    for (let i=0; i<3; i++) {
        requiredVersion[i] = isNaN(parseInt(requiredVersion[i])) ? 0 : parseInt(requiredVersion[i]);
        checkedVersion[i] = isNaN(parseInt(checkedVersion[i])) ? 0 : parseInt(checkedVersion[i]);
    }
    
    if (checkedVersion[0] > requiredVersion[0]) return false;
    if (checkedVersion[0] < requiredVersion[0]) return true;
    if (checkedVersion[1] > requiredVersion[1]) return false;
    if (checkedVersion[1] < requiredVersion[1]) return true;
    if (checkedVersion[2] > requiredVersion[2]) return false;
    return true;
  }
  
export function compatibleCore(compatibleVersion){
    const split = compatibleVersion.split(".");
    if (split.length == 1) compatibleVersion = `${compatibleVersion}.0`;
    let coreVersion = game.version;
    return compareVersions(compatibleVersion, coreVersion);
}

export function compatibleSystem(compatibleVersion){
    const split = compatibleVersion.split(".");
    if (split.length == 2) compatibleVersion = `0.${compatibleVersion}`;
    let coreVersion = game.system.version;
    return compareVersions(coreVersion, compatibleVersion);
}

export function cloneObject(obj) {
    return structuredClone(obj);
}

export function getLastElement(s) {
    if (s == undefined || s == null) return '';
    const split = s.split('.');
    return split[split.length-1];
}

export function getDocument(type, id, id2) {
    if (id == '' || id == undefined || id == null) return;

    let document;
    if (type == 'token') {
        document = canvas.tokens.get(getLastElement(id));
        if (document == undefined) document = canvas.tokens.placeables.find(p => p.name == id);
    }
    else if (type == 'actor') {
        document = canvas.tokens.placeables.find(p => p.actor.id == getLastElement(id));
        if (document == undefined) document = canvas.tokens.placeables.find(p => p.actor.name == id);
    }
    else if (type == 'macro') {
        document = game.macros.get(getLastElement(id));
        if (document == undefined) document = game.macros.getName(id);
    }
    else if (type == 'playlist') {
        document = game.playlists.get(getLastElement(id));
        if (document == undefined) document = game.playlists.getName(id);
    }
    else if (type == 'track') {
        if (id2 == '' || id2 == undefined || id2 == null) return;
        let playlist = getDocument('playlist',id2);
        if (playlist == undefined) return;
        document = playlist.sounds.get(getLastElement(id));
        if (document == undefined) document = playlist.sounds.getName(id);
    }
    else if (type == 'table') {
        document = game.tables.get(getLastElement(id));
        if (document == undefined) document = game.tables.getName(id);
    }
    else if (type == 'compendium') {
        document = game.packs.find(p=>p.metadata.label == id);
        if (document == undefined) document = game.packs.get(id);
    }
    else if (type == 'journal') {
        document = game.journal.get(getLastElement(id));
        if (document == undefined) document = game.journal.getName(id);
    }
    else if (type == 'scene') {
        document = game.scenes.get(getLastElement(id));
        if (document == undefined) document = game.scenes.getName(id);
        if (document == undefined) document = game.scenes.find(s=>s.navName == id);
    }

    return document;
}