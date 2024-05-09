import { moduleName } from "../MaterialDeck.js";

const defaultEnable = [true,true,true,true];
const defaultUserPermissions = {
    COMBAT: {
        END_TURN: [true,true,true,true],
        TURN_DISPLAY: [true,true,true,true],
        OTHER_FUNCTIONS: [false,false,true,true],
        DISPLAY_COMBATANTS: [false,false,true,true],
        DISPLAY_NON_OWNED_STATS: [false,false,true,true],
        DISPLAY_LIMITED_HP: [false,true,true,true],
        DISPLAY_OBSERVER_HP: [true,true,true,true],
        DISPLAY_ALL_NAMES: [false,false,true,true],
        DISPLAY_LIMITED_NAME: [false,true,true,true],
        DISPLAY_OBSERVER_NAME: [true,true,true,true]
    },
    MACRO: {
        HOTBAR: [true,true,true,true],
        BY_NAME: [false,false,true,true],
        MACROBOARD: [false,false,true,true],
        MACROBOARD_CONFIGURE: [false,false,true,true]
    },
    OTHER: {
        PAUSE: [false,false,true,true],
        CONTROL: [true,true,true,true],
        DARKNESS: [false,false,true,true],
        DICE: [true,true,true,true],
        TABLES_ALL: [false,false,true,true],
        TABLES: [false,true,true,true],
        SIDEBAR: [true,true,true,true],
        COMPENDIUM_ALL: [false,false,true,true],
        COMPENDIUM: [false,true,true,true],
        JOURNAL_ALL: [false,false,true,true],
        JOURNAL: [false,true,true,true],
        CHAT: [false,true,true,true]
    },
    PLAYLIST: {
        PLAY: [false,false,true,true],
        CONFIGURE: [false,false,true,true]
    },
    SCENE: {
        VISIBLE: [false,false,true,true],
        ACTIVE: [true,true,true,true],
        DIRECTORY: [false,false,true,true],
        NAME: [false,false,true,true]
    },
    SOUNDBOARD: {
        PLAY: [false,false,true,true],
        CONFIGURE: [false,false,true,true]
    },
    TOKEN: {
        STATS: [true,true,true,true],
        VISIBILITY: [false,false,true,true],
        COMBAT: [false,true,true,true],
        VISION: [false,true,true,true],
        WILDCARD: [false,true,true,true],
        CONDITIONS: [false,true,true,true],
        CUSTOM: [false,false,true,true],
        NON_OWNED: [false,false,true,true],
        OBSERVER: [false,true,true,true]
    } 
}

export function configureUserPermissions() {
    let permissionSettings = game.settings.get(moduleName,'userPermission');
    
    if (permissionSettings == undefined || permissionSettings == null || isEmpty(permissionSettings)) {
        permissionSettings = {
            enable: defaultEnable,
            permissions: defaultUserPermissions
        }
    }
    else {
        if (permissionSettings.permissions.TOKEN.NON_OWNED == undefined) permissionSettings.permissions.TOKEN.NON_OWNED = [false,false,true,true];
        if (permissionSettings.permissions.TOKEN.OBSERVER == undefined) permissionSettings.permissions.TOKEN.OBSERVER = [false,true,true,true];
        if (permissionSettings.permissions.MACRO.BY_NAME == undefined) permissionSettings.permissions.MACRO.BY_NAME = [false,false,true,true];
    }
    if (game.user.isGM)
        game.settings.set(moduleName,'userPermission',permissionSettings);
}

export class userPermission extends FormApplication {
    constructor(data, options) {
        super(data, options);
    }
  
    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "materialDeck_userPermissionConfig",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.Permission"),
            template: "./modules/MaterialDeck/templates/userPermissionConfig.html",
            width: 660,
            height: "auto",
            scrollY: [".permissions-list"],
        });
    }
  
    /**
     * Provide data to the template
     */
    async getData() {
        let settings = game.settings.get(moduleName,'userPermission');
        if (settings == undefined || settings == null || isEmpty(settings)) {
            settings = {
                enable: defaultEnable,
                permissions: defaultUserPermissions
            }
        }
        
        const actions = Object.entries(duplicate(settings.permissions)).reduce((arr, e) => {
            const perms = Object.entries(duplicate(e[1])).reduce((arr, p) => {
                let perm = {};
                perm.roles = [
                    {role:'player',en:p[1][0]},
                    {role:'trusted',en:p[1][1]},
                    {role:'assistent',en:p[1][2]},
                    {role:'gm',en:p[1][3]}
                ]
                perm.id = p[0];
                perm.label = game.i18n.localize("MaterialDeck.Perm."+e[0]+"."+p[0]+".label");
                perm.hint = game.i18n.localize("MaterialDeck.Perm."+e[0]+"."+p[0]+".hint");
                arr.push(perm);
                return arr;
              }, []);

            let cat = {};
            cat.permissions = perms;
            cat.id = e[0];
            cat.label = game.i18n.localize("MaterialDeck.Perm."+e[0]+".label");
            cat.hint = game.i18n.localize("MaterialDeck.Perm."+e[0]+".hint");
            arr.push(cat);
            return arr;
          }, []);
        for (let i=0; i<actions.length; i++) {
            if (actions[i].id == 'MOVE')
                actions.splice(i,1);
        }
        
        const enable = [
            {role:'player',en:settings.enable[0]},
            {role:'trusted',en:settings.enable[1]},
            {role:'assistent',en:settings.enable[2]},
            {role:'gm',en:settings.enable[3]}
        ]
        return {
          roles: Object.keys(CONST.USER_ROLES).reduce((obj, r) => {
            if ( r === "NONE" ) return obj;
            obj[r] = `USER.Role${r.titleCase()}`;
            return obj;
          }, {}),
          actions,
          enable
        }
    }
  
    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
        let settings = {};
        let permissions = expandObject(formData);

        for (const [key, value] of Object.entries(permissions)) {
            const val = value;
            let conf = {};
            if (key == 'ENABLE') {
                settings.enable = [value.player, value.trusted, value.assistent, value.gm];
            }
            else {
                conf = {};
                for (const [key, value] of Object.entries(val)) {
                    const arr = [value.player, value.trusted, value.assistent, value.gm];
                    conf[key] = arr;
                }
            }
            permissions[key] = conf;
        }
    
        delete permissions.ENABLE;
        settings.permissions = permissions;
        game.settings.set(moduleName,'userPermission',settings);
    }
  
    async activateListeners(html) {
        super.activateListeners(html);
        const defaultBtn = html.find('button[name="reset"]');

        defaultBtn.on("click", event => {
            this.resetToDefault();
        })
            
        
    }

    async resetToDefault(){
        const settings = {
            enable: defaultEnable,
            permissions: defaultUserPermissions
        }
        await game.settings.set(moduleName,'userPermission',settings);
        this.render();
        ui.notifications.info(game.i18n.localize("MaterialDeck.Perm.DefaultNotification"));
    }
}