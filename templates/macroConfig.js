import { moduleName, getPermission, materialDeck } from "../MaterialDeck.js";
import { compatibleCore } from "../src/misc.js";
import { importDialogForm } from "./importDialog.js";
import { exportDialogForm } from "./exportDialog.js";

export class macroConfigForm extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.data = data;
        this.page = 0;
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "materialDeck_macroConfig",
            title: "Material Deck: "+game.i18n.localize("MaterialDeck.Sett.MacroConfig"),
            template: "./modules/MaterialDeck/templates/macroConfig.html",
            classes: ["sheet"]
        });
    }
    
    /**
     * Provide data to the template
     */
    getData() {
        if (getPermission('MACRO','MACROBOARD_CONFIGURE') == false ) {
            ui.notifications.warn(game.i18n.localize("MaterialDeck.Notifications.Macroboard.NoPermission"));
            return;
        }
        //Get the settings
        const settings = game.settings.get(moduleName,'macroSettings');
        var selectedMacros = settings.macros;
        var color = settings.color;
        var args = settings.args;
        var labels = settings.labels;

        //Check if the settings are defined
        if (selectedMacros == undefined) selectedMacros = [];
        if (color == undefined) color = [];
        if (args == undefined) args = [];
        if (labels == undefined) labels = [];

        //Check if the Furnace is installed and enabled
        let height = 95;
        let advancedMacrosEnabled = false;
        if (compatibleCore('11.0')) {
            advancedMacrosEnabled = true;
        }
        else {
            let advancedMacros = game.modules.get("advanced-macros");
            if (advancedMacros != undefined && advancedMacros.active) advancedMacrosEnabled = true;
            if (advancedMacrosEnabled) {
                advancedMacrosEnabled = true;
                height += 50;
            }
        }
        

        let iteration = this.page*32;
        let macroData = [];
        for (let j=0; j<4; j++){
            let macroRowConfig = [];
      
            for (let i=0; i<8; i++){
                let colorData = color[iteration];
                if (colorData != undefined){
                    let colorCorrect = true;
                    if (colorData[0] != '#') colorCorrect = false;
                    for (let k=0; k<6; k++){
                        if (parseInt(colorData[k+1],16)>15)
                            colorCorrect = false;
                    }
                    if (colorCorrect == false) colorData = '#000000'; 
                }
                else 
                    colorData = '#000000';
                const label = labels[iteration] == undefined || labels[iteration] == "" ? game.macros.get(selectedMacros[iteration])?.name : labels[iteration];
                let dataThis = {
                    iteration: iteration+1,
                    macro: selectedMacros[iteration],
                    color: colorData,
                    args: args[iteration],
                    label
                }
                macroRowConfig.push(dataThis);
                iteration++;
            }
            macroData.push({macroRowConfig});
        }
       
        return {
            height: height,
            macros: game.macros,
            selectedMacros: selectedMacros,
            macroData: macroData,
            furnace: advancedMacrosEnabled,
            macroRange: `${this.page*32 + 1} - ${this.page*32 + 32}`,
            prevDisabled: this.page == 0 ? 'disabled' : '',
            totalMacros: Math.max(Math.ceil(selectedMacros.length/32)*32, this.page*32 + 32)
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
        const navNext = html.find("button[name='navNext']");
        const navPrev = html.find("button[name='navPrev']");
        const clearAll = html.find("button[name='clearAll']");
        const clearPage = html.find("button[name='clearPage']");
        const importBtn = html.find("button[name='import']");
        const exportBtn = html.find("button[name='export']");
        const macro = html.find("select[name='macros']");
        const args = html.find("input[name='args']");
        const color = html.find("input[name='colorPicker']");
        const label = html.find("input[name='macroLabel']")

        importBtn.on('click', async(event) => {
            let importDialog = new importDialogForm();
            importDialog.setData('macroboard',this)
            importDialog.render(true);
        });

        exportBtn.on('click', async(event) => {
            const settings = game.settings.get(moduleName,'macroSettings');
            let exportDialog = new exportDialogForm();
            exportDialog.setData(settings,'macroboard')
            exportDialog.render(true);
        });

        navNext.on('click',async (event) => {
            this.page++;
            this.render(true);
        });

        navPrev.on('click',async (event) => {
            const settings = game.settings.get(moduleName,'macroSettings');
            this.page--;
            if (this.page < 0) this.page = 0;
            else {
                const totalMacros = Math.ceil(settings.macros.length/32)*32;
                if ((this.page + 2)*32 == totalMacros) {
                    let pageEmpty = this.getPageEmpty(totalMacros-32);
                    if (pageEmpty) {
                        await this.clearPage(totalMacros-32,true)
                    }
                }
            }
            this.render(true);
        });

        clearAll.on('click',async (event) => {
            const parent = this;

            let d = new Dialog({
                title: game.i18n.localize("MaterialDeck.ClearAll"),
                content: game.i18n.localize("MaterialDeck.ClearAll_Content"),
                buttons: {
                    continue: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("MaterialDeck.Continue"),
                    callback: async () => {
                        this.page = 0;
                        await parent.clearAllSettings();
                        parent.render(true);
                    }
                    },
                    cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("MaterialDeck.Cancel")
                    }
                },
                default: "cancel"
            });
            d.render(true);
        })

        clearPage.on('click',(event) => {
            const parent = this;

            let d = new Dialog({
                title: game.i18n.localize("MaterialDeck.ClearPage"),
                content: game.i18n.localize("MaterialDeck.ClearPage_Content"),
                buttons: {
                    continue: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("MaterialDeck.Continue"),
                    callback: async () => {
                        await parent.clearPage(parent.page*32)
                        parent.render(true);
                    }
                    },
                    cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("MaterialDeck.Cancel")
                    }
                },
                default: "cancel"
            });
            d.render(true);
        })

        macro.on("change", event => {
            let id = event.target.id.replace('materialDeck_macroConfig_macros','');
            let settings = game.settings.get(moduleName,'macroSettings');
            settings.macros[id-1] = event.target.value;
            if (settings.labels == undefined) settings.labels = [];
            const macroLabel = event.target.value == '' ? '' : game.macros.get(event.target.value).name;
            settings.labels[id-1] = macroLabel;
            document.getElementById(`materialDeck_macroConfig_label${id}`).value = macroLabel;
            this.updateSettings(settings);
        });

        args.on("change", event => {
            let id = event.target.id.replace('materialDeck_macroConfig_args','');
            let settings = game.settings.get(moduleName,'macroSettings');
            if (settings.args == undefined) settings.args = [];
            settings.args[id-1]=event.target.value;
            this.updateSettings(settings);
        });

        color.on("change", event => {
            let id = event.target.id.replace('materialDeck_macroConfig_colorpicker','');
            let settings = game.settings.get(moduleName,'macroSettings');
            settings.color[id-1]=event.target.value;
            this.updateSettings(settings);
        });

        label.on("change", event => {
            let id = event.target.id.replace('materialDeck_macroConfig_label','');
            let settings = game.settings.get(moduleName,'macroSettings');
            if (settings.labels == undefined) settings.labels = [];
            settings.labels[id-1] = event.target.value;
            this.updateSettings(settings);
        })
    }

    async updateSettings(settings){
        if (game.user.isGM) {
            await game.settings.set(moduleName,'macroSettings',settings);
            if (materialDeck.enableModule) materialDeck.macroControl.updateAll();
        }
        else {
            const payload = {
                "msgType": "macroboardUpdate", 
                "settings": settings
            };
            game.socket.emit(`module.MaterialDeck`, payload);
        }
    }

    getPageEmpty(pageStart) {
        const settings = game.settings.get(moduleName,'macroSettings');
        let pageEmpty = true;
        for (let i=pageStart; i<pageStart+32; i++) {
            if (settings.macros[i] != undefined && settings.macros[i] != null && settings.macros[i] != "") {
                pageEmpty = false;
                break;
            }
        }
        return pageEmpty;
    }

    async clearPage(pageStart,remove=false) {
        const settings = game.settings.get(moduleName,'macroSettings');
        if (remove) {
            await settings.macros.splice(pageStart,32);
            await settings.color.splice(pageStart,32);
            if (settings.args != undefined) await settings.args.splice(pageStart,32);
        }
        else {
            for (let i=pageStart; i<pageStart+32; i++) {
                settings.macros[i] = null;
                settings.color[i] = "0";
                if (settings.args != undefined) settings.args[i] = null;
            }
        }
        await this.updateSettings(settings);
    }

    async clearAllSettings() {
        let settings = {
            macros: [],
            color: [],
            args: []
        };
        for (let i=0; i<32; i++) {
            settings.macros[i] = null;
            settings.color[i] = "0";
            settings.args[i] = null;
        }
        await this.updateSettings(settings);
    }
}