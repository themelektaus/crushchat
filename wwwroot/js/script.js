/* script.js */



(function()
{
    const items = {
        language: "EN",
        autoGenerate: "true",
        showOriginalMessages: "false",
        blurImages: "false",
        hideImages: "false",
        csrfToken: "",
        sessionToken: "",
        translationClient: "",
        deeplAuthKey: "",
        deeplBlockSize: 10,
        libreTranslateUrl: ""
    }
    
    for (const key in items)
        if (localStorage.getItem(key) === null)
            localStorage.setItem(key, items[key])
})()



let cssRootDefault =
[
    {
        category: "Body",
        values: [
            {
                name: "Text",
                type: "color",
                key: "--body__text-color",
                value: "#FFFFFF"
            },
            {
                name: "Background",
                type: "color",
                key: "--body__background-color",
                value: "#160711"
            }
        ]
    },
    {
        category: "Main",
        values: [
            {
                name: "Background",
                type: "color",
                key: "--main__background-color",
                value: "#000000",
                alpha: 0.0
            }
        ]
    },
    {
        category: "Button",
        values: [
            {
                name: "Text",
                type: "color",
                key: "--button__text-color",
                value: "#FFFFFF"
            },
            {
                name: "Text (Hover)",
                type: "color",
                key: "--button__text-color__hover",
                value: "#FFFFFF"
            },
            {
                name: "Text (Active)",
                type: "color",
                key: "--button__text-color__active",
                value: "#FFFFFF"
            },
            {
                name: "Background",
                type: "color",
                key: "--button__background-color",
                value: "#440022"
            },
            {
                name: "Background (Hover)",
                type: "color",
                key: "--button__background-color__hover",
                value: "#440022"
            },
            {
                name: "Background (Active)",
                type: "color",
                key: "--button__background-color__active",
                value: "#7F154D"
            },
            {
                name: "Border",
                type: "color",
                key: "--button__border-color",
                value: "#440022"
            },
            {
                name: "Border (Hover)",
                type: "color",
                key: "--button__border-color__hover",
                value: "#FF3399"
            },
            {
                name: "Border (Active)",
                type: "color",
                key: "--button__border-color__active",
                value: "#FF3399"
            }
        ]
    },
    {
        category: "Menu Item",
        values: [
            {
                name: "Background",
                type: "color",
                key: "--menu-item__background-color",
                value: "#440022"
            },
            {
                name: "Background (Hover)",
                type: "color",
                key: "--menu-item__background-color__hover",
                value: "#551133"
            }
        ]
    },
    {
        category: "Input",
        values: [
            {
                name: "Text",
                type: "color",
                key: "--input__text-color",
                value: "#FFFFFF"
            },
            {
                name: "Text (Hover)",
                type: "color",
                key: "--input__text-color__placeholder",
                value: "#995577"
            },
            {
                name: "Background",
                type: "color",
                key: "--input__background-color",
                value: "#090009"
            },
            {
                name: "Background (Hover)",
                type: "color",
                key: "--input__background-color__hover",
                value: "#090009"
            },
            {
                name: "Background (Focus)",
                type: "color",
                key: "--input__background-color__focus",
                value: "#090009"
            },
            {
                name: "Border",
                type: "color",
                key: "--input__border-color",
                value: "#660033"
            },
            {
                name: "Border (Hover)",
                type: "color",
                key: "--input__border-color__hover",
                value: "#FF3399"
            },
            {
                name: "Border (Focus)",
                type: "color",
                key: "--input__border-color__focus",
                value: "#FF3399"
            }
        ]
    },
    {
        category: "Textarea",
        values: [
            {
                name: "Background",
                type: "color",
                key: "--textarea__background-color",
                value: "#000000",
                alpha: 0.25
            },
            {
                name: "Background (Focus)",
                type: "color",
                key: "--textarea__background-color__focus",
                value: "#000000",
                alpha: 0.45
            }
        ]
    },
    {
        category: "Character",
        values: [
            {
                name: "Background (Hover)",
                type: "color",
                key: "--character__background-color__hover",
                value: "#330033"
            },
            {
                name: "Border (Hover)",
                type: "color",
                key: "--character__border-color__hover",
                value: "#8B008B"
            }
        ]
    },
    {
        category: "Message",
        values: [
            {
                name: "Background (You)",
                type: "color",
                key: "--message__background-color__you",
                value: "#000000",
                alpha: 0.5
            },
            {
                name: "Background (Bot)",
                type: "color",
                key: "--message__background-color__bot",
                value: "#000000",
                alpha: 0
            }
        ]
    },
    {
        category: "Message Topic",
        values: [
            {
                name: "Text (You)",
                type: "color",
                key: "--message-topic__text-color__you",
                value: "#DD99BB",
                alpha: 0.8
            },
            {
                name: "Background (You)",
                type: "color",
                key: "--message-topic__background-color__you",
                value: "#666666",
                alpha: 0.08
            },
            {
                name: "Text (Bot)",
                type: "color",
                key: "--message-topic__text-color__bot",
                value: "#F79ABB",
                alpha: 0.85
            },
            {
                name: "Background (Bot)",
                type: "color",
                key: "--message-topic__background-color__bot",
                value: "#2A0D22",
                alpha: 0.6
            }
        ]
    },
    {
        category: "Message Original",
        values: [
            {
                name: "Text",
                type: "color",
                key: "--message-original__text-color",
                value: "#FF99FF",
                alpha: 0.4
            }
        ]
    },
    {
        category: "Overlay",
        values: [
            {
                name: "Background",
                type: "color",
                key: "--overlay__background-color",
                value: "#000000",
                alpha: 0.6
            }
        ]
    },
    {
        category: "Dialog",
        values: [
            {
                name: "Background",
                type: "color",
                key: "--dialog__background-color",
                value: "#12020d"
            },
            {
                name: "Border",
                type: "color",
                key: "--dialog__border-color",
                value: "#662244",
                alpha: 0.6
            },
            {
                name: "Border (Empty Image)",
                type: "color",
                key: "--dialog__border-color__empty-image",
                value: "#FFFFFF",
                alpha: 0.1325
            }
        ]
    }
]



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
    isMobile:
    {
        value: () =>
        {
            return navigator.userAgentData.mobile
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
            h['X-LibreTranslate-URL'] = localStorage.getItem('libreTranslateUrl')
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
            const disabled = !(enabled ?? true)
            
            queryAll(`input, button, textarea, select`).forEach(x => x.disabled = disabled)
            queryAll(`.overlay, .clickable`).forEach(x => x.toggleClass(`disabled`, disabled))
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

Object.defineProperties(String.prototype,
{
    fromJson:
    {
        value: function()
        {
            return JSON.parse(this)
        }
    },
})

Object.defineProperties(Array.prototype,
{
    findOrPush:
    {
        value: function(predicate, create)
        {
            let item = this.find(predicate)
            if (!item)
            {
                item = create()
                this.push(item)
            }
            return item
        }
    }
})

Object.defineProperties(Object.prototype,
{
    toJson:
    {
        value: function()
        {
            return JSON.stringify(this)
        }
    },
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
                    if ($.tagName == 'UL')
                    {   
                        target[$.dataset.bind] = []
                        
                        $.queryAll(`li`).forEach($li =>
                        {
                            if ($li == $.firstElementChild  || $li == $.lastElementChild )
                                return
                            
                            const value = { }
                            $li.transferToInternal(value, `property`)
                            target[$.dataset.bind].push(value)
                        })
                    }
                    else
                    {
                        this.transferToInternal(target, `bind`)
                    }
                })
            }
            else
            {
                target.queryAll(`[data-bind]`).forEach($ =>
                {
                    if ($.tagName == 'UL')
                    {
                        const $template = $.query(`li`).addClass(`display-none`).addClass(`important`)
                        
                        $.queryAll(`li`).forEach($li =>
                        {
                            if ($li == $template)
                                return
                            
                            $.removeChild($li)
                        })
                        
                        for (const value of this[$.dataset.bind])
                        {
                            const $li = $template.clone().removeClass(`display-none`).removeClass(`important`)
                            $.appendChild($li)
                            value.transferToInternal($li, `property`)
                            $li.create(`button`).addClass(`remove`).onClick(() => $.removeChild($li))
                        }
                        
                        $.create(`li`).create(`button`).setHtml(`Add Item`).onClick(() =>
                        {
                            const $li = $template.clone().removeClass(`display-none`).removeClass(`important`)
                            $.insertBefore($li, $.lastChild)
                            $li.create(`button`).addClass(`remove`).onClick(() => $.removeChild($li))
                        })
                    }
                    else
                    {
                        this.transferToInternal(target, `bind`)
                    }
                })
            }
            return this
        }
    },
    transferToInternal:
    {
        value: function(target, key)
        {
            if (this instanceof EventTarget)
            {
                this.queryAll(`[data-${key}]`).forEach($ =>
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
                        localStorage.setItem($.dataset[key], value)
                    }
                    else
                    {
                        switch ($.type)
                        {
                            case 'checkbox':
                                target[$.dataset[key]] = $.checked
                                break
                                
                            default:
                                target[$.dataset[key]] = $.value
                                break
                        }
                    }
                })
            }
            else
            {
                target.queryAll(`[data-${key}]`).forEach($ =>
                {
                    if (this instanceof Storage)
                    {
                        switch ($.type)
                        {
                            case 'checkbox':
                                $.checked = this.getItem($.dataset[key]) == "true"
                                break
                            
                            default:
                                $.value = this.getItem($.dataset[key])
                                break
                        }
                    }
                    else
                    {
                        switch ($.type)
                        {
                            case 'checkbox':
                                $.checked = this[$.dataset[key]]
                                break
                            
                            default:
                                $.value = this[$.dataset[key]]
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
    },
    clone:
    {
        value: function()
        {
            if (this instanceof Node)
                return this.cloneNode(true)
            
            return JSON.parse(JSON.stringify(this))
        }
    },
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
            new CharacterDialog,
            new MessageDialog,
            new SettingsDialog,
            new AppearanceDialog,
        ])
        {
            this.dialogs[dialog.name] = dialog
        }
    }
    
    async mainAsync()
    {
        if (!localStorage.getItem(`appearance`))
            localStorage.setItem(`appearance`, `[]`)
        this.cssRoot = localStorage.getItem(`appearance`).fromJson()
        this.applyCssRoot()
        
        this.updateStyle()
        
        queryAll(`.ripple`).forEach($ =>
        {
            const lastChild = $.lastChild
            if (lastChild instanceof Text)
            {
                const $div = $.create(`div`)
                $.insertBefore($div, $.firstChild)
                
                const text = lastChild.textContent
                $.removeChild(lastChild)
                
                const $span = $.create(`span`)
                $span.style.position = `relative`
                $span.style.pointerEvents = `none`
                $span.innerText = text.trim()
                $.appendChild($span)
            }
        })
        
        on(`mousedown`, ($, e) =>    
        {
            if (!$.hasClass(`ripple`))
                return
            
            const $ripple = create(`div`).addClass(`ripple`)
            $ripple.style.left = `${e.offsetX}px`
            $ripple.style.top = `${e.offsetY}px`
            $.insertBefore($ripple, $.firstChild)
            
            $ripple.offsetHeight
            $ripple.addClass(`execute`)
            
            setTimeout(() => $.removeChild($ripple), 500)
        })
        
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
                
                if ($sender.hasClass(`disabled`))
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
                
                if ($sender.hasClass(`disabled`))
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
    
    async openDialogAsync(sender, userData)
    {
        disableInput()
        
        this.closeAllDialogs()
        
        const dialog = typeof sender == `string`
            ? sender
            : sender.dataset.target
        
        const $dialog = query(`[data-dialog="${dialog}"]`)
        $dialog.removeClass(`hidden`)
        
        const $prev = $dialog.previousElementSibling
        if ($prev.hasClass(`overlay`))
            $prev.removeClass(`hidden`)
        
        if (this.dialogs[dialog].onOpenAsync)
            await this.dialogs[dialog].onOpenAsync(userData)
        
        enableInput()
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
    
    applyCssRoot()
    {
        const set = (key, value) => document.documentElement.style.setProperty(key, value)
        
        for (const sectionDefault of cssRootDefault)
        {
            const section = this.cssRoot.findOrPush(
                x => x.category == sectionDefault.category,
                () =>
                {
                    const x = sectionDefault.clone()
                    return { category: x.category, values: [] }
                }
            )
            
            for (const valueDefault of sectionDefault.values)
            {
                let value = section.values.findOrPush(
                    x => x.key == valueDefault.key,
                    () => valueDefault.clone()
                )
                
                let _value = value.value
                if (value.alpha !== undefined)
                {
                    let alpha = Math.round(value.alpha * 255).toString(16).toUpperCase()
                    while (alpha.length < 2)
                        alpha = `0${alpha}`
                    _value += alpha
                }
                set(value.key, _value);
            }
        }
        
        const body = this.cssRoot.find(x => x.category == `Body`)
        const backgroundColor = body.values.find(x => x.key == `--body__background-color`)
        
        set(`--bottombar__background-color__start`, `${backgroundColor.value}ff`)
        set(`--bottombar__background-color__end`, `${backgroundColor.value}00`)
        
        localStorage.setItem(`appearance`, this.cssRoot.toJson())
    }
    
    updateStyle()
    {
        const _updateStyle = (key, id, style) =>
        {
            const $image = document.getElementById(id)
            
            if (localStorage.getItem(key) != "true")
            {
                if (!$image)
                    return
                
                $head.removeChild($image)
                return
            }
            
            if ($image)
                return
            
            $head.create(`style`).setHtml(style).id = id
        }
        
        _updateStyle(
            `blurImages`,
            `blur-images-style`,
            `.nsfw-content { filter: blur(18px); }
             .nsfw-content.small { filter: blur(14px); scale: .9; }
             .nsfw-content.tiny { filter: blur(10px); scale: .7; }`
        )
        
        _updateStyle(
            `hideImages`,
            `hide-images-style`,
            `.nsfw-content {
               background-size: unset !important;
               background-image: url(res/checkers.svg) !important;
             }`
        )
    }
    
    async fetchCharactersAsync()
    {
        let error = false
        
        //const cache = this.useCache ?? location.hostname == `localhost`
        const cache = this.useCache
        
        const characters = await fetchAsync(`/api/characters?cache=${cache}`)
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
        
        if (!isMobile())
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
        
        delete this.character
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
        
        if (!isMobile())
            this.$message.focus()
    }
    
    async refreshChatAsync($sender, options)
    {
        disableInput()
        this.$messages.clearHtml()
        
        options ??= { }
        options.scrollDown ??= true
        options.cache ??= false
        options.translate ??= true
        
        await this.refreshAsync(options)
        
        enableInput()
        
        if (!isMobile())
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
        this.$persona.query(`.description`).setHtml(this.character.personaFilteredTranslated || this.character.personaFiltered)
        
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
            
            $message.onClick(async () =>
            {
                if ($message.hasClass(`disabled`))
                    return
                
                await App.instance.openDialogAsync(`message`, {
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
        
        if (!isMobile())
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
            
            const $item = this.$historyContent
                .create(`div`)
                .addClass(`clickable`)
                .addClass(`nsfw-content`)
                .addClass(`tiny`)
            
            $item.dataset.id = image.id
            $item.setBackgroundImage(image.url)
            
            $item.onClick(() =>
            {
                if ($item.hasClass(`disabled`))
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

class CharacterDialog extends Dialog
{
    get name()
    {
        return `character`
    }
    
    constructor()
    {
        super()
        
        this.data = { }
    }
    
    get #chat()
    {
        return App.instance.pages.chat
    }
    
    async onOpenAsync()
    {
        this.data.name = ``
        this.data.description = ``
        this.data.imagePrompt = ``
        this.data.initialMessages = []
        this.data.persona = ``
        this.data.thumbnail = ``
        this.data.memories = []
        
        this.data.transferTo(this.$content)
        
        if (!this.#chat.character)
        {
            this.$.query(`.title`).setHtml(`Create Character`)
            this.$.query(`.field:has([data-bind="memories"])`).addClass(`display-none`).addClass(`important`)
            return
        }
        
        this.$.query(`.title`).setHtml(`Edit Character`)
        this.$.query(`.field:has([data-bind="memories"])`).removeClass(`display-none`).removeClass(`important`)
        
        const url = `/api/characters/${this.#chat.character.id}`
        const character = await fetchAsync(url).then(x => x.json())
        
        this.data.name = character.name
        this.data.description = character.description
        this.data.imagePrompt = character.imagePrompt
        this.data.initialMessages = character.initialMessages.fromJson()
        this.data.persona = character.personaFiltered
        this.data.thumbnail = character.thumbnail
        this.data.memories = character.memories
        
        this.data.transferTo(this.$content)
    }
    
    async saveAsync()
    {
        App.instance.startLoading()
        
        this.$content.transferTo(this.data)
        
        const url = `/api/characters/${this.#chat.character ? `update` : `create`}`
        
        const body = {
            name: this.data.name,
            description: this.data.description,
            persona: this.data.persona,
            imagePrompt: this.data.imagePrompt,
            initialMessages: this.data.initialMessages.toJson(),
            thumbnail: this.data.thumbnail,
            tags: [`Female`],
            isPrivate: true,
            memories: this.data.memories
        }
        
        if (this.#chat.character)
        {
            body.id = this.#chat.character.id
        }
        
        await fetchAsync(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body.toJson()
        })
        
        if (body.id)
            this.#chat.character = await fetchAsync(`/api/characters/${body.id}`).then(x => x.json())
        
        App.instance.stopLoading()
        this.cancel()
        
        if (body.id)
            await this.#chat.refreshChatAsync()
    }
    
    async deleteAsync()
    {
        App.instance.startLoading()
        await fetchAsync(`/api/characters/${this.character.id}/delete`)
        App.instance.stopLoading()
        
        this.cancel()
    }
}

class MessageDialog extends Dialog
{
    get name()
    {
        return `message`
    }
    
    onOpenAsync(userData)
    {
        this.characterId = userData.character.id
        this.messageId = userData.message.id
        this.messageIndex = userData.message.index
        this.imagePrompt = ``
        this.content = userData.message.content
        
        this.transferTo(this.$content)
        
        this.$.query(`[data-bind="imagePrompt"]`).placeholder = userData.character.imagePrompt
        
        const $image = this.$content.query(`.image`)
        
        $image.toggleClass(`empty`, !userData.message.image)
        $image.setBackgroundImage(userData.message.image ? userData.message.image : ``)
        this.$.query(`[data-action="dialogs.message.deleteImageAsync"]`).toggleClass(`display-none`, !userData.message.image)
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
    
    onOpenAsync()
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
        const cookies = json.fromJson()
        
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

class AppearanceDialog extends Dialog
{
    get name()
    {
        return `appearance`
    }
    
    onOpenAsync()
    {
        this.$content.clearHtml()
        
        for (const section of App.instance.cssRoot)
        {
            const $section = this.$content.create(`div`).addClass(`section`)
            $section.create(`div`).addClass(`title`).setHtml(section.category)
            
            const $content = $section.create(`div`).addClass(`grid-content`)
            
            for (const value of section.values)
            {
                const $field = $content.create(`div`).addClass(`field`)
                $field.create(`label`).setHtml(value.name)
                
                const $input = $field.create(`input`)
                $input.type = value.type
                $input.value = value.value
                $input.on(`input`, () =>
                {
                    value.value = $input.value
                    App.instance.applyCssRoot()
                })
                
                const $range = $field.create(`input`)
                $range.type = `range`
                $range.min = 0
                $range.max = 255
                
                if (value.alpha !== undefined)
                {
                    $range.value = Math.round(value.alpha * 255)
                    $range.on(`input`, () =>
                    {
                        value.alpha = $range.value / 255.0
                        App.instance.applyCssRoot()
                    })
                    continue
                }
                
                $range.addClass(`hidden`)
                $range.value = 0
            }
        }
    }
    
    async resetAsync()
    {
        App.instance.cssRoot = []
        App.instance.applyCssRoot()
        
        await this.onOpenAsync()
    }
}



App.instance = new App
App.instance.mainAsync()
