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
    if (split.length == 2) compatibleVersion = `0.${compatibleVersion}`;
    let coreVersion = game.version == undefined ? game.data.version : `0.${game.version}`;
    return compareVersions(compatibleVersion, coreVersion);
}

export function compatibleSystem(compatibleVersion){
    const split = compatibleVersion.split(".");
    if (split.length == 2) compatibleVersion = `0.${compatibleVersion}`;
    let coreVersion = game.system.version;
    return compareVersions(coreVersion, compatibleVersion);
}