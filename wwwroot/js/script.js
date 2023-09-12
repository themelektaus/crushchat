/* script.js */



(function()
{
    const items = {
        'language': "EN",
        'autoGenerate': "true",
        'showOriginalMessages': "false",
        'hideImages': "false",
        'csrfToken': "",
        'sessionToken': "",
        'translationClient': "",
        'deeplAuthKey': "",
        'deeplBlockSize': 10,
        'libreTranslateUrl': "",
        'characterLimit': 100,
        'messageLimit': 800
    }
    
    for (const key in items)
        if (localStorage.getItem(key) === null)
            localStorage.setItem(key, items[key])
})()



Object.defineProperties(EventTarget.prototype,
{
    $head:
    {
        get: () =>
        {
            return document.head
        }
    },
    $body:
    {
        get: () =>
        {
            return document.body
        }
    },
    $main:
    {
        get: () =>
        {
            return query(`#main`)
        }
    },
    $loader:
    {
        get: () =>
        {
            return query(`#main > .loader`)
        }
    },
    fetchAsync:
    {
        value: function(url, options)
        {
            options ??= { }
            
            options.headers ??= { }
            
            const h = options.headers
            
            h['X-CSRF-Token'] = localStorage.getItem('csrfToken')
            h['X-Session-Token'] = localStorage.getItem('sessionToken')
            h['X-Translation-Client'] = localStorage.getItem('translationClient')
            h['X-DeepL-Auth-Key'] = localStorage.getItem('deeplAuthKey')
            h['X-DeepL-Block-Size'] = localStorage.getItem('deeplBlockSize')
            h['X-LibreTranslate-URL'] = localStorage.getItem('libreTranslateUrl')
            h['X-Character-Limit'] = localStorage.getItem('characterLimit')
            h['X-Message-Limit'] = localStorage.getItem('messageLimit')
            h['X-Language'] = localStorage.getItem('language')
            
            return window.fetch(url, options)
        }
    },
    create:
    {
        value: function()
        {
            const element = document.createElement(...arguments)
            
            if (this instanceof Node)
                this.appendChild(element)
            
            return element
        }
    },
    query:
    {
        value: function()
        {
            return (this instanceof Window ? document : this).querySelector(...arguments)
        }
    },
    queryAll:
    {
        value: function()
        {
            return (this instanceof Window ? document : this).querySelectorAll(...arguments)
        }
    },
    hasClass:
    {
        value: function()
        {
            return this.classList.contains(...arguments)
        }
    },
    toggleClass:
    {
        value: function(_class, add)
        {
            if (add ?? !this.hasClass(_class))
                return this.addClass(_class)
            return this.removeClass(_class)
        }
    },
    addClass:
    {
        value: function()
        {
            this.classList.add(...arguments)
            return this
        }
    },
    removeClass:
    {
        value: function()
        {
            this.classList.remove(...arguments)
            return this
        }
    },
    setBackgroundImage:
    {
        value: function(url)
        {
            if (url)
                this.style.backgroundImage = `url(${url})`
            else
                this.style.backgroundImage = `none`
            return this
        }
    },
    clone:
    {
        value: function()
        {
            return this.cloneNode(true)
        }
    },
    setHtml:
    {
        value: function(value)
        {
            this.innerHTML = value
            return this
        }
    },
    addHtml:
    {
        value: function(value)
        {
            this.innerHTML += value
            return this
        }
    },
    clearHtml:
    {
        value: function()
        {
            return this.setHtml(``)
        }
    },
    add:
    {
        value: function()
        {
            this.appendChild(...arguments)
            return this
        }
    },
    remove:
    {
        value: function()
        {
            this.parentNode.removeChild(this)
            return this
        }
    },
    removeIf:
    {
        value: function(condition)
        {
            if (condition)
                return this.remove()
            return this
        }
    },
    on:
    {
        value: function(selector, callback)
        {
            this.addEventListener(selector, e => callback(e.target, e))
            return this
        }
    },
    clearEventListeners:
    {
        value: function()
        {
            const clone = this.clone()
            this.parentNode.replaceChild(clone, this);
            return clone
        }
    },
    onClick:
    {
        value: function(callback)
        {
            return this.on(`click`, callback)
        }
    },
    enableInput:
    {
        value: function(enabled)
        {
            queryAll(`input, button, textarea, select`).forEach(x => x.disabled = !(enabled ?? true))
        }
    },
    disableInput:
    {
        value: function()
        {
            enableInput(false)
        }
    },
    transitionAsync:
    {
        value: async function(options)
        {
            this.addClass(`no-background-image`)
            
            for (const item in options.from)
                this.style[item] = options.from[item]
            
            this.style.transition = `all ${options.duration}ms`
            
            await new Promise(async resolve =>
            {
                const callback = e =>
                {
                    this.removeEventListener(`transitionend`, callback)
                    
                    for (const item in options.from)
                        this.style[item] = ``
                    
                    this.style.transition = ``
                    
                    if (!this.attributes[`style`].value)
                        this.removeAttribute(`style`)
                    
                    this.removeClass(`no-background-image`)
                    
                    resolve()
                }
                
                this.addEventListener(`transitionend`, callback)
                
                // Hack: https://stackoverflow.com/a/31997214
                // It tricks the layout engine
                this.offsetHeight
                
                for (const item in options.to)
                    this.style[item] = options.to[item]
            })
        }
    },
    forceShow:
    {
        value: function (visible)
        {
            this.toggleClass(`display-none`, !visible)
            this.toggleClass(`important`, !visible)
            return this
        }
    },
})

