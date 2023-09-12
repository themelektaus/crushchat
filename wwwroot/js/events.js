// Events

q(`#page-main__characters`).addEventListener(`click`, async () =>
{
    preRefresh()
    await refreshCharactersPageAsync()
    postRefresh()
})

q(`#page-main__image-generator`).addEventListener(`click`, async () => 
{
    preRefresh()
    await refreshImageGeneratorPageAsync()
    postRefresh()
})

q(`#page-main__settings`).addEventListener(`click`, async () => 
{
    openSettingsDialog()
})

query(`.menu .item`).forEach(x =>
{
    x.addEventListener(`click`, () =>
    {
        toggleMenu(false)
    })
})

query(`.menu .item__main-menu`).forEach(x =>
{
    x.addEventListener(`click`, async () =>
    {
        preRefresh()
        await refreshMainPage()
        postRefresh()
    })
})

$_.chatMessageInput.addEventListener(`input`, refreshSendMessageButton)

$_.chatMessageInput.addEventListener(`keydown`, e =>
{
    if (e.keyCode != 13)
        return
    
    e.stopPropagation()
    
    if ($_.chatMessageInput.value)
    {
        $_.chatSendMessageButton.click()
        return
    }
    
    $_.chatReceiveMessageButton.click()
})

$_.chatSendMessageButton.addEventListener(`click`, async () =>
{
    if (!$_.chatMessageInput.value)
        return
    
    const scrollTop = window.scrollTop
    
    preRefresh()
    
    q(`#common-load-indicator`).classList.add(`display-none`)
    q(`#chat-load-indicator`).classList.remove(`display-none`)
    
    scrollDown()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: $_.chatMessageInput.value
    })
    
    await refreshChatAsync()
    
    postRefresh()
    
    $_.chatMessageInput.value = ``
    refreshSendMessageButton()
    
    window.scrollTop = scrollTop
    scrollDown()
    
    if (localStorage.getItem('auto-generate') == "true")
        $_.chatReceiveMessageButton.click()
})

$_.chatReceiveMessageButton.addEventListener(`click`, async () =>
{
    const scrollTop = window.scrollTop
    
    preRefresh()
    
    q(`#common-load-indicator`).classList.add(`display-none`)
    q(`#chat-load-indicator`).classList.remove(`display-none`)
    
    scrollDown()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/generate`)
    await refreshChatAsync()
    
    postRefresh()
    
    window.scrollTop = scrollTop
    scrollDown()
})

query(`
    #characters__menu-button,
    #chat__menu-button,
    #image-generator__menu-button,
    #menu-overlay`
).forEach(x =>
{
    x.addEventListener(`click`, () =>
    {
        toggleMenu()
    })
})

q(`#save-settings-button`).addEventListener(`click`, async () =>
{
    query(`[data-bind]`).forEach($x =>
    {
        let value
        switch ($x.type)
        {
            case 'checkbox':
                value = $x.checked.toString()
                break
            
            default:
                value = $x.value.toString()
                break
        }
        localStorage.setItem($x.dataset.bind, value)
    })
    
    $_.settingsDialog.parentElement.classList.add(`hidden`)
})

q(`#cancel-settings-button`).addEventListener(`click`, () =>
{
    closeSettingsDialog()
})

$_.settingsDialog.parentElement.addEventListener(`click`, e =>
{
    if (e.target != $_.settingsDialog.parentElement)
        return
    
    closeSettingsDialog()
})

q(`.item__clear-cache`).addEventListener(`click`, async () =>
{
    preRefresh()
    scrollDown()
    
    await refreshChatAsync({ cache: false, translate: true })
    
    postRefresh()
    scrollDown()
})

q(`.item__clear-chat`).addEventListener(`click`, async () =>
{
    preRefresh()
    scrollDown()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/clear`)
    await refreshChatAsync()
    
    postRefresh()
    scrollDown()
})

q(`#image-generator__generate-button`).addEventListener(`click`, async () =>
{
    const prompt = q(`#image-generator-prompt-input`).value
    if (!prompt)
        return
    
    preRefresh()
    
    const $image = q(`#image-generator-image`)
    
    $image.style = ``
    
    let options = { }
    options.headers = { }
    options.headers['X-Prompt'] = prompt
    
    const realistic = q(`#image-generator-realistic-toggle`).checked
    
    await requestAsync(`/api/generate-image?realistic=${realistic}`, options)
    await refreshImageGeneratorPageAsync()
    
    postRefresh()
    
    q(`#image-generator-history`).children[1].click()
})

q(`#image-generator__delete-button`).addEventListener(`click`, async () =>
{
    const $image = q(`#image-generator-image`)
    
    preRefresh()
    
    await requestAsync(`/api/images/${$image.dataset.id}?delete=true`)
    await refreshImageGeneratorPageAsync()
    
    postRefresh()
})

query(`.item__leave-chat`).forEach(x =>
{
    x.addEventListener(`click`, async () =>
    {
        preRefresh()
        await refreshCharactersPageAsync()
        postRefresh()
    })
})

query(`.item__settings`).forEach(x =>
{
    x.addEventListener(`click`, () =>
    {
        openSettingsDialog()
    })
})

q(`.parse-tokens-from-clipboard`).addEventListener(`click`, async () =>
{
    await parseTokensFromClipboardAsync()
})

q(`#generate-message-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/generate/${currentMessage.index}`)
    await refreshChatAsync({ cache: false })
    postRefresh()
})

q(`#save-message-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/${currentMessage.index}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: q(`#message-content-input`).value
    })
    await refreshChatAsync({ cache: false })
    postRefresh()
})

q(`#delete-message-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/delete/${currentMessage.index}`)
    await refreshChatAsync()
    postRefresh()
})

q(`#cancel-message-button`).addEventListener(`click`, () =>
{
    if (isBusy())
        return
    
    $_.messageDialog.parentElement.classList.add(`hidden`)
})

q(`#message-dialog-overlay`).addEventListener(`click`, e =>
{
    if (e.target != q(`#message-dialog-overlay`))
        return
    
    q(`#cancel-message-button`).click()
})

q(`#generate-image-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    
    let options = undefined
    
    const prompt = q(`#custom-image-prompt`).value
    if (prompt)
    {
        options = { }
        options.headers = { }
        options.headers['X-Prompt'] = prompt
    }
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/generate-image/${currentMessage.index}`, options)
    await refreshChatAsync({ cache: false })
    
    postRefresh()
})

q(`#delete-image-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/delete-image/${currentMessage.index}`)
    await refreshChatAsync({ cache: false })
    
    postRefresh()
})

q(`[data-bind="translation-client"]`).addEventListener(`change`, e =>
{
    const value = q(`[data-bind="translation-client"]`).value
    q(`[data-bind="deepl-auth-key"]`).parentElement.classList.toggle(`display-none`, value != `DeepL`)
    q(`[data-bind="libretranslate-url"]`).parentElement.classList.toggle(`display-none`, value != `LibreTranslate`)
})
