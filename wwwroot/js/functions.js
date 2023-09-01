// Functions

function create()
{
    return document.createElement(...arguments)
}

function q()
{
    return document.querySelector(...arguments)
}

function query()
{
    return document.querySelectorAll(...arguments)
}

function toggleMenu()
{
    q(`#menu`).classList.toggle(`hidden`)
    q(`#menu-overlay`).classList.toggle(`hidden`)
}

function preRefresh()
{
    (() =>
    {
        const hideImageId = `hide-images-style`
        const $hideImage = document.getElementById(`hide-images-style`)
        
        if (localStorage.getItem('hide-images') != "true")
        {
            if (!$hideImage)
            return
            
            document.head.removeChild($hideImage)
            return
        }
        
        if ($hideImage)
            return
        
        const style = create(`style`)
        style.id = hideImageId;
        style.innerHTML = "*{background-image:none!important}"
        document.head.appendChild(style)
    })()
    
    q(`#common-load-indicator`).classList.remove(`display-none`)
    query('[data-lang]').forEach(x => x.innerHTML = localStorage.getItem('language'))
    
    document.body.classList.add(`loading`)
    query(`button, input`).forEach(x => x.disabled = true)
}

function postRefresh()
{
    document.body.classList.remove(`loading`)
    query(`.load-indicator`).forEach(x => x.parentElement.classList.add(`display-none`))
    query(`button, input`).forEach(x => x.disabled = false)
    
    if (currentCharacter)
        $_.messageInput.focus()
    
    if (hasAnyErrors)
        openSettingsDialog()
}

async function refreshCurrentPageAsync()
{
    switch (currentPage)
    {
        case `home`:
            await refreshHomePageAsync()
            break
        
        case `character`:
            await refreshMessagesAsync()
            break
    }
}

async function refreshHomePageAsync()
{
    q(`#common-load-indicator`).classList.remove(`display-none`)
    q(`#bottombar`).classList.add(`display-none`)
    
    q(`#content`).innerHTML = ``
    
    try
    {
        await requestAsync(
            `/api/characters`
        ).then(
            x => x.json()
        ).then(
            characters =>
            {
                for (const category of [
                    { title: "Recent Characters", key: "recent" },
                    { title: "Private Characters", key: "private" },
                    { title: "Public Characters", key: "public" },
                ])
                {
                    if (!characters[category.key]?.length)
                        continue
                    
                    const $section = create(`div`)
                    $section.classList.add(`section`)
                    
                    const $title = create(`div`)
                    $title.classList.add(`title`)
                    $title.innerHTML = category.title
                    $section.appendChild($title)
                    
                    const $items = create(`div`)
                    $items.classList.add(`characters`)
                    $section.appendChild($items)
                    
                    for (const character of characters[category.key])
                    {
                        const $item = create(`div`)
                        $item.dataset.id = character.id
                        $item.classList.add(`character`)
                        
                        $item.addEventListener(`click`, async () =>
                        {
                            q(`#content`).innerHTML = ``
                            
                            currentPage = `character`
                            currentCharacter = character
                            
                            preRefresh()
                            await refreshMessagesAsync({ cache: false, initialize: true })
                            
                            const language = localStorage.getItem("language")
                            if (language && language != "EN" && !currentCharacter.descriptionTranslated)
                            {
                                await requestAsync(`/api/characters/${currentCharacter.id}/messages/translate`)
                                    .then(x => x.json())
                                    .then(async x =>
                                    {
                                        if (x)
                                        {
                                            currentCharacter = x
                                            await refreshMessagesAsync()
                                        }
                                    })
                            }
                            postRefresh()
                            
                            scrollDown()
                        })
                        
                        $item.innerHTML = `
                            <div class="thumbnail" style="background-image: url(${character.thumbnail})"></div>
                            <div class="name">${character.name}</div>
                            <div class="description">${character.descriptionTranslated || character.description}</div>
                        `
                        
                        $items.appendChild($item)
                    }
                    
                    q(`#content`).appendChild($section)
                }
            }
        )
    }
    catch (ex)
    {
        console.error(ex)
        hasAnyErrors = true
    }
}

