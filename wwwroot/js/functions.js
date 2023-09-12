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

function toggleMenu(force)
{
    if (force === undefined)
    {
        q(`#menu-wrapper`).classList.toggle(`hidden`)
        q(`#menu-overlay`).classList.toggle(`hidden`)
        return
    }
    
    q(`#menu-wrapper`).classList.toggle(`hidden`, !force)
    q(`#menu-overlay`).classList.toggle(`hidden`, !force)
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
        style.innerHTML = `[data-has-image] {
            background-size: unset !important;
            background-image: url(res/checkers.svg) !important;
        }`
        document.head.appendChild(style)
    })()
    
    q(`#common-load-indicator`).classList.remove(`display-none`)
    
    document.body.classList.add(`loading`)
    query(`button, input, textarea`).forEach(x => x.disabled = true)
}

function postRefresh()
{
    document.body.classList.remove(`loading`)
    query(`button, input, textarea`).forEach(x => x.disabled = false)
    
    query(`.load-indicator`).forEach(x => x.parentElement.classList.add(`display-none`))
    
    if (currentPage = `chat`)
        $_.chatMessageInput.focus()
}

async function refreshMainPage()
{
    currentPage = `main`
    
    query(`.page`).forEach(x => x.classList.add(`display-none`))
    q(`.page__main`).classList.remove(`display-none`)
    
    q(`#bottombar__characters`).classList.add(`display-none`)
    q(`#bottombar__chat`).classList.add(`display-none`)
    q(`#bottombar__image-generator`).classList.add(`display-none`)
    
    query(`.menu`).forEach(x => x.classList.add(`hidden`))
    
    scrollUp()
}

async function refreshCharactersPageAsync()
{
    currentPage = `characters`
    
    query(`.page`).forEach(x => x.classList.add(`display-none`))
    q(`.page__characters`).classList.remove(`display-none`)
    
    q(`#bottombar__characters`).classList.remove(`display-none`)
    q(`#bottombar__chat`).classList.add(`display-none`)
    q(`#bottombar__image-generator`).classList.add(`display-none`)
    
    query(`.menu`).forEach(x => x.classList.add(`hidden`))
    query(`.menu__characters`).forEach(x => x.classList.remove(`hidden`))
    
    scrollUp()
    
    q(`.page__characters`).innerHTML = ``
    q(`.page__characters`).classList.remove(`display-none`)
    
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
                        currentCharacter = character
                        
                        preRefresh()
                        scrollUp()
                        
                        await refreshChatAsync()
                        postRefresh()
                        
                        scrollDown()
                    })
                    
                    $item.innerHTML = `
                        <div class="thumbnail" data-has-image style="background-image: url(${character.thumbnail})"></div>
                        <div class="name">${character.name}</div>
                        <div class="description">${character.descriptionTranslated || character.description}</div>
                    `
                    
                    $items.appendChild($item)
                }
                
                q(`.page__characters`).appendChild($section)
            }
        }
    )
}

async function refreshChatAsync(options)
{
    currentPage = `chat`
    
    query(`.page:not(.page__chat)`).forEach(x => x.classList.add(`display-none`))
    q(`.page__chat`).classList.remove(`display-none`)
    
    q(`#bottombar__characters`).classList.add(`display-none`)
    q(`#bottombar__chat`).classList.remove(`display-none`)
    q(`#bottombar__image-generator`).classList.add(`display-none`)
    
    query(`.menu`).forEach(x => x.classList.add(`hidden`))
    query(`.menu__chat`).forEach(x => x.classList.remove(`hidden`))
    
    options ??= { }
    options.cache ??= true
    options.initialize ??= false
    options.translate ??= false

    await requestAsync(
        `/api/characters/${currentCharacter.id}/messages`
            + `?cache=${options.cache.toString()}`
            + `&initialize=${options.initialize.toString()}`
            + `&translate=${options.translate.toString()}`
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
                    $li.innerHTML += `<div class="image" style="background-image: url(${image})" data-has-image></div>`
                
                if (!isYou)
                    $li.innerHTML += `<div class="avatar" style="background-image: url(${currentCharacter.thumbnail})" data-has-image></div>`
                
                $li.innerHTML += `<div class="name">${name}</div>`
                $li.innerHTML += `<div class="text">${content}</div>`
                
                if (showOriginalMessage && message.contentTranslated)
                    $li.innerHTML += `<div class="original">${message.content}</div>`
                
                $li.addEventListener(`click`, () =>
                {
                    if (isBusy())
                        return
                    
                    currentMessage = message
                    
                    q(`#message-content-input`).value = content
                    
                    $_.messageDialog.parentElement.classList.remove(`hidden`)
                    
                    if (image)
                    {
                        q(`#message-image`).dataset.hasImage = true
                        q(`#message-image`).style = `background-image: url(${image})`
                    }
                    else
                    {
                        delete q(`#message-image`).dataset.hasImage
                        q(`#message-image`).style = `outline-color: #fff2; outline-style: dashed; `
                    }
                    
                    q(`#custom-image-prompt`).value = ``
                    
                    if (isYou)
                    {
                        q(`#custom-image-prompt`).classList.add(`display-none`)
                        q(`#generate-image-button`).classList.add(`display-none`)
                    }
                    else
                    {
                        q(`#custom-image-prompt`).classList.remove(`display-none`)
                        q(`#generate-image-button`).classList.remove(`display-none`)
                    }
                })
                
                $ul.appendChild($li)
            }
            
            q(`#chat`).innerHTML = `<div class="persona">
                <div class="image" data-has-image style="background-image: url(${currentCharacter.thumbnail})"></div>
                <div class="name">${currentCharacter.name}</div>
                <div>${currentCharacter.personaTranslated || currentCharacter.persona}</div>
            </div>`
            
            q(`#chat`).appendChild($ul)
        }
    )
}

