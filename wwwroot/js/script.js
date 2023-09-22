/* script.js */



(function()
{
    const items = {
        language: "EN",
        autoGenerate: "true",
        showOriginalMessages: "true",
        blurImages: "false",
        hideImages: "false",
        csrfToken: "",
        sessionToken: "",
        additionalSecret: "",
        translationClient: "",
        deeplAuthKey: "",
        libreTranslateUrl: "",
        nsfw: "false",
    }
    
    for (const key in items)
        if (localStorage.getItem(key) === null)
            localStorage.setItem(key, items[key])
})()



const hue = localStorage.nsfw == "true" ? 330 : 240
const sat = localStorage.nsfw == "true" ? 0.9 : 0.05

let cssRootDefault =
[
    {
        category: "Body",
        values: [
            {
                name: "Text",
                type: "hsl",
                key: "--body__text-color",
                value: [ 0, 0, 100 ]
            },
            {
                name: "Background",
                type: "hsl",
                key: "--body__background-color",
                value: [ hue, 50 * sat, 10 ]
            },
            {
                name: "Tooltip (Background)",
                type: "hsla",
                key: "--tooltip__background-color",
                value: [ 0, 0, 0, 1 ]
            }
        ]
    },
    {
        category: "Main",
        values: [
            {
                name: "Background",
                type: "hsla",
                key: "--main__background-color",
                value: [ 0, 0, 0, 0 ]
            }
        ]
    },
    {
        category: "Button",
        values: [
            {
                name: "Text",
                type: "hsl",
                key: "--button__text-color",
                value: [ 0, 0, 100 ]
            },
            {
                name: "Text (Hover)",
                type: "hsl",
                key: "--button__text-color__hover",
                value: [ 0, 0, 100 ]
            },
            {
                name: "Text (Active)",
                type: "hsl",
                key: "--button__text-color__active",
                value: [ 0, 0, 100 ]
            },
            {
                name: "Background",
                type: "hsl",
                key: "--button__background-color",
                value: [ hue, 100 * sat, 15 ]
            },
            {
                name: "Background (Hover)",
                type: "hsl",
                key: "--button__background-color__hover",
                value: [ hue, 100 * sat, 20 ]
            },
            {
                name: "Background (Active)",
                type: "hsl",
                key: "--button__background-color__active",
                value: [ hue, 100 * sat, 30 ]
            },
            {
                name: "Border",
                type: "hsl",
                key: "--button__border-color",
                value: [ hue, 100 * sat, 15 ]
            },
            {
                name: "Border (Hover)",
                type: "hsl",
                key: "--button__border-color__hover",
                value: [ hue, 100 * sat, 60 ]
            },
            {
                name: "Border (Active)",
                type: "hsl",
                key: "--button__border-color__active",
                value: [ hue, 100 * sat, 60 ]
            }
        ]
    },
    {
        category: "Menu Item",
        values: [
            {
                name: "Background",
                type: "hsl",
                key: "--menu-item__background-color",
                value: [ hue, 100 * sat, 15 ]
            },
            {
                name: "Background (Hover)",
                type: "hsl",
                key: "--menu-item__background-color__hover",
                value: [ hue, 100 * sat, 25 ]
            }
        ]
    },
    {
        category: "Input",
        values: [
            {
                name: "Text",
                type: "hsl",
                key: "--input__text-color",
                value: [ 0, 0, 100 ]
            },
            {
                name: "Text (Placeholder)",
                type: "hsl",
                key: "--input__text-color__placeholder",
                value: [ hue, 30 * sat, 50 ]
            },
            {
                name: "Background",
                type: "hsl",
                key: "--input__background-color",
                value: [ hue, 100 * sat, 5 ]
            },
            {
                name: "Background (Hover)",
                type: "hsl",
                key: "--input__background-color__hover",
                value: [ hue, 100 * sat, 5 ]
            },
            {
                name: "Background (Focus)",
                type: "hsl",
                key: "--input__background-color__focus",
                value: [ hue, 100 * sat, 5 ]
            },
            {
                name: "Border",
                type: "hsl",
                key: "--input__border-color",
                value: [ hue, 100 * sat, 20 ]
            },
            {
                name: "Border (Hover)",
                type: "hsl",
                key: "--input__border-color__hover",
                value: [ hue, 100 * sat, 60 ]
            },
            {
                name: "Border (Focus)",
                type: "hsl",
                key: "--input__border-color__focus",
                value: [ hue, 100 * sat, 60 ]
            }
        ]
    },
    {
        category: "Textarea",
        values: [
            {
                name: "Background",
                type: "hsla",
                key: "--textarea__background-color",
                value: [ 0, 0, 0, .25 ]
            },
            {
                name: "Background (Focus)",
                type: "hsla",
                key: "--textarea__background-color__focus",
                value: [ 0, 0, 0, .45 ]
            }
        ]
    },
    {
        category: "Character",
        values: [
            {
                name: "Background (Hover)",
                type: "hsl",
                key: "--character__background-color__hover",
                value: [ hue, 60 * sat, 15 ]
            },
            {
                name: "Border (Hover)",
                type: "hsl",
                key: "--character__border-color__hover",
                value: [ hue, 80 * sat, 45 ]
            },
            {
                name: "Badge (Background)",
                type: "hsla",
                key: "--badge__background-color",
                value: [ hue, 50 * sat, 50, .5 ]
            },
            {
                name: "Badge (Recent, Background)",
                type: "hsla",
                key: "--badge__background-color__recent",
                value: [ hue, 40 * sat, 30, .5 ]
            },
            {
                name: "Badge (Private, Background)",
                type: "hsla",
                key: "--badge__background-color__private",
                value: [ hue, 50 * sat, 50, .5 ]
            },
            {
                name: "Badge (Public, Background)",
                type: "hsla",
                key: "--badge__background-color__public",
                value: [ hue, 50 * sat, 50, .5 ]
            }
        ]
    },
    {
        category: "Message",
        values: [
            {
                name: "Background (You)",
                type: "hsla",
                key: "--message__background-color__you",
                value: [ 0, 0, 0, .5 ]
            },
            {
                name: "Background (Bot)",
                type: "hsla",
                key: "--message__background-color__bot",
                value: [ hue, 100 * sat, 50, 0 ]
            }
        ]
    },
    {
        category: "Message Topic",
        values: [
            {
                name: "Text (You)",
                type: "hsla",
                key: "--message-topic__text-color__you",
                value: [ hue, 70 * sat, 80, .85 ]
            },
            {
                name: "Background (You)",
                type: "hsla",
                key: "--message-topic__background-color__you",
                value: [ hue, 70 * sat, 25, .35 ]
            },
            {
                name: "Text (Bot)",
                type: "hsla",
                key: "--message-topic__text-color__bot",
                value: [ hue, 85 * sat, 85, .85 ]
            },
            {
                name: "Background (Bot)",
                type: "hsla",
                key: "--message-topic__background-color__bot",
                value: [ hue, 70 * sat, 45, .15 ]
            }
        ]
    },
    {
        category: "Message Original",
        values: [
            {
                name: "Text",
                type: "hsla",
                key: "--message-original__text-color",
                value: [ hue, 100 * sat, 80, .4 ]
            }
        ]
    },
    {
        category: "Overlay",
        values: [
            {
                name: "Background",
                type: "hsla",
                key: "--overlay__background-color",
                value: [ 0, 0, 0, .6 ]
            }
        ]
    },
    {
        category: "Dialog",
        values: [
            {
                name: "Background",
                type: "hsl",
                key: "--dialog__background-color",
                value: [ hue, 80 * sat, 5 ]
            },
            {
                name: "Border",
                type: "hsla",
                key: "--dialog__border-color",
                value: [ hue, 100 * sat, 10, 1 ]
            },
            {
                name: "Border (Empty Image)",
                type: "hsla",
                key: "--dialog__border-color__empty-image",
                value: [ 0, 0, 100, .13 ]
            }
        ]
    }
]



