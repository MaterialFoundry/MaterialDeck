import { versions } from "../MaterialDeck.js";

export const releaseURLs = {
    module: {
        api: "https://api.github.com/repos/MaterialFoundry/MaterialDeck/releases",
        url: "https://github.com/MaterialFoundry/MaterialDeck/releases"
    },
    plugin: {
        api: "https://api.github.com/repos/MaterialFoundry/MaterialDeck_SD/releases",
        url: "https://github.com/MaterialFoundry/MaterialDeck_SD/releases"
    },
    materialCompanion: {
        api: "https://api.github.com/repos/MaterialFoundry/MaterialCompanion/releases",
        url: "https://github.com/MaterialFoundry/MaterialCompanion/releases"
    } 
}

export class downloadUtility extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.releases = {}
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "materialDeck_downloadUtility",
            title: "Material Deck: " + game.i18n.localize("MaterialDeck.DownloadUtility.Title"),
            template: "./modules/MaterialDeck/templates/downloadUtility.html",
            width: 500,
            height: "auto"
        });
    }

    /**
     * Provide data to the template
     */
    async getData() {
        let dlDisabled = true;

        this.releases = {
            module: await this.checkForUpdate('module'),
            plugin: await this.checkForUpdate('plugin'),
            materialCompanion: await this.checkForUpdate('materialCompanion')
        }

        let versionsCopy = JSON.parse(JSON.stringify(versions));
        versionsCopy.module.current = 'v' + versionsCopy.module.current;
        versionsCopy.materialCompanion.minimum = 'v' + versionsCopy.materialCompanion.minimum;
        if (versionsCopy.materialCompanion.current == '') versionsCopy.materialCompanion.current = '?';
        else versionsCopy.materialCompanion.current = 'v' + versionsCopy.materialCompanion.current;
        versionsCopy.plugin.minimum = 'v' + versionsCopy.plugin.minimum;
        if (versionsCopy.plugin.current == '') versionsCopy.plugin.current = '?';
        else versionsCopy.plugin.current = 'v' + versionsCopy.plugin.current;

        return {
            releases: this.releases,
            versions: versionsCopy,
            sdDlDisable: this.releases.plugin == undefined,
            msDlDisable: this.releases.materialCompanion == undefined,
            profileDlDisable: dlDisabled
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

        const downloadSd = html.find("button[id='materialDeck_dlUtil_downloadSd']");
        const downloadMc = html.find("button[id='materialDeck_dlUtil_downloadMc']");
        const downloadProfile = html.find("button[name='downloadProfile']")
        const refresh = html.find("button[id='materialDeck_dlUtil_refresh']");

        //releaseURLs

        downloadSd.on('click', () => {
            this.downloadURI(this.releases.plugin.url)
        })
        downloadMc.on('click', () => {
            const os = document.getElementById('materialDeck_dlUtil_os').value;
            this.downloadURI(this.releases.materialCompanion.variants.find(v => v.name.includes(os)).url)
        })
        downloadProfile.on('click',(event) => {
            let name = event.currentTarget.id.replace('materialDeck_dlUtil_dlProfile-','');
            this.downloadURI(this.releases.plugin.profiles.find(p => p.name.includes(name)).url);
        })
    }

    downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      getReleaseData() {
        let parent = this;
        const url = 'https://api.github.com/repos/MaterialFoundry/MaterialDeck_SD/releases/latest';
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');
                const data = JSON.parse(request.responseText);
                parent.releaseAssets = data.assets;
                parent.render(true);
                if (type.indexOf("text") !== 1)  return;
            }
        }
        request.onerror = function () {}
    }

    checkForUpdate(reqType) {
        return new Promise((resolve) => {
            const url = releaseURLs?.[reqType].api;
            if (url == undefined) return;
    
            $.getJSON(url).done(function(releases) {
                releases = releases.filter(r => !r.prerelease);
                const release = releases[0];
                if (reqType == 'plugin') {
                    const url = release.assets.find(a => a.name.includes('streamDeckPlugin'))?.browser_download_url;
                    let profiles  = [];
                    for (let profile of release.assets.filter(a => a.name.includes('streamDeckProfile'))) {
                        profiles.push({
                            name: profile.name.replace('.streamDeckProfile', ''),
                            url: profile.browser_download_url
                        })
                    }
                    resolve({
                        release: releases[0],
                        version: release.tag_name,
                        url,
                        profiles
                    });
                }
                else if (reqType == 'materialCompanion') {
                    let variants = [];
                    for (let variant of release.assets) {
                        variants.push({
                            name: variant.name,
                            url: variant.browser_download_url
                        })
                    }
                    resolve({
                        release: releases[0],
                        version: release.tag_name,
                        url,
                        variants
                    });
                }
                else if (reqType == 'module') {
                    resolve({
                        release: releases[0],
                        version: release.tag_name
                    });
                }
            });
        });  
    }     
}