async function refreshImageGeneratorPageAsync()
{
    currentPage = `image-generator`
    
    query(`.page`).forEach(x => x.classList.add(`display-none`))
    q(`.page__image-generator`).classList.remove(`display-none`)
    
    q(`#bottombar__characters`).classList.add(`display-none`)
    q(`#bottombar__chat`).classList.add(`display-none`)
    q(`#bottombar__image-generator`).classList.remove(`display-none`)
    
    query(`.menu`).forEach(x => x.classList.add(`hidden`))
    query(`.menu__image-generator`).forEach(x => x.classList.remove(`hidden`))
    
    const $history = q(`#image-generator-history`)
    $history.innerHTML = ``
    
    q(`#image-generator-image`).style = ``
    
    const images = await requestAsync(`/api/images`).then(x => x.json())
    
    const $firstItem = create(`div`)
    $firstItem.style = `min-width: 7rem; `
    $history.appendChild($firstItem)
    
    for (const image of images)
    {
        const $item = create(`div`)
        $item.classList.add(`image-generator-history__item`)
        $item.dataset.hasImage = true
        $item.style.backgroundImage = `url(${image.url})`
        $item.addEventListener(`click`, () =>
        {
            if (isBusy())
                return
            
            query(`.image-generator-history__item`).forEach(x => x.classList.remove(`active`))
            $item.classList.add(`active`)
            
            q(`#image-generator-image`).dataset.id = image.id
            q(`#image-generator-image`).style = `background-image: url(${image.url})`
            q(`#image-generator-realistic-toggle`).checked = image.request.isRealistic
            q(`#image-generator-prompt-input`).value = image.request.prompt
        })
        $history.appendChild($item)
    }
    
    const $item = create(`div`)
    $item.style = `min-width: 7rem; `
    $history.appendChild($item)
}

function scrollUp()
{
    window.scrollTo({ top: 0 })
}

function scrollDown()
{
    window.scrollTo({ top: q(`.page__chat`).scrollHeight, behavior: "smooth" })
}

function refreshSendMessageButton()
{
    const hasValue = $_.chatMessageInput.value.trim()
    $_.chatSendMessageButton.classList.toggle(`display-none`, !hasValue)
    $_.chatReceiveMessageButton.classList.toggle(`display-none`, hasValue)
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
    
    q(`[data-bind="translation-client"]`).dispatchEvent(new Event('change'))
}

function closeSettingsDialog()
{
    $_.settingsDialog.parentElement.classList.add(`hidden`)
}

function requestAsync(url, options)
{
    options ??= { }
    
    options.headers ??= { }
    
    const h = options.headers
    
    h['X-CSRF-Token'] = localStorage.getItem('csrf-token')
    h['X-Session-Token'] = localStorage.getItem('session-token')
    h['X-Translation-Client'] = localStorage.getItem('translation-client')
    h['X-DeepL-Auth-Key'] = localStorage.getItem('deepl-auth-key')
    h['X-DeepL-Block-Size'] = localStorage.getItem('deepl-block-size')
    h['X-LibreTranslate-URL'] = localStorage.getItem('libretranslate-url')
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

function isBusy()
{
    return document.body.classList.contains(`loading`)
}