let me = null
let errors = []



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
    $tooltip:
    {
        get: () =>
        {
            return query(`#tooltip`)
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
        value: async function(url, options)
        {
            const userFolder = localStorage.getItem('userFolder')
            if (!userFolder)
            {
                errors.push(`userFolder is null`)
                return null
            }
            
            options ??= { }
            
            options.headers ??= { }
            
            const h = options.headers
            
            h['X-User-Folder'] = userFolder
            h['X-CSRF-Token'] = localStorage.getItem('csrfToken')
            h['X-Session-Token'] = localStorage.getItem('sessionToken')
            h['X-Additional-Secret'] = localStorage.getItem('additionalSecret')
            h['X-Translation-Client'] = localStorage.getItem('translationClient')
            h['X-DeepL-Auth-Key'] = localStorage.getItem('deeplAuthKey')
            h['X-LibreTranslate-URL'] = localStorage.getItem('libreTranslateUrl')
            h['X-Language'] = localStorage.getItem('language')
            h['X-NSFW'] = localStorage.getItem('nsfw')
            
            if (!me)
            {
                me = await window.fetch(`api/me`, options).thenJson(null)
                if (!me || !me.id)
                {
                    if (!me)
                        errors.push(`me is null`)
                    
                    else if (!me.id)
                        errors.push(`me.id is null`)
                    
                    me = null
                    return null
                }
            }
            
            h['X-User-ID'] = me.id
            
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
    createRangeInput:
    {
        value: function(min, max, value, onInput)
        {
            const $ = this.create(`div`)
            $.addClass(`range`)
            
            const $input = $.create(`input`)
            $input.type = `range`
            $input.min = min
            $input.max = max
            $input.value = value
            if (onInput)
                $input.on(`input`, onInput)
            
            const $info = $.create(`div`)
            $info.style.width = `3rem`;
            $info.innerText = $input.value
            
            $input.on(`input`, () => $info.innerText = $input.value)
            return $
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
                    
                    if (this.attributes[`style`])
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

Object.defineProperties(Promise.prototype,
{
    thenJson:
    {
        value: function(defaultValue)
        {
            try
            {
                return this
                    .then(x => x.json())
                    .catch(e =>
                    {
                        errors.push(e)
                        return defaultValue
                    })
            }
            catch (e)
            {
                errors.push(e)
                return defaultValue
            }
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
    },
    asCssHsl:
    {
        value: function()
        {
            return `hsl(${this[0]}, ${this[1]}%, ${this[2]}%)`
        }
    },
    asCssHsla:
    {
        value: function()
        {
            return `hsla(${this[0]}, ${this[1]}%, ${this[2]}%, ${this[3]})`
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
    waitFor:
    {
        value: async function(predicate)
        {
            while (!predicate())
                await delay(10)
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



class Task
{
    current = null
    next = null
    promise = null
    
    run(task)
    {
        if (this.current)
        {
            this.next = task
            return
        }
        
        this.current = task
        
        if (!this.current)
            return
        
        this.promise = new Promise(async resolve =>
        {
            await this.current()
            this.current = null
            
            if (this.next)
            {
                const next = this.next
                this.next = null
                this.run(next)
                return
            }
            
            resolve()
        })
    }
    
    async stopAsync()
    {
        this.run(null)
        await this.promise
    }
}



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
            new DeleteCharacterDialog,
            new ClearChatDialog,
            new AppearanceDialog,
            new AppearanceResetDialog,
            new ErrorDialog,
        ])
        {
            this.dialogs[dialog.name] = dialog
        }
        
        this.imageLoader = new IntersectionObserver(
            entries =>
            {
                entries.forEach(entry =>
                {
                    if (entry.intersectionRatio <= 0)
                        return
                    
                    const $ = entry.target
                    
                    if ($.dataset.image)
                    {
                        $.setBackgroundImage($.dataset.image)
                        delete $.dataset.image
                    }
                })
            }
        )
    }
    
    async mainAsync()
    {
        const errorsUpdate = async () =>
        {
            for (;;)
            {
                if (errors.length > 0)
                {
                    if (this.pages.home.$.hasClass(`display-none`))
                    {
                        await waitFor(() => !this.isLoading())
                        await delay(300)
                        await App.instance.gotoPageAsync(`home`)
                    }
                    
                    const error = errors.shift()
                    console.error(error)
                    
                    const dialog = await App.instance.openDialogAsync(`error`, { text: error })
                    
                    await waitFor(() => dialog.$.hasClass(`hidden`))
                    if (errors.length > 0)
                        disableInput()
                }
                
                await delay(200)
            }
        }
        errorsUpdate()
        
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
        
        queryAll(`.tabs`).forEach($tabs =>
        {
            const $titles = $tabs.create(`div`).addClass(`titles`)
            const $container = $tabs.create(`div`).addClass(`container`)
            
            $tabs.queryAll(`.tab`).forEach($tab =>
            {
                $tab.addClass(`display-none`).addClass(`important`)
                const $title = $tab.query(`.title`)
                $title.onClick(async () =>
                {
                    const oldHeight = $tabs.offsetHeight
                    
                    $titles.queryAll(`.title`).forEach($ => $.removeClass(`active`))
                    $title.addClass(`active`)
                    
                    $container.queryAll(`.tab`).forEach($ => $.addClass(`display-none`).addClass(`important`))
                    $tab.removeClass(`display-none`).removeClass(`important`)
                    
                    $tabs.style.height = `unset`
                    const newHeight = $tabs.offsetHeight
                    
                    if (newHeight == 0)
                        return
                    
                    $tabs.addClass(`transition`)
                    $tabs.style.height = `${oldHeight}px`
                    await delay(1)
                    $tabs.style.height = `${newHeight}px`
                    await delay(260)
                    $tabs.removeClass(`transition`)
                    
                    $tabs.style.height = `unset`
                })
                $titles.appendChild($title)
                
                $container.appendChild($tab)
            })
            
            $titles.query(`.title`).click()
        })
        
        on(`mousemove`, ($, e) =>
        {
            const text = $.dataset.tooltip
            if (text)
            {
                const rect = $.getBoundingClientRect()
                $tooltip.setHtml(text)
                $tooltip.addClass(`visible`)
                $tooltip.style.left = `${rect.left + rect.width / 2}px`
                $tooltip.style.top = `${rect.top}px`
            }
            else
            {
                $tooltip.removeClass(`visible`)
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
                $tooltip.removeClass(`visible`)
                
                const _action = $sender.dataset.action
                
                if (this.closeAllMenus())
                    if (_action == `gotoPageAsync`)
                        disableInput()
                
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
            $tooltip.removeClass(`visible`)
            
            $overlay.onClick($sender =>
            {
                if ($sender != $overlay)
                    return
                
                if ($sender.hasClass(`disabled`))
                    return
                
                this.closeAllMenus()
            })
        })
        
        this.closeAllDialogs(true, $overlay =>
        {
            $tooltip.removeClass(`visible`)
            
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
            
            this.pages.chat.character = await fetchAsync(`api/characters/${route.id}`).thenJson([])
            
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
    
    closeAllDialogs(force, onProcessOverlay)
    {
        queryAll(`[data-dialog]`).forEach($ =>
        {
            if (!force && $.dataset.dialog == `appearance`)
                return
            
            $.addClass(`hidden`)
            
            const $prev = $.previousElementSibling
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
        
        const _dialog = this.dialogs[dialog]
        if (_dialog.onOpenAsync)
            await _dialog.onOpenAsync(userData)
        
        enableInput()
        
        return _dialog
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
        const title = localStorage.getItem(`nsfw`) == `true`
            ? `My CrushChat Client`
            : `My Chatbot Client`
        
        document.title = title
        query(`[data-page="home"] > h2`).setHtml(title)
        
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
                
                if (value.type == `color`)
                {   
                    if (value.alpha !== undefined)
                    {
                        let alpha = Math.round(value.alpha * 255).toString(16).toUpperCase()
                        while (alpha.length < 2)
                            alpha = `0${alpha}`
                        _value += alpha
                    }
                }
                else if (value.type == `hsl`)
                {
                    _value = value.value.asCssHsl()
                }
                else if (value.type == `hsla`)
                {
                    _value = value.value.asCssHsla()
                }
                set(value.key, _value);
            }
        }
        
        const body = this.cssRoot.find(x => x.category == `Body`)
        const backgroundColor = body.values.find(x => x.key == `--body__background-color`)
        
        set(`--bottombar__background-color__start`, [...backgroundColor.value, 1].asCssHsla())
        set(`--bottombar__background-color__end`, [...backgroundColor.value, 0].asCssHsla())
        
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
    
    async fetchCharactersAsync(options)
    {
        options ??= { }
        
        const query = {
            cache: !(options.cache === false),
            all: options.all || false,
            private: options.private || false,
            recent: options.recent || false,
            public: options.public || false,
            page: options.page || 1,
            limit: options.limit ?? 10,
            search: options.search ?? ``
        }
        
        return await fetchAsync(`api/characters${query.toQueryString()}`).thenJson([])
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
    
    #onScrollCallback
    #searchTask
    
    constructor()
    {
        super()
        
        this.$loader = this.$.query(`.loader`).addClass(`hidden`)
        
        this.$characters = this.$.query(`.characters`)
        this.$section = this.$characters.query(`.section`)
        this.$sectionContent = this.$section.query(`.content`)
        
        this.$characterTemplate = this.$sectionContent.query(`.character`)
        this.$characterTemplate.remove()
        
        this.#searchTask = new Task
        
        this.$search = this.$bottombar.query(`[data-bind="search"]`)
        this.$search.on(`input`, () => this.#searchTask.run(async () =>
        {
            this.#reset()
            this.$loader.removeClass(`hidden`)
            await this.loadNextCharactersAsync()
            this.$loader.addClass(`hidden`)
        }))
    }
    
    #reset()
    {
        this.page = 1
        this.$characters.queryAll(`.thumbnail`).forEach($ => App.instance.imageLoader.unobserve($))
        this.$sectionContent.clearHtml()
    }
    
    async onLoadAsync()
    {
        this.#reset()
        
        await this.loadNextCharactersAsync()
        
        this.#onScrollCallback = this.#onScroll.bind(this)
        document.addEventListener(`scroll`, this.#onScrollCallback)
    }
    
    async onPostLoadAsync()
    {
        enableInput()
        
        if (!isMobile())
            this.$search.focus()
    }
    
    async onUnloadAsync()
    {
        await this.#searchTask.stopAsync()
        
        this.$loader.addClass(`hidden`)
        document.removeEventListener(`scroll`, this.#onScrollCallback)
    }
    
    #onScroll(e)
    {
        if (App.instance.isLoading())
            return
    
        if (e.target != document)
            return
        
        const $ = document.documentElement
        const delta = $.offsetHeight - $.scrollTop - $.clientHeight
        
        if (delta > 100)
            return
        
        this.#searchTask.run(async () =>
        {
            document.removeEventListener(`scroll`, this.#onScrollCallback)
            this.$loader.removeClass(`hidden`)
            
            await this.loadNextCharactersAsync()
            
            this.$loader.addClass(`hidden`)
            document.addEventListener(`scroll`, this.#onScrollCallback)
        })
    }
    
    async loadNextCharactersAsync()
    {
        const search = this.$search.value.toLowerCase().trim()
        
        const options = { all: true, page: this.page++, search: search }
        
        const characters = await App.instance.fetchCharactersAsync(options)
        
        for (const character of characters)
        {
            const $character = this.$characterTemplate.clone().onClick(async () =>
            {
                if ($character.hasClass(`disabled`))
                    return
                
                App.instance.pages.chat.character = character
                await App.instance.gotoPageAsync(`chat`, character.id)
            })
            
            const $thumbnail = $character.query(`.thumbnail`)
            $thumbnail.dataset.image = character.details?.thumbnail || character.thumbnail
            App.instance.imageLoader.observe($thumbnail)
            
            $character.query(`.name`).setHtml(character.name)
            $character.query(`.description`).setHtml(character.descriptionTranslated || character.description)
            $character.query(`.upvotes`).setHtml(character.upvotes)
            $character.query(`.recent`).toggleClass(`display-none`, !character.recent)
            $character.query(`.private`).toggleClass(`display-none`, !character.isPrivate)
            $character.query(`.public`).toggleClass(`display-none`, character.isPrivate)
            
            this.$sectionContent.add($character)
        }
    }
    
    async refreshCharactersAsync()
    {
        App.instance.startLoading()
        const search = this.$search.value.toLowerCase().trim()
        await App.instance.fetchCharactersAsync({ all: true, cache: false, limit: 0, search: search })
        await this.onLoadAsync()
        App.instance.stopLoading()
        
        if (!isMobile())
            this.$search.focus()
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
        
        this.$persona.query(`.background`).setBackgroundImage(this.character.details?.thumbnail || this.character.thumbnail)
        this.$persona.query(`.name`).setHtml(this.character.name)
        this.$persona.query(`.description`).setHtml(this.character.personaFilteredTranslated || this.character.personaFiltered)
        
        if (scrollDown)
            this.scrollDown()
        
        const url = `api/characters/${this.character.id}/messages${options.toQueryString()}`
        const messages = await fetchAsync(url).thenJson([])
        
        this.$messages.clearHtml()
        
        const showOriginalMessage = localStorage.getItem(`showOriginalMessages`) == `true`
        
        for (const message of messages)
        {
            const isYou = message.role == `You`
            const image = message.image
            
            const name = isYou ? `You` : this.character.name.split(`:`).pop().trim()
            
            let text = message.contentTranslated || message.content
            text = text.replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`)
            text = text.replaceAll(/\*(.*?)\*/g, (m, g) => `<span class="topic">*${g}*</span>`)
            
            const $message = this.$messageTemplate
                .clone()
                .addClass(isYou ? `you` : `bot`)
            
            $message.query(`.avatar`).setBackgroundImage(this.character.details?.thumbnail || this.character.thumbnail).parentNode.removeIf(isYou)
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
        await App.instance.openDialogAsync(`clearChat`, this)
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
        this.$sendMessageButton.children[1].toggleClass(`display-none`, this.$message.value)
        this.$sendMessageButton.children[2].toggleClass(`display-none`, !this.$message.value)
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
            await fetchAsync(`api/characters/${this.character.id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: body
            })
        }
        else
        {
            await fetchAsync(`api/characters/${this.character.id}/messages/generate`)
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
        
        this.userId = null
        this.userFolder = null
        this.imageId = null
        this.isRealistic = false
        this.prompt = ``
        this.transferTo(this.$content)
        
        this.$historyContent.clearHtml()
        
        const images = await fetchAsync(`api/images`).thenJson([])
        
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
        
        if (!image)
            return
        
        this.$image.setBackgroundImage(image.url)
        
        this.userId = image.userId
        this.userFolder = image.userFolder
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
        
        const query = { realistic: this.isRealistic }
        await fetchAsync(`api/generate-image${query.toQueryString()}`, options)
        
        await this.refreshAsync()
        
        App.instance.stopLoading()
        
        this.loadImage(this.firstImage)
    }
    
    async deleteAsync()
    {
        App.instance.startLoading()
        
        const query = { delete: true }
        await fetchAsync(`api/images/${this.userId}/${this.userFolder}/${this.imageId}.png${query.toQueryString()}`)
        
        await this.refreshAsync()
        
        App.instance.stopLoading()
    }
    
    async copyAbsoluteUrlAsync()
    {
        const permission = await navigator.permissions.query({ name: "clipboard-write" })
        if (permission.state == "denied")
            return
        
        await navigator.clipboard.writeText(`${location.origin}/api/images/${this.userId}/${this.userFolder}/${this.imageId}.png`)
    }
    
    async copyRelativeUrlAsync()
    {
        const permission = await navigator.permissions.query({ name: "clipboard-write" })
        if (permission.state == "denied")
            return
        
        await navigator.clipboard.writeText(`/api/images/${this.userId}/${this.userFolder}/${this.imageId}.png`)
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
        this.data.hidden = false
        
        this.$.query(`[data-bind="thumbnail"]`).placeholder = ``
        
        this.data.transferTo(this.$content)
        
        if (!this.#chat.character)
        {
            this.$.query(`.title`).setHtml(`Create Character`)
            this.$.query(`.field:has([data-bind="thumbnail"])`).addClass(`display-none`).addClass(`important`)
            this.$.query(`.field:has([data-bind="memories"])`).addClass(`display-none`).addClass(`important`)
            this.$.query(`[data-action="dialogs.character.deleteAsync"]`).addClass(`display-none`)
            return
        }
        
        this.$.query(`.title`).setHtml(`Edit Character`)
        this.$.query(`.field:has([data-bind="thumbnail"])`).removeClass(`display-none`).removeClass(`important`)
        this.$.query(`.field:has([data-bind="memories"])`).removeClass(`display-none`).removeClass(`important`)
        this.$.query(`[data-action="dialogs.character.deleteAsync"]`).removeClass(`display-none`)
        
        const url = `api/characters/${this.#chat.character.id}`
        const character = await fetchAsync(url).thenJson(null)
        
        if (character)
        {
            this.data.name = character.name
            this.data.description = character.description
            this.data.imagePrompt = character.imagePrompt
            this.data.initialMessages = character.initialMessages.fromJson()
            this.data.persona = character.personaFiltered
            this.data.thumbnail = character.details?.thumbnail || ``
            this.data.memories = character.details.memories || []
            this.data.hidden = character.details.hidden || false
            
            this.$.query(`[data-bind="thumbnail"]`).placeholder = character.thumbnail
        }
        
        this.data.transferTo(this.$content)
    }
    
    async regenerateThumbnailAsync()
    {
        this.cancel()
        App.instance.startLoading()
        await fetchAsync(`api/characters/${this.#chat.character.id}/regenerate-image`)
        App.instance.stopLoading()
    }
    
    async saveAsync()
    {
        this.cancel()
        
        App.instance.startLoading()
        
        this.$content.transferTo(this.data)
        
        let url = `api/characters/${this.#chat.character ? `update` : `create`}`
        
        const body = {
            name: this.data.name,
            description: this.data.description,
            persona: this.data.persona,
            imagePrompt: this.data.imagePrompt,
            initialMessages: this.data.initialMessages.toJson(),
            tags: [`Female`],
            isPrivate: true,
            details: {
                thumbnail: this.data.thumbnail,
                memories: this.data.memories,
                hidden: this.data.hidden
            }
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
        {
            this.#chat.character = await fetchAsync(`api/characters/${body.id}`).thenJson(null)
            App.instance.stopLoading()
            
            if (this.#chat.character)
                await this.#chat.refreshChatAsync()
            
            return
        }
        
        await App.instance.pages.characters.refreshCharactersAsync()
    }
    
    async deleteAsync()
    {
        await App.instance.openDialogAsync(`deleteCharacter`, this.#chat.character)
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
        
        this.$.query(`[data-bind="imagePrompt"]`).placeholder = userData.character.imagePrompt || "Enter image prompt(s)"
        
        const isYou = userData.message.role == `You`
        
        this.$.query(`[data-action="dialogs.message.generateMessage"]`).parentNode
            .toggleClass(`display-none`, isYou)
            .toggleClass(`important`, isYou)
        
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
        const url = `api/characters/${this.characterId}/messages/generate/${this.messageIndex}`
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
        
        const url = `api/characters/${this.characterId}/messages/generate-image/${this.messageIndex}`
        await this.applyAsync(async () => await fetchAsync(url, options))
    }
    
    async deleteImageAsync()
    {
        const url = `api/characters/${this.characterId}/messages/delete-image/${this.messageIndex}`
        await this.applyAsync(async () => await fetchAsync(url))
    }
    
    async saveAsync()
    {
        this.$content.transferTo(this)
        
        const url = `api/characters/${this.characterId}/messages/${this.messageIndex}`
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
        const url = `api/characters/${this.characterId}/messages/delete/${this.messageIndex}`
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
    
    cancel()
    {
        App.instance.closeAllDialogs(true)
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
                
                if (value.type == `color`)
                {
                    const $input = $field.create(`input`)
                    $input.type = value.type
                    $input.value = value.value
                    $input.on(`input`, () =>
                    {
                        value.value = $input.value
                        App.instance.applyCssRoot()
                    })
                    
                    if (value.alpha !== undefined)
                    {
                        $field.createRangeInput(0, 255, Math.round(value.alpha * 255), $ =>
                        {
                            value.alpha = $.value / 255.0
                            App.instance.applyCssRoot()
                        })
                    }
                    
                    continue
                }
                
                if (value.type == `hsl` || value.type == `hsla`)
                {
                    const $preview = $field.create(`div`)
                    $preview.addClass(`color-preview`)
                    
                    const updatePreview = () =>
                    {
                        $preview.style.backgroundColor = value.type == `hsl`
                            ? value.value.asCssHsl()
                            : value.value.asCssHsla()
                    }
                    updatePreview()
                    
                    let $s, $b
                    
                    const updateSB = () =>
                    {
                        $s.query(`input[type="range"]`).style.backgroundImage
                            = `linear-gradient(90deg, hsl(${value.value[0]}, 0%, 50%), hsl(${value.value[0]}, 100%, 50%))`
                        $b.query(`input[type="range"]`).style.backgroundImage
                            = `linear-gradient(90deg, hsl(${value.value[0]}, 50%, 0%) 0%, hsl(${value.value[0]}, 50%, 50%) 50%, hsl(${value.value[0]}, 50%, 100%))`
                    }
                    
                    $field.createRangeInput(0, 360, value.value[0], $ =>
                    {
                        updateSB()
                        value.value[0] = $.value
                        updatePreview()
                        App.instance.applyCssRoot()
                    }).addClass(`hue`)
                    
                    $s = $field.createRangeInput(0, 100, value.value[1], $ =>
                    {
                        value.value[1] = $.value
                        updatePreview()
                        App.instance.applyCssRoot()
                    })
                    
                    $b = $field.createRangeInput(0, 100, value.value[2], $ =>
                    {
                        value.value[2] = $.value
                        updatePreview()
                        App.instance.applyCssRoot()
                    }).addClass(`brightness`)
                    
                    updateSB()
                    
                    if (value.type == `hsla`)
                    {
                        $field.createRangeInput(0, 100, value.value[3] * 100, $ =>
                        {
                            value.value[3] = $.value / 100.0
                            updatePreview()
                            App.instance.applyCssRoot()
                        })
                    }
                        
                    continue
                }
            }
        }
    }
    
    async resetAsync()
    {
        
        
        
    }
}

class DeleteCharacterDialog extends Dialog
{
    get name()
    {
        return `deleteCharacter`
    }
    
    onOpenAsync(userData)
    {
        this.character = userData
    }
    
    async yesAsync()
    {
        this.cancel()
        
        App.instance.startLoading()
        await fetchAsync(`api/characters/${this.character.id}/delete`)
        App.instance.stopLoading()
        
        await App.instance.gotoPageAsync(`characters`)
    }
}

class ClearChatDialog extends Dialog
{
    get name()
    {
        return `clearChat`
    }
    
    onOpenAsync(userData)
    {
        this.page = userData
    }
    
    async yesAsync()
    {
        this.cancel()
        
        disableInput()
        this.page.$messages.clearHtml()
        await fetchAsync(`api/characters/${this.page.character.id}/messages/clear`)
        
        await this.page.refreshAsync({ scrollDown: true, cache: false, translate: true })
        
        if (!isMobile())
            this.page.$message.focus()
        
        enableInput()
    }
}

class AppearanceResetDialog extends Dialog
{
    get name()
    {
        return `appearanceReset`
    }
    
    reset()
    {
        this.cancel()
        App.instance.cssRoot = []
        App.instance.applyCssRoot()
        App.instance.dialogs.appearance.onOpenAsync()
    }
}

class ErrorDialog extends Dialog
{
    get name()
    {
        return `error`
    }
    
    onOpenAsync(userData)
    {
        this.$.query(`.content`).setHtml(userData.text)
    }
}



App.instance = new App
App.instance.mainAsync()