Object.defineProperties(Object.prototype,
{
    route:
    {
        set: function(value)
        {
            const hash = [ value.page ]
            
            if (value.id)
                hash.push(value.id)
            
            location.hash = hash.join(`/`)
        },
        get: function()
        {
            let hash = location.hash
                .replace(/^\#+/, ``).replace(/\#+$/, ``)
                .replace(/^\/+/, ``).replace(/\/+$/, ``)
                .split(`/`)
            return {
                page: hash[0] || `home`,
                id: hash[1] || ``
            }
        }
    },
    toQueryString:
    {
        value: function()
        {
            const queries = []
            for (const key in this)
                queries.push(`${key}=${encodeURIComponent(this[key])}`)
            if (queries.length == 0)
                return ``
            return `?${queries.join(`&`)}`
        }
    },
    getAndDelete:
    {
        value: function(key, defaultValue)
        {
            const result = this[key] ?? defaultValue
            delete this[key]
            return result
        }
    },
    transferTo:
    {
        value: function(target)
        {
            if (this instanceof EventTarget)
            {
                this.queryAll(`[data-bind]`).forEach($ =>
                {
                    if (target instanceof Storage)
                    {
                        let value
                        switch ($.type)
                        {
                            case 'checkbox':
                                value = $.checked.toString()
                                break
                            
                            default:
                                value = $.value.toString()
                                break
                        }
                        localStorage.setItem($.dataset.bind, value)
                    }
                    else
                    {
                        switch ($.type)
                        {
                            case 'checkbox':
                                target[$.dataset.bind] = $.checked
                                break
                                
                            default:
                                target[$.dataset.bind] = $.value
                                break
                        }
                    }
                })
            }
            else
            {
                target.queryAll(`[data-bind]`).forEach($ =>
                {
                    if (this instanceof Storage)
                    {
                        switch ($.type)
                        {
                            case 'checkbox':
                                $.checked = this.getItem($.dataset.bind) == "true"
                                break
                            
                            default:
                                $.value = this.getItem($.dataset.bind)
                                break
                        }
                    }
                    else
                    {
                        switch ($.type)
                        {
                            case 'checkbox':
                                $.checked = this[$.dataset.bind]
                                break
                                
                            default:
                                $.value = this[$.dataset.bind]
                                break
                        }
                    }
                })
            }
            return this
        }
    },
    delay:
    {
        value: function(ms)
        {
            return new Promise(x => setTimeout(x, ms))
        }
    },
    stopTimeout:
    {
        value: function(handle)
        {
            if (!window.mangagedTimeouts)
                return
            
            if (window.mangagedTimeouts[handle])
            {
                clearTimeout(window.mangagedTimeouts[handle])
                delete window.mangagedTimeouts[handle]
            }
        }
    },
    startTimeout:
    {
        value: function(handle, callback, ms)
        {
            stopTimeout(handle)
            
            window.mangagedTimeouts ??= { }
            
            window.mangagedTimeouts[handle] = setTimeout(() =>
            {
                delete window.mangagedTimeouts[handle]
                callback()
            }, ms)
        }
    }
})



class App
{
    static instance
    
    pages = { }
    dialogs = { }
    
    constructor()
    {
        for (const page of [
            new HomePage,
            new CharactersPage,
            new ChatPage,
            new ImageGeneratorPage,
        ])
        {
            this.pages[page.name] = page
        }
        
        for (const dialog of [
            new MessageDialog,
            new SettingsDialog,
        ])
        {
            this.dialogs[dialog.name] = dialog
        }
    }
    
    async mainAsync()
    {
        this.updateStyle()
        
        queryAll(`[data-page], .loader`).forEach(x =>
        {
            x.addClass(`display-none`)
        })
        
        queryAll(`.overlay`).forEach(x =>
        {
            x.addClass(`hidden`)
        })
        
        queryAll(`[data-action]`).forEach(x =>
        {
            x.onClick(async $sender =>
            {
                const _action = $sender.dataset.action
                
                if (this.closeAllMenus())
                {
                    if (_action == `gotoPageAsync`)
                    {
                        disableInput()
                        await delay(200)
                    }
                }
                
                var actions = _action.split(`.`)
                
                let action = this
                let _this = this
                
                while (actions.length > 0)
                {
                    _this = action
                    action = action[actions.shift()]
                }
                
                action.call(_this, $sender)
            })
        })
        
        this.closeAllMenus($overlay =>
        {
            $overlay.onClick($sender =>
            {
                if ($sender != $overlay)
                    return
                
                this.closeAllMenus()
            })
        })
        
        this.closeAllDialogs($overlay =>
        {
            $overlay.onClick($sender =>
            {
                if ($sender != $overlay)
                    return
                
                this.closeAllDialogs()
            })
        })
        
        $body.removeClass(`display-none`)
        
        if (route.page == `chat`)
        {
            if (!route.id)
            {
                await this.gotoPageAsync(`home`)
                return
            }
            
            this.startLoading()
            
            this.useCache = true
            const characters = await App.instance.fetchCharactersAsync()
            delete this.useCache
            
            for (const key in characters)
            {
                const characterGroup = characters[key]
                
                for (const character of characterGroup)
                {
                    if (!character)
                        continue
                    
                    if (character.id != route.id)
                        continue
                    
                    this.pages.chat.character = character
                    break
                }
                
                if (this.pages.chat.character)
                    break
            }
            
            if (!this.pages.chat.character)
            {
                await this.gotoPageAsync(`home`)
                return
            }
            
            await this.gotoPageAsync(`chat`, this.pages.chat.character.id)
            return
        }
        
        await this.gotoPageAsync(route.page)
    }
    
    closeAllMenus(onProcessOverlay)
    {
        let result = false
        
        for (const name in this.pages)
        {
            const page = this.pages[name]
            
            if (page.$menu && !page.$menu.hasClass(`hidden`))
            {
                result = true
                page.$menu.addClass(`hidden`)
            }
            
            if (page.$menuOverlay)
            {
                page.$menuOverlay.addClass(`hidden`)
                if (onProcessOverlay)
                    onProcessOverlay(page.$menuOverlay)
            }
        }
        
        return result
    }
    
    closeAllDialogs(onProcessOverlay)
    {
        queryAll(`[data-dialog]`).forEach(x =>
        {
            x.addClass(`hidden`)
            
            const $prev = x.previousElementSibling
            if ($prev.hasClass(`overlay`))
            {
                $prev.addClass(`hidden`)
                if (onProcessOverlay)
                    onProcessOverlay($prev)
            }
        })
    }
    
    openDialog(sender, userData)
    {
        this.closeAllDialogs()
        
        const dialog = typeof sender == `string`
            ? sender
            : sender.dataset.target
        
        const $dialog = query(`[data-dialog="${dialog}"]`)
        $dialog.removeClass(`hidden`)
        
        const $prev = $dialog.previousElementSibling
        if ($prev.hasClass(`overlay`))
            $prev.removeClass(`hidden`)
        
        if (this.dialogs[dialog].onOpen)
            this.dialogs[dialog].onOpen(userData)
    }
    
    async gotoPageAsync(sender, id)
    {
        const page = typeof sender == `string`
            ? sender
            : sender.dataset.target
        
        route = { page: page, id: id }
        
        this.startLoading()
        
        const $pages = queryAll(`[data-page]`)
        
        for (const $page of $pages)
        {
            if ($page.hasClass(`display-none`))
                continue
            
            const currentPage = this.pages[$page.dataset.page]
            
            if (currentPage.$bottombar)
                currentPage.$bottombar.addClass(`hidden`)
            
            await $page.transitionAsync({
                duration: 200,
                from: { opacity: 1, translate: `0 0` },
                to: { opacity: 0, translate: `0 30px` }
            })
            
            $page.addClass(`display-none`)
            
            if (currentPage.onUnloadAsync)
                await currentPage.onUnloadAsync()
        }
        
        const nextPage = this.pages[page]
        if (nextPage.onLoadAsync)
            await nextPage.onLoadAsync()
        
        const $page = query(`[data-page="${page}"]`)
        
        $page.removeClass(`display-none`)
        
        if (!nextPage.onPostLoadAsync)
            this.stopLoading()
        
        await $page.transitionAsync({
            duration: 200,
            from: { opacity: 0, translate: `0 -30px` },
            to: { opacity: 1, translate: `0 0` }
        })
        
        if (nextPage.$bottombar)
            nextPage.$bottombar.removeClass(`hidden`)
        
        if (nextPage.onPostLoadAsync)
        {
            await nextPage.onPostLoadAsync()
            this.stopLoading()
        }
        
    }
    
    isLoading()
    {
        return !$loader.hasClass(`display-none`)
    }
    
    startLoading()
    {
        disableInput()
        
        $body.addClass(`loading`)
        
        startTimeout(`loader`, () => $loader.removeClass(`display-none`), 500)
    }
    
    stopLoading()
    {
        stopTimeout(`loader`)
        
        $loader.addClass(`display-none`)
        enableInput()
        
        $body.removeClass(`loading`)
    }
    
    updateStyle()
    {
        const hideImageId = `hide-images-style`
        const $hideImage = document.getElementById(`hide-images-style`)
        
        if (localStorage.getItem('hideImages') != "true")
        {
            if (!$hideImage)
                return
            
            $head.removeChild($hideImage)
            return
        }
        
        if ($hideImage)
            return
        
        const style = $head.create(`style`)
        style.id = hideImageId;
        style.innerHTML = `[style]:not(.no-background-image) {
            background-size: unset !important;
            background-image: url(res/checkers.svg) !important;
        }`
    }
    
    async fetchCharactersAsync()
    {
        let error = false
        
        
        
        const characters = await fetchAsync(`/api/characters?cache=${this.useCache ?? location.hostname == `localhost`}`)
            .then(x => x.json())
            .catch(() => error = true)
        
        if (error)
        {
            delete this.useCache
            await this.gotoPageAsync(`home`)
            return null
        }
        
        this.useCache = true
        
        return characters
    }
}



class AppNode
{
    get selector()
    {
        return `[data-${this.typeName}="${this.name}"]`
    }
    
    get $()
    {
        return query(this.selector)
    }
}



class Page extends AppNode
{
    get typeName()
    {
        return `page`
    }
    
    constructor()
    {
        super()
        
        this.$bottombar = this.$.query(`.bottombar`)
        if (!this.$bottombar)
            return
        
        this.$menu = this.$bottombar.query(`.menu`)
        const $prev = this.$menu.previousElementSibling
        if ($prev.hasClass(`overlay`))
            this.$menuOverlay = $prev
        
        const $next = this.$.nextElementSibling
        if ($next)
            $main.insertBefore(this.$bottombar, $next)
        else
            $main.appendChild(this.$bottombar)
        
        this.$bottombar.addClass(`hidden`)
    }
    
    openMenu()
    {
        App.instance.closeAllMenus()
        
        this.$menu.removeClass(`hidden`)
        
        if (this.$menuOverlay)
            this.$menuOverlay.removeClass(`hidden`)
    }
}

class HomePage extends Page
{
    get name()
    {
        return `home`
    }
}

class CharactersPage extends Page
{
    get name()
    {
        return `characters`
    }
    
    constructor()
    {
        super()
        
        this.$characters = this.$.query(`.characters`)
        
        this.$sectionTemplate = this.$characters.query(`.section`)
        this.$characterTemplate = this.$sectionTemplate.query(`.content > div`)
        
        this.$sectionTemplate.remove()
        this.$characterTemplate.remove()
        
        this.$search = this.$bottombar.query(`[data-bind="search"]`)
        this.$search.on(`input`, () => this.#refreshSearchResults())
    }
    
    async onLoadAsync()
    {
        this.$characters.clearHtml()
        
        const characters = await App.instance.fetchCharactersAsync()
        
        this.#addCharacter(characters, `recent`, `Recent Characters`)
        this.#addCharacter(characters, `private`, `Private Characters`)
        this.#addCharacter(characters, `public`, `Public Characters`)
        
        this.#refreshSearchResults(true)
    }
    
    async onPostLoadAsync()
    {
        enableInput()
        
        this.$search.focus()
    }
    
    #addCharacter(characters, key, title)
    {
        if (!characters[key]?.length)
            return
        
        const $section = this.$sectionTemplate.clone().removeClass(`display-none`)
        $section.query(`.title`).setHtml(title)
        
        const $content = $section.query(`.content`)
        
        for (const character of characters[key])
        {
            const $character = this.$characterTemplate.clone().onClick(async () =>
            {
                App.instance.pages.chat.character = character
                await App.instance.gotoPageAsync(`chat`, character.id)
            })
            
            $character.query(`.thumbnail`).setBackgroundImage(character.thumbnail)
            $character.query(`.name`).setHtml(character.name)
            $character.query(`.description`).setHtml(character.descriptionTranslated || character.description)
            
            $content.add($character)
        }
        
        this.$characters.add($section)
    }
    
    #refreshSearchResults(immediately)
    {
        const callback = () =>
        {
            this.$characters.queryAll(`.character`).forEach($ =>
            {
                const search = this.$search.value.toLowerCase().trim()
                const name = $.query(`.name`).innerText.toLowerCase()
                const description = $.query(`.description`).innerText.toLowerCase()
                const hidden = name.indexOf(search) == -1 && description.indexOf(search) == -1
                $.toggleClass(`display-none`, hidden)
                $.toggleClass(`important`, hidden)
            })
        }
        
        if (immediately)
        {
            callback()
            return
        }
        
        startTimeout(`search`, callback, 500)
    }
}

class ChatPage extends Page
{
    get name()
    {
        return `chat`
    }
    
    constructor()
    {
        super()
        
        this.$persona = this.$.query(`.persona`)
        this.$messages = this.$.query(`.messages`)
        
        this.$messageTemplate = this.$messages.query(`.message`)
        this.$messageTemplate.remove()
        
        this.$loader = this.$.query(`.loader`)
        
        this.$sendMessageButton = this.$bottombar.query(`[data-action="pages.chat.sendMessageAsync"]`)
    }
    
    async onUnloadAsync()
    {
        this.$message.clearEventListeners()
    }
    
    async onLoadAsync()
    {
        App.instance.stopLoading()
        
        disableInput()
        this.$messages.clearHtml()
        
        this.$persona.query(`.background`).setBackgroundImage(``)
        this.$persona.query(`.name`).setHtml(``)
        this.$persona.query(`.description`).setHtml(``)
    }
    
    async onPostLoadAsync()
    {
        await this.refreshAsync({ scrollDown: true })
        
        enableInput()
        
        this.$message.focus()
    }
    
    async refreshChatAsync()
    {
        disableInput()
        this.$messages.clearHtml()
        
        await this.refreshAsync({ scrollDown: true, cache: false, translate: true })
        
        enableInput()
        
        this.$message.focus()
    }
    
    async refreshAsync(options)
    {
        options ??= { }
        
        const scrollDown = options.getAndDelete(`scrollDown`, false)
        
        if (!App.instance.isLoading())
            this.$loader.removeClass(`display-none`)
        
        this.$message = this.$bottombar.query(`[data-bind="message"]`)
            .on(`input`, this.refreshSendMessageButton.bind(this))
            .on(`keydown`, this.onKeyDown.bind(this))
        
        this.refreshSendMessageButton()
        
        this.$persona.query(`.background`).setBackgroundImage(this.character.thumbnail)
        this.$persona.query(`.name`).setHtml(this.character.name)
        this.$persona.query(`.description`).setHtml(this.character.personaTranslated || this.character.persona)
        
        if (scrollDown)
            this.scrollDown()
        
        const url = `/api/characters/${this.character.id}/messages${options.toQueryString()}`
        const messages = await fetchAsync(url).then(x => x.json())
        
        this.$messages.clearHtml()
        
        const showOriginalMessage = localStorage.getItem(`show-original-messages`) == `true`
        
        for (const message of messages)
        {
            const isYou = message.role == `You`
            const image = message.image
            
            const name = isYou ? `You` : this.character.name.split(`:`).pop().trim()
            
            let text = message.contentTranslated || message.content
            text = text.replaceAll(/\*(.*?)\*/g, (m, g) => `<span class="topic">*${g}*</span>`)
            
            const $message = this.$messageTemplate
                .clone()
                .addClass(isYou ? `you` : `bot`)
            
            $message.query(`.avatar`).setBackgroundImage(this.character.thumbnail).parentNode.removeIf(isYou)
            $message.query(`.name`).setHtml(name)
            $message.query(`.text`).setHtml(text)
            $message.query(`.original`).setHtml(message.content).removeIf(!showOriginalMessage || !message.contentTranslated)
            $message.query(`.image`).setBackgroundImage(image).parentNode.removeIf(!image)
            
            $message.onClick(() =>
            {
                if (App.instance.isLoading())
                    return
                
                if (!this.$loader.hasClass(`display-none`))
                    return
                
                App.instance.openDialog(`message`, {
                    character: this.character,
                    message: message
                })
            })
            
            this.$messages.add($message)
        }
        
        if (!App.instance.isLoading())
            this.$loader.addClass(`display-none`)
        
        if (scrollDown)
            this.scrollDown()
    }
    
    async clearChatAsync()
    {
        disableInput()
        this.$messages.clearHtml()
        await fetchAsync(`/api/characters/${this.character.id}/messages/clear`)
        await this.refreshAsync({ scrollDown: true, cache: false, translate: true })
        enableInput()
        
        this.$message.focus()
    }
    
    scrollDown()
    {
        scrollTo({ top: $body.scrollHeight })
    }
    
    onKeyDown(sender, e)
    {
        if (e.keyCode != 13)
            return
        
        e.stopPropagation()
        
        this.$sendMessageButton.click()
    }
    
    refreshSendMessageButton()
    {
        this.$sendMessageButton.setHtml(this.$message.value ? `Send` : `Receive`)
    }
    
    async sendMessageAsync()
    {
        disableInput()
        this.$loader.removeClass(`display-none`)
        
        this.scrollDown()
        
        const body = this.$message.value
        const autoGenerate = body && localStorage.getItem('autoGenerate') == "true"
        
        if (body)
        {
            await fetchAsync(`/api/characters/${this.character.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: body
            })
        }
        else
        {
            await fetchAsync(`/api/characters/${this.character.id}/messages/generate`)
        }
        
        await this.refreshAsync({ scrollDown: true, cache: false })
        
        this.$message.value = ``
        this.refreshSendMessageButton()
        
        if (autoGenerate)
        {
            await this.sendMessageAsync()
            return
        }
        
        enableInput()
        
        this.$message.focus()
    }
}

class ImageGeneratorPage extends Page
{
    get name()
    {
        return `imageGenerator`
    }
    
    constructor()
    {
        super()
        
        this.$content = this.$.query(`.content`)
        this.$history = this.$content.query(`.history`)
        this.$historyContent = this.$history.query(`.content`)
        this.$image = this.$content.query(`.image`)
    }
    
    async onLoadAsync()
    {
        await this.refreshAsync()
        
        this.loadImage(this.firstImage)
    }
    
    async refreshAsync()
    {
        this.$image.setBackgroundImage(``)
        
        this.imageId = null
        this.isRealistic = false
        this.prompt = ``
        this.transferTo(this.$content)
        
        this.$historyContent.clearHtml()
        
        const images = await fetchAsync(`/api/images`).then(x => x.json())
        
        this.firstImage = null
        
        for (const image of images)
        {
            this.firstImage ??= image
            
            const $item = this.$historyContent.create(`div`)
            $item.dataset.id = image.id
            $item.setBackgroundImage(image.url)
            
            $item.onClick(() =>
            {
                if (App.instance.isLoading())
                    return
                
                this.loadImage(image)
            })
        }
    }
    
    loadImage(image)
    {
        for (const $ of this.$historyContent.children)
            $.toggleClass(`active`, $.dataset.id == image.id)
        
        this.$image.setBackgroundImage(image.url)
        
        this.imageId = image.id
        this.isRealistic = image.request.isRealistic
        this.prompt = image.request.prompt
        this.transferTo(this.$content)
    }
    
    async generateAsync()
    {
        App.instance.startLoading()
        
        this.$content.transferTo(this)
        
        let options = { }
        options.headers = { }
        options.headers['X-Prompt'] = this.prompt
            .replaceAll(`\n`, ` `)
            .replaceAll(`  `, ` `)
        
        this.$image.setBackgroundImage(``)
        
        let error = false
        const query = { realistic: this.isRealistic }
        await fetchAsync(`/api/generate-image${query.toQueryString()}`, options)
            .catch(e => error = e)
        
        if (error)
        {
            await App.instance.gotoPageAsync(`home`)
            return
        }
        
        await this.refreshAsync()
        
        App.instance.stopLoading()
        
        this.loadImage(this.firstImage)
    }
    
    async deleteAsync()
    {
        App.instance.startLoading()
        
        let error = false
        const query = { delete: true }
        await fetchAsync(`/api/images/${this.imageId}${query.toQueryString()}`)
            .catch(() => error = true)
        
        if (error)
        {
            await App.instance.gotoPageAsync(`home`)
            return
        }
        
        await this.refreshAsync()
        
        App.instance.stopLoading()
    }
}



class Dialog extends AppNode
{
    get typeName()
    {
        return `dialog`
    }
    
    constructor()
    {
        super()
        
        this.$content = this.$.query(`.content`)
    }
    
    cancel()
    {
        App.instance.closeAllDialogs()
    }
}

class MessageDialog extends Dialog
{
    get name()
    {
        return `message`
    }
    
    onOpen(userData)
    {
        this.characterId = userData.character.id
        this.messageId = userData.message.id
        this.messageIndex = userData.message.index
        this.imagePrompt = ``
        this.content = userData.message.content
        
        this.transferTo(this.$content)
        
        const $image = this.$content.query(`.image`)
        
        $image.toggleClass(`empty`, !userData.message.image)
        $image.setBackgroundImage(userData.message.image ? userData.message.image : ``)
    }
    
    async applyAsync(task)
    {
        this.cancel()
        App.instance.startLoading()
        await task()
        await App.instance.pages.chat.refreshAsync({ cache: false, translate: true })
        App.instance.stopLoading()
    }
    
    async generateMessage()
    {
        const url = `/api/characters/${this.characterId}/messages/generate/${this.messageIndex}`
        await this.applyAsync(async () => await fetchAsync(url))
    }
    
    async generateImageAsync()
    {
        this.$content.transferTo(this)
        
        let options = undefined
        
        if (this.imagePrompt)
        {
            options = { }
            options.headers = { }
            options.headers['X-Prompt'] = this.imagePrompt
        }
        
        const url = `/api/characters/${this.characterId}/messages/generate-image/${this.messageIndex}`
        await this.applyAsync(async () => await fetchAsync(url, options))
    }
    
    async deleteImageAsync()
    {
        const url = `/api/characters/${this.characterId}/messages/delete-image/${this.messageIndex}`
        await this.applyAsync(async () => await fetchAsync(url))
    }
    
    async saveAsync()
    {
        this.$content.transferTo(this)
        
        const url = `/api/characters/${this.characterId}/messages/${this.messageIndex}`
        await this.applyAsync(
            async () => await fetchAsync(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: this.content
            })
        )
    }
    
    async deleteAsync()
    {
        const url = `/api/characters/${this.characterId}/messages/delete/${this.messageIndex}`
        await this.applyAsync(async () => await fetchAsync(url))
    }
}

class SettingsDialog extends Dialog
{
    get name()
    {
        return `settings`
    }
    
    constructor()
    {
        super()
        
        this.$language = this.$.query(`[data-bind="language"]`)
        this.$language.on(`change`, () => this.updateLayout())
        
        this.$translationClient = this.$.query(`[data-bind="translationClient"]`)
        this.$translationClient.on(`change`, () => this.updateLayout())
    }
    
    onOpen()
    {
        localStorage.transferTo(this.$content)
        
        this.updateLayout();
    }
    
    updateLayout()
    {
        if (this.$language.value == "EN")
        {
            this.$translationClient.parentNode.forceShow(false)
            this.$.query(`[data-bind="deeplAuthKey"]`).parentNode.forceShow(false)
            this.$.query(`[data-bind="libreTranslateUrl"]`).parentNode.forceShow(false)
            return
        }
        
        this.$translationClient.parentNode.forceShow(true)
        
        this.$
            .query(`[data-bind="deeplAuthKey"]`)
            .parentNode
            .forceShow(this.$translationClient.value == "DeepL")
        
        this.$
            .query(`[data-bind="libreTranslateUrl"]`)
            .parentNode
            .forceShow(this.$translationClient.value == "LibreTranslate")
    }
    
    async parseTokensFromClipboardAsync()
    {
        const permission = await navigator.permissions.query({ name: "clipboard-read" })
        if (permission.state == "denied")
            return
        
        const json = await navigator.clipboard.readText()
        const cookies = JSON.parse(json)
        
        for (const cookie of cookies)
        {
            if (cookie.name == '__Host-next-auth.csrf-token')
                this.$content.query(`[data-bind="csrfToken"]`).value = cookie.value
            
            if (cookie.name == '__Secure-next-auth.session-token')
                this.$content.query(`[data-bind="sessionToken"]`).value = cookie.value
        }
    }
    
    save($sender)
    {
        this.$content.transferTo(localStorage)
        this.cancel()
        
        App.instance.updateStyle()
    }
}



App.instance = new App
App.instance.mainAsync()