async function refreshMessagesAsync(options)
{
    options ??= { }
    options.cache ??= true
    options.initialize ??= false
    
    if (hasAnyErrors)
        return
    
    q(`#bottombar`).classList.remove(`display-none`)
    
    try
    {
        await requestAsync(
            `/api/characters/${currentCharacter.id}/messages?cache=${options.cache.toString()}&initialize=${options.initialize.toString()}`
        ).then(
            x => x.json()
        ).then(
            messages =>
            {
                const showOriginalMessage = localStorage.getItem(`show-original-messages`) == "true"
                
                const $ul = create(`ul`)
                $ul.classList.add(`messages`)
                
                for (const message of messages)
                {
                    const isYou = message.role == 'You'
                    const name = isYou ? 'You' : currentCharacter.name.split(':').pop().trim()
                    const content = message.contentTranslated || message.content
                    const image = message.image
                    
                    const $li = create(`li`)
                    $li.classList.add(`message`)
                    $li.classList.add(isYou ? "you" : "bot")
                    
                    if (image)
                        $li.innerHTML += `<div class="image" style="background-image: url(${image})"></div>`
                    
                    if (!isYou)
                        $li.innerHTML += `<div class="avatar" style="background-image: url(${currentCharacter.thumbnail})"></div>`
                    
                    $li.innerHTML += `<div class="name">${name}</div>`
                    $li.innerHTML += `<div class="text">${content}</div>`
                    
                    if (showOriginalMessage && message.contentTranslated)
                        $li.innerHTML += `<div class="original">${message.content}</div>`
                    
                    $li.addEventListener(`click`, () =>
                    {
                        if (document.body.classList.contains('loading'))
                            return
                        
                        currentMessage = message
                        
                        q(`#message-content-input`).value = content
                        
                        $_.messageDialog.parentElement.classList.remove(`hidden`)
                        
                        if (image)
                            q(`#message-image`).style = `background-image: url(${image})`
                        else
                            q(`#message-image`).style = `outline-color: #fff2; outline-style: dashed; `
                        
                        if (isYou)
                            q(`#generate-image-button`).classList.add(`display-none`)
                        else
                            q(`#generate-image-button`).classList.remove(`display-none`)
                        
                    })
                    
                    $ul.appendChild($li)
                }
                
                q(`#content`).innerHTML = `<div class="persona">
                    <div class="image" style="background-image: url(${currentCharacter.thumbnail})"></div>
                    <div class="name">${currentCharacter.name}</div>
                    <div>${currentCharacter.personaTranslated || currentCharacter.persona}</div>
                </div>`
                
                q(`#content`).appendChild($ul)
            }
        )
    }
    catch (ex)
    {
        console.error(ex)
        hasAnyErrors = true
    }
}

function scrollDown()
{
    window.scrollTo({ top: q(`#content`).scrollHeight, behavior: "smooth" })
}

function refreshSendMessageButton()
{
    const hasValue = $_.messageInput.value.trim()
    $_.sendMessageButton.classList.toggle(`display-none`, !hasValue)
    $_.receiveMessageButton.classList.toggle(`display-none`, hasValue)
}

function openSettingsDialog()
{
    $_.settingsDialog.parentElement.classList.remove(`hidden`)
    
    query(`[data-bind]`).forEach($x =>
    {
        switch ($x.type)
        {
            case 'checkbox':
                $x.checked = localStorage.getItem($x.dataset.bind) == "true"
                break
                
            default:
                $x.value = localStorage.getItem($x.dataset.bind)
                break
        }
    })
}

async function closeSettingsDialogAsync()
{
    $_.settingsDialog.parentElement.classList.add(`hidden`)
    
    if (hasAnyErrors)
    {
        hasAnyErrors = false
        
        preRefresh()
        await refreshHomePageAsync()
        postRefresh()
    }
}

function requestAsync(url, options)
{
    options ??= { }
    
    options.headers ??= { }
    
    const h = options.headers
    
    h['X-CSRF-Token'] = localStorage.getItem('csrf-token')
    h['X-Session-Token'] = localStorage.getItem('session-token')
    h['X-DeepL-Auth-Key'] = localStorage.getItem('deepl-auth-key')
    h['X-DeepL-Block-Size'] = localStorage.getItem('deepl-block-size')
    h['X-Character-Limit'] = localStorage.getItem('character-limit')
    h['X-Message-Limit'] = localStorage.getItem('message-limit')
    h['X-Language'] = localStorage.getItem('language')
    
    return fetch(url, options)
}

async function parseTokensFromClipboardAsync()
{
    const permission = await navigator.permissions.query({ name: "clipboard-read" })
    if (permission.state == "denied")
        return
    
    const json = await navigator.clipboard.readText()
    const cookies = JSON.parse(json)
    
    for (const cookie of cookies)
    {
        if (cookie.name == '__Host-next-auth.csrf-token')
            q('[data-bind="csrf-token"]').value = cookie.value
        
        if (cookie.name == '__Secure-next-auth.session-token')
            q('[data-bind="session-token"]').value = cookie.value
    }
}
