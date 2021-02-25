import * as MODULE from "../MaterialDeck.js";
import { playlistConfigForm, macroConfigForm, soundboardConfigForm } from "./misc.js";

let userPermissions = {};
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
        MACROBOARD: [false,false,true,true],
        MACROBOARD_CONFIGURE: [false,false,true,true]
    },
    MOVE: {
        TOKEN: [true,true,true,true],
        CANVAS: [true,true,true,true]
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
        CUSTOM: [false,false,true,true]
    } 
}

export const registerSettings = function() {
    /**
     * Main settings
     */
    //world,global,client

    //Enabled the module
    game.settings.register(MODULE.moduleName,'Enable', {
        name: "MaterialDeck.Sett.Enable",
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: x => window.location.reload()
    });

    game.settings.register(MODULE.moduleName,'streamDeckModel', {
        name: "MaterialDeck.Sett.Model",
        hint: "MaterialDeck.Sett.Model_Hint",
        scope: "client",
        config: true,
        type:Number,
        default:1,
        choices:["MaterialDeck.Sett.Model_Mini","MaterialDeck.Sett.Model_Normal","MaterialDeck.Sett.Model_XL"],
    });

    /**
     * Sets the ip address of the server
     */
    game.settings.register(MODULE.moduleName,'address', {
        name: "MaterialDeck.Sett.ServerAddr",
        hint: "MaterialDeck.Sett.ServerAddrHint",
        scope: "client",
        config: true,
        default: "localhost:3001",
        type: String,
        onChange: x => window.location.reload()
    });

    game.settings.register(MODULE.moduleName, 'imageBuffer', {
        name: "MaterialDeck.Sett.ImageBuffer",
        hint: "MaterialDeck.Sett.ImageBufferHint",
        default: 100,
        type: Number,
        scope: 'client',
        range: { min: 0, max: 500, step: 10 },
        config: true
        
    });

    //Create the Help button
    game.settings.registerMenu(MODULE.moduleName, 'helpMenu',{
        name: "MaterialDeck.Sett.Help",
        label: "MaterialDeck.Sett.Help",
        type: helpMenu,
        restricted: false
    });

    game.settings.registerMenu(MODULE.moduleName, 'permissionConfig',{
        name: "MaterialDeck.Sett.Permission",
        label: "MaterialDeck.Sett.Permission",
        type: userPermission,
        restricted: true
    });

    game.settings.register(MODULE.moduleName, 'userPermission', {
        name: "userPermission",
        scope: "world",
        type: Object,
        config: false
    });

    /**
     * Playlist soundboard
     */
    game.settings.registerMenu(MODULE.moduleName, 'playlistConfigMenu',{
        name: "MaterialDeck.Sett.PlaylistConfig",
        label: "MaterialDeck.Sett.PlaylistConfig",
        type: playlistConfigForm,
        restricted: false
    });

    game.settings.register(MODULE.moduleName, 'playlists', {
        name: "selectedPlaylists",
        scope: "world",
        type: Object,
        default: {},
        config: false
    });

    /**
     * Macro Board
     */
    game.settings.registerMenu(MODULE.moduleName, 'macroConfigMenu',{
        name: "MaterialDeck.Sett.MacroConfig",
        label: "MaterialDeck.Sett.MacroConfig",
        type: macroConfigForm,
        restricted: false
    });

    game.settings.register(MODULE.moduleName, 'macroSettings', {
        name: "macroSettings",
        scope: "world",
        type: Object,
        config: false
    });

    game.settings.register(MODULE.moduleName, 'macroArgs', {
        name: "macroArgs",
        scope: "world",
        type: Object,
        config: false
    });

    /**
     * Soundboard
     */
    game.settings.register(MODULE.moduleName, 'soundboardSettings', {
        name: "soundboardSettings",
        scope: "world",
        type: Object,
        default: "None",
        config: false
    });

    game.settings.registerMenu(MODULE.moduleName, 'soundboardConfigMenu',{
        name: "MaterialDeck.Sett.SoundboardConfig",
        label: "MaterialDeck.Sett.SoundboardConfig",
        type: soundboardConfigForm,
        restricted: false
    });
}

export class helpMenu extends FormApplication {
    constructor(data, options) {
        super(data, options);
    }
  
    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "helpMenu",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.Help"),
            template: "./modules/MaterialDeck/templates/helpMenu.html",
            width: "500px"
        });
    }
  
    /**
     * Provide data to the template
     */
    getData() {
      
        return {
           
        } 
    }
  
    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
  
    }
  
    activateListeners(html) {
        super.activateListeners(html);
        
    }
  }

  class userPermission extends FormApplication {
    constructor(data, options) {
        super(data, options);
    }
  
    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "userPermissionConfig",
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
        let settings = game.settings.get(MODULE.moduleName,'userPermission');
        if (settings == undefined || settings == null || MODULE.isEmpty(settings)) {
            settings = {
                enable: defaultEnable,
                permissions: defaultUserPermissions
            }
        }

        const actions = Object.entries(duplicate(settings.permissions)).reduce((arr, e) => {
            //const perm = e[1];

            const perms = Object.entries(duplicate(e[1])).reduce((arr, p) => {
                //const perm = e[1];
                
                let perm = {};
                perm.roles = [p[1][0],p[1][1],p[1][2],p[1][3]]
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

        const current = await game.settings.get("core", "permissions");
        return {
          roles: Object.keys(CONST.USER_ROLES).reduce((obj, r) => {
            if ( r === "NONE" ) return obj;
            obj[r] = `USER.Role${r.titleCase()}`;
            return obj;
          }, {}),
          actions: actions,
          enable: settings.enable
        }
    }
  
    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
        let permissions = expandObject(formData);
        let settings = {};
        settings.enable = permissions.ENABLE;
        delete permissions.ENABLE;
        settings.permissions = permissions;
        game.settings.set(MODULE.moduleName,'userPermission',settings);
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
        await game.settings.set(MODULE.moduleName,'userPermission',settings);
        this.render();
        ui.notifications.info(game.i18n.localize("MaterialDeck.Perm.DefaultNotification"));
    }
  }


