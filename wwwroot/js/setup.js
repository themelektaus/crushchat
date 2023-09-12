// Setup

(function()
{
    const items = {
        'language': "EN",
        'auto-generate': "true",
        'show-original-messages': "false",
        'hide-images': "false",
        'csrf-token': "",
        'session-token': "",
        'translation-client': "",
        'deepl-auth-key': "",
        'deepl-block-size': 10,
        'libretranslate-url': "",
        'character-limit': 100,
        'message-limit': 800
    }
    
    for (const key in items)
        if (localStorage.getItem(key) === null)
            localStorage.setItem(key, items[key])
})()

let currentPage = null
let currentCharacter = null
let currentMessage = null

const $_ = {
    chatMessageInput: q(`#chat__message-input`),
    chatSendMessageButton: q(`#chat__send-message-button`),
    chatReceiveMessageButton: q(`#chat__receive-message-button`),
    
    settingsDialog: q(`#settings-dialog`),
    messageDialog: q(`#message-dialog`)
}
