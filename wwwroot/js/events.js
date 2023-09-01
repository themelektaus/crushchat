// Events

$_.messageInput.addEventListener(`input`, refreshSendMessageButton)

$_.messageInput.addEventListener(`keydown`, e =>
{
    if (e.keyCode != 13)
        return
    
    e.stopPropagation()
    
    if ($_.messageInput.value)
    {
        $_.sendMessageButton.click()
        return
    }
    
    $_.receiveMessageButton.click()
})

$_.sendMessageButton.addEventListener(`click`, async () =>
{
    if (!$_.messageInput.value)
        return
    
    const scrollTop = window.scrollTop
    
    preRefresh()
    q(`#common-load-indicator`).classList.add(`display-none`)
    q(`#message-load-indicator`).classList.remove(`display-none`)
    
    scrollDown()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: $_.messageInput.value
    })
    
    await refreshMessagesAsync()
    postRefresh()
    
    $_.messageInput.value = ``
    refreshSendMessageButton()
    
    window.scrollTop = scrollTop
    scrollDown()
    
    if (localStorage.getItem('auto-generate') == "true")
        $_.receiveMessageButton.click()
})

$_.receiveMessageButton.addEventListener(`click`, async () =>
{
    const scrollTop = window.scrollTop
    
    preRefresh()
    q(`#common-load-indicator`).classList.add(`display-none`)
    q(`#message-load-indicator`).classList.remove(`display-none`)
    
    scrollDown()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/generate`)
    await refreshMessagesAsync()
    
    postRefresh()
    
    window.scrollTop = scrollTop
    scrollDown()
})

query(`#menu-button, #menu-overlay`).forEach(x => x.addEventListener(`click`, toggleMenu))

q(`#clear-cache-menu-item`).addEventListener(`click`, async () =>
{
    toggleMenu()
    
    preRefresh()
    scrollDown()
    
    await refreshMessagesAsync({ cache: false })
    
    postRefresh()
    scrollDown()
})

q(`#clear-chat-menu-item`).addEventListener(`click`, async () =>
{
    toggleMenu()
    
    preRefresh()
    scrollDown()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/clear`)
    await refreshMessagesAsync()
    
    postRefresh()
    scrollDown()
})

q(`#translate-menu-item`).addEventListener(`click`, async () =>
{
    toggleMenu()
    
    preRefresh()
    
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/translate`)
        .then(x => x.json())
        .then(x => currentCharacter = x)
    await refreshMessagesAsync()
    
    postRefresh()
})

q(`#back-to-home-menu-item`).addEventListener(`click`, async () =>
{
    toggleMenu()
    
    currentPage = `home`
    currentCharacter = null
    
    preRefresh()
    await refreshHomePageAsync()
    postRefresh()
})

q(`#settings-menu-item`).addEventListener(`click`, () =>
{
    toggleMenu()
    openSettingsDialog()
})

q(`.parse-tokens-from-clipboard`).addEventListener(`click`, async () =>
{
    await parseTokensFromClipboardAsync()
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
    
    hasAnyErrors = false
    
    preRefresh()
    await refreshCurrentPageAsync()
    postRefresh()
})

q(`#cancel-settings-button`).addEventListener(`click`, async () =>
{
    await closeSettingsDialogAsync()
})

$_.settingsDialog.parentElement.addEventListener(`click`, async e =>
{
    if (e.target != $_.settingsDialog.parentElement)
        return
    
    await closeSettingsDialogAsync()
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
    await refreshMessagesAsync({ cache: false })
    postRefresh()
    
    currentMessage = null
})

q(`#generate-message-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/generate/${currentMessage.index}`)
    await refreshMessagesAsync({ cache: false })
    postRefresh()
    
    currentMessage = null
})

q(`#delete-message-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/delete/${currentMessage.index}`)
    await refreshMessagesAsync()
    postRefresh()
    
    currentMessage = null
})

q(`#cancel-message-button`).addEventListener(`click`, () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    currentMessage = null
})

q(`#generate-image-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/generate-image/${currentMessage.index}`)
    await refreshMessagesAsync({ cache: false })
    postRefresh()
    
    currentMessage = null
})

q(`#delete-image-button`).addEventListener(`click`, async () =>
{
    $_.messageDialog.parentElement.classList.add(`hidden`)
    
    preRefresh()
    await requestAsync(`/api/characters/${currentCharacter.id}/messages/delete-image/${currentMessage.index}`)
    await refreshMessagesAsync({ cache: false })
    postRefresh()
    
    currentMessage = null
})

q(`#message-dialog-overlay`).addEventListener(`click`, e =>
{
    if (e.target == q(`#message-dialog-overlay`))
        $_.messageDialog.parentElement.classList.add(`hidden`)
})